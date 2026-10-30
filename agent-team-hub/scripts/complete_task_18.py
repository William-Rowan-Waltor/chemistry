import asyncio
import sys
from fastmcp import Client

sys.stdout.reconfigure(encoding="utf-8")

URL = "http://127.0.0.1:8931/mcp"

async def main():
    async with Client(URL) as client:
        res = await client.call_tool("complete_task", {
            "task_id": "TASK-0018",
            "completed_by": "antigravity",
            "summary": "Đã đẩy toàn bộ 4 commit lên GitHub origin/main để Vercel tự động build & deploy phiên bản mới nhất, đồng thời thêm cache busting ?v=20261030 trên index.html, nâng cấp CUSTOM_DATA_KEY lên v3, và bổ sung cơ chế ensureOfficialTestsPreserved bảo vệ 2 đề mới không bao giờ bị đè bởi cache cũ trong localStorage.",
            "evidence": [
                "git push origin main -> SUCCESS (commit 22597ac..bdf16c9 pushed to https://github.com/William-Rowan-Waltor/chemistry.git)",
                "index.html: Thêm query param ?v=20261030 vào css và toàn bộ file js (diagrams.js, data.js, chemlab.js, games.js, traps.js, engine.js) để trình duyệt mobile/desktop tự động tải code mới nhất",
                "js/engine.js: Nâng cấp CUSTOM_DATA_KEY lên hoa11_12_custom_data_v3, tự động migrate dữ liệu cũ",
                "js/engine.js: Bổ sung hàm ensureOfficialTestsPreserved() trong initCustomData và syncFromCloud đảm bảo g12t19 và g12t20 luôn tồn tại dù client có cache cũ",
                "Node simulation: Test boot với localStorage giả lập chứa 20 đề cũ -> Kết quả tự động giữ trọn vẹn 22 đề (g12t19 và g12t20 không bị mất)",
                "Regression suite: scripts/verify_chemistry_data.py -> PASS 100% (22 đề thi, 705 câu hỏi)"
            ]
        })
        print("Completed TASK-0018:", res)

if __name__ == "__main__":
    asyncio.run(main())
