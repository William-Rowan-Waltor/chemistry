"""SQLite persistence layer for the Team Hub.

Every public operation opens its own short-lived connection.  SQLite WAL mode
plus a busy timeout keeps the hub usable when several agents call tools at the
same time, without requiring an external database service.
"""

from __future__ import annotations

import os
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterator

from server import models
from server.models import (
    AGENTS,
    CREATORS,
    MESSAGE_TYPES,
    PRIORITIES,
    STATUSES,
    HubError,
    Message,
    SharedContext,
    StatusEvent,
    Task,
    TaskNotFound,
)


PROJECT_ROOT = Path(__file__).resolve().parent.parent
DB_PATH = Path(os.environ.get("TEAM_HUB_DB", PROJECT_ROOT / "data" / "team_hub.db")).expanduser()

SCHEMA = """
CREATE TABLE IF NOT EXISTS tasks (
    seq INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id TEXT UNIQUE,
    created_by TEXT NOT NULL,
    assigned_to TEXT NOT NULL,
    title TEXT NOT NULL,
    objective TEXT NOT NULL,
    acceptance_criteria TEXT NOT NULL DEFAULT '[]',
    context_files TEXT NOT NULL DEFAULT '[]',
    constraints TEXT NOT NULL DEFAULT '[]',
    priority TEXT NOT NULL DEFAULT 'medium',
    status TEXT NOT NULL DEFAULT 'open',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    completed_at TEXT,
    completion_summary TEXT,
    completion_evidence TEXT NOT NULL DEFAULT '[]'
);

CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);

CREATE TABLE IF NOT EXISTS messages (
    message_id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id TEXT NOT NULL REFERENCES tasks(task_id) ON DELETE CASCADE,
    from_agent TEXT NOT NULL,
    message_type TEXT NOT NULL,
    content TEXT NOT NULL,
    attachments TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_messages_task_time
    ON messages(task_id, created_at, message_id);

CREATE TABLE IF NOT EXISTS task_status_history (
    history_id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id TEXT NOT NULL REFERENCES tasks(task_id) ON DELETE CASCADE,
    from_status TEXT,
    to_status TEXT NOT NULL,
    updated_by TEXT NOT NULL,
    reason TEXT,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_history_task_time
    ON task_status_history(task_id, created_at, history_id);

CREATE TABLE IF NOT EXISTS shared_context (
    seq INTEGER PRIMARY KEY AUTOINCREMENT,
    context_id TEXT UNIQUE,
    from_agent TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    audience TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_context_time ON shared_context(created_at);
"""


def init_db() -> None:
    """Create the data directory, database, tables, and indexes if needed."""

    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(str(DB_PATH), timeout=10)
    try:
        connection.execute("PRAGMA journal_mode = WAL")
        connection.execute("PRAGMA synchronous = NORMAL")
        connection.executescript(SCHEMA)
        connection.commit()
    finally:
        connection.close()


@contextmanager
def connection() -> Iterator[sqlite3.Connection]:
    """Open a connection with the safety settings used by every operation."""

    conn = sqlite3.connect(str(DB_PATH), timeout=10)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA busy_timeout = 5000")
    try:
        yield conn
        conn.commit()
    except BaseException:
        conn.rollback()
        raise
    finally:
        conn.close()


def _fetch_task_row(conn: sqlite3.Connection, task_id: str) -> sqlite3.Row:
    row = conn.execute("SELECT * FROM tasks WHERE task_id = ?", (task_id,)).fetchone()
    if row is None:
        raise TaskNotFound(f"TASK_NOT_FOUND: no task with task_id {task_id!r}")
    return row


def _history_row(conn: sqlite3.Connection, history_id: int) -> sqlite3.Row:
    row = conn.execute(
        "SELECT * FROM task_status_history WHERE history_id = ?", (history_id,)
    ).fetchone()
    if row is None:  # pragma: no cover - defensive only
        raise HubError(f"STATUS_HISTORY_NOT_FOUND: {history_id}")
    return row


def _message_row(conn: sqlite3.Connection, message_id: int) -> sqlite3.Row:
    row = conn.execute("SELECT * FROM messages WHERE message_id = ?", (message_id,)).fetchone()
    if row is None:  # pragma: no cover - defensive only
        raise HubError(f"MESSAGE_NOT_FOUND: {message_id}")
    return row


def _message_dict(conn: sqlite3.Connection, message_id: int) -> dict:
    return Message.from_row(_message_row(conn, message_id)).to_dict()


def _task_detail(conn: sqlite3.Connection, task_id: str) -> dict:
    task = Task.from_row(_fetch_task_row(conn, task_id)).to_dict()
    messages = conn.execute(
        "SELECT * FROM messages WHERE task_id = ? "
        "ORDER BY created_at ASC, message_id ASC",
        (task_id,),
    ).fetchall()
    history = conn.execute(
        "SELECT * FROM task_status_history WHERE task_id = ? "
        "ORDER BY created_at ASC, history_id ASC",
        (task_id,),
    ).fetchall()
    task["messages"] = [Message.from_row(row).to_dict() for row in messages]
    task["status_history"] = [StatusEvent.from_row(row).to_dict() for row in history]
    return task


def create_task(
    created_by: str,
    assigned_to: str,
    title: str,
    objective: str,
    acceptance_criteria: list[str] | None = None,
    context_files: list[str] | None = None,
    constraints: list[str] | None = None,
    priority: str = "medium",
) -> dict:
    """Insert a task and return its complete public representation."""

    created_by = models.require_choice(created_by, CREATORS, "created_by")
    assigned_to = models.require_choice(assigned_to, AGENTS, "assigned_to")
    title = models.require_text(title, "title")
    objective = models.require_text(objective, "objective")
    priority = models.require_choice(priority, PRIORITIES, "priority")
    signed_criteria = models.clean_list(acceptance_criteria)
    signed_files = models.clean_list(context_files)
    signed_constraints = models.clean_list(constraints)
    now = models.now_utc()

    with connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO tasks (
                task_id, created_by, assigned_to, title, objective,
                acceptance_criteria, context_files, constraints, priority,
                status, created_at, updated_at, completion_evidence
            ) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, 'open', ?, ?, '[]')
            """,
            (
                created_by,
                assigned_to,
                title,
                objective,
                models.encode_json_list(signed_criteria),
                models.encode_json_list(signed_files),
                models.encode_json_list(signed_constraints),
                priority,
                now,
                now,
            ),
        )
        sequence = cursor.lastrowid
        task_id = f"TASK-{sequence:04d}"
        conn.execute("UPDATE tasks SET task_id = ? WHERE seq = ?", (task_id, sequence))
        conn.execute(
            """
            INSERT INTO task_status_history (
                task_id, from_status, to_status, updated_by, reason, created_at
            ) VALUES (?, NULL, 'open', ?, 'Task created', ?)
            """,
            (task_id, created_by, now),
        )
        row = _fetch_task_row(conn, task_id)
    return Task.from_row(row).to_dict()


def get_task(task_id: str) -> dict:
    """Return one task with all messages and status history."""

    task_id = models.require_text(task_id, "task_id")
    with connection() as conn:
        return _task_detail(conn, task_id)


def list_tasks(
    status: str = "all",
    assigned_to: str = "all",
    include_completed: bool = False,
) -> list[dict]:
    """List tasks, most urgent first, then oldest first.

    ``status='all'`` means all unfinished tasks unless ``include_completed`` is
    true.  Successful completion and failure are both treated as closed.
    """

    valid_statuses = (*STATUSES, "all")
    status = models.require_choice(status, valid_statuses, "status")
    assigned_to = models.require_choice(assigned_to, (*AGENTS, "all"), "assigned_to")

    clauses: list[str] = []
    params: list[object] = []
    if status == "all":
        if not include_completed:
            clauses.append("status NOT IN ('completed', 'failed')")
    else:
        clauses.append("status = ?")
        params.append(status)

    if assigned_to != "all":
        clauses.append("assigned_to = ?")
        params.append(assigned_to)

    where = (" WHERE " + " AND ".join(clauses)) if clauses else ""
    sql = (
        "SELECT * FROM tasks"
        + where
        + """
        ORDER BY
            CASE priority
                WHEN 'urgent' THEN 0
                WHEN 'high' THEN 1
                WHEN 'medium' THEN 2
                ELSE 3
            END ASC,
            created_at ASC,
            seq ASC
        """
    )
    with connection() as conn:
        rows = conn.execute(sql, params).fetchall()
        return [Task.from_row(row).to_dict() for row in rows]


def send_message(
    task_id: str,
    from_agent: str,
    message_type: str,
    content: str,
    attachments: list[str] | None = None,
) -> dict:
    """Append a message and apply blocker/review status side effects."""

    task_id = models.require_text(task_id, "task_id")
    from_agent = models.require_choice(from_agent, CREATORS, "from_agent")
    message_type = models.require_choice(message_type, MESSAGE_TYPES, "message_type")
    content = models.require_text(content, "content")
    attachments = models.clean_list(attachments)
    now = models.now_utc()

    with connection() as conn:
        task_row = _fetch_task_row(conn, task_id)
        cursor = conn.execute(
            """
            INSERT INTO messages (
                task_id, from_agent, message_type, content, attachments, created_at
            ) VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                task_id,
                from_agent,
                message_type,
                content,
                models.encode_json_list(attachments),
                now,
            ),
        )
        message_id = cursor.lastrowid
        previous_status = task_row["status"]
        new_status = previous_status
        if message_type == "blocker":
            new_status = "blocked"
        elif message_type == "review_request":
            new_status = "review"

        if new_status != previous_status:
            conn.execute(
                """
                UPDATE tasks
                   SET status = ?, updated_at = ?, completed_at = NULL,
                       completion_summary = NULL, completion_evidence = '[]'
                 WHERE task_id = ?
                """,
                (new_status, now, task_id),
            )
            conn.execute(
                """
                INSERT INTO task_status_history (
                    task_id, from_status, to_status, updated_by, reason, created_at
                ) VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    task_id,
                    previous_status,
                    new_status,
                    from_agent,
                    f"{message_type} message: {content[:180]}",
                    now,
                ),
            )
        else:
            conn.execute(
                "UPDATE tasks SET updated_at = ? WHERE task_id = ?", (now, task_id)
            )

        result = _message_dict(conn, message_id)
    result["task_status"] = new_status
    return result


def _normalise_since(value: str) -> str:
    """Validate an ISO timestamp and return a UTC ``Z`` form for SQL comparison."""

    raw = value.strip()
    if not raw:
        raise HubError("since must be a valid ISO 8601 timestamp")
    try:
        parsed = datetime.fromisoformat(raw.replace("Z", "+00:00"))
    except ValueError as exc:
        raise HubError(f"since must be ISO 8601, got {value!r}") from exc
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    parsed = parsed.astimezone(timezone.utc)
    return parsed.isoformat(timespec="seconds").replace("+00:00", "Z")


def get_messages(task_id: str, since: str | None = None, limit: int = 50) -> list[dict]:
    """Return task messages in chronological order, optionally only newer ones."""

    task_id = models.require_text(task_id, "task_id")
    limit = max(1, min(int(limit), 500))
    params: list[object] = [task_id]
    since_sql = ""
    if since is not None:
        since_sql = " AND created_at >= ?"
        params.append(_normalise_since(since))
    params.append(limit)

    with connection() as conn:
        _fetch_task_row(conn, task_id)
        rows = conn.execute(
            "SELECT * FROM messages WHERE task_id = ?"
            + since_sql
            + " ORDER BY created_at ASC, message_id ASC LIMIT ?",
            params,
        ).fetchall()
        return [Message.from_row(row).to_dict() for row in rows]


def update_status(
    task_id: str,
    updated_by: str,
    status: str,
    reason: str = "",
    evidence: list[str] | None = None,
) -> dict:
    """Change a task status and append a status-history event."""

    task_id = models.require_text(task_id, "task_id")
    updated_by = models.require_choice(updated_by, AGENTS, "updated_by")
    status = models.require_choice(status, STATUSES, "status")
    reason = (reason or "").strip()
    evidence = models.clean_list(evidence)

    if status == "completed":
        if not evidence:
            raise HubError(
                "COMPLETION_EVIDENCE_REQUIRED: completing a task needs at least one "
                "evidence item; use complete_task or pass evidence"
            )
        if not reason:
            raise HubError("COMPLETION_REASON_REQUIRED: reason is required when completing")

    with connection() as conn:
        row = _fetch_task_row(conn, task_id)
        previous_status = row["status"]

        if previous_status == "completed" and status == "open" and not reason:
            raise HubError(
                "REOPEN_REASON_REQUIRED: cannot move a completed task back to open "
                "without a reason"
            )

        if previous_status == status:
            return Task.from_row(row).to_dict()

        now = models.now_utc()
        completed_at = now if status == "completed" else None
        completion_summary = reason if status == "completed" else None
        completion_evidence = (
            models.encode_json_list(evidence) if status == "completed" else "[]"
        )
        conn.execute(
            """
            UPDATE tasks
               SET status = ?, updated_at = ?, completed_at = ?,
                   completion_summary = ?, completion_evidence = ?
             WHERE task_id = ?
            """,
            (
                status,
                now,
                completed_at,
                completion_summary,
                completion_evidence,
                task_id,
            ),
        )
        conn.execute(
            """
            INSERT INTO task_status_history (
                task_id, from_status, to_status, updated_by, reason, created_at
            ) VALUES (?, ?, ?, ?, ?, ?)
            """,
            (task_id, previous_status, status, updated_by, reason or None, now),
        )
        updated = _fetch_task_row(conn, task_id)
    return Task.from_row(updated).to_dict()


def complete_task(
    task_id: str,
    completed_by: str,
    summary: str,
    evidence: list[str],
) -> dict:
    """Mark a task completed with required evidence and return the full detail."""

    task_id = models.require_text(task_id, "task_id")
    completed_by = models.require_choice(completed_by, AGENTS, "completed_by")
    summary = models.require_text(summary, "summary")
    evidence = models.clean_list(evidence)
    if not evidence:
        raise HubError("COMPLETION_EVIDENCE_REQUIRED: at least one evidence item is required")

    with connection() as conn:
        row = _fetch_task_row(conn, task_id)
        if row["status"] == "completed":
            return _task_detail(conn, task_id)

        previous_status = row["status"]
        now = models.now_utc()
        conn.execute(
            """
            UPDATE tasks
               SET status = 'completed', updated_at = ?, completed_at = ?,
                   completion_summary = ?, completion_evidence = ?
             WHERE task_id = ?
            """,
            (
                now,
                now,
                summary,
                models.encode_json_list(evidence),
                task_id,
            ),
        )
        conn.execute(
            """
            INSERT INTO task_status_history (
                task_id, from_status, to_status, updated_by, reason, created_at
            ) VALUES (?, ?, 'completed', ?, ?, ?)
            """,
            (
                task_id,
                previous_status,
                completed_by,
                f"Completed: {summary[:180]}",
                now,
            ),
        )
        return _task_detail(conn, task_id)


def broadcast_context(
    from_agent: str,
    title: str,
    content: str,
    audience: list[str] | None = None,
) -> dict:
    """Store context that is not tied to a single task and return its id."""

    from_agent = models.require_choice(from_agent, CREATORS, "from_agent")
    title = models.require_text(title, "title")
    content = models.require_text(content, "content")
    selected_audience = models.clean_list(audience) or list(AGENTS)
    for agent in selected_audience:
        models.require_choice(agent, AGENTS, "audience")
    now = models.now_utc()

    with connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO shared_context (
                context_id, from_agent, title, content, audience, created_at
            ) VALUES (NULL, ?, ?, ?, ?, ?)
            """,
            (
                from_agent,
                title,
                content,
                models.encode_json_list(selected_audience),
                now,
            ),
        )
        sequence = cursor.lastrowid
        context_id = f"CTX-{sequence:04d}"
        conn.execute(
            "UPDATE shared_context SET context_id = ? WHERE seq = ?",
            (context_id, sequence),
        )
        row = conn.execute(
            "SELECT * FROM shared_context WHERE seq = ?", (sequence,)
        ).fetchone()
    return SharedContext.from_row(row).to_dict()


# Create the schema as soon as the module is imported.  This keeps direct
# imports in tests and the smoke script safe, not just ``python -m server.main``.
init_db()
