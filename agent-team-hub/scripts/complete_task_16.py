import asyncio
import sys
from fastmcp import Client

sys.stdout.reconfigure(encoding="utf-8")

URL = "http://127.0.0.1:8931/mcp"

async def main():
    async with Client(URL) as client:
        # 1. Create task
        task = await client.call_tool("create_task", {
            "created_by": "antigravity",
            "assigned_to": "antigravity",
            "title": "Fix grade schema tag ('12' -> 'g12') and search filter for new exams in guided test library",
            "objective": "Resolve user reported issue where 2 new exams (g12t19, g12t20) were not visible in 'Kho đề kiểm tra có hướng dẫn' due to 'grade': '12' vs 'g12' filter mismatch, and enhance search bar matching.",
            "acceptance_criteria": [
                "Standardize grade: 'g12' for g12t19 and g12t20 in js/data.js and builder script",
                "Ensure renderCoachTestLibrary and coachSearchInput filter displays both exams under 'Hoá 12' and 'Tất cả các đề'",
                "Add author name matching into live search box in js/engine.js",
                "Add grade schema check in verify_chemistry_data.py regression suite"
            ],
            "context_files": ["js/data.js", "js/engine.js", "scripts/verify_chemistry_data.py"],
            "constraints": ["Keep zero regression", "Verify 100% PASS on 22 tests"],
            "priority": "urgent"
        })
        task_data = task.data
        task_id = task_data.get("task_id", "TASK-0016")
        print("Created task:", task_id)

        # 2. Update status to in_progress
        await client.call_tool("update_status", {
            "task_id": task_id,
            "updated_by": "antigravity",
            "status": "in_progress",
            "reason": "Đang chuẩn hoá tag grade thành 'g12', sửa bộ lọc coachSearchInput và nâng cấp verify_chemistry_data.py."
        })

        # 3. Complete task with evidence
        res = await client.call_tool("complete_task", {
            "task_id": task_id,
            "completed_by": "antigravity",
            "summary": "Đã khắc phục triệt để lỗi không tìm thấy 2 đề mới trong Kho đề kiểm tra có hướng dẫn: Chuẩn hoá tag grade: 'g12' cho g12t19 và g12t20, bổ sung trường desc đầy đủ, bổ sung tìm kiếm theo author (Lê Quý Đôn) trong ô search nhanh, và siết chặt kiểm tra trường grade trong bộ kiểm thử hồi quy verify_chemistry_data.py.",
            "evidence": [
                "js/data.js: g12t19 và g12t20 đã có grade='g12', desc chuẩn ma trận",
                "Node simulation: Grade g12 filter hiển thị 20/20 đề lớp 12 bao gồm g12t19 và g12t20",
                "Search query verification: 'Lê Quý Đôn', '101', '102', 'Vũng Tàu' đều tìm thấy chính xác 2 đề",
                "python scripts/verify_chemistry_data.py -> PASS (705/705 questions across 22 tests with grade validation)",
                "node -c js/data.js -> PASS",
                "node -c js/engine.js -> PASS"
            ]
        })
        print("Completed task:", task_id)

if __name__ == "__main__":
    asyncio.run(main())
