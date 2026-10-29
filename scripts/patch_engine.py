#!/usr/bin/env python3
"""Patch and harmonize question kind mappings in js/engine.js."""

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ENGINE_JS = ROOT / "js" / "engine.js"

content = ENGINE_JS.read_text(encoding="utf-8")

patches = [
    # 1. bankKindBadge
    (
        '  function bankKindBadge(k) {\n    var m = { m: [ico("choose"), "Trắc nghiệm"], tf: [ico("scale"), "Đúng / Sai"], n: [ico("type"), "Điền số"] }[k] || [k, k];\n    return \'<span class="q-kind">\' + m[0] + " " + m[1] + "</span>";\n  }',
        '''  function bankKindBadge(k) {
    var m = {
      m: [ico("choose"), "Trắc nghiệm"],
      mc: [ico("choose"), "Trắc nghiệm"],
      tf: [ico("scale"), "Đúng / Sai"],
      n: [ico("type"), "Điền số"],
      num: [ico("type"), "Điền số"],
      sa: [ico("type"), "Điền số"]
    }[k] || [ico("type"), k];
    return '<span class="q-kind">' + m[0] + " " + m[1] + "</span>";
  }'''
    ),
    # 2. bank question html k === "m" || k === "mc"
    (
        '    if (it.k === "m") {\n      body = \'<div class="mcq-opts">\'',
        '    if (it.k === "m" || it.k === "mc") {\n      body = \'<div class="mcq-opts">\''
    ),
    # 3. bankPick k === "m" || it.k === "mc" || it.k === "tf"
    (
        '    if (it.k === "m" || it.k === "tf") {\n      correct = (pick === it.a) || (it.k === "tf" && String(pick) === String(it.a));',
        '    if (it.k === "m" || it.k === "mc" || it.k === "tf") {\n      correct = (pick === it.a) || (it.k === "tf" && String(pick) === String(it.a));'
    ),
    # 4. bankPick buttons disable
    (
        '    if (it.k === "m" || it.k === "tf") {\n      $(".mcq-opt, .tf-opt").forEach(function(btn) {',
        '    if (it.k === "m" || it.k === "mc" || it.k === "tf") {\n      $(".mcq-opt, .tf-opt").forEach(function(btn) {'
    ),
    # 5. bank feedback text
    (
        "(it.k === \"m\" ? '. ' + fmt(correctObj.t) : '')",
        "((it.k === \"m\" || it.k === \"mc\") ? '. ' + fmt(correctObj.t) : '')"
    ),
    (
        "(it.k === \"m\" ? '. ' + fmt(pickedObj.t) : '')",
        "((it.k === \"m\" || it.k === \"mc\") ? '. ' + fmt(pickedObj.t) : '')"
    ),
    # 6. testQHTML
    (
        '    } else if (it.k === "m") {\n      body = \'<div class="mcq-opts">\'',
        '    } else if (it.k === "m" || it.k === "mc") {\n      body = \'<div class="mcq-opts">\''
    ),
    # 7. testSubmit checkNum
    (
        '      } else if (it.k === "n" || it.k === "num") {\n        ok = checkNum(ans, it);',
        '      } else if (it.k === "n" || it.k === "num" || it.k === "sa") {\n        ok = checkNum(ans, it);'
    ),
    # 8. test review summary
    (
        '        if (d.it.k === "m") yourAns = "Bạn chọn: "',
        '        if (d.it.k === "m" || d.it.k === "mc") yourAns = "Bạn chọn: "'
    ),
    # 9. coachTestQHTML short-ans-box
    (
        '    } else if (cur.k === "n" || cur.k === "num") {\n      var nVal = ans ? ans.picked : "";\n      optsHtml = \'<div class="short-ans-box">\' +\n        \'<input type="text" id="coachShortAnsInput" class="short-ans-input" placeholder="Nhập đáp số (số hoặc chữ)..." value="\' + esc(nVal || "") + \'" \' + (isSubmitted ? \'disabled\' : \'\') + \'>\' +\n        (!isSubmitted ? \'<button class="btn primary" data-act="coachPickN">Kiểm tra kết quả</button>\' : \'\') +\n      \'</div>\';',
        '    } else if (cur.k === "n" || cur.k === "num" || cur.k === "sa") {\n      var nVal = ans ? ans.picked : "";\n      optsHtml = \'<div class="short-ans-box">\' +\n        \'<input type="text" id="coachShortAnsInput" class="short-ans-input" placeholder="Nhập đáp số (số hoặc chữ)..." value="\' + esc(nVal || "") + \'" \' + (isSubmitted ? \'disabled\' : \'\') + \'>\' +\n        (cur.u ? \'<span class="num-unit">\' + esc(cur.u) + \'</span>\' : \'\') +\n        (!isSubmitted ? \'<button class="btn primary" data-act="coachPickN">Kiểm tra kết quả</button>\' : \'\') +\n      \'</div>\';'
    ),
    # 10. coachTest diagnostic explanation
    (
        '(cur.k === "m" ? \' — \' + fmt((opts.find(function(o){ return o.k === String(cur.a).trim(); }) || {}).t || "") : \'\')',
        '((cur.k === "m" || cur.k === "mc") ? \' — \' + fmt((opts.find(function(o){ return o.k === String(cur.a).trim(); }) || {}).t || "") : \'\')'
    ),
]

# Normalizing newlines for replacement matching
is_crlf = "\r\n" in content
clean_content = content.replace("\r\n", "\n")

applied = 0
for idx, (target, repl) in enumerate(patches, 1):
    if target in clean_content:
        clean_content = clean_content.replace(target, repl, 1)
        applied += 1
        print(f"[{idx}] Applied patch successfully")
    else:
        print(f"[{idx}] WARNING: Target not found:")
        print(target[:60] + "...")

if is_crlf:
    final_content = clean_content.replace("\n", "\r\n")
else:
    final_content = clean_content

ENGINE_JS.write_text(final_content, encoding="utf-8")
print(f"\nApplied {applied}/{len(patches)} patches to {ENGINE_JS}")

# Validate with node
try:
    res = subprocess.run(["node", "-c", str(ENGINE_JS)], capture_output=True, text=True, check=True)
    print("Node syntax check: PASS!")
except Exception as e:
    print("Node syntax check: FAILED!", e)
    sys.exit(1)
