# -*- coding: utf-8 -*-
with open("js/engine.js", "r", encoding="utf-8") as f:
    code = f.read()

# 1. Update renderLibNotes to delegate to window.MoleGuide.render()
old_map = """      var isSys = (n.id === SYSTEM_NOTE_MOLE_RATIO.id);
      var badge = isSys ? '<span class="badge g12" style="margin-left:6px;font-size:0.72rem;padding:2px 7px">📌 Hệ thống · GDPT 2018</span>' : "";
      return '<div class="note-item' + (isSys ? " sys-note" : "") + '">' +
        "<h4>" + esc(n.t || "Ghi chú") + badge + "</h4>" +
        '<div class="ni-meta">' + ico("pen") + " " + (isSys ? "Biên soạn chuẩn bộ đề &amp; SGK Hoá 12" : "Lưu lúc " + ds) + "</div>" +
        '<div class="ni-body">' + esc(n.b || "") + "</div>" +
        '<div class="ni-actions">' +
          '<button class="btn ghost tiny" data-act="copyNote" data-id="' + n.id + '">' + ico("cards") + " Sao chép</button>" +
          '<button class="btn warn tiny del-btn" data-act="noteDel" data-id="' + n.id + '">Xoá</button>' +
        "</div>" +
      "</div>";"""

new_map = """      var isSys = (n.id === SYSTEM_NOTE_MOLE_RATIO.id);
      if (isSys && window.MoleGuide) {
        return window.MoleGuide.render();
      }
      var badge = isSys ? '<span class="badge g12" style="margin-left:6px;font-size:0.72rem;padding:2px 7px">📌 Hệ thống · GDPT 2018</span>' : "";
      return '<div class="note-item' + (isSys ? " sys-note" : "") + '">' +
        "<h4>" + esc(n.t || "Ghi chú") + badge + "</h4>" +
        '<div class="ni-meta">' + ico("pen") + " " + (isSys ? "Biên soạn chuẩn bộ đề &amp; SGK Hoá 12" : "Lưu lúc " + ds) + "</div>" +
        '<div class="ni-body">' + esc(n.b || "") + "</div>" +
        '<div class="ni-actions">' +
          '<button class="btn ghost tiny" data-act="copyNote" data-id="' + n.id + '">' + ico("cards") + " Sao chép</button>" +
          '<button class="btn warn tiny del-btn" data-act="noteDel" data-id="' + n.id + '">Xoá</button>' +
        "</div>" +
      "</div>";"""

if old_map in code:
    code = code.replace(old_map, new_map)
    print("1. Updated renderLibNotes to delegate to MoleGuide.render()")
else:
    print("WARNING: Could not find exact old_map in engine.js")

# 2. Add input listener
input_listener = """  document.addEventListener("input", function (ev) {
    if (ev.target && ev.target.id === "moleSearchInput") {
      if (window.MoleGuide) window.MoleGuide.setSearch(ev.target.value);
    }
  });\n\n"""

target_blur = """  /* ═══════════ GLOBAL CLICK DELEGATION & ACTION HANDLERS ═══════════ */
  document.addEventListener("blur", function (ev) {"""

replacement_blur = """  /* ═══════════ GLOBAL CLICK DELEGATION & ACTION HANDLERS ═══════════ */
""" + input_listener + """  document.addEventListener("blur", function (ev) {"""

if target_blur in code and "moleSearchInput" not in code:
    code = code.replace(target_blur, replacement_blur, 1)
    print("2. Added input listener for moleSearchInput")

# 3. Add click cases in switch (act)
old_restore = """      case "restoreMoleNotes":
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

new_restore = """      case "restoreMoleNotes":
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
        break;
      case "moleFilter":
        if (window.MoleGuide) window.MoleGuide.setFilter(el.getAttribute("data-cat"));
        break;
      case "moleToggleView":
        if (window.MoleGuide) window.MoleGuide.toggleViewMode();
        break;
      case "moleToggleCard":
        if (window.MoleGuide) window.MoleGuide.toggleCard(el.getAttribute("data-id"));
        break;
      case "moleToggleAll":
        if (window.MoleGuide) window.MoleGuide.toggleAll();
        break;
      case "moleCopyAll":
        if (window.MoleGuide) window.MoleGuide.copyAllText();
        break;
      case "moleClearSearch":
        if (window.MoleGuide) window.MoleGuide.setSearch("");
        break;"""

if old_restore in code:
    code = code.replace(old_restore, new_restore)
    print("3. Added mole actions to click switch")
else:
    print("WARNING: Could not find old_restore in engine.js")

with open("js/engine.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Saved js/engine.js successfully")
