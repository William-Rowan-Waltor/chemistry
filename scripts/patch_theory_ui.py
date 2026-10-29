#!/usr/bin/env python3
"""Patch Quick Theory modal and in-place peek layout and text double-escaping."""

import subprocess
import sys
from pathlib import Path

# Force UTF-8 output
sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
ENGINE_JS = ROOT / "js" / "engine.js"
STYLE_CSS = ROOT / "css" / "style.css"

# 1. Patch js/engine.js
engine_txt = ENGINE_JS.read_text(encoding="utf-8")
is_crlf_eng = "\r\n" in engine_txt
eng_norm = engine_txt.replace("\r\n", "\n")

target_summary = '''  function getQuickTheorySummary(chId) {
    var ch = DATA[chId];
    if (!ch) {
      ch = (DATA.chapters || []).find(function (c) { return c.id === chId; });
    }
    if (!ch) return null;

    var notesText = "";
    if (ch.notes && ch.notes.length) {
      notesText = ch.notes.slice(0, 3).map(function (n) {
        var raw = String(n.text || n.b || "").replace(/<[^>]+>/g, "");
        var snippet = raw.length > 170 ? raw.slice(0, 170) + "..." : raw;
        return '• <b>' + esc(n.title || n.t) + ':</b> ' + fmt(snippet);
      }).join("<br>");
    }

    return {
      feynman: ch.feynman || ch.hook || "",
      keyNotes: notesText
    };
  }'''

repl_summary = '''  function getQuickTheorySummary(chId) {
    var ch = DATA[chId];
    if (!ch) {
      ch = (DATA.chapters || []).find(function (c) { return c.id === chId; });
    }
    if (!ch) return null;

    var notesItems = [];
    if (ch.notes && ch.notes.length) {
      notesItems = ch.notes.slice(0, 4).map(function (n) {
        var raw = String(n.text || n.b || "").replace(/<[^>]+>/g, "").trim();
        var snippet = raw.length > 180 ? raw.slice(0, 175) + "…" : raw;
        return {
          title: n.title || n.t || "Trọng tâm",
          body: snippet
        };
      });
    }

    return {
      title: ch.title || chId,
      feynman: ch.feynman || ch.hook || "",
      notes: notesItems
    };
  }'''

target_peek = '''      // Quick Theory Peek Drawer
      var theoryPeekHtml = "";
      if (state.coachTest.showTheoryPeek && quickTheory) {
        theoryPeekHtml = '<div class="quick-theory-peek">' +
          '<div class="qtp-head">' + ico("bookOpen") + ' <b>Tóm tắt lý thuyết trọng tâm: ' + esc(chObj.title) + '</b></div>' +
          (quickTheory.feynman ? '<div class="qtp-feynman"><b>Trực giác Feynman:</b> ' + fmt(quickTheory.feynman) + '</div>' : '') +
          (quickTheory.keyNotes ? '<div class="qtp-notes">' + fmt(quickTheory.keyNotes) + '</div>' : '') +
        '</div>';
      }'''

repl_peek = '''      // Quick Theory Peek Drawer
      var theoryPeekHtml = "";
      if (state.coachTest.showTheoryPeek && quickTheory) {
        var notesListHtml = "";
        if (quickTheory.notes && quickTheory.notes.length) {
          notesListHtml = '<div class="qtp-notes-list">' +
            quickTheory.notes.map(function (n) {
              return '<div class="qtp-note-item">' +
                '<span class="qtp-note-dot">•</span> ' +
                '<b>' + esc(n.title) + ':</b> ' +
                '<span class="qtp-note-text">' + fmt(n.body) + '</span>' +
              '</div>';
            }).join("") +
          '</div>';
        }
        theoryPeekHtml = '<div class="quick-theory-peek">' +
          '<div class="qtp-head">' + ico("bookOpen") + ' <b>Tóm tắt lý thuyết trọng tâm: ' + esc(chObj.title) + '</b></div>' +
          (quickTheory.feynman ? '<div class="qtp-feynman"><b>Trực giác Feynman:</b> ' + fmt(quickTheory.feynman) + '</div>' : '') +
          notesListHtml +
        '</div>';
      }'''

if target_summary in eng_norm:
    eng_norm = eng_norm.replace(target_summary, repl_summary, 1)
    print("✓ Patched getQuickTheorySummary")
else:
    print("✗ Failed to find target_summary in engine.js")

if target_peek in eng_norm:
    eng_norm = eng_norm.replace(target_peek, repl_peek, 1)
    print("✓ Patched theoryPeekHtml")
else:
    print("✗ Failed to find target_peek in engine.js")

final_eng = eng_norm.replace("\n", "\r\n") if is_crlf_eng else eng_norm
ENGINE_JS.write_text(final_eng, encoding="utf-8")

# 2. Patch css/style.css
style_txt = STYLE_CSS.read_text(encoding="utf-8")
is_crlf_css = "\r\n" in style_txt
css_norm = style_txt.replace("\r\n", "\n")

target_css_peek = '''/* Quick Theory Peek */
.quick-theory-peek {
  margin-top: 12px;
  padding: 14px 16px;
  border-radius: 10px;
  background: var(--surface-2);
  border: 1px dashed var(--accent);
  animation: pop 0.2s var(--ease-standard);
}
.qtp-head {
  font-size: .88rem;
  color: var(--accent);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.qtp-feynman {
  font-size: .86rem;
  line-height: 1.55;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px dashed var(--line-soft);
}
.qtp-notes {
  font-size: .82rem;
  line-height: 1.55;
  color: var(--fg);
}'''

repl_css_peek = '''/* Quick Theory Peek */
.quick-theory-peek {
  margin-top: 14px;
  padding: 16px 18px;
  border-radius: 12px;
  background: var(--surface-2);
  border: 1px dashed var(--accent);
  animation: pop 0.2s var(--ease-standard);
  box-sizing: border-box;
  max-width: 100%;
}
.qtp-head {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.qtp-feynman {
  font-size: 0.88rem;
  line-height: 1.6;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px dashed var(--line-soft);
  color: var(--fg);
  word-break: break-word;
  overflow-wrap: break-word;
}
.qtp-notes-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.qtp-note-item {
  font-size: 0.86rem;
  line-height: 1.55;
  color: var(--fg);
  word-break: break-word;
  overflow-wrap: break-word;
}
.qtp-note-dot {
  color: var(--accent);
  font-weight: 800;
  margin-right: 4px;
}
.qtp-note-item b {
  color: var(--accent);
  font-weight: 700;
}'''

target_css_modal = '''.modal-theory-box {
  max-width: 820px !important;
  width: 94vw !important;
  max-height: 88vh !important;
  display: flex !important;
  flex-direction: column !important;
  padding: 22px 26px !important;
  border-radius: 16px !important;
  background: var(--surface) !important;
  border: 1px solid var(--line-soft) !important;
  box-shadow: 0 25px 70px rgba(0,0,0,0.35) !important;
  overflow: hidden !important;
}
.modal-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line-soft);
}
.modal-header-row h3 {
  margin: 0;
  font-size: 1.18rem;
  color: var(--accent);
  display: flex;
  align-items: center;
  gap: 8px;
}
.modal-close-btn {
  font-size: 1.25rem;
  padding: 4px 10px;
  border-radius: 8px;
}
.modal-content-scroll {
  flex: 1 1 auto;
  overflow-y: auto;
  padding-right: 8px;
  margin-bottom: 16px;
}
.tm-feynman-card {
  padding: 14px 18px;
  background: var(--surface-2);
  border-radius: 12px;
  border-left: 4px solid var(--accent);
  margin-bottom: 16px;
  line-height: 1.6;
}
.tm-sec-badge {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.tm-notes-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.tm-note-card {
  padding: 14px 18px;
  background: var(--surface-2);
  border: 1px solid var(--line-soft);
  border-radius: 12px;
}
.tm-note-card h4 {
  margin: 0 0 8px;
  font-size: 0.98rem;
  color: var(--fg);
  display: flex;
  align-items: center;
  gap: 8px;
}
.tm-note-idx {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: var(--accent-soft);
  color: var(--accent);
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 700;
}
.tm-note-body {
  font-size: 0.88rem;
  line-height: 1.65;
  color: var(--muted);
  word-break: break-word;
  overflow-wrap: break-word;
}'''

repl_css_modal = '''.modal-theory-box {
  max-width: 820px !important;
  width: 94vw !important;
  max-height: 88vh !important;
  display: flex !important;
  flex-direction: column !important;
  padding: 22px 26px !important;
  border-radius: 16px !important;
  background: var(--surface) !important;
  border: 1px solid var(--line-soft) !important;
  box-shadow: 0 25px 70px rgba(0,0,0,0.35) !important;
  overflow: hidden !important;
  box-sizing: border-box !important;
}
.modal-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line-soft);
  flex-shrink: 0;
}
.modal-header-row h3 {
  margin: 0;
  font-size: 1.18rem;
  color: var(--accent);
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.modal-close-btn {
  font-size: 1.25rem;
  padding: 4px 10px;
  border-radius: 8px;
  flex-shrink: 0;
}
.modal-content-scroll {
  flex: 1 1 auto;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
  margin-bottom: 16px;
  word-break: break-word;
  overflow-wrap: break-word;
}
.tm-feynman-card {
  padding: 14px 18px;
  background: var(--surface-2);
  border-radius: 12px;
  border-left: 4px solid var(--accent);
  margin-bottom: 16px;
  line-height: 1.6;
  word-break: break-word;
  overflow-wrap: break-word;
}
.tm-sec-badge {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.tm-notes-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.tm-note-card {
  padding: 14px 18px;
  background: var(--surface-2);
  border: 1px solid var(--line-soft);
  border-radius: 12px;
  word-break: break-word;
  overflow-wrap: break-word;
}
.tm-note-card h4 {
  margin: 0 0 8px;
  font-size: 0.98rem;
  color: var(--fg);
  display: flex;
  align-items: center;
  gap: 8px;
}
.tm-note-idx {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: var(--accent-soft);
  color: var(--accent);
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}
.tm-note-body {
  font-size: 0.88rem;
  line-height: 1.65;
  color: var(--muted);
  word-break: break-word;
  overflow-wrap: break-word;
}

@media (max-width: 640px) {
  .modal-theory-box {
    width: 96vw !important;
    max-height: 92vh !important;
    padding: 16px 14px !important;
    border-radius: 12px !important;
  }
  .modal-header-row h3 {
    font-size: 1.0rem;
  }
  .tm-feynman-card, .tm-note-card {
    padding: 12px 14px;
  }
}'''

if target_css_peek in css_norm:
    css_norm = css_norm.replace(target_css_peek, repl_css_peek, 1)
    print("✓ Patched CSS quick-theory-peek")
else:
    print("✗ Failed to find target_css_peek in style.css")

if target_css_modal in css_norm:
    css_norm = css_norm.replace(target_css_modal, repl_css_modal, 1)
    print("✓ Patched CSS modal-theory-box")
else:
    print("✗ Failed to find target_css_modal in style.css")

final_css = css_norm.replace("\n", "\r\n") if is_crlf_css else css_norm
STYLE_CSS.write_text(final_css, encoding="utf-8")

# Validate with node
try:
    subprocess.run(["node", "-c", str(ENGINE_JS)], capture_output=True, text=True, check=True)
    print("Node syntax check: PASS!")
except Exception as e:
    print("Node syntax check: FAILED!", e)
    sys.exit(1)
