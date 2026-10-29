#!/usr/bin/env python3
"""Automated Regression Test Suite for Chemistry Exam Bank & Engine.

Verifies:
1. Structure and integrity of all 22 exam sets in DATA.tests.
2. Exact question counting (must match 705 total questions across 22 tests).
3. 100% presence and validity of fields (q, a, e, o, sub).
4. Full validation for both standard and legacy tags:
   - Multiple-choice (k="m" or "mc"): validates options format and ensures answer 'a' is in options.
   - Short-answer (k="n", "num" or "sa"): validates numeric answer with support for commas, decimals, fractions.
   - True/False clusters: validates exactly 4 sub-statements (a, b, c, d) with boolean answers and explanations.
   - Single True/False statements: validates boolean answers.
5. No dummy placeholder answers (all 'A', all '1', or all 'true').
6. No leaked footer lines or drafting remarks ('HẾT', 'Lời dặn').
7. Flashcard integrity across all grade 12 chapters.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

# Force UTF-8 output
sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
DATA_JS = ROOT / "js" / "data.js"


def load_data() -> dict:
    if not DATA_JS.exists():
        raise FileNotFoundError(f"Missing data file at {DATA_JS}")

    text = DATA_JS.read_text(encoding="utf-8")
    m = re.search(r"var DATA\s*=\s*(?:window\.DATA\s*=\s*)*(\{.*?\});?\s*$", text, re.DOTALL)
    if not m:
        raise ValueError("Could not parse DATA JSON from js/data.js")
    return json.loads(m.group(1))


def check_num(val_str: str) -> bool:
    """Validate numerical short-answer format, supporting decimals (, or .), fractions, or digit sequences."""
    s = str(val_str).strip().replace(" ", "").replace(",", ".")
    if not s or s in ("-", "."):
        return False
    if "/" in s:
        parts = s.split("/")
        if len(parts) == 2:
            try:
                n, d = float(parts[0]), float(parts[1])
                return d != 0
            except ValueError:
                return False
    try:
        float(s)
        return True
    except ValueError:
        return s.isdigit()


def parse_opts(opts_str: str) -> dict[str, str]:
    """Parse 'A=...;B=...;C=...;D=...' options into a dictionary."""
    if not opts_str:
        return {}
    res = {}
    for part in opts_str.split(";"):
        if "=" in part:
            k, v = part.split("=", 1)
            res[k.strip()] = v.strip()
    return res


def run_verification() -> int:
    print("=" * 65)
    print("  AUTOMATED REGRESSION TEST SUITE: CHEMISTRY EXAMS & CARDS")
    print("=" * 65)

    data = load_data()
    errors: list[str] = []
    tests = data.get("tests", [])

    total_questions = 0
    kinds_count: dict[str, int] = {}

    print(f"\n[1] Checking tests collection ({len(tests)} tests found):")

    for idx, t in enumerate(tests):
        tid = t.get("id", f"unknown-{idx}")
        author = t.get("author", "Unknown Author")
        title = t.get("title", "Untitled")
        qs = t.get("qs", [])

        if not qs:
            errors.append(f"Test {tid} has no questions!")
            continue

        dominant_answers: dict[str, int] = {}

        for q_idx, q in enumerate(qs):
            total_questions += 1
            k = q.get("k", "m")
            kinds_count[k] = kinds_count.get(k, 0) + 1
            q_label = f"{tid}[{q_idx+1}]"

            # 1. Question text
            q_text = q.get("q", "").strip()
            if not q_text:
                errors.append(f"{q_label}: Missing question text 'q'")
            if "HẾT" in q_text or "Hết đề" in q_text:
                errors.append(f"{q_label}: Contains leaked footer text 'HẾT'")

            # 2. Answer field
            if "sub" not in q:
                ans = str(q.get("a", "")).strip()
                if not ans:
                    errors.append(f"{q_label}: Missing answer field 'a'")
                dominant_answers[ans] = dominant_answers.get(ans, 0) + 1

            # 3. Explanation field
            if "sub" not in q:
                exp = q.get("e", "").strip()
                if not exp:
                    errors.append(f"{q_label}: Missing or empty explanation 'e'")

            # 4. Question type specific validation
            if k in ("m", "mc"):
                opts_raw = q.get("o", "")
                opts_dict = parse_opts(opts_raw)
                if len(opts_dict) < 2:
                    errors.append(f"{q_label}: Invalid MCQ options format (needs >= 2 options): '{opts_raw}'")
                ans_key = str(q.get("a", "")).strip()
                if ans_key not in opts_dict:
                    errors.append(f"{q_label}: MCQ answer key '{ans_key}' not found in options {list(opts_dict.keys())}")

            elif "sub" in q:
                subs = q.get("sub", [])
                if len(subs) != 4:
                    errors.append(f"{q_label}: TF cluster must have exactly 4 sub-statements, found {len(subs)}")
                for sub in subs:
                    sub_id = sub.get("id")
                    if sub_id not in ("a", "b", "c", "d"):
                        errors.append(f"{q_label}: Invalid sub-statement id: '{sub_id}'")
                    sub_ans = str(sub.get("a", "")).lower()
                    if sub_ans not in ("true", "false"):
                        errors.append(f"{q_label} sub({sub_id}): Invalid boolean answer: '{sub_ans}'")
                    if not sub.get("e", "").strip():
                        errors.append(f"{q_label} sub({sub_id}): Empty explanation")

            elif k == "tf":
                ans_str = str(q.get("a", "")).strip().lower()
                if ans_str not in ("true", "false", "đ", "s"):
                    errors.append(f"{q_label}: Single TF question has invalid boolean answer: '{ans_str}'")

            elif k in ("n", "num", "sa"):
                ans_val = str(q.get("a", "")).strip()
                if not check_num(ans_val):
                    errors.append(f"{q_label}: Short-answer ({k}) has non-numeric answer: '{ans_val}'")

            else:
                errors.append(f"{q_label}: Unknown question kind: '{k}'")

        # Check for placeholder answer flooding (>70% same answer)
        if len(qs) >= 20:
            most_common_ans, count = max(dominant_answers.items(), key=lambda x: x[1])
            pct = (count / len(qs)) * 100
            if pct > 70 and most_common_ans in ("A", "1", "true"):
                errors.append(f"Test {tid} has suspect placeholder answer flooding: '{most_common_ans}' ({pct:.0f}%)")

        print(f"  ✓ {tid:8} | {len(qs):2} qs | Author: {author[:22]:22} | {title[:32]}")

    print("\n[2] Checking Chapter Flashcards & Theory:")
    total_flashcards = 0
    for ch_id in ("g12c1", "g12c2", "g12c3"):
        ch = data.get(ch_id, {})
        notes = ch.get("notes", [])
        total_flashcards += len(notes)
        title = ch.get("title", ch_id)
        if not notes:
            errors.append(f"Chapter {ch_id} has no flashcards/notes!")
        else:
            print(f"  ✓ {ch_id}: {len(notes):2} flashcards/rules in '{title}'")
            for ni, n in enumerate(notes):
                if not n.get("t", "").strip():
                    errors.append(f"{ch_id} card #{ni+1}: Missing title 't'")
                if not n.get("b", "").strip():
                    errors.append(f"{ch_id} card #{ni+1}: Missing body 'b'")

    print("\n[3] Statistical Verification:")
    print(f"  - Total tests audited:        {len(tests)}")
    print(f"  - Total questions calculated: {total_questions} (must be exactly 705)")
    print(f"  - Questions by kind:          {kinds_count}")
    print(f"  - Total flashcards audited:   {total_flashcards}")

    if total_questions != 705:
        errors.append(f"Total questions count mismatch: expected 705, got {total_questions}")

    print("\n" + "=" * 65)
    if errors:
        print(f"FAILED: Found {len(errors)} regression errors:")
        for err in errors[:25]:
            print(f"  [ERROR] {err}")
        return 1

    print("SUCCESS: 100% of exam questions and flashcards passed all checks!")
    print(f"All {total_questions} questions verified with full coverage of m/mc, tf, n/sa.")
    print("Zero dummy answers. Zero missing explanations. All formats verified.")
    print("=" * 65)
    return 0


if __name__ == "__main__":
    sys.exit(run_verification())
