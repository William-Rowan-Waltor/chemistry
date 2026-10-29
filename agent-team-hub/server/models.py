"""Domain models and validation helpers for the Team Hub.

The MCP server stores JSON arrays in SQLite, but callers always see ordinary
Python lists.  Keeping the conversion in one place avoids drifting response
shapes between tools.
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any


AGENTS = ("opencode", "freebuff", "antigravity")
CREATORS = (*AGENTS, "user")
STATUSES = ("open", "in_progress", "blocked", "review", "completed", "failed")
PRIORITIES = ("low", "medium", "high", "urgent")
MESSAGE_TYPES = (
    "question",
    "update",
    "result",
    "blocker",
    "review_request",
    "approval",
    "handoff",
)


class HubError(ValueError):
    """Base class for explicit, user-facing Team Hub errors."""


class TaskNotFound(HubError):
    """Raised when a task ID does not exist."""


def now_utc() -> str:
    """Return a UTC timestamp in ISO 8601 form (for example 2026-10-29T10:00:00Z)."""

    return datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


def clean_list(values: list[str] | None) -> list[str]:
    """Trim, drop empty entries, and de-duplicate a list while preserving order."""

    if not values:
        return []
    result: list[str] = []
    seen: set[str] = set()
    for value in values:
        item = str(value).strip()
        if item and item not in seen:
            seen.add(item)
            result.append(item)
    return result


def require_text(value: str, field_name: str) -> str:
    """Validate a required, non-empty string."""

    if not isinstance(value, str) or not value.strip():
        raise HubError(f"{field_name} must be a non-empty string")
    return value.strip()


def require_choice(value: str, choices: tuple[str, ...], field_name: str) -> str:
    """Validate that a value belongs to a fixed set."""

    if value not in choices:
        raise HubError(f"{field_name} must be one of: {', '.join(choices)}")
    return value


def decode_json_list(raw: Any) -> list[str]:
    """Decode a JSON array stored in SQLite, tolerating old/empty rows."""

    if raw is None or raw == "":
        return []
    if isinstance(raw, list):
        return [str(item) for item in raw]
    try:
        value = json.loads(raw)
    except (TypeError, json.JSONDecodeError):
        return []
    return [str(item) for item in value] if isinstance(value, list) else []


def encode_json_list(values: list[str] | None) -> str:
    """Encode a list as compact UTF-8 JSON for SQLite."""

    return json.dumps(clean_list(values), ensure_ascii=False)


@dataclass(frozen=True)
class Task:
    task_id: str
    created_by: str
    assigned_to: str
    title: str
    objective: str
    acceptance_criteria: list[str]
    context_files: list[str]
    constraints: list[str]
    priority: str
    status: str
    created_at: str
    updated_at: str
    completed_at: str | None = None
    completion_summary: str | None = None
    completion_evidence: list[str] = field(default_factory=list)

    @classmethod
    def from_row(cls, row: Any) -> "Task":
        return cls(
            task_id=row["task_id"],
            created_by=row["created_by"],
            assigned_to=row["assigned_to"],
            title=row["title"],
            objective=row["objective"],
            acceptance_criteria=decode_json_list(row["acceptance_criteria"]),
            context_files=decode_json_list(row["context_files"]),
            constraints=decode_json_list(row["constraints"]),
            priority=row["priority"],
            status=row["status"],
            created_at=row["created_at"],
            updated_at=row["updated_at"],
            completed_at=row["completed_at"],
            completion_summary=row["completion_summary"],
            completion_evidence=decode_json_list(row["completion_evidence"]),
        )

    def to_dict(self) -> dict[str, Any]:
        return {
            "task_id": self.task_id,
            "created_by": self.created_by,
            "assigned_to": self.assigned_to,
            "title": self.title,
            "objective": self.objective,
            "acceptance_criteria": self.acceptance_criteria,
            "context_files": self.context_files,
            "constraints": self.constraints,
            "priority": self.priority,
            "status": self.status,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "completed_at": self.completed_at,
            "completion_summary": self.completion_summary,
            "completion_evidence": self.completion_evidence,
        }


@dataclass(frozen=True)
class Message:
    message_id: int
    task_id: str
    from_agent: str
    message_type: str
    content: str
    attachments: list[str]
    created_at: str

    @classmethod
    def from_row(cls, row: Any) -> "Message":
        return cls(
            message_id=row["message_id"],
            task_id=row["task_id"],
            from_agent=row["from_agent"],
            message_type=row["message_type"],
            content=row["content"],
            attachments=decode_json_list(row["attachments"]),
            created_at=row["created_at"],
        )

    def to_dict(self) -> dict[str, Any]:
        return {
            "message_id": self.message_id,
            "task_id": self.task_id,
            "from_agent": self.from_agent,
            "message_type": self.message_type,
            "content": self.content,
            "attachments": self.attachments,
            "created_at": self.created_at,
        }


@dataclass(frozen=True)
class StatusEvent:
    history_id: int
    task_id: str
    from_status: str | None
    to_status: str
    updated_by: str
    reason: str | None
    created_at: str

    @classmethod
    def from_row(cls, row: Any) -> "StatusEvent":
        return cls(
            history_id=row["history_id"],
            task_id=row["task_id"],
            from_status=row["from_status"],
            to_status=row["to_status"],
            updated_by=row["updated_by"],
            reason=row["reason"],
            created_at=row["created_at"],
        )

    def to_dict(self) -> dict[str, Any]:
        return {
            "history_id": self.history_id,
            "task_id": self.task_id,
            "from_status": self.from_status,
            "to_status": self.to_status,
            "updated_by": self.updated_by,
            "reason": self.reason,
            "created_at": self.created_at,
        }


@dataclass(frozen=True)
class SharedContext:
    context_id: str
    from_agent: str
    title: str
    content: str
    audience: list[str]
    created_at: str

    @classmethod
    def from_row(cls, row: Any) -> "SharedContext":
        return cls(
            context_id=row["context_id"],
            from_agent=row["from_agent"],
            title=row["title"],
            content=row["content"],
            audience=decode_json_list(row["audience"]),
            created_at=row["created_at"],
        )

    def to_dict(self) -> dict[str, Any]:
        return {
            "context_id": self.context_id,
            "from_agent": self.from_agent,
            "title": self.title,
            "content": self.content,
            "audience": self.audience,
            "created_at": self.created_at,
        }
