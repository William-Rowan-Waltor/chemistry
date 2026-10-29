#!/usr/bin/env python3
"""Convenient CLI helper to create, list, and inspect tasks in Team Hub."""

from __future__ import annotations

import argparse
import asyncio
import json
import sys
from fastmcp import Client

# Force UTF-8 output
sys.stdout.reconfigure(encoding="utf-8")

URL = "http://127.0.0.1:8931/mcp"


async def list_tasks_cmd(args):
    async with Client(URL) as client:
        res = await client.call_tool("list_tasks", {
            "status": args.status,
            "assigned_to": args.assigned_to,
            "include_completed": args.all
        })
        tasks = res.data or []
        print(f"\n=== TEAM HUB TASKS ({len(tasks)}) ===")
        if not tasks:
            print("  (Không có task nào thỏa mãn điều kiện)")
            return
        for t in tasks:
            pri = f"[{t['priority'].upper()}]"
            st = f"[{t['status'].upper()}]"
            print(f"  {t['task_id']:10} {st:14} {pri:9} -> {t['assigned_to']:12} | {t['title']}")


async def show_task_cmd(args):
    async with Client(URL) as client:
        try:
            res = await client.call_tool("get_task", {"task_id": args.task_id})
            t = res.data
        except Exception as e:
            print(f"Lỗi: Không tìm thấy task {args.task_id}: {e}")
            return

        print(f"\n=== CHI TIẾT {t['task_id']}: {t['title']} ===")
        print(f"Trạng thái:   {t['status'].upper()}")
        print(f"Người giao:   {t['created_by']} -> Người nhận: {t['assigned_to']}")
        print(f"Độ ưu tiên:   {t['priority']}")
        print(f"Mục tiêu:     {t['objective']}")
        if t.get("acceptance_criteria"):
            print("Tiêu chí chấp nhận:")
            for ac in t["acceptance_criteria"]:
                print(f"  - {ac}")
        if t.get("evidence"):
            print("Bằng chứng hoàn thành (Evidence):")
            for ev in t["evidence"]:
                print(f"  * {ev}")
        msgs = t.get("messages", [])
        print(f"\nTin nhắn trao đổi ({len(msgs)}):")
        for m in msgs:
            print(f"  [{m['from_agent'].upper()}] ({m['message_type']}): {m['content']}")


async def create_task_cmd(args):
    async with Client(URL) as client:
        res = await client.call_tool("create_task", {
            "created_by": args.by,
            "assigned_to": args.assign,
            "title": args.title,
            "objective": args.objective or args.title,
            "priority": args.priority
        })
        t = res.data
        print(f"\n✓ Đã tạo thành công {t['task_id']}!")
        print(f"  Tiêu đề:       {t['title']}")
        print(f"  Người nhận:    {t['assigned_to']}")
        print(f"  Độ ưu tiên:    {t['priority']}")


def main():
    parser = argparse.ArgumentParser(description="Team Hub Task CLI")
    sub = parser.add_subparsers(dest="cmd", required=True)

    # list
    p_list = sub.add_parser("list", help="Liệt kê danh sách tasks")
    p_list.add_argument("--status", default="all", help="open, in_progress, blocked, review, completed, all")
    p_list.add_argument("--assigned-to", default="all", help="opencode, freebuff, antigravity, all")
    p_list.add_argument("--all", action="store_true", help="Bao gồm cả các task completed/failed")

    # show
    p_show = sub.add_parser("show", help="Xem chi tiết một task")
    p_show.add_argument("task_id", help="Mã task (ví dụ: TASK-0009)")

    # create
    p_create = sub.add_parser("create", help="Tạo task mới trên Team Hub")
    p_create.add_argument("title", help="Tiêu đề task")
    p_create.add_argument("objective", nargs="?", default="", help="Mục tiêu cụ thể")
    p_create.add_argument("--assign", default="antigravity", choices=["opencode", "freebuff", "antigravity"])
    p_create.add_argument("--by", default="user", choices=["user", "opencode", "antigravity", "freebuff"])
    p_create.add_argument("--priority", default="medium", choices=["low", "medium", "high", "urgent"])

    args = parser.parse_args()
    if args.cmd == "list":
        asyncio.run(list_tasks_cmd(args))
    elif args.cmd == "show":
        asyncio.run(show_task_cmd(args))
    elif args.cmd == "create":
        asyncio.run(create_task_cmd(args))


if __name__ == "__main__":
    main()
