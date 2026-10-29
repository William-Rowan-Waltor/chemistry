#!/usr/bin/env python3
"""End-to-end smoke test for the local MCP Team Hub.

The script never calls an AI model.  It connects to the running hub, or starts a
temporary one, then exercises the full task/message/status lifecycle and prints
PASS/FAIL for every step.  A non-zero exit code means at least one step failed.
"""

from __future__ import annotations

import asyncio
import os
import socket
import subprocess
import sys
import time
from pathlib import Path
from urllib.parse import urlparse

from fastmcp import Client
from fastmcp.exceptions import ToolError


ROOT = Path(__file__).resolve().parents[1]
URL = os.environ.get("TEAM_HUB_URL", "http://127.0.0.1:8931/mcp")
PARSED_URL = urlparse(URL)
HOST = PARSED_URL.hostname or "127.0.0.1"
PORT = PARSED_URL.port or 8931
LOG_PATH = ROOT / "data" / "smoke_server.log"

REQUIRED_TOOLS = {
    "create_task",
    "get_task",
    "list_tasks",
    "send_message",
    "get_messages",
    "update_status",
    "complete_task",
    "broadcast_context",
}

RESULTS: list[tuple[str, bool, str | None]] = []


def port_open() -> bool:
    """Return True when something is listening on the hub port."""

    try:
        with socket.create_connection((HOST, PORT), timeout=0.5):
            return True
    except OSError:
        return False


def start_temporary_server() -> tuple[subprocess.Popen, object]:
    """Start the hub as a child process and wait until the port is ready."""

    LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    log = LOG_PATH.open("w", encoding="utf-8")
    creationflags = getattr(subprocess, "CREATE_NO_WINDOW", 0)
    environment = os.environ.copy()
    environment["TEAM_HUB_HOST"] = HOST
    environment["TEAM_HUB_PORT"] = str(PORT)
    child = subprocess.Popen(
        [sys.executable, "-m", "server.main"],
        cwd=str(ROOT),
        stdout=log,
        stderr=subprocess.STDOUT,
        text=True,
        creationflags=creationflags,
        env=environment,
    )

    deadline = time.time() + 20
    while time.time() < deadline:
        if port_open():
            return child, log
        if child.poll() is not None:
            log.flush()
            output = LOG_PATH.read_text(encoding="utf-8", errors="replace")
            raise RuntimeError(
                f"Team Hub exited during startup (code {child.returncode}).\n{output}"
            )
        time.sleep(0.1)

    child.terminate()
    raise RuntimeError("Team Hub did not open port 8931 within 20 seconds")


def stop_temporary_server(child: subprocess.Popen, log: object) -> None:
    """Stop a server started by this script; do nothing for an external server."""

    try:
        if child.poll() is None:
            child.terminate()
            try:
                child.wait(timeout=5)
            except subprocess.TimeoutExpired:
                child.kill()
                child.wait(timeout=5)
    finally:
        log.close()  # type: ignore[attr-defined]


async def call(client: Client, name: str, arguments: dict) -> object:
    """Call one tool and return its structured data."""

    result = await client.call_tool(name, arguments)
    return result.data


async def step(label: str, action) -> object:
    """Run one test step and print its PASS/FAIL line."""

    try:
        value = await action()
    except Exception as exc:  # noqa: BLE001 - the report needs the real failure
        RESULTS.append((label, False, str(exc)))
        print(f"[FAIL] {label}: {exc}")
        raise
    RESULTS.append((label, True, None))
    print(f"[PASS] {label}")
    return value


async def expect_tool_error(label: str, action, expected_fragment: str) -> str:
    """Assert that an MCP call fails with a useful error message."""

    async def run() -> str:
        try:
            await action()
        except ToolError as exc:
            text = str(exc)
            if expected_fragment not in text:
                raise AssertionError(
                    f"expected {expected_fragment!r} in error, got {text!r}"
                ) from exc
            return text
        raise AssertionError("expected the tool call to fail, but it succeeded")

    return await step(label, run)


async def run_suite() -> int:
    child: subprocess.Popen | None = None
    log = None
    temporary = False

    if not port_open():
        print("No hub detected; starting a temporary server ...")
        child, log = start_temporary_server()
        temporary = True
        print(f"Temporary server started (pid {child.pid})")
    else:
        print(f"Using existing hub at {URL}")

    try:
        async with Client(URL, timeout=15) as client:
            tools = await step(
                "connect and discover MCP tools",
                lambda: client.list_tools(),
            )
            names = {tool.name for tool in tools}
            missing = REQUIRED_TOOLS - names
            if missing:
                raise AssertionError(f"missing tools: {sorted(missing)}")
            print(f"       discovered {len(names)} tools: {', '.join(sorted(names))}")

            task = await step(
                "create_task for Freebuff",
                lambda: call(
                    client,
                    "create_task",
                    {
                        "created_by": "opencode",
                        "assigned_to": "freebuff",
                        "title": "Smoke test: verify Team Hub lifecycle",
                        "objective": "Prove that task, message, status, and evidence flows work end to end.",
                        "acceptance_criteria": [
                            "Task is stored with an open status",
                            "Update message can be read back",
                            "Task completes only with evidence",
                        ],
                        "context_files": ["scripts/smoke_test.py"],
                        "constraints": ["No AI model calls", "Local SQLite only"],
                        "priority": "high",
                    },
                ),
            )
            assert task["task_id"].startswith("TASK-"), task
            assert task["status"] == "open", task
            assert task["assigned_to"] == "freebuff", task
            task_id = task["task_id"]
            print(f"       created {task_id}")

            message = await step(
                "send_message update",
                lambda: call(
                    client,
                    "send_message",
                    {
                        "task_id": task_id,
                        "from_agent": "freebuff",
                        "message_type": "update",
                        "content": "Smoke test update: starting the verification run.",
                        "attachments": ["scripts/smoke_test.py"],
                    },
                ),
            )
            assert message["task_id"] == task_id, message
            message_id = message["message_id"]

            messages = await step(
                "get_messages returns the update",
                lambda: call(
                    client,
                    "get_messages",
                    {"task_id": task_id, "since": message["created_at"], "limit": 50},
                ),
            )
            assert any(item["message_id"] == message_id for item in messages), messages

            in_progress = await step(
                "update_status to in_progress",
                lambda: call(
                    client,
                    "update_status",
                    {
                        "task_id": task_id,
                        "updated_by": "freebuff",
                        "status": "in_progress",
                        "reason": "Smoke test is running.",
                    },
                ),
            )
            assert in_progress["status"] == "in_progress", in_progress

            completed = await step(
                "complete_task with evidence",
                lambda: call(
                    client,
                    "complete_task",
                    {
                        "task_id": task_id,
                        "completed_by": "freebuff",
                        "summary": "Team Hub lifecycle verified.",
                        "evidence": [
                            "smoke_test_passed",
                            "python -m compileall server scripts",
                        ],
                    },
                ),
            )
            assert completed["status"] == "completed", completed
            assert "smoke_test_passed" in completed["completion_evidence"], completed

            final = await step(
                "get_task confirms completed status",
                lambda: call(client, "get_task", {"task_id": task_id}),
            )
            assert final["status"] == "completed", final
            assert len(final["messages"]) >= 1, final
            assert len(final["status_history"]) >= 3, final

            listed = await step(
                "list_tasks includes the completed task",
                lambda: call(
                    client,
                    "list_tasks",
                    {
                        "status": "completed",
                        "assigned_to": "freebuff",
                        "include_completed": True,
                    },
                ),
            )
            assert any(item["task_id"] == task_id for item in listed), listed

            active = await step(
                "list_tasks default excludes completed tasks",
                lambda: call(client, "list_tasks", {"assigned_to": "freebuff"}),
            )
            assert all(item["status"] not in ("completed", "failed") for item in active), active

            context = await step(
                "broadcast_context stores shared context",
                lambda: call(
                    client,
                    "broadcast_context",
                    {
                        "from_agent": "opencode",
                        "title": "Smoke test context",
                        "content": "The Team Hub lifecycle is being verified locally.",
                        "audience": ["opencode", "freebuff", "antigravity"],
                    },
                ),
            )
            assert context["context_id"].startswith("CTX-"), context

            await expect_tool_error(
                "get_task reports TASK_NOT_FOUND",
                lambda: call(client, "get_task", {"task_id": "TASK-999999"}),
                "TASK_NOT_FOUND",
            )

            second = await step(
                "create second task for blocker/review checks",
                lambda: call(
                    client,
                    "create_task",
                    {
                        "created_by": "opencode",
                        "assigned_to": "antigravity",
                        "title": "Smoke test: blocker and review transitions",
                        "objective": "Verify blocker and review_request side effects.",
                        "priority": "urgent",
                    },
                ),
            )
            second_id = second["task_id"]

            blocked = await step(
                "blocker message changes status to blocked",
                lambda: call(
                    client,
                    "send_message",
                    {
                        "task_id": second_id,
                        "from_agent": "antigravity",
                        "message_type": "blocker",
                        "content": "Waiting for a local dependency.",
                    },
                ),
            )
            assert blocked["task_status"] == "blocked", blocked

            review = await step(
                "review_request changes status to review",
                lambda: call(
                    client,
                    "send_message",
                    {
                        "task_id": second_id,
                        "from_agent": "antigravity",
                        "message_type": "review_request",
                        "content": "Ready for review after testing.",
                    },
                ),
            )
            assert review["task_status"] == "review", review

            await call(
                client,
                "complete_task",
                {
                    "task_id": second_id,
                    "completed_by": "antigravity",
                    "summary": "Transition checks passed.",
                    "evidence": ["smoke_test_transition_passed"],
                },
            )
            await expect_tool_error(
                "completed -> open without reason is rejected",
                lambda: call(
                    client,
                    "update_status",
                    {
                        "task_id": second_id,
                        "updated_by": "opencode",
                        "status": "open",
                        "reason": "",
                    },
                ),
                "REOPEN_REASON_REQUIRED",
            )

    finally:
        if temporary and child is not None and log is not None:
            stop_temporary_server(child, log)

    passed = sum(1 for _, ok, _ in RESULTS if ok)
    failed = len(RESULTS) - passed
    print(f"\nSmoke test summary: {passed} passed, {failed} failed")
    if failed or not RESULTS:
        print("SMOKE TEST: FAIL")
        return 1
    print("SMOKE TEST: PASS")
    return 0


def main() -> int:
    try:
        return asyncio.run(run_suite())
    except Exception as exc:  # noqa: BLE001 - final report must show the failure
        passed = sum(1 for _, ok, _ in RESULTS if ok)
        failed = len(RESULTS) - passed
        if not RESULTS or RESULTS[-1][1]:
            RESULTS.append(("unexpected test harness error", False, str(exc)))
            failed += 1
        print(f"\nSmoke test summary: {passed} passed, {failed} failed")
        print(f"SMOKE TEST: FAIL\nReason: {exc}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
