import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
VERIFY_PY = ROOT / "scripts" / "verify_chemistry_data.py"
text = VERIFY_PY.read_text(encoding="utf-8")

old_parse = """def parse_opts(opts_str: str) -> dict[str, str]:
    \"\"\"Parse 'A=...;B=...;C=...;D=...' options into a dictionary.\"\"\"
    if not opts_str:
        return {}
    res = {}
    for part in opts_str.split(";"):
        if "=" in part:
            k, v = part.split("=", 1)
            res[k.strip()] = v.strip()
    return res"""

new_parse = """def parse_opts(opts_str: str) -> dict[str, str]:
    \"\"\"Parse 'A=...;B=...;C=...;D=...' options into a dictionary.\"\"\"
    if not opts_str:
        return {}
    re_opt = re.compile(r'(?:^|;\s*)([A-Da-d0-9])\s*=\s*(.*?)(?=(?:;\s*[A-Da-d0-9]\s*=|$))', re.DOTALL)
    matches = re_opt.findall(opts_str)
    if matches:
        return {k.strip().upper(): v.strip() for k, v in matches}
    res = {}
    for part in opts_str.split(";"):
        if "=" in part:
            k, v = part.split("=", 1)
            res[k.strip().upper()] = v.strip()
    return res"""

if old_parse not in text and old_parse.replace('\n', '\r\n') in text:
    old_parse = old_parse.replace('\n', '\r\n')
    new_parse = new_parse.replace('\n', '\r\n')

assert old_parse in text, "old_parse not found"
text = text.replace(old_parse, new_parse, 1)

old_mcq = """            if k in ("m", "mc"):
                opts_raw = q.get("o", "")
                opts_dict = parse_opts(opts_raw)
                if len(opts_dict) < 2:
                    errors.append(f"{q_label}: Invalid MCQ options format (needs >= 2 options): '{opts_raw}'")
                ans_key = str(q.get("a", "")).strip()
                if ans_key not in opts_dict:
                    errors.append(f"{q_label}: MCQ answer key '{ans_key}' not found in options {list(opts_dict.keys())}")"""

new_mcq = """            if k in ("m", "mc"):
                opts_raw = q.get("o", "")
                opts_dict = parse_opts(opts_raw)
                if set(opts_dict.keys()) != {"A", "B", "C", "D"}:
                    errors.append(f"{q_label}: MCQ must have exactly 4 options (A, B, C, D), got {list(opts_dict.keys())} in '{opts_raw}'")
                ans_key = str(q.get("a", "")).strip().upper()
                if ans_key not in opts_dict:
                    errors.append(f"{q_label}: MCQ answer key '{ans_key}' not found in options {list(opts_dict.keys())}")"""

if old_mcq not in text and old_mcq.replace('\n', '\r\n') in text:
    old_mcq = old_mcq.replace('\n', '\r\n')
    new_mcq = new_mcq.replace('\n', '\r\n')

assert old_mcq in text, "old_mcq not found"
text = text.replace(old_mcq, new_mcq, 1)

old_flash_stat = "    print(f\"  - Total flashcards audited:   {total_flashcards}\")"
new_flash_stat = """    print(f"  - Total flashcards audited:   {total_flashcards} (must be exactly 50)")

    if total_flashcards != 50:
        errors.append(f"Total flashcards count mismatch: expected 50, got {total_flashcards}")"""

if old_flash_stat not in text and old_flash_stat.replace('\n', '\r\n') in text:
    old_flash_stat = old_flash_stat.replace('\n', '\r\n')
    new_flash_stat = new_flash_stat.replace('\n', '\r\n')

assert old_flash_stat in text, "old_flash_stat not found"
text = text.replace(old_flash_stat, new_flash_stat, 1)

VERIFY_PY.write_text(text, encoding="utf-8")
print("Successfully updated scripts/verify_chemistry_data.py with exact 4 options check and 50 flashcards check!")
