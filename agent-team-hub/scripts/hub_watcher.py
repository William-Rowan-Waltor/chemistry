#!/usr/bin/env python3
"""Autonomous Hub Watcher / Monitor Loop for Team Hub.

Continuously monitors the MCP Team Hub server (HTTP or SQLite)
for new tasks, status changes, new messages, and broadcasts.
Logs real-time events to console and data/hub_events.log.
"""

from __future__ import annotations

import argparse
import asyncio
import datetime
import json
import os
import signal
import sys
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Set

from fastmcp import Client

# Force UTF-8 output
if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_URL = os.environ.get("TEAM_HUB_URL", "http://127.0.0.1:8931/mcp")
LOG_PATH = PROJECT_ROOT / "data" / "hub_events.log"


def now_iso() -> str:
    return datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def now_local() -> str:
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def append_event_log(event_type: str, data: Dict[str, Any]) -> None:
    LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "timestamp": now_iso(),
        "event": event_type,
        "data": data,
    }
    with open(LOG_PATH, "a", encoding="utf-8") as f:
        f.write(json.dumps(payload, ensure_ascii=False) + "\n")


class HubWatcher:
    def __init__(self, url: str, poll_interval: float = 3.0):
        self.url = url
        self.interval = poll_interval
        self.running = True
        self.known_tasks: Dict[str, Dict[str, Any]] = {}
        self.known_msg_counts: Dict[str, int] = {}
        self.known_msg_ids: Set[int] = set()

    def stop(self) -> None:
        self.running = False

    async def poll_once(self, client: Client) -> None:
        try:
            res = await client.call_tool(
                "list_tasks",
                {"status": "all", "assigned_to": "all", "include_completed": True},
            )
            tasks = res.data or []
        except Exception as e:
            print(f"[{now_local()}] [WARNING] Hub query failed: {e}")
            return

        for t in tasks:
            tid = t.get("task_id")
            if not tid:
                continue

            status = t.get("status")
            assigned = t.get("assigned_to")
            priority = t.get("priority", "medium")
            title = t.get("title", "")

            # Check if this is a newly discovered task
            if tid not in self.known_tasks:
                self.known_tasks[tid] = t
                msg = f"[{now_local()}] 🚀 [NEW TASK] {tid} [{priority.upper()}] -> {assigned} | {title}"
                print(msg, flush=True)
                append_event_log("new_task", t)

                # Initialize message count for this task
                try:
                    m_res = await client.call_tool("get_messages", {"task_id": tid})
                    msgs = m_res.data or []
                    self.known_msg_counts[tid] = len(msgs)
                    for m in msgs:
                        if "message_id" in m:
                            self.known_msg_ids.add(m["message_id"])
                except Exception:
                    self.known_msg_counts[tid] = 0
                continue

            prev = self.known_tasks[tid]

            # Check for status changes
            if status != prev.get("status"):
                old_st = prev.get("status")
                msg = f"[{now_local()}] 🔄 [STATUS] {tid}: {old_st} -> {status} (assignee: {assigned})"
                print(msg, flush=True)
                append_event_log(
                    "status_change",
                    {
                        "task_id": tid,
                        "old_status": old_st,
                        "new_status": status,
                        "assigned_to": assigned,
                    },
                )
                self.known_tasks[tid] = t

            # Check for assignee changes
            elif assigned != prev.get("assigned_to"):
                old_ass = prev.get("assigned_to")
                msg = f"[{now_local()}] 👤 [REASSIGN] {tid}: {old_ass} -> {assigned}"
                print(msg, flush=True)
                append_event_log(
                    "reassign",
                    {"task_id": tid, "old_assigned": old_ass, "new_assigned": assigned},
                )
                self.known_tasks[tid] = t

            # Check for new messages
            try:
                m_res = await client.call_tool("get_messages", {"task_id": tid})
                msgs = m_res.data or []
                curr_count = len(msgs)
                prev_count = self.known_msg_counts.get(tid, 0)
                if curr_count > prev_count:
                    new_msgs = msgs[prev_count:]
                    for nm in new_msgs:
                        mid = nm.get("message_id")
                        if mid and mid in self.known_msg_ids:
                            continue
                        if mid:
                            self.known_msg_ids.add(mid)
                        from_ag = nm.get("from_agent", "unknown")
                        mtype = nm.get("message_type", "update")
                        content = nm.get("content", "").replace("\n", " ")
                        if len(content) > 90:
                            content = content[:87] + "..."
                        msg = f"[{now_local()}] 💬 [MSG] {tid} [{from_ag.upper()}|{mtype}]: {content}"
                        print(msg, flush=True)
                        append_event_log("new_message", nm)
                    self.known_msg_counts[tid] = curr_count
            except Exception:
                pass

    async def run(self) -> None:
        print(f"[{now_local()}] [WATCHER START] Connecting to Team Hub at {self.url}...", flush=True)
        print(f"[{now_local()}] [WATCHER START] Polling interval: {self.interval}s. Logging to: {LOG_PATH}", flush=True)
        async with Client(self.url) as client:
            # Initial baseline scan
            try:
                res = await client.call_tool(
                    "list_tasks",
                    {"status": "all", "assigned_to": "all", "include_completed": True},
                )
                tasks = res.data or []
                for t in tasks:
                    tid = t["task_id"]
                    self.known_tasks[tid] = t
                    try:
                        m_res = await client.call_tool("get_messages", {"task_id": tid})
                        msgs = m_res.data or []
                        self.known_msg_counts[tid] = len(msgs)
                        for m in msgs:
                            if "message_id" in m:
                                self.known_msg_ids.add(m["message_id"])
                    except Exception:
                        self.known_msg_counts[tid] = 0

                print(f"[{now_local()}] [BASELINE] Initialized with {len(self.known_tasks)} existing tasks. Listening for events...", flush=True)
            except Exception as e:
                print(f"[{now_local()}] [ERROR] Failed to initialize baseline: {e}", flush=True)

            while self.running:
                try:
                    await self.poll_once(client)
                except Exception as e:
                    print(f"[{now_local()}] [ERROR] Poll error: {e}", flush=True)
                await asyncio.sleep(self.interval)

        print(f"[{now_local()}] [WATCHER STOP] Watcher loop terminated.", flush=True)


def main() -> None:
    parser = argparse.ArgumentParser(description="Autonomous Team Hub Watcher Loop")
    parser.add_argument("--url", default=DEFAULT_URL, help="Team Hub FastMCP URL")
    parser.add_argument("--interval", type=float, default=3.0, help="Polling interval in seconds (default: 3.0)")
    parser.add_argument("--once", action="store_true", help="Run a single poll and exit")
    args = parser.parse_args()

    watcher = HubWatcher(url=args.url, poll_interval=args.interval)

    def handle_exit(signum, frame):
        watcher.stop()

    try:
        signal.signal(signal.SIGINT, handle_exit)
        signal.signal(signal.SIGTERM, handle_exit)
    except Exception:
        pass

    if args.once:
        async def run_once():
            async with Client(args.url) as c:
                await watcher.poll_once(c)
        asyncio.run(run_once())
    else:
        asyncio.run(watcher.run())


if __name__ == "__main__":
    main()
