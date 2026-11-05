# -*- coding: utf-8 -*-
import sys, json

sys.stdout.reconfigure(encoding="utf-8")

from build_mole_ratio_note import note_title, note_body

# Convert note_body to JSON string representation so it can safely be embedded into JS
json_body = json.dumps(note_body, ensure_ascii=False)
json_title = json.dumps(note_title, ensure_ascii=False)

system_note_js = f"""  /* ═══ SYSTEM NOTE: G12 MOLE RATIOS & STOICHIOMETRIC RELATIONS (CT GDPT 2018) ═══ */
  var SYSTEM_NOTE_MOLE_RATIO = {{
    id: "sys_note_mole_ratios_g12",
    t: {json_title},
    b: {json_body},
    ts: 1730000000000
  }};

  function ensureDefaultNotes(s) {{
    if (!s || !Array.isArray(s.notes)) return;
    var hasSysNote = s.notes.some(function (n) {{ return n.id === SYSTEM_NOTE_MOLE_RATIO.id; }});
    if (!hasSysNote && !s.deletedSysMoleNote) {{
      s.notes.unshift(SYSTEM_NOTE_MOLE_RATIO);
    }}
  }}
"""

with open("js/engine.js", "r", encoding="utf-8") as f:
    engine_code = f.read()

# Check if SYSTEM_NOTE_MOLE_RATIO is already present
if "SYSTEM_NOTE_MOLE_RATIO" in engine_code:
    print("SYSTEM_NOTE_MOLE_RATIO already in engine.js, skipping declaration patch")
else:
    # Insert right before function profile()
    target = "  function profile() {"
    pos = engine_code.find(target)
    if pos == -1:
        print("ERROR: could not find '  function profile() {'")
        sys.exit(1)
    
    replacement = system_note_js + "\n" + target
    engine_code = engine_code[:pos] + replacement + engine_code[pos + len(target):]
    print("Inserted SYSTEM_NOTE_MOLE_RATIO before profile()")

# Now check inside profile() for ensureDefaultNotes(s);
if "ensureDefaultNotes(s);" not in engine_code:
    target2 = "    s.guidedPredictions = s.guidedPredictions || {};\n    return s;"
    pos2 = engine_code.find(target2)
    if pos2 == -1:
        print("ERROR: could not find target2 in profile()")
        sys.exit(1)
    replacement2 = "    s.guidedPredictions = s.guidedPredictions || {};\n    ensureDefaultNotes(s);\n    return s;"
    engine_code = engine_code[:pos2] + replacement2 + engine_code[pos2 + len(target2):]
    print("Added ensureDefaultNotes(s) into profile()")

# Now update renderLibNotes
old_renderLibNotes = """  function renderLibNotes() {
    var s = profile();
    var notes = s.notes || [];
    var list = notes.slice().sort(function (a, b) { return b.ts - a.ts; }).map(function (n) {
      var d = new Date(n.ts);
      var ds = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
      return '<div class="note-item">' +
        "<h4>" + esc(n.t || "Ghi chú") + "</h4>" +
        '<div class="ni-meta">' + ico("pen") + " Lưu lúc " + ds + "</div>" +
        '<div class="ni-body">' + esc(n.b || "") + "</div>" +
        '<div class="ni-actions">' +
          '<button class="btn warn tiny del-btn" data-act="noteDel" data-id="' + n.id + '">Xoá</button>' +
        "</div>" +
      "</div>";
    }).join("");
    return '<div class="notes-editor">' +
      "<h3>" + ico("pen") + " Ghi chú nhanh cá nhân</h3>" +
      '<input id="nt" placeholder="Tiêu đề ghi chú…" style="width:100%;margin-bottom:8px;padding:8px 12px;border:1px solid var(--line);border-radius:8px">' +
      '<textarea id="nb" rows="3" placeholder="Viết điều bạn muốn ghi nhớ…" style="width:100%;padding:8px 12px;border:1px solid var(--line);border-radius:8px"></textarea>' +
      '<button class="btn primary" style="margin-top:8px" data-act="noteSave">Lưu ghi chú</button>' +
    "</div>" +
    '<div class="fav-sec"><h2 class="sec-title">Ghi chú đã lưu</h2><div class="fav-list">' + (list || "<p class='muted'>Chưa có ghi chú nào.</p>") + "</div></div>";
  }"""

new_renderLibNotes = """  function renderLibNotes() {
    var s = profile();
    var notes = s.notes || [];
    var list = notes.slice().sort(function (a, b) {
      if (a.id === SYSTEM_NOTE_MOLE_RATIO.id) return -1;
      if (b.id === SYSTEM_NOTE_MOLE_RATIO.id) return 1;
      return b.ts - a.ts;
    }).map(function (n) {
      var d = new Date(n.ts);
      var ds = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
      var isSys = (n.id === SYSTEM_NOTE_MOLE_RATIO.id);
      var badge = isSys ? '<span class="badge g12" style="margin-left:6px;font-size:0.72rem;padding:2px 7px">📌 Hệ thống · GDPT 2018</span>' : "";
      return '<div class="note-item' + (isSys ? " sys-note" : "") + '">' +
        "<h4>" + esc(n.t || "Ghi chú") + badge + "</h4>" +
        '<div class="ni-meta">' + ico("pen") + " " + (isSys ? "Biên soạn chuẩn bộ đề &amp; SGK Hoá 12" : "Lưu lúc " + ds) + "</div>" +
        '<div class="ni-body">' + esc(n.b || "") + "</div>" +
        '<div class="ni-actions">' +
          '<button class="btn ghost tiny" data-act="copyNote" data-id="' + n.id + '">' + ico("cards") + " Sao chép</button>" +
          '<button class="btn warn tiny del-btn" data-act="noteDel" data-id="' + n.id + '">Xoá</button>' +
        "</div>" +
      "</div>";
    }).join("");
    return '<div class="notes-editor">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px">' +
        '<h3 style="margin:0">' + ico("pen") + " Ghi chú nhanh cá nhân</h3>" +
        '<button class="btn ghost tiny" data-act="restoreMoleNotes" title="Khôi phục lại cẩm nang tỉ lệ mol nếu bạn lỡ xoá">⚡ Khôi phục cẩm nang tỉ lệ mol</button>' +
      '</div>' +
      '<input id="nt" placeholder="Tiêu đề ghi chú…" style="width:100%;margin-bottom:8px;padding:8px 12px;border:1px solid var(--line);border-radius:8px">' +
      '<textarea id="nb" rows="3" placeholder="Viết điều bạn muốn ghi nhớ…" style="width:100%;padding:8px 12px;border:1px solid var(--line);border-radius:8px"></textarea>' +
      '<button class="btn primary" style="margin-top:8px" data-act="noteSave">Lưu ghi chú</button>' +
    "</div>" +
    '<div class="fav-sec"><h2 class="sec-title">Ghi chú đã lưu</h2><div class="fav-list">' + (list || "<p class='muted'>Chưa có ghi chú nào.</p>") + "</div></div>";
  }"""

if old_renderLibNotes in engine_code:
    engine_code = engine_code.replace(old_renderLibNotes, new_renderLibNotes)
    print("Replaced renderLibNotes with upgraded version")
else:
    print("WARNING: Could not find exact old_renderLibNotes, checking if already modified")

# Now update the action dispatcher: noteDel, copyNote, restoreMoleNotes
old_actions = """      /* Notes */
      case "noteSave": noteSave(); break;
      case "noteDel":
        var s = profile();
        var id = el.getAttribute("data-id");
        s.notes = (s.notes || []).filter(function (n) { return n.id !== id; });
        save(s);
        renderLibraryOnly(); break;"""

new_actions = """      /* Notes */
      case "noteSave": noteSave(); break;
      case "noteDel":
        var s = profile();
        var id = el.getAttribute("data-id");
        if (id === SYSTEM_NOTE_MOLE_RATIO.id) {
          s.deletedSysMoleNote = true;
        }
        s.notes = (s.notes || []).filter(function (n) { return n.id !== id; });
        save(s);
        renderLibraryOnly(); break;
      case "copyNote":
        (function () {
          var id = el.getAttribute("data-id");
          var s = profile();
          var target = (s.notes || []).find(function (n) { return n.id === id; });
          if (target && target.b) {
            var fullText = (target.t || "") + "\\n\\n" + (target.b || "");
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(fullText).then(function () {
                showMiniToast("✓ Đã sao chép nội dung ghi chú vào clipboard!");
              }).catch(function () {
                showMiniToast("Không thể sao chép tự động");
              });
            } else {
              showMiniToast("Trình duyệt không hỗ trợ clipboard API");
            }
          }
        })();
        break;
      case "restoreMoleNotes":
        (function () {
          var s = profile();
          delete s.deletedSysMoleNote;
          s.notes = s.notes || [];
          var exists = s.notes.some(function (n) { return n.id === SYSTEM_NOTE_MOLE_RATIO.id; });
          if (!exists) s.notes.unshift(SYSTEM_NOTE_MOLE_RATIO);
          save(s);
          renderLibraryOnly();
          showMiniToast("⚡ Đã nạp lại Cẩm nang Tỉ lệ Mol Hoá 12 vào ghi chú!");
        })();
        break;"""

if old_actions in engine_code:
    engine_code = engine_code.replace(old_actions, new_actions)
    print("Replaced noteDel actions and added copyNote & restoreMoleNotes")
else:
    print("WARNING: Could not find exact old_actions")

with open("js/engine.js", "w", encoding="utf-8") as f:
    f.write(engine_code)

print("Saved js/engine.js successfully")
