"""Team Hub MCP server.

Run with::

    python -m server.main

The server exposes a small, local-only collaboration API over FastMCP's HTTP
transport at http://127.0.0.1:8931/mcp.  All state lives in SQLite under
``data/team_hub.db``; no cloud service or API key is required.
"""

from __future__ import annotations

import os
from typing import Literal

from fastmcp import FastMCP

from server import db, models
from server.models import HubError


HOST = os.environ.get("TEAM_HUB_HOST", "127.0.0.1")
PORT = int(os.environ.get("TEAM_HUB_PORT", "8931"))

mcp = FastMCP(
    name="Team Hub",
    version="1.0.0",
    instructions=(
        "Local task and message hub for OpenCode, Freebuff, and Antigravity. "
        "Create a task before delegating work, report progress with messages, "
        "and complete a task only with concrete evidence."
    ),
    mask_error_details=False,
)


@mcp.tool
def create_task(
    created_by: Literal["opencode", "freebuff", "antigravity", "user"],
    assigned_to: Literal["opencode", "freebuff", "antigravity"],
    title: str,
    objective: str,
    acceptance_criteria: list[str] | None = None,
    context_files: list[str] | None = None,
    constraints: list[str] | None = None,
    priority: Literal["low", "medium", "high", "urgent"] = "medium",
) -> dict:
    """Create a collaboration task and return the stored task object.

    Args:
        created_by: Agent or user creating the task.
        assigned_to: Agent responsible for doing the work.
        title: Short task title.
        objective: Concrete outcome the assignee must achieve.
        acceptance_criteria: Checklist that defines done.
        context_files: Files the assignee should read first.
        constraints: Rules or limits that must be respected.
        priority: Scheduling priority; defaults to medium.

    Returns:
        The task including its generated ``task_id`` (for example TASK-0001),
        status ``open``, timestamps, and normalized list fields.
    """

    return db.create_task(
        created_by=created_by,
        assigned_to=assigned_to,
        title=title,
        objective=objective,
        acceptance_criteria=acceptance_criteria,
        context_files=context_files,
        constraints=constraints,
        priority=priority,
    )


@mcp.tool
def get_task(task_id: str) -> dict:
    """Return a task with all messages and its status history.

    Args:
        task_id: Public task identifier such as ``TASK-0001``.

    Returns:
        The task object plus ``messages`` and ``status_history`` arrays.

    Raises:
        ValueError: With a clear ``TASK_NOT_FOUND`` message if the id is unknown.
    """

    return db.get_task(task_id)


@mcp.tool
def list_tasks(
    status: Literal[
        "open", "in_progress", "blocked", "review", "completed", "failed", "all"
    ] = "all",
    assigned_to: Literal["opencode", "freebuff", "antigravity", "all"] = "all",
    include_completed: bool = False,
) -> list[dict]:
    """List tasks ordered by priority (urgent first), then creation time.

    With the default ``status='all'``, completed and failed tasks are omitted
    so agents see the active queue.  Set ``include_completed=True`` to include
    them, or request a specific status explicitly.

    Args:
        status: Status filter, or ``all`` for the active queue.
        assigned_to: Assignee filter, or ``all``.
        include_completed: Include completed/failed tasks in an ``all`` query.

    Returns:
        A list of task objects without their message bodies.
    """

    return db.list_tasks(
        status=status,
        assigned_to=assigned_to,
        include_completed=include_completed,
    )


@mcp.tool
def send_message(
    task_id: str,
    from_agent: Literal["opencode", "freebuff", "antigravity", "user"],
    message_type: Literal[
        "question",
        "update",
        "result",
        "blocker",
        "review_request",
        "approval",
        "handoff",
    ],
    content: str,
    attachments: list[str] | None = None,
) -> dict:
    """Append a message to a task and apply its status side effect.

    A ``blocker`` message moves the task to ``blocked``.  A
    ``review_request`` message moves it to ``review``.  All other message types
    leave the status unchanged.

    Args:
        task_id: Task receiving the message.
        from_agent: Author of the message.
        message_type: Intent of the message.
        content: Human-readable message body.
        attachments: Optional file paths, URLs, or evidence identifiers.

    Returns:
        The stored message plus ``task_status`` after the side effect.
    """

    return db.send_message(
        task_id=task_id,
        from_agent=from_agent,
        message_type=message_type,
        content=content,
        attachments=attachments,
    )


@mcp.tool
def get_messages(task_id: str, since: str | None = None, limit: int = 50) -> list[dict]:
    """Return a task's messages in chronological order.

    Args:
        task_id: Task whose messages should be read.
        since: Optional ISO 8601 timestamp; only messages at or after it return.
        limit: Maximum number of messages, clamped to 1..500.

    Returns:
        A chronological list of message objects.
    """

    return db.get_messages(task_id=task_id, since=since, limit=limit)


@mcp.tool
def update_status(
    task_id: str,
    updated_by: Literal["opencode", "freebuff", "antigravity"],
    status: Literal[
        "open", "in_progress", "blocked", "review", "completed", "failed"
    ],
    reason: str = "",
    evidence: list[str] | None = None,
) -> dict:
    """Change a task's status and append an audit entry.

    Reopening a completed task as ``open`` requires a non-empty reason.  Moving
    a task to ``completed`` requires at least one evidence item; the normal path
    is ``complete_task``, which also stores a summary.

    Args:
        task_id: Task to update.
        updated_by: Agent making the change.
        status: New status.
        reason: Why the status changed.
        evidence: Required only when status is ``completed``.

    Returns:
        The updated task object.
    """

    return db.update_status(
        task_id=task_id,
        updated_by=updated_by,
        status=status,
        reason=reason,
        evidence=evidence,
    )


@mcp.tool
def complete_task(
    task_id: str,
    completed_by: Literal["opencode", "freebuff", "antigravity"],
    summary: str,
    evidence: list[str],
) -> dict:
    """Mark a task completed after checking that evidence exists.

    Args:
        task_id: Task to complete.
        completed_by: Agent that finished the work.
        summary: What was delivered.
        evidence: At least one concrete proof item, such as a passing test name,
            a diff path, a verification command, or a review approval.

    Returns:
        The final task object with messages and status history.
    """

    return db.complete_task(
        task_id=task_id,
        completed_by=completed_by,
        summary=summary,
        evidence=evidence,
    )


@mcp.tool
def broadcast_context(
    from_agent: Literal["opencode", "freebuff", "antigravity", "user"],
    title: str,
    content: str,
    audience: list[str] | None = None,
) -> dict:
    """Store shared context that is not tied to a single task.

    Args:
        from_agent: Author of the context.
        title: Short label for the information.
        content: The shared context itself.
        audience: Agents that should see it; defaults to all three agents.

    Returns:
        The stored context object including a generated ``context_id``.
    """

    return db.broadcast_context(
        from_agent=from_agent,
        title=title,
        content=content,
        audience=audience,
    )


def main() -> None:
    """Initialize the database and serve MCP over local HTTP."""

    db.init_db()
    mcp.run(transport="http", host=HOST, port=PORT)


if __name__ == "__main__":
    try:
        main()
    except HubError as exc:  # pragma: no cover - startup validation only
        raise SystemExit(f"Team Hub failed to start: {exc}") from exc
