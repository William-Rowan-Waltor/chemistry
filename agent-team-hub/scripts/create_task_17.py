import asyncio
import sys
from fastmcp import Client

sys.stdout.reconfigure(encoding="utf-8")

URL = "http://127.0.0.1:8931/mcp"

async def main():
    async with Client(URL) as client:
        task = await client.call_tool("create_task", {
            "created_by": "antigravity",
            "assigned_to": "antigravity",
            "title": "Comprehensive audit and fix across UI, color harmony, typography, academic chemistry accuracy, and engine backend",
            "objective": "Audit entire codebase (HTML, CSS, JS, JSON data) to identify and fix visual layout glitches, dark mode contrast issues, mobile overflows, raw text escaping, academic chemical notation/typos, and engine state bugs.",
            "acceptance_criteria": [
                "Audit UI components for responsive layout, contrast, and dark mode harmony",
                "Audit chapter flashcards and question explanations for academic accuracy and IUPAC terminology",
                "Fix all identified text/rendering anomalies (unescaped HTML/markdown/newlines)",
                "Verify zero regression in verify_chemistry_data.py and node syntax checks"
            ],
            "context_files": ["index.html", "css/style.css", "js/engine.js", "js/data.js", "js/diagrams.js"],
            "constraints": ["No dummy changes", "Test thoroughly", "Preserve existing user data structure"],
            "priority": "high"
        })
        task_id = task.data.get("task_id", "TASK-0017")
        print("Created task:", task_id)
        await client.call_tool("update_status", {
            "task_id": task_id,
            "updated_by": "antigravity",
            "status": "in_progress",
            "reason": "Bắt đầu quét toàn diện toàn bộ mã nguồn, dữ liệu hóa học, giao diện CSS và các luồng xử lý engine."
        })

if __name__ == "__main__":
    asyncio.run(main())
