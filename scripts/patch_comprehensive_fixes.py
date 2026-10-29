import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
ENGINE_JS = ROOT / "js" / "engine.js"
CSS_FILE = ROOT / "css" / "style.css"

print("--- Step 1: Patching js/engine.js ---")
engine_text = ENGINE_JS.read_text(encoding="utf-8")

# 1. Expand BOLD_KW to include carbohydrate and biochemistry keywords
old_bold = 'var BOLD_KW = ["carboxylic acid","acetic acid","amino acid"'
new_bold = 'var BOLD_KW = ["glucose","fructose","saccharose","maltose","cellulose","peptide","protein","triglyceride","triolein","tristearin","tripalmitin","carboxylic acid","acetic acid","amino acid"'
assert old_bold in engine_text, "BOLD_KW not found"
engine_text = engine_text.replace(old_bold, new_bold, 1)

# 2. Add flushTestNumericInput and testWrong functions
old_test_submit = "  function testSubmit() {"
new_helpers = """  function flushTestNumericInput() {
    if (state.test) {
      var inp = $(".num-in", $("#app"));
      if (inp) {
        var val = inp.value.trim();
        if (val !== "") {
          state.test.answers[state.test.i] = val;
        }
      }
    }
  }

  function testWrong() {
    if (!state.test || !state.test.details) return;
    var wrongQs = state.test.details.filter(function (d) { return !d.ok; }).map(function (d) { return d.it; });
    if (!wrongQs.length) return;
    state.test = {
      t: {
        id: state.test.t.id + "_wrong",
        title: "Ôn tập câu sai · " + state.test.t.title,
        timeMin: Math.max(10, Math.ceil(wrongQs.length * 1.5)),
        qs: wrongQs,
        grade: state.test.t.grade
      },
      i: 0,
      answers: {},
      t0: Date.now(),
      limit: Math.max(10, Math.ceil(wrongQs.length * 1.5)) * 60
    };
    renderPracticeOnly();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function testSubmit() {
    flushTestNumericInput();"""

assert old_test_submit in engine_text, "testSubmit not found"
engine_text = engine_text.replace(old_test_submit, new_helpers, 1)

# 3. Add flush in testPrev, testNext, testJump
old_test_prev = """      case "testPrev":
        if (state.test && state.test.i > 0) {"""
new_test_prev = """      case "testPrev":
        flushTestNumericInput();
        if (state.test && state.test.i > 0) {"""
if old_test_prev not in engine_text and old_test_prev.replace("\n", "\r\n") in engine_text:
    old_test_prev = old_test_prev.replace("\n", "\r\n")
    new_test_prev = new_test_prev.replace("\n", "\r\n")
assert old_test_prev in engine_text, "testPrev not found"
engine_text = engine_text.replace(old_test_prev, new_test_prev, 1)

old_test_next = """      case "testNext":
        if (state.test && state.test.i + 1 < state.test.t.qs.length) {"""
new_test_next = """      case "testNext":
        flushTestNumericInput();
        if (state.test && state.test.i + 1 < state.test.t.qs.length) {"""
if old_test_next not in engine_text and old_test_next.replace("\n", "\r\n") in engine_text:
    old_test_next = old_test_next.replace("\n", "\r\n")
    new_test_next = new_test_next.replace("\n", "\r\n")
assert old_test_next in engine_text, "testNext not found"
engine_text = engine_text.replace(old_test_next, new_test_next, 1)

old_test_jump = """      case "testJump":
        if (state.test) {"""
new_test_jump = """      case "testJump":
        flushTestNumericInput();
        if (state.test) {"""
if old_test_jump not in engine_text and old_test_jump.replace("\n", "\r\n") in engine_text:
    old_test_jump = old_test_jump.replace("\n", "\r\n")
    new_test_jump = new_test_jump.replace("\n", "\r\n")
assert old_test_jump in engine_text, "testJump not found"
engine_text = engine_text.replace(old_test_jump, new_test_jump, 1)

# 4. Add case "testWrong"
old_test_again = '      case "testAgain": state.test.done = null; startTest(state.test.t.id); break;'
new_test_again = '      case "testAgain": state.test.done = null; startTest(state.test.t.id); break;\n      case "testWrong": testWrong(); break;'
if old_test_again not in engine_text and old_test_again.replace("\n", "\r\n") in engine_text:
    old_test_again = old_test_again.replace("\n", "\r\n")
    new_test_again = new_test_again.replace("\n", "\r\n")
assert old_test_again in engine_text, "testAgain not found"
engine_text = engine_text.replace(old_test_again, new_test_again, 1)

# 5. Add input event handler for testNum
old_coach_input = '    if (act === "coachSearchInput") {'
new_inputs = """    if (act === "testNum") {
      if (state.test) {
        state.test.answers[state.test.i] = el.value.trim();
        var palChip = $('.pal-c[data-i="' + state.test.i + '"]');
        if (palChip) {
          palChip.classList.toggle("done", el.value.trim() !== "");
        }
      }
      return;
    }

    if (act === "coachSearchInput") {"""
if old_coach_input not in engine_text and old_coach_input.replace("\n", "\r\n") in engine_text:
    old_coach_input = old_coach_input.replace("\n", "\r\n")
    new_inputs = new_inputs.replace("\n", "\r\n")
assert old_coach_input in engine_text, "coachSearchInput not found"
engine_text = engine_text.replace(old_coach_input, new_inputs, 1)

# 6. Add Enter key listeners on numeric inputs
old_keydown = """  document.addEventListener("keydown", function (ev) {
    if (state.modal) {"""
new_keydown = """  document.addEventListener("keydown", function (ev) {
    var targetEl = ev.target;
    if (targetEl && targetEl.tagName === "INPUT" && ev.key === "Enter") {
      var dAct = targetEl.getAttribute("data-act");
      if (dAct === "testNum") {
        ev.preventDefault();
        testPick("save");
        return;
      }
      if (dAct === "numIn") {
        ev.preventDefault();
        bankPick("submit");
        return;
      }
      if (targetEl.id === "coachShortAnsInput") {
        ev.preventDefault();
        coachPickN();
        return;
      }
    }

    if (state.modal) {"""
if old_keydown not in engine_text and old_keydown.replace("\n", "\r\n") in engine_text:
    old_keydown = old_keydown.replace("\n", "\r\n")
    new_keydown = new_keydown.replace("\n", "\r\n")
assert old_keydown in engine_text, "keydown not found"
engine_text = engine_text.replace(old_keydown, new_keydown, 1)

# 7. Add addBankQ, editBankQ, deleteBankQ handlers
old_add_guided = '      case "addGuidedStage":'
new_bank_crud = """      case "addBankQ":
        (function () {
          var chId = state.chapter || "g12c1";
          openModal({
            title: "Thêm câu hỏi mới vào ngân hàng",
            fields: [
              { id: "q", label: "Nội dung câu hỏi", val: "", type: "textarea", rows: 3 },
              { id: "k", label: "Dạng câu hỏi", val: "m", type: "select", opts: [["m","Trắc nghiệm (MCQ)"],["tf","Đúng / Sai"],["n","Điền số"]] },
              { id: "o", label: "Phương án (A=...;B=...;C=...;D=...)", val: "A=...;B=...;C=...;D=...", type: "text" },
              { id: "a", label: "Đáp án đúng", val: "A", type: "text" },
              { id: "e", label: "Lời giải thích", val: "", type: "textarea", rows: 3 }
            ],
            onSave: function (vals) {
              DATA[chId] = DATA[chId] || {};
              DATA[chId].customQuestions = DATA[chId].customQuestions || [];
              DATA[chId].customQuestions.push({ ch: chId, k: vals.k, q: vals.q, o: vals.o, a: vals.a, e: vals.e });
              saveCustomData();
              renderPracticeOnly();
            }
          });
        })(); break;

      case "editBankQ":
        (function () {
          var bs = state.bank;
          if (!bs || !bs.items || !bs.items[bs.i]) return;
          var curItem = bs.items[bs.i];
          openModal({
            title: "Sửa câu hỏi ngân hàng #" + (bs.i + 1),
            fields: [
              { id: "q", label: "Nội dung câu hỏi", val: curItem.q, type: "textarea", rows: 3 },
              { id: "k", label: "Dạng câu hỏi", val: curItem.k, type: "select", opts: [["m","Trắc nghiệm (MCQ)"],["tf","Đúng / Sai"],["n","Điền số"]] },
              { id: "o", label: "Phương án (A=...;B=...;C=...;D=...)", val: curItem.o || "", type: "text" },
              { id: "a", label: "Đáp án đúng", val: curItem.a, type: "text" },
              { id: "e", label: "Lời giải thích", val: curItem.e || "", type: "textarea", rows: 3 }
            ],
            onSave: function (vals) {
              curItem.q = vals.q; curItem.k = vals.k; curItem.o = vals.o; curItem.a = vals.a; curItem.e = vals.e;
              saveCustomData();
              renderPracticeOnly();
            }
          });
        })(); break;

      case "deleteBankQ":
        (function () {
          var bs = state.bank;
          if (!bs || !bs.items || !bs.items[bs.i]) return;
          if (confirm("Xoá câu hỏi này khỏi phiên luyện tập ngân hàng?")) {
            bs.items.splice(bs.i, 1);
            if (bs.i >= bs.items.length) bs.i = Math.max(0, bs.items.length - 1);
            saveCustomData();
            renderPracticeOnly();
          }
        })(); break;

      case "addGuidedStage":"""
if old_add_guided not in engine_text and old_add_guided.replace("\n", "\r\n") in engine_text:
    old_add_guided = old_add_guided.replace("\n", "\r\n")
    new_bank_crud = new_bank_crud.replace("\n", "\r\n")
assert old_add_guided in engine_text, "addGuidedStage not found"
engine_text = engine_text.replace(old_add_guided, new_bank_crud, 1)

ENGINE_JS.write_text(engine_text, encoding="utf-8")
print("✓ js/engine.js successfully patched!")

print("--- Step 2: Patching css/style.css ---")
css_text = CSS_FILE.read_text(encoding="utf-8")

css_additions = """
/* ═══════════ AUDIT & POLISH FIXES: DARK MODE & RESPONSIVE REFINEMENT ═══════════ */
html[data-theme="dark"] .cec-meta .badge.g12 {
  background: rgba(90, 189, 160, 0.2);
  color: #5abda0;
}
html[data-theme="dark"] .cec-meta .badge.g11 {
  background: rgba(96, 165, 250, 0.2);
  color: #60a5fa;
}

@media (max-width: 600px) {
  .tf-cluster-row {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    padding: 12px 14px;
  }
  .tfc-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    width: 100%;
  }
  .tfc-buttons .tf-opt {
    flex: 1 1 0;
    min-width: 0;
    padding: 9px 12px;
    font-size: 0.92rem;
  }
}

@media (max-width: 480px) {
  .short-ans-box, .test-q .num-row {
    flex-wrap: wrap;
    padding: 12px;
    gap: 8px;
  }
  .num-in, .short-ans-input {
    width: 100%;
    font-size: 1.15rem;
  }
  .coach-nav-bar {
    gap: 8px;
  }
  .coach-nav-bar button {
    flex: 1 1 auto;
    font-size: 0.85rem;
    padding: 8px 10px;
  }
}
"""

if "/* ═══════════ AUDIT & POLISH FIXES: DARK MODE & RESPONSIVE REFINEMENT ═══════════ */" not in css_text:
    css_text += css_additions
    CSS_FILE.write_text(css_text, encoding="utf-8")
    print("✓ css/style.css successfully patched!")
else:
    print("css/style.css already contains polish fixes.")

print("All patches applied cleanly.")
