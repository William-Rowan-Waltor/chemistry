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
            "title": "Execute OpenCode Comprehensive Roadmap: P0 (parseOpts, g12t1#3, g12t2#3, 4-opts test), P1 (quick-theory, distractor analysis, g12t20 Q3, g12c3 expansion, testWrong), P2 (units, docs)",
            "objective": "Implement full enhancement package proposed by OpenCode: (1) Robust parseOpts regex + fix g12t1#3 & g12t2#3 + enforce exact 4 MCQ options in test suite; (2) Unify theory modal using noteBody() and remove quick-theory snippet truncation; (3) Upgrade getDistractorAnalysis with true/false cluster handling and per-option reasoning; (4) Fix g12t20 Q3 explanation & 'Glutacid' typo + add per-question chapter tags (ch) to g12t19 and g12t20; (5) Expand g12c3 to cover Amino Acid, Peptide, Protein with 8 new flashcards/notes; (6) Harden testWrong retake workflow; (7) Add unit tags (u) for quantitative calculation questions and update documentation.",
            "acceptance_criteria": [
                "P0: parseOpts in engine.js and verify_chemistry_data.py handles options with semicolons and spaces cleanly; g12t1#3 and g12t2#3 formatted with '<'; verify_chemistry_data enforces exactly 4 options on 100% MCQ",
                "P1: openTheoryModal uses noteBody(n) with full markdown table support; getQuickTheorySummary removes arbitrary text truncation",
                "P1: getDistractorAnalysis handles True/False clusters (sub) and extracts option-specific explanations from q.oe / q.e",
                "P1: g12t20 Q3 explanation aligned with scrambled option B; typo 'Glutacid' fixed to 'Glutamic acid'; all 56 questions of g12t19 and g12t20 tagged with accurate chapter ch (g12c1, g12c2, g12c3)",
                "P1: g12c3 expanded with 8 comprehensive notes covering Amino Acid, Peptide, Protein & Enzyme",
                "P1: testWrong retake flow allows retrying mistakes and re-entering review seamlessly",
                "P2: Quantitative short-answer questions have explicit unit u (g, kg, mol, %, etc.); docs updated",
                "100% PASS on verify_chemistry_data.py and node syntax checks; push to origin/main"
            ],
            "context_files": ["js/engine.js", "js/data.js", "scripts/verify_chemistry_data.py", "docs/feedbacks_01.md"],
            "constraints": ["Zero regressions", "Preserve all existing data integrity", "Push to origin/main when verified"],
            "priority": "urgent"
        })
        task_id = task.data.get("task_id", "TASK-0019")
        print("Created task:", task_id)
        await client.call_tool("update_status", {
            "task_id": task_id,
            "updated_by": "antigravity",
            "status": "in_progress",
            "reason": "Bắt đầu triển khai toàn diện lộ trình OpenCode theo các phân hệ P0, P1, P2."
        })

if __name__ == "__main__":
    asyncio.run(main())
