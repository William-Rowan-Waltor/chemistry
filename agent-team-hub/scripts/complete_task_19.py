import asyncio
import sys
from fastmcp import Client

sys.stdout.reconfigure(encoding="utf-8")

URL = "http://127.0.0.1:8931/mcp"

async def main():
    async with Client(URL) as client:
        res = await client.call_tool("complete_task", {
            "task_id": "TASK-0019",
            "completed_by": "antigravity",
            "summary": "Hoàn tất 100% lộ trình nâng cấp toàn diện OpenCode: P0 (sửa parseOpts, g12t1#3, g12t2#3, bắt buộc 4 phương án cho 100% MCQ); P1 (sửa Quick Theory truncation, noteBody() trong modal, phân tích bẫy cluster & q.e/q.oe, sửa g12t20 Q3, typo Glutacid, g12t19/g12t20 ch tagging, mở rộng g12c3 thành 16 flashcards bao quát Amino acid/Peptide/Protein, tối ưu testWrong retake); P2 (bổ sung đơn vị u cho câu tính toán, cập nhật tài liệu).",
            "evidence": [
                "P0: js/engine.js parseOpts và verify_chemistry_data.py parse_opts sử dụng regex đa dòng hỗ trợ khoảng trắng và dấu chấm phẩy bên trong lựa chọn",
                "P0: g12t1#3 và g12t2#3 sử dụng toán tử thứ tự '<' chuẩn xác, hiển thị rõ ràng",
                "P0: verify_chemistry_data.py ràng buộc nghiêm ngặt: 379/379 câu hỏi MCQ có đúng 4 phương án {A, B, C, D}",
                "P1: openTheoryModal sử dụng noteBody(n) hiển thị trọn vẹn bảng biểu markdown; getQuickTheorySummary bỏ cắt ngắn thô bạo",
                "P1: getDistractorAnalysis hỗ trợ phân tích cụm Đúng/Sai theo từng ý a, b, c, d và bóc tách giải thích phương án từ q.oe/q.e",
                "P1: g12t20_q3 đồng bộ phương án đảo của Mã 102 (đáp án B đúng); sửa typo Glutacid -> Glutamic acid tại g12t20_q20",
                "P1: Gắn tag chương ch chuẩn xác cho 100% 56 câu hỏi của g12t19 và g12t20",
                "P1: Mở rộng g12c3 từ 8 lên 16 flashcards/notes bao quát trọn vẹn Amino acid, Peptide, Protein & Enzyme",
                "P1: testWrong và testAgain xử lý luồng thi lại câu sai và xem lại mượt mà",
                "P2: Bổ sung đơn vị u (g, kg, mol, %, L, g/mol) cho các câu hỏi định lượng; cập nhật docs/feedbacks_01.md",
                "Regression suite: scripts/verify_chemistry_data.py PASS 100% trên 22 đề và 50 flashcards",
                "Node syntax: 7/7 file JS PASS (node -c)"
            ]
        })
        print("Completed TASK-0019:", res)

if __name__ == "__main__":
    asyncio.run(main())
