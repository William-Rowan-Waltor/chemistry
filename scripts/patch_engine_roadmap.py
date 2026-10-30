import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
ENGINE_JS = ROOT / "js" / "engine.js"
text = ENGINE_JS.read_text(encoding="utf-8")

# 1. Update parseOpts
old_parse_opts = """  var parseOpts = function (o) {
    if (!o) return [];
    return o.split(";").map(function (part) {
      var i = part.indexOf("=");
      return { k: part.slice(0, i).trim(), t: part.slice(i + 1) };
    });
  };"""

new_parse_opts = """  var parseOpts = function (o) {
    if (!o) return [];
    var re = /(?:^|;\\s*)([A-Da-d0-9])\\s*=\\s*(.*?)(?=(?:;\\s*[A-Da-d0-9]\\s*=|$))/gs;
    var matches = [];
    var m;
    while ((m = re.exec(o)) !== null) {
      matches.push({ k: m[1].trim().toUpperCase(), t: m[2].trim() });
    }
    if (matches.length > 0) return matches;
    return o.split(";").map(function (part) {
      var i = part.indexOf("=");
      return { k: part.slice(0, i).trim().toUpperCase(), t: part.slice(i + 1).trim() };
    });
  };"""

if old_parse_opts not in text and old_parse_opts.replace('\n', '\r\n') in text:
    old_parse_opts = old_parse_opts.replace('\n', '\r\n')
    new_parse_opts = new_parse_opts.replace('\n', '\r\n')

assert old_parse_opts in text, "parseOpts not found"
text = text.replace(old_parse_opts, new_parse_opts, 1)

# 2. Update getDistractorAnalysis, getQuickTheorySummary, and openTheoryModal
old_distractor_block = """  function getDistractorAnalysis(q, test, picked) {
    var opts = parseOpts(q.o);
    var correctKey = String(q.a).trim();

    if (!opts.length) {
      if (q.k === "tf" || correctKey === "true" || correctKey === "false" || correctKey === "đ" || correctKey === "s") {
        var isTrue = correctKey.toLowerCase() === "true" || correctKey.toLowerCase() === "đ";
        var userPickedTrue = picked === "true" || picked === "đ" || picked === "ĐÚNG";
        var userPickedFalse = picked === "false" || picked === "s" || picked === "SAI";
        return [{
          k: isTrue ? "ĐÚNG" : "SAI",
          t: isTrue ? "Nhận định hoàn toàn chính xác theo chuẩn hoá học" : "Nhận định này sai lệch bản chất",
          isCorrect: true,
          wasPicked: isTrue ? userPickedTrue : userPickedFalse,
          note: "ĐÁP ÁN CHUẨN XÁC: Được khẳng định và chứng minh rõ trong sách giáo khoa và thực nghiệm hoá học."
        }, {
          k: isTrue ? "SAI" : "ĐÚNG",
          t: isTrue ? "Bẫy nhận định đảo ngược" : "Bẫy ngộ nhận thường gặp",
          isCorrect: false,
          wasPicked: isTrue ? userPickedFalse : userPickedTrue,
          note: "Học sinh thường bị đánh lừa bởi điều kiện nhiệt độ, xúc tác đun nóng hoặc nhầm lẫn giữa các hiện tượng tương tự."
        }];
      }
      return [];
    }

    return opts.map(function (o) {
      var isCorrect = o.k === correctKey;
      var wasPicked = picked === o.k;
      var note = "";
      if (isCorrect) {
        note = "ĐÁP ÁN CHÍNH XÁC: Thoả mãn toàn bộ các điều kiện, cơ chế và danh pháp hoá học của đề bài.";
      } else {
        var tLower = o.t.toLowerCase();
        var qLower = q.q.toLowerCase();
        if (qLower.includes("este") || qLower.includes("ester")) {
          if (tLower.includes("formate") || tLower.includes("hcoo")) {
            note = "Bẫy gốc formate (HCOO-): Đây là dẫn xuất của formic acid, học sinh hay nhầm với acetate hoặc propionate.";
          } else if (tLower.includes("acetate") || tLower.includes("ch3coo")) {
            note = "Bẫy gốc acetate (CH₃COO-): Dễ bị nhầm lẫn thứ tự gọi tên giữa gốc alcohol và gốc carboxylate.";
          } else {
            note = "Phương án không thoả mãn cấu tạo phân tử hoặc điều kiện sản phẩm phản ứng mà đề bài yêu cầu.";
          }
        } else if (qLower.includes("carbohydrate") || qLower.includes("saccharide")) {
          if (tLower.includes("glucose") || tLower.includes("fructose")) {
            note = "Đây là Monosaccharide (đường đơn không bị thuỷ phân), không phải disaccharide hay polysaccharide.";
          } else if (tLower.includes("saccharose") || tLower.includes("maltose")) {
            note = "Đây là Disaccharide (thuỷ phân cho 2 gốc monosaccharide).";
          } else if (tLower.includes("tinh bột") || tLower.includes("cellulose") || tLower.includes("amylose")) {
            note = "Đây là Polysaccharide (đường đa phân tử lớn).";
          } else {
            note = "Phương án này thuộc phân nhóm carbohydrate khác với yêu cầu của đề.";
          }
        } else {
          note = "Phương án gây nhiễu: Sai lệch về bản chất cấu tạo, điều kiện phản ứng hoặc sản phẩm phản ứng so với yêu cầu đề bài.";
        }
      }
      return {
        k: o.k,
        t: o.t,
        isCorrect: isCorrect,
        wasPicked: wasPicked,
        note: note
      };
    });
  }

  function getQuickTheorySummary(chId) {
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
  }

  function openTheoryModal(chId) {
    var chObj = (DATA.chapters || []).find(function (c) { return c.id === chId; }) || { title: chId };
    var chData = DATA[chId] || {};
    var notes = chData.notes || [];
    var feynman = chData.feynman || chData.hook || "";

    var bodyHtml = '<div class="theory-modal-wrapper">';
    if (feynman) {
      bodyHtml += '<div class="tm-feynman-card">' +
        '<div class="tm-sec-badge">' + ico("sparkles") + ' Trực giác đời sống (Feynman Technique)</div>' +
        '<p>' + fmt(feynman) + '</p>' +
      '</div>';
    }
    if (notes.length) {
      bodyHtml += '<div class="tm-notes-list">' +
        notes.map(function (n, idx) {
          return '<div class="tm-note-card">' +
            '<h4><span class="tm-note-idx">' + (idx + 1) + '</span> ' + esc(n.title || n.t) + '</h4>' +
            '<div class="tm-note-body">' + fmt(n.text || n.b || "") + '</div>' +
          '</div>';
        }).join("") +
      '</div>';
    } else {
      bodyHtml += '<p class="muted">Đang cập nhật nội dung chi tiết cho chuyên đề này.</p>';
    }
    bodyHtml += '</div>';

    openModal({
      title: "Lý thuyết trọng tâm: " + chObj.title,
      icon: ico("bookOpen"),
      html: bodyHtml
    });
  }"""

new_distractor_block = """  function getDistractorAnalysis(q, test, picked) {
    // 1. Handle True/False Clusters (sub-statements a, b, c, d)
    if (q && q.sub && Array.isArray(q.sub) && q.sub.length) {
      return q.sub.map(function (s) {
        var isTrue = (String(s.a).toLowerCase() === "true" || String(s.a).toLowerCase() === "đ");
        var userDraft = (state.coachTest && state.coachTest.clusterDraft && state.coachTest.clusterDraft[state.coachTest.i]) || {};
        var userPick = userDraft[s.id];
        return {
          k: "Ý (" + s.id + ")",
          t: s.q,
          isCorrect: isTrue,
          wasPicked: userPick != null,
          note: s.e ? s.e : (isTrue ? "Mệnh đề này hoàn toàn chính xác theo chuẩn SGK Hoá học 12." : "Mệnh đề này sai lệch bản chất hoá học.")
        };
      });
    }

    var opts = parseOpts(q.o);
    var correctKey = String(q.a).trim().toUpperCase();

    // 2. Handle Single True/False
    if (!opts.length) {
      if (q.k === "tf" || correctKey === "TRUE" || correctKey === "FALSE" || correctKey === "Đ" || correctKey === "S") {
        var isTrue = correctKey === "TRUE" || correctKey === "Đ";
        var userPickedTrue = picked === "true" || picked === "đ" || picked === "ĐÚNG";
        var userPickedFalse = picked === "false" || picked === "s" || picked === "SAI";
        return [{
          k: isTrue ? "ĐÚNG" : "SAI",
          t: isTrue ? "Nhận định hoàn toàn chính xác theo chuẩn hoá học" : "Nhận định này sai lệch bản chất",
          isCorrect: true,
          wasPicked: isTrue ? userPickedTrue : userPickedFalse,
          note: q.e ? q.e : "ĐÁP ÁN CHUẨN XÁC: Được khẳng định và chứng minh rõ trong sách giáo khoa và thực nghiệm hoá học."
        }, {
          k: isTrue ? "SAI" : "ĐÚNG",
          t: isTrue ? "Bẫy nhận định đảo ngược" : "Bẫy ngộ nhận thường gặp",
          isCorrect: false,
          wasPicked: isTrue ? userPickedFalse : userPickedTrue,
          note: "Học sinh thường bị đánh lừa bởi điều kiện nhiệt độ, xúc tác đun nóng hoặc nhầm lẫn giữa các hiện tượng tương tự."
        }];
      }
      return [];
    }

    // 3. Handle MCQ (extract per-option explanation from q.oe or q.e if available)
    var expLines = String(q.e || "").split("\\n");
    var optExpMap = {};
    if (q.oe && typeof q.oe === "object") {
      optExpMap = q.oe;
    } else {
      expLines.forEach(function (line) {
        var clean = line.trim();
        var mOpt = clean.match(/^[-*•]?\\s*\\(?([A-Da-d0-9])\\)?[\\s:.-]+(.*)/);
        if (mOpt) {
          optExpMap[mOpt[1].toUpperCase()] = mOpt[2].trim();
        }
      });
    }

    return opts.map(function (o) {
      var isCorrect = o.k === correctKey;
      var wasPicked = picked === o.k;
      var note = "";

      if (optExpMap[o.k]) {
        note = (isCorrect ? "ĐÁP ÁN CHÍNH XÁC: " : "PHÂN TÍCH PHƯƠNG ÁN: ") + optExpMap[o.k];
      } else if (isCorrect) {
        note = q.e ? q.e : "ĐÁP ÁN CHÍNH XÁC: Thoả mãn toàn bộ các điều kiện, cơ chế và danh pháp hoá học của đề bài.";
      } else {
        var tLower = o.t.toLowerCase();
        var qLower = (q.q || "").toLowerCase();
        if (qLower.includes("este") || qLower.includes("ester")) {
          if (tLower.includes("formate") || tLower.includes("hcoo")) {
            note = "Bẫy gốc formate (HCOO-): Đây là dẫn xuất của formic acid, học sinh hay nhầm với acetate hoặc propionate.";
          } else if (tLower.includes("acetate") || tLower.includes("ch3coo")) {
            note = "Bẫy gốc acetate (CH₃COO-): Dễ bị nhầm lẫn thứ tự gọi tên giữa gốc alcohol và gốc carboxylate.";
          } else {
            note = "Phương án không thoả mãn cấu tạo phân tử hoặc điều kiện sản phẩm phản ứng mà đề bài yêu cầu.";
          }
        } else if (qLower.includes("carbohydrate") || qLower.includes("saccharide")) {
          if (tLower.includes("glucose") || tLower.includes("fructose")) {
            note = "Đây là Monosaccharide (đường đơn không bị thuỷ phân), không phải disaccharide hay polysaccharide.";
          } else if (tLower.includes("saccharose") || tLower.includes("maltose")) {
            note = "Đây là Disaccharide (thuỷ phân cho 2 gốc monosaccharide).";
          } else if (tLower.includes("tinh bột") || tLower.includes("cellulose") || tLower.includes("amylose")) {
            note = "Đây là Polysaccharide (đường đa phân tử lớn).";
          } else {
            note = "Phương án này thuộc phân nhóm carbohydrate khác với yêu cầu của đề.";
          }
        } else {
          note = "Phương án gây nhiễu: Sai lệch về bản chất cấu tạo, điều kiện phản ứng hoặc sản phẩm phản ứng so với yêu cầu đề bài.";
        }
      }

      return {
        k: o.k,
        t: o.t,
        isCorrect: isCorrect,
        wasPicked: wasPicked,
        note: note
      };
    });
  }

  function getQuickTheorySummary(chId) {
    var ch = DATA[chId];
    if (!ch) {
      ch = (DATA.chapters || []).find(function (c) { return c.id === chId; });
    }
    if (!ch) return null;

    var notesItems = [];
    if (ch.notes && ch.notes.length) {
      notesItems = ch.notes.slice(0, 5).map(function (n) {
        var raw = String(n.b || n.text || "").trim();
        return {
          title: n.title || n.t || "Trọng tâm",
          body: raw
        };
      });
    }

    return {
      title: ch.title || chId,
      feynman: ch.feynman || ch.hook || "",
      notes: notesItems
    };
  }

  function openTheoryModal(chId) {
    var chObj = (DATA.chapters || []).find(function (c) { return c.id === chId; }) || { title: chId };
    var chData = DATA[chId] || {};
    var notes = chData.notes || [];
    var feynman = chData.feynman || chData.hook || "";

    var bodyHtml = '<div class="theory-modal-wrapper">';
    if (feynman) {
      bodyHtml += '<div class="tm-feynman-card">' +
        '<div class="tm-sec-badge">' + ico("sparkles") + ' Trực giác đời sống (Feynman Technique)</div>' +
        '<p>' + fmt(feynman) + '</p>' +
      '</div>';
    }
    if (notes.length) {
      bodyHtml += '<div class="tm-notes-list">' +
        notes.map(function (n, idx) {
          return '<div class="tm-note-card">' +
            '<h4><span class="tm-note-idx">' + (idx + 1) + '</span> ' + esc(n.title || n.t) + '</h4>' +
            '<div class="tm-note-body">' + noteBody(n) + '</div>' +
          '</div>';
        }).join("") +
      '</div>';
    } else {
      bodyHtml += '<p class="muted">Đang cập nhật nội dung chi tiết cho chuyên đề này.</p>';
    }
    bodyHtml += '</div>';

    openModal({
      title: "Lý thuyết trọng tâm: " + chObj.title,
      icon: ico("bookOpen"),
      html: bodyHtml
    });
  }"""

if old_distractor_block not in text and old_distractor_block.replace('\n', '\r\n') in text:
    old_distractor_block = old_distractor_block.replace('\n', '\r\n')
    new_distractor_block = new_distractor_block.replace('\n', '\r\n')

assert old_distractor_block in text, "distractor block not found"
text = text.replace(old_distractor_block, new_distractor_block, 1)

# 3. Update testAgain for retake tests
old_test_again = """      case "testAgain": state.test.done = null; startTest(state.test.t.id); break;"""
new_test_again = """      case "testAgain":
        if (state.test && state.test.t) {
          if (String(state.test.t.id).endsWith("_wrong")) {
            state.test = {
              t: state.test.t,
              i: 0,
              answers: {},
              t0: Date.now(),
              limit: (state.test.t.timeMin || 15) * 60
            };
            renderPracticeOnly();
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            state.test.done = null;
            startTest(state.test.t.id);
          }
        }
        break;"""

if old_test_again not in text and old_test_again.replace('\n', '\r\n') in text:
    old_test_again = old_test_again.replace('\n', '\r\n')
    new_test_again = new_test_again.replace('\n', '\r\n')

assert old_test_again in text, "testAgain not found"
text = text.replace(old_test_again, new_test_again, 1)

ENGINE_JS.write_text(text, encoding="utf-8")
print("Successfully patched js/engine.js with parseOpts, distractor analysis, noteBody in modal, and testWrong retake!")
