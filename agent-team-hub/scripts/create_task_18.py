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
            "title": "Fix deployed web visibility on desktop & mobile: Git push origin main, cache busting query and localStorage customData merge protection",
            "objective": "Resolve user reported issue where 2 new exams (g12t19, g12t20) are not visible on desktop and mobile web: push all unpushed commits to origin/main for Vercel auto-deployment, add script version query params in index.html to bust aggressive mobile/desktop browser caching, bump CUSTOM_DATA_KEY to v3, and ensure official tests are unconditionally preserved in initCustomData and syncFromCloud.",
            "acceptance_criteria": [
                "Bust static cache in index.html with ?v=20261030 for css and js scripts",
                "Protect DATA.tests in initCustomData and syncFromCloud against stale localStorage overrides",
                "Bump CUSTOM_DATA_KEY to v3",
                "Execute git push origin main so GitHub and Vercel receive the 2 new exams and all fixes"
            ],
            "context_files": ["index.html", "js/engine.js", "js/data.js", "vercel.json"],
            "constraints": ["Keep regression suite 100% PASS"],
            "priority": "urgent"
        })
        task_id = task.data.get("task_id", "TASK-0018")
        print("Created task:", task_id)

if __name__ == "__main__":
    asyncio.run(main())
