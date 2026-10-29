import asyncio
import sys
from fastmcp import Client

sys.stdout.reconfigure(encoding="utf-8")

URL = "http://127.0.0.1:8931/mcp"

async def main():
    async with Client(URL) as client:
        # First send completion message
        msg_res = await client.call_tool("send_message", {
            "task_id": "TASK-0015",
            "from_agent": "antigravity",
            "message_type": "result",
            "content": "Hoàn thành tích hợp trọn vẹn 2 đề thi mới từ 8 trang ảnh THPT Chuyên Lê Quý Đôn (Bà Rịa - Vũng Tàu) gồm g12t19 (Mã 101, 28 câu) và g12t20 (Mã 102, 28 câu). Cả 56 câu đều có lời giải 3 bước tỉ mỉ, đáp án chuẩn xác; 3 sơ đồ vector mới cho Amphetamine, Triglyceride và Polyme hoá Caprolactam; toàn bộ 705 câu của 22 đề đã vượt qua regression test suite.",
            "attachments": ["js/data.js", "js/diagrams.js", "scripts/verify_chemistry_data.py"]
        })
        print("Message sent:", msg_res)

        complete_res = await client.call_tool("complete_task", {
            "task_id": "TASK-0015",
            "completed_by": "antigravity",
            "summary": "Tích hợp hoàn tất 2 đề thi chính thức mới (g12t19 - Mã 101 và g12t20 - Mã 102) từ 8 trang ảnh đề THPT Chuyên Lê Quý Đôn (Bà Rịa - Vũng Tàu), thiết kế 3 sơ đồ vector ChemFig mới (amphetamine_structure, saturated_triglyceride_structure, polycaproamide_reaction), hoàn thiện giải thích 3 bước 100% chuẩn sư phạm và vượt qua bộ regression test suite 705 câu hỏi.",
            "evidence": [
                "python scripts/verify_chemistry_data.py -> PASS (705/705 questions across 22 tests verified)",
                "node -c js/data.js -> PASS (exit code 0)",
                "node -c js/diagrams.js -> PASS (exit code 0)",
                "Diagram verification: 21 diagrams registered, 0 missing references",
                "Scrambled mapping accuracy: 28 questions of Mã 101 matched 1-to-1 with scrambled permutations in Mã 102",
                "Clean transcription: 0 leaked footer tags, 0 dummy answers"
            ]
        })
        print("Task completed:", complete_res)

if __name__ == "__main__":
    asyncio.run(main())
