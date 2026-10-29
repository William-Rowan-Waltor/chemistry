import asyncio
import sys
from fastmcp import Client

sys.stdout.reconfigure(encoding="utf-8")

URL = "http://127.0.0.1:8931/mcp"

async def main():
    async with Client(URL) as client:
        # Complete TASK-0017 with full audit findings and evidence
        res = await client.call_tool("complete_task", {
            "task_id": "TASK-0017",
            "completed_by": "antigravity",
            "summary": "Rà soát toàn diện và khắc phục thành công các lỗi UI, Dark mode contrast, tương thích thiết bị di động, tự động lưu đáp án câu hỏi điền số, cơ chế ôn lại câu sai testWrong, và mở rộng bộ từ khóa hóa sinh BOLD_KW.",
            "evidence": [
                "Backend Engine Fix: Tự động lưu đáp án câu điền số (short-answer/testNum) khi chuyển câu (testNext/testPrev/testJump) và khi nộp bài (testSubmit), ngăn chặn hoàn toàn việc mất bài làm của học sinh",
                "UX Feature Fix: Bổ sung tính năng 'Ôn lại X câu sai' (testWrong) trong bảng tổng kết đề thi thử",
                "Keyboard Accessibility: Thêm phím Enter tự động submit trên các ô nhập số (#coachShortAnsInput, .num-in testNum, numIn)",
                "Edit Mode Completeness: Hoàn thiện chức năng CRUD câu hỏi ngân hàng (addBankQ, editBankQ, deleteBankQ)",
                "Dark Mode Contrast: Khắc phục độ tương phản huy hiệu lớp 12 và lớp 11 trong .coach-exam-card",
                "Mobile Responsive: Chống tràn vỡ layout cho .tf-cluster-row và .short-ans-box trên màn hình nhỏ <= 600px và <= 480px",
                "Academic Typography: Mở rộng BOLD_KW với các thuật ngữ glucid, lipid và protein chuẩn GDPT 2018 (glucose, fructose, saccharose, maltose, cellulose, peptide, protein, triglyceride, triolein, tristearin, tripalmitin)",
                "Regression Suite: scripts/verify_chemistry_data.py PASS 100% trên 22 đề và 705 câu hỏi",
                "Node Syntax: Tất cả 7 file JavaScript chính thức đều vượt qua node -c (exit code 0)"
            ]
        })
        print("Completed TASK-0017:", res)

if __name__ == "__main__":
    asyncio.run(main())
