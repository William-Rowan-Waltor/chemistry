/* ═══════════════════ HOÁ 11–12 · ÔN TẬP — ENGINE (V2 ENHANCED) ═══════════════════ */
(function () {
  "use strict";

  /* ---------- tiny utils ---------- */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.from((root || document).querySelectorAll(sel)); };
    /* ═══════════ GSAP MOTION & TASTE SYSTEM ═══════════ */
  var hasGSAP = typeof gsap !== "undefined";
  var prefersReduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function spawnXPParticle(originEl, amount) {
    if (!hasGSAP || prefersReduced || typeof document === "undefined") return;
    var x = window.innerWidth / 2;
    var y = window.innerHeight / 2;
    if (originEl && originEl.getBoundingClientRect) {
      var rect = originEl.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top;
    }
    var badge = document.createElement("div");
    badge.className = "xp-fly-badge";
    badge.innerHTML = ico("flame") + " +" + (amount || 10) + " XP";
    badge.style.left = x + "px";
    badge.style.top = y + "px";
    document.body.appendChild(badge);

    gsap.fromTo(badge,
      { xPercent: -50, yPercent: -50, scale: 0.85, opacity: 0.95 },
      {
        y: y - 24,
        scale: 1.0,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: function () { badge.remove(); }
      }
    );
  }

  function animateViewEntrance() {
    if (!hasGSAP || prefersReduced || typeof document === "undefined") return;
    var viewContainer = $("#app > section, #app > .panel, #app > .guided-container, #app > .coach-test-card, #app > .flash-session, #app > .flash-setup");
    if (viewContainer) {
      gsap.fromTo(viewContainer,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.34, ease: "power2.out", clearProps: "transform,opacity" }
      );
    }
    var chCards = $$(".chapter-grid .ch-card");
    if (chCards.length) {
      gsap.fromTo(chCards,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.36, stagger: 0.025, ease: "power2.out", clearProps: "transform,opacity" }
      );
    }
    var notes = $$(".note-grid .note");
    if (notes.length) {
      gsap.fromTo(notes,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.38, stagger: 0.035, ease: "power2.out", clearProps: "transform,opacity" }
      );
    }
    var guidedSecs = $$(".guided-section");
    if (guidedSecs.length) {
      gsap.fromTo(guidedSecs,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.36, stagger: 0.06, ease: "power2.out", clearProps: "transform,opacity" }
      );
    }
  }

  var esc = function (s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };
  var BOLD_KW = ["carboxylic acid","acetic acid","amino acid","quy tắc Markovnikov","quy tắc Zaitsev","phản ứng cộng","phản ứng thế","phản ứng tách","phản ứng trùng hợp","phản ứng tráng bạc","liên kết hydrogen","xà phòng hoá","este hoá","trùng ngưng","thuỷ phân","thủy phân","nhiệt độ sôi","chất giặt rửa","alkane","ankan","alkene","anken","alkyne","ankin","arene","benzene","toluene","styrene","alcohol","ancol","phenol","aldehyde","anđehit","ketone","xeton","carboxylic","ester","este","lipit","amine","amin","halogen","glycerol","ethylene","acetylene","ethanol","ether","iodoform","hiđrocacbon","hydrocarbon","muối","dung dịch","kết tủa","đồng phân","nhóm chức","điều chế","xà phòng","acid","axit"];
  var UNDER_KW = ["đun nóng","xúc tác","dư"];
  var underMap = {};
  UNDER_KW.forEach(function (w) { underMap[w] = true; });
  var _escRe = function (s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); };
  var kwRe = null;

  /* ---------- chemistry typesetter (subscripts / superscripts) ---------- */
  var ELEM = new Set(("H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se " +
    "Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu " +
    "Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr R").split(" "));
  var CHEM_LABEL = /^(?:[(\[]?[CR]\d+[)\]]?|[(\[]?[CR]-\d+[)\]]?|[A-Z][a-z]?\(\s*(?:C|R)\s*\d+\s*\)|(?:[A-Z][a-z]+)-\d+-[a-z]+)$/;
  function chemTypeset(s) {
    var n = s.length;
    if (n < 2) return null;
    if (/[₀₁₂₃₄₅₆₇₈₉ₙ₊₋⁺⁻²³]/u.test(s)) return null;
    if (CHEM_LABEL.test(s)) return null;
    var out = "", i = 0, last = "x", elemSeen = 0, countRun = null;
    var m = /^\d+/.exec(s);
    if (m) { out += m[0]; i += m[0].length; }
    var flushCount = function () {
      if (countRun) { out += "<sub>" + countRun + "</sub>"; countRun = null; }
    };
    while (i < n) {
      var c = s[i];
      if (/[A-Z]/.test(c)) {
        var sym2 = c + (i + 1 < n && /[a-z]/.test(s[i + 1]) ? s[i + 1] : "");
        var two = sym2.length === 2 && sym2 !== "Cm" && ELEM.has(sym2);
        var sym = two ? sym2 : (ELEM.has(c) ? c : null);
        if (!sym) return null;
        i += sym.length;
        flushCount();
        out += sym;
        elemSeen++;
        last = "e";
      } else if (/[0-9nm]/.test(c)) {
        var run = "";
        while (i < n) {
          if (/[0-9nm]/.test(s[i])) { run += s[i]; i++; }
          else if ((s[i] === "+" || s[i] === "-") && i + 1 < n && /[0-9nm]/.test(s[i + 1])) { run += s[i]; i++; }
          else break;
        }
        if (last === "e" || last === "g") countRun = countRun ? countRun + run : run;
        else out += run;
        last = "c";
      } else if (c === "(" || c === "[") {
        flushCount();
        out += c; i++;
        last = "o";
      } else if (c === ")" || c === "]") {
        flushCount();
        out += c; i++;
        last = "g";
      } else if (c === "+" || c === "-") {
        var atEnd = (i === n - 1 || (s[i + 1] === ")" && i + 1 === n - 1));
        if (atEnd) {
          if (c === "+") {
            var sup = "";
            if (countRun && /[0-9nm]$/.test(countRun)) { sup = countRun; countRun = null; }
            out += "<sup>" + sup + c + "</sup>";
          } else {
            if (i > 0 && s[i - 1] === "O") { flushCount(); out += "<sup>" + c + "</sup>"; }
            else { flushCount(); out += c; }
          }
          i++;
          last = "q";
        } else {
          flushCount();
          out += c; i++;
          last = "b";
        }
      } else {
        flushCount();
        out += c; i++;
        last = "x";
      }
    }
    flushCount();
    if (elemSeen === 0 || out === s) return null;
    return out;
  }
  function emphasize(s) {
    if (!kwRe) {
      var src = BOLD_KW.concat(UNDER_KW).sort(function (a, b) { return b.length - a.length; }).map(_escRe).join("|");
      kwRe = new RegExp("(?<![\\p{L}\\p{N}])(?:" + src + ")(?![\\p{L}\\p{N}])", "giu");
    }
    s = s.replace(kwRe, function (m) {
      var low = m.toLowerCase();
      if (underMap[low]) return '<u class="kwe">' + m + "</u>";
      return '<b class="kw">' + m + "</b>";
    });
    s = s.replace(/([\p{L}\p{N}\-–—₊₋⁺⁻·•+=/\u2261()\[\]]+)/gu, function (m) {
      if (m.length >= 2 && /[A-Z]/.test(m) && /[\p{N}]/u.test(m)) {
        var unbal = {}, stack = [], i, ch;
        for (i = 0; i < m.length; i++) {
          ch = m[i];
          if (ch === "(" || ch === "[") stack.push(i);
          else if (ch === ")" || ch === "]") { if (stack.length) stack.pop(); else unbal[i] = 1; }
        }
        while (stack.length) unbal[stack.pop()] = 1;
        var core = "", left = "", right = "", openMin = -1;
        for (i = 0; i < m.length && openMin < 0; i++) {
          ch = m[i];
          if (unbal[i]) {
            if (ch === "(" || ch === "[") openMin = i;
            else { if (core === "") left += ch; else right += ch; }
          } else core += ch;
        }
        if (openMin >= 0) {
          var after = m.slice(openMin);
          if (core === "") left += after; else right += after;
        }
        var c2 = core.replace(/^[\p{N}(\[\]]+/u, "");
        if (/^[A-Z]/.test(c2) && !/^[A-Za-z]\(/.test(c2)) {
          var chem = chemTypeset(core);
          return left + '<i class="kwi">' + (chem || core) + "</i>" + right;
        }
      }
      return m;
    });
    return s;
  }
  var fmt = function (s) {
    return emphasize(esc(String(s == null ? "" : s).replace(/->/g, "→").replace(/=>/g, "→"))).replace(/\n/g, "<br>");
  };
  var getSvg = function (q, isReview) {
    if (!q) return "";
    var s = q.svg || (q.svgKey && typeof DIAGRAMS !== "undefined" && DIAGRAMS[q.svgKey] ? DIAGRAMS[q.svgKey] : "");
    if (!s) return "";
    var cls = "q-diagram-wrap" + (isReview ? " q-diagram-review" : "");
    return '<div class="' + cls + '">' + s + '</div>';
  };
  var num = function (s) {
    s = String(s == null ? "" : s).trim().replace(/\s/g, "").replace(/,/g, ".");
    if (s === "" || s === "-" || s === ".") return null;
    if (s.indexOf("/") !== -1) {
      var parts = s.split("/");
      if (parts.length === 2) {
        var n = parseFloat(parts[0]);
        var d = parseFloat(parts[1]);
        if (!isNaN(n) && !isNaN(d) && d !== 0) return n / d;
      }
    }
    var f = parseFloat(s);
    return isNaN(f) ? null : f;
  };
  var parseOpts = function (o) {
    if (!o) return [];
    return o.split(";").map(function (part) {
      var i = part.indexOf("=");
      return { k: part.slice(0, i).trim(), t: part.slice(i + 1) };
    });
  };
  var ICONS = {
    book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10"/>',
    bookOpen: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    books: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 2v20M12 6h4M12 10h4"/>',
    pen: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
    edit: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>',
    cards: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M9 21V9"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    ok: '<path d="M20 6 9 17l-5-5"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    no: '<path d="M18 6 6 18M6 6l12 12"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    cal: '<rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>',
    flask: '<path d="M10 2v4.5L4.5 18a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 6.5V2M8.5 2h7M7 14h10"/>',
    ring: '<polygon points="12 2 2 8.5 2 15.5 12 22 22 15.5 22 8.5 12 2"/><circle cx="12" cy="12" r="3"/>',
    tube: '<path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5V2M8.5 2h7M9.5 12h5"/>',
    drop: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-6-1.5-1.6-3.2-3.4-4-5-.8 1.6-2.5 3.4-4 5-2 2.1-3 4-3 6a7 7 0 0 0 7 7z"/>',
    pump: '<path d="M12 2v4M12 6H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4ZM6 12h12M10 16h4"/>',
    carbonyl: '<polygon points="12 2 2 8.5 2 15.5 12 22 22 15.5 22 8.5 12 2"/><path d="m19 7 3-1.5M20 9l2.5-1.2"/><circle cx="23" cy="7" r="1"/>',
    acid: '<path d="M10 2v4.5L5 18a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3L14 6.5V2M8.5 2h7"/><circle cx="10" cy="15" r="1"/><circle cx="14" cy="15" r="1"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    lipid: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-6-1.5-1.6-3.2-3.4-4-5-.8 1.6-2.5 3.4-4 5-2 2.1-3 4-3 6a7 7 0 0 0 7 7z"/><path d="M9 14h6M10 17h4"/>',
    formula: '<path d="M4 7V4h16v3M9 20h6M12 4v16"/>',
    rule: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
    bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6M10 22h4"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    tbl: '<path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18"/>',
    scale: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1ZM2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1ZM7 21h10M12 3v18M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
    type: '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>',
    choose: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    graph: '<circle cx="6" cy="12" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><line x1="8.7" y1="10.7" x2="15.3" y2="7.3"/><line x1="8.7" y1="13.3" x2="15.3" y2="16.7"/>',
    plus: '<path d="M5 12h14M12 5v14"/>',
    trash: '<path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
    refresh: '<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/>',
    rotate: '<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',
    arrowLeft: '<path d="m12 19-7-7 7-7M19 12H5"/>',
    arrowRight: '<path d="M5 12h14m-7-7 7 7-7 7"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    sparkles: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/>',
    dna: '<path d="m2 15 20-6M2 9l20 6M5 7v10M12 4v16M19 7v10"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
    cloudCheck: '<path d="m9 15 2 2 4-4"/><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>'
  };
  function ico(n) { return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (ICONS[n] || "") + '</svg>'; }
  window.ico = ico; window.ICONS = ICONS;
  var KIND = { card: "Công thức", rule: "Quy tắc", rxn: "Phản ứng", trick: "Mẹo", danger: "Cảnh báo", table: "Bảng" };
  var KIND_ICON = { card: ico("formula"), rule: ico("rule"), rxn: ico("flask"), trick: ico("bulb"), danger: ico("alert"), table: ico("tbl") };
  var KIND_CLS = { card: "k-card", rule: "k-rule", rxn: "k-rxn", trick: "k-trick", danger: "k-danger", table: "k-table" };
  var CH_ICON = {
    g11c1: "flask", g11c2: "ring", g11c3: "tube", g11c4: "drop", g11c5: "pump",
    g11c6: "carbonyl", g11c7: "acid", g11on: "books", g11cq: "target", g12c1: "lipid",
    g12c2: "flame", g12c3: "dna"
  };
  function chIco(id) { return ico(CH_ICON[id] || "flask"); }

  /* ---------- storage & custom data layer ---------- */
  var LS_KEY = "hoa11-12.v1";
  var CUSTOM_DATA_KEY = "hoa11_12_custom_data_v2";
  var ORIGINAL_DATA = null;

  var cloudSyncTimer = null;
  var cloudSyncStatus = (typeof location !== "undefined" && location.protocol && location.protocol.startsWith("http")) ? "synced" : "local";

  function cloudSyncLabel() {
    if (cloudSyncStatus === "syncing") return "Đang lưu...";
    if (cloudSyncStatus === "synced") return "Vercel DB";
    if (cloudSyncStatus === "local") return "Cục bộ";
    if (cloudSyncStatus === "offline") return "Offline";
    return "Đồng bộ";
  }

  function updateCloudIndicator(status, text) {
    cloudSyncStatus = status;
    var el = document.getElementById("cloudSyncStatus");
    if (!el) return;
    var icon = (status === "syncing") ? ico("refresh") : (status === "offline" ? ico("alert") : (status === "local" ? ico("cards") : ico("cloud")));
    el.innerHTML = icon + ' <small id="cloudSyncText">' + (text || cloudSyncLabel()) + '</small>';
    el.className = "stat pill cloud-pill " + status;
  }

  function scheduleCloudSync() {
    if (typeof location === "undefined" || !location.protocol || !location.protocol.startsWith("http")) return;
    if (cloudSyncTimer) clearTimeout(cloudSyncTimer);
    updateCloudIndicator("syncing", "Đang lưu...");
    cloudSyncTimer = setTimeout(function () {
      pushToCloud();
    }, 1200);
  }

  function pushToCloud() {
    if (typeof location === "undefined" || !location.protocol || !location.protocol.startsWith("http")) {
      updateCloudIndicator("local", "Cục bộ");
      return;
    }
    try {
      var customRaw = localStorage.getItem(CUSTOM_DATA_KEY);
      var payload = {
        user: { username: "William-Rowan-Waltor", name: "William Rowan Waltor" },
        profile: store.get(),
        customData: customRaw ? JSON.parse(customRaw) : null,
        clientTimestamp: Date.now()
      };
      fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      .then(function (r) {
        if (r.ok) {
          updateCloudIndicator("synced", "Vercel DB");
        } else {
          updateCloudIndicator("error", "Lỗi sync");
        }
      })
      .catch(function () {
        updateCloudIndicator("offline", "Offline");
      });
    } catch (e) {
      console.warn("pushToCloud error", e);
    }
  }

  function syncFromCloud(callback) {
    if (typeof location === "undefined" || !location.protocol || !location.protocol.startsWith("http")) {
      updateCloudIndicator("local", "Cục bộ");
      if (callback) callback(false);
      return;
    }
    updateCloudIndicator("syncing", "Đang tải DB...");
    fetch("/api/user")
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res && res.ok && res.data) {
          var cloudData = res.data;
          var localProfile = store.get();
          var updated = false;

          // Merge profile if cloud has data
          if (cloudData.profile) {
            var cloudXP = cloudData.profile.xp || 0;
            var localXP = localProfile.xp || 0;
            if (!localXP || cloudXP > localXP) {
              store.setSilent(cloudData.profile);
              updated = true;
            } else if (localXP > cloudXP) {
              // Local is ahead (user solved quizzes offline), sync up to cloud
              scheduleCloudSync();
            }
          }

          // Merge customData
          if (cloudData.customData && cloudData.customData.chapters) {
            var localCustomRaw = localStorage.getItem(CUSTOM_DATA_KEY);
            if (!localCustomRaw) {
              localStorage.setItem(CUSTOM_DATA_KEY, JSON.stringify(cloudData.customData));
              Object.assign(DATA, cloudData.customData);
              updated = true;
            }
          }

          updateCloudIndicator("synced", "Vercel DB");
          if (callback) callback(updated);
        } else {
          updateCloudIndicator("synced", "Vercel DB");
          if (callback) callback(false);
        }
      })
      .catch(function (err) {
        console.info("Cloud DB offline or local mode:", err.message);
        updateCloudIndicator("offline", "Offline");
        if (callback) callback(false);
      });
  }

  var store = {
    get: function () {
      try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch (e) { return {}; }
    },
    set: function (s) {
      try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch (e) {}
      scheduleCloudSync();
    },
    setSilent: function (s) {
      try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch (e) {}
    }
  };
  function todayStr() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function profile() {
    var s = store.get();
    s.streak = s.streak || { last: "", days: 0 };
    s.xp = s.xp || 0;
    s.xpByCh = s.xpByCh || {};
    s.deck = s.deck || {};
    s.solved = s.solved || {};
    s.tests = s.tests || {};
    s.fav = s.fav || {};
    s.notes = s.notes || [];
    s.guidedPredictions = s.guidedPredictions || {};
    return s;
  }
  function save(s) { store.set(s); }

  function activity() {
    var s = profile();
    var t = todayStr();
    if (s.streak.last === t) { }
    else if (s.streak.last === yesterdayStr()) s.streak.days += 1;
    else s.streak.days = 1;
    s.streak.last = t;
    save(s);
  }
  function yesterdayStr() {
    var d = new Date(); d.setDate(d.getDate() - 1);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function addXP(s, ch, n) {
    s = s || profile();
    var pts = n || 10;
    s.xp += pts;
    if (ch) s.xpByCh[ch] = (s.xpByCh[ch] || 0) + pts;
    save(s);
  }

  function initCustomData() {
    try {
      ORIGINAL_DATA = JSON.parse(JSON.stringify(DATA));
      var raw = localStorage.getItem(CUSTOM_DATA_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.chapters) {
          Object.assign(DATA, parsed);
        }
      }
    } catch (e) {
      console.warn("initCustomData error", e);
    }
  }

  function saveCustomData() {
    try {
      localStorage.setItem(CUSTOM_DATA_KEY, JSON.stringify(DATA));
      scheduleCloudSync();
    } catch (e) {
      console.error("saveCustomData error", e);
    }
  }

  function resetCustomData() {
    if (confirm("Bạn có chắc chắn muốn khôi phục toàn bộ nội dung (lý thuyết, bài tập, đề thi, thẻ nhớ) về mặc định ban đầu không? Mọi chỉnh sửa của bạn sẽ bị xoá.")) {
      try { localStorage.removeItem(CUSTOM_DATA_KEY); } catch (e) {}
      alert("Đã khôi phục dữ liệu gốc!");
      location.reload();
    }
  }

  function exportCustomDataJSON() {
    var str = JSON.stringify(DATA, null, 2);
    var blob = new Blob([str], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "hoa11-12-dulieu-tuybien.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function importCustomDataJSON(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (e) {
      try {
        var imported = JSON.parse(e.target.result);
        if (imported && imported.chapters) {
          Object.assign(DATA, imported);
          saveCustomData();
          alert("Nhập dữ liệu thành công! Toàn bộ nội dung đã được cập nhật.");
          render();
        } else {
          alert("File JSON không hợp lệ.");
        }
      } catch (err) {
        alert("Lỗi khi đọc file JSON: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  /* ---------- ATOMIC MINIMALIST FLASHCARDS REPOSITORY ---------- */
  /* ---------- ATOMIC MINIMALIST FLASHCARDS REPOSITORY (ENRICHED PATCH) ---------- */
  var DEFAULT_ATOMIC_FLASHCARDS = {
  "g12c1": [
    {
      "q": "Công thức tổng quát của ester no, đơn chức, mạch hở",
      "a": "CₙH₂ₙO₂ (n ≥ 2)",
      "note": "Ester đơn giản nhất là methyl formate HCOOCH₃ (n=2)"
    },
    {
      "q": "Mùi hương đặc trưng của isoamyl acetate",
      "a": "Mùi chuối chín",
      "note": "CH₃COOCH₂CH₂CH(CH₃)₂ dùng làm hương liệu thực phẩm"
    },
    {
      "q": "Mùi thơm đặc trưng của ethyl butyrate và ethyl propionate",
      "a": "Mùi quả dứa chín",
      "note": "Ester tạo hương dứa thơm ngọt tự nhiên"
    },
    {
      "q": "Mùi thơm đặc trưng của benzyl acetate",
      "a": "Mùi hoa nhài",
      "note": "CH₃COOCH₂C₆H₅ dùng trong công nghiệp nước hoa"
    },
    {
      "q": "Mùi thơm đặc trưng của methyl acetate",
      "a": "Mùi quả táo",
      "note": "CH₃COOCH₃ là ester no đơn chức C₃H₆O₂"
    },
    {
      "q": "So sánh nhiệt độ sôi của ester so với alcohol và acid cùng số C",
      "a": "Ester thấp hơn nhiều",
      "note": "Do phân tử ester không tạo được liên kết hydrogen liên phân tử"
    },
    {
      "q": "Thuỷ phân vinyl acetate (CH₃COOCH=CH₂) trong dung dịch NaOH",
      "a": "CH₃COONa + CH₃CHO (acetaldehyde)",
      "note": "Gốc vinyl gắn trực tiếp vào oxy tạo enol không bền, tự chuyển thành aldehyde"
    },
    {
      "q": "Thuỷ phân phenyl acetate (CH₃COOC₆H₅) với NaOH dư",
      "a": "CH₃COONa + C₆H₅ONa + H₂O",
      "note": "Tỉ lệ mol 1:2 tạo 2 muối và nước, TUYỆT ĐỐI KHÔNG sinh ra alcohol!"
    },
    {
      "q": "Số đồng phân ester đơn chức ứng với C₄H₈O₂",
      "a": "4 đồng phân ester",
      "note": "HCOOCH₂CH₂CH₃, HCOOCH(CH₃)₂, CH₃COOC₂H₅, C₂H₅COOCH₃"
    },
    {
      "q": "Số đồng phân đơn chức (ester và acid) của C₄H₈O₂",
      "a": "6 đồng phân (4 ester + 2 acid)",
      "note": "Gồm 4 ester trên cùng với 2 acid: butanoic acid và isobutanoic acid"
    },
    {
      "q": "Vai trò của H₂SO₄ đặc trong phản ứng ester hoá",
      "a": "Xúc tác và hút nước",
      "note": "Hút nước giúp chuyển dịch cân bằng hoá học sang chiều tạo ester"
    },
    {
      "q": "Công thức phân tử và phân tử khối của triolein",
      "a": "(C₁₇H₃₃COO)₃C₃H₅ (M = 884)",
      "note": "Chất béo lỏng không no, chứa 3 liên kết đôi C=C ở gốc acid"
    },
    {
      "q": "Công thức phân tử và phân tử khối của tristearin",
      "a": "(C₁₇H₃₅COO)₃C₃H₅ (M = 890)",
      "note": "Chất béo rắn no, có trong mỡ bò, mỡ cừu"
    },
    {
      "q": "Công thức phân tử và phân tử khối của tripalmitin",
      "a": "(C₁₅H₃₁COO)₃C₃H₅ (M = 806)",
      "note": "Chất béo rắn no, có trong mỡ động vật và dầu cọ"
    },
    {
      "q": "Phản ứng biến dầu ăn lỏng thành bơ nhân tạo / mỡ rắn",
      "a": "Hydrogen hoá (cộng H₂, xúc tác Ni, t°)",
      "note": "Triolein (lỏng) + 3H₂ → Tristearin (rắn)"
    },
    {
      "q": "Sản phẩm thu được khi xà phòng hoá mọi chất béo bằng NaOH",
      "a": "Glycerol + Muối sodium của acid béo (xà phòng)",
      "note": "1 mol chất béo luôn sinh ra 1 mol glycerol C₃H₅(OH)₃"
    },
    {
      "q": "Công thức đại diện của xà phòng bánh truyền thống",
      "a": "C₁₇H₃₅COONa hoặc C₁₅H₃₁COONa",
      "note": "Sodium stearate hoặc sodium palmitate có đầu ưa nước và đuôi kị nước"
    },
    {
      "q": "Công thức đại diện của chất giặt rửa tổng hợp",
      "a": "CH₃[CH₂]₁₁-C₆H₄-SO₃Na",
      "note": "Sodium alkylbenzenesulfonate (chứa nhóm sunfonat -SO₃Na)"
    },
    {
      "q": "Dấu hiệu nhận biết công thức xà phòng và chất giặt rửa tổng hợp",
      "a": "Xà phòng có đuôi -COO-; chất giặt rửa có nhóm -SO₃- hoặc -OSO₃-",
      "note": "Thấy lưu huỳnh (S) trong muối là chất giặt rửa tổng hợp"
    },
    {
      "q": "Tại sao xà phòng bị giảm bọt và mất tác dụng trong nước cứng?",
      "a": "Tạo kết tủa không tan với ion Ca²⁺ và Mg²⁺",
      "note": "2RCOO⁻ + Ca²⁺ → (RCOO)₂Ca↓ làm tắc sợi vải và lãng phí xà phòng"
    },
    {
      "q": "Ưu điểm vượt trội của chất giặt rửa tổng hợp so với xà phòng",
      "a": "Dùng tốt cả trong nước cứng và môi trường acid",
      "note": "Muối alkylsulfonate của Ca²⁺, Mg²⁺ tan tốt trong nước, không bị kết tủa"
    },
    {
      "q": "Chất tự nhiên có trong quả bồ kết giúp giặt rửa sạch tóc",
      "a": "Saponin",
      "note": "Chất hoạt động bề mặt tự nhiên tạo bọt và cuốn trôi dầu mỡ"
    },
    {
      "q": "Phân biệt acetic acid, glycerol và triolein chỉ bằng nước và quỳ tím",
      "a": "Triolein tách lớp; acid làm đỏ quỳ; glycerol tan không đổi màu",
      "note": "Triolein không tan trong nước; acid hữu cơ làm quỳ hoá đỏ; glycerol tan vô hạn"
    },
    {
      "q": "Phản ứng thuỷ phân ester trong môi trường acid là phản ứng gì?",
      "a": "Phản ứng thuận nghịch (hai chiều)",
      "note": "RCOOR' + H₂O ⇌ RCOOH + R'OH (xúc tác H⁺, đun nóng)"
    },
    {
      "q": "Phản ứng thuỷ phân ester trong môi trường kiềm (xà phòng hoá) là",
      "a": "Phản ứng một chiều",
      "note": "RCOOR' + NaOH → RCOONa + R'OH (đun nóng)"
    },
    {
      "q": "Hệ số tỉ lệ mol NaOH phản ứng với este của phenol (RCOOC₆H₅)",
      "a": "1 : 2 (tạo 2 muối và H₂O)",
      "note": "RCOOC₆H₅ + 2NaOH → RCOONa + C₆H₅ONa + H₂O (không tạo alcohol!)"
    },
    {
      "q": "Sản phẩm thuỷ phân vinyl acetate trong dung dịch kiềm NaOH",
      "a": "Sodium acetate và Acetaldehyde",
      "note": "CH₃COOCH=CH₂ + NaOH → CH₃COONa + CH₃CHO (chuyển vị từ enol)"
    },
    {
      "q": "Vai trò của dung dịch NaCl bão hoà trong thí nghiệm điều chế ethyl acetate",
      "a": "Làm giảm độ tan của este và tăng d dung dịch giúp este tách lớp nổi lên",
      "note": "Hiệu ứng salting-out giúp tách este triệt để thành lớp dầu nổi"
    },
    {
      "q": "Tại sao không đun sôi trực tiếp bằng ngọn lửa khi điều chế ethyl acetate?",
      "a": "Tránh cồn và este bốc cháy và bay hơi hết (phải đun cách thuỷ ở 65-70°C)",
      "note": "Ethanol và ethyl acetate là chất lỏng dễ bay hơi và dễ bắt lửa"
    },
    {
      "q": "Hệ thức bảo toàn khối lượng trong phản ứng xà phòng hoá chất béo",
      "a": "m(chất béo) + m(NaOH) = m(xà phòng) + m(glycerol)",
      "note": "Trong đó luôn có n(NaOH) = 3 × n(glycerol) = 3 × n(chất béo)"
    },
    {
      "q": "Cách phân biệt dầu ăn và dầu mỡ bôi trơn máy móc bằng hoá học",
      "a": "Đun với dung dịch kiềm NaOH: Dầu ăn bị xà phòng hoá tan dần, dầu máy không tan",
      "note": "Dầu mỡ ăn là este sinh học, dầu máy móc là hydrocarbon khoáng"
    },
    {
      "q": "Tại sao xà phòng bánh tạo kết tủa trong nước cứng còn nước rửa chén tổng hợp thì không?",
      "a": "Muối stearate của Ca²⁺/Mg²⁺ không tan, còn muối alkylsulfonate tan tốt",
      "note": "2RCOO⁻ + Ca²⁺ → (RCOO)₂Ca↓ làm tắc sợi vải và hao xà phòng"
    },
    {
      "q": "Số đồng phân đơn chức (gồm cả este và acid) ứng với C₃H₆O₂",
      "a": "3 đồng phân (2 este + 1 acid)",
      "note": "2 este: HCOOC₂H₅, CH₃COOCH₃; 1 acid: C₂H₅COOH"
    },
    {
      "q": "Chất béo lỏng bị ôi thiu trong không khí do phản ứng gì?",
      "a": "Oxi hoá chậm liên kết C=C bởi oxy không khí tạo peroxide",
      "note": "Peroxide phân huỷ thành các aldehyde và ketone có mùi khó chịu"
    },
    {
      "q": "Phân tử khối (M) của Tristearin và Triolein lần lượt là",
      "a": "Tristearin: 890 · Triolein: 884",
      "note": "Tristearin là chất béo no C₅₇H₁₁₀O₆; Triolein là chất béo không no C₅₇H₁₀₄O₆"
    }
  ],
  "g12c2": [
    {
      "q": "Công thức phân tử của glucose và fructose",
      "a": "C₆H₁₂O₆ (M = 180)",
      "note": "Đều là monosaccharide, là đồng phân cấu tạo của nhau"
    },
    {
      "q": "Công thức phân tử của saccharose và maltose",
      "a": "C₁₂H₂₂O₁₁ (M = 342)",
      "note": "Đều là disaccharide, là đồng phân cấu tạo của nhau"
    },
    {
      "q": "Công thức phân tử của tinh bột và cellulose",
      "a": "(C₆H₁₀O₅)ₙ (M = 162n)",
      "note": "Đều là polysaccharide, KHÔNG phải đồng phân vì n khác nhau"
    },
    {
      "q": "Tên gọi dân gian của glucose và nồng độ trong máu",
      "a": "Đường nho · Chiếm 0,1% trong máu người",
      "note": "Còn gọi là dextrose, có nhiều trong quả nho chín"
    },
    {
      "q": "Tên gọi dân gian của fructose và độ ngọt",
      "a": "Đường mật ong · Là loại đường tự nhiên ngọt nhất",
      "note": "Chiếm khoảng 40% khối lượng mật ong"
    },
    {
      "q": "Tên gọi dân gian của saccharose và nguồn gốc",
      "a": "Đường mía (đường củ cải, đường thốt nốt)",
      "note": "Chiết xuất công nghiệp từ cây mía đường hoặc củ cải đường"
    },
    {
      "q": "Tên gọi dân gian của maltose và nguồn gốc",
      "a": "Đường mạch nha",
      "note": "Sản xuất bằng cách thuỷ phân tinh bột nhờ men trong mầm lúa"
    },
    {
      "q": "Các nhóm chức có trong phân tử glucose mạch hở",
      "a": "5 nhóm -OH kề nhau và 1 nhóm -CHO",
      "note": "Vừa có tính chất của polyalcohol vừa có tính chất của aldehyde"
    },
    {
      "q": "Các nhóm chức có trong phân tử fructose mạch hở",
      "a": "5 nhóm -OH kề nhau và 1 nhóm C=O (ketone)",
      "note": "Polyhydroxyketone có vị ngọt sắc"
    },
    {
      "q": "Tại sao fructose là ketone mà vẫn tham gia phản ứng tráng bạc?",
      "a": "Trong môi trường kiềm, fructose chuyển hoá thành glucose",
      "note": "Fructose ⇌ Glucose trong môi trường base của thuốc thử Tollens"
    },
    {
      "q": "Thuốc thử hoá học dùng để phân biệt glucose và fructose",
      "a": "Dung dịch nước bromine (nước Br₂)",
      "note": "Glucose làm mất màu nước Br₂ (môi trường acid); fructose không phản ứng"
    },
    {
      "q": "Lượng Ag thu được khi 1 mol glucose tráng bạc hoàn toàn",
      "a": "2 mol Ag",
      "note": "1 mol R-CHO sinh ra 2 mol Ag kết tủa bám sáng bóng"
    },
    {
      "q": "Những carbohydrate nào KHÔNG tham gia phản ứng tráng bạc?",
      "a": "Saccharose, Tinh bột, Cellulose",
      "note": "Do không có nhóm -CHO tự do và không chuyển hoá thành -CHO"
    },
    {
      "q": "Cấu tạo phân tử của saccharose",
      "a": "1 gốc α-glucose liên kết 1 gốc β-fructose qua cầu oxy",
      "note": "Liên kết α,β-1,2-glycoside; cả 2 nhóm -OH hemiacetal đều bị khoá"
    },
    {
      "q": "Cấu tạo phân tử của maltose",
      "a": "2 gốc α-glucose liên kết qua cầu oxy",
      "note": "Liên kết α-1,4-glycoside; còn 1 nhóm -OH hemiacetal tự do nên tráng bạc được"
    },
    {
      "q": "Thuỷ phân hoàn toàn 1 mol saccharose trong môi trường acid thu được",
      "a": "1 mol glucose và 1 mol fructose",
      "note": "Dung dịch sau khi thuỷ phân đem tráng bạc cho tối đa 4 mol Ag"
    },
    {
      "q": "Thuỷ phân hoàn toàn tinh bột hoặc cellulose thu được duy nhất",
      "a": "Glucose",
      "note": "Đều cấu tạo từ các mắt xích glucose liên kết glycoside"
    },
    {
      "q": "Hai dạng cấu trúc của tinh bột",
      "a": "Amylose (mạch không phân nhánh) và Amylopectin (mạch phân nhánh)",
      "note": "Amylose xoắn ốc; Amylopectin chứa liên kết nhánh α-1,6-glycoside"
    },
    {
      "q": "Thuốc thử nhận biết hồ tinh bột và hiện tượng",
      "a": "Dung dịch Iodine (I₂) → Xuất hiện màu xanh tím",
      "note": "Phân tử I₂ bị hấp phụ lọt vào lòng ống xoắn của amylose"
    },
    {
      "q": "Hiện tượng khi đun nóng rồi để nguội dung dịch tinh bột + I₂",
      "a": "Đun nóng mất màu xanh tím, để nguội xuất hiện trở lại",
      "note": "Do cấu trúc xoắn bị duỗi ra khi nóng và cuộn lại khi nguội"
    },
    {
      "q": "Cấu tạo phân tử của cellulose",
      "a": "Mạch thẳng không phân nhánh gồm các gốc β-glucose",
      "note": "Liên kết β-1,4-glycoside, phân tử duỗi thẳng kéo dài thành sợi bền vững"
    },
    {
      "q": "Công thức dạng mắt xích của cellulose",
      "a": "[C₆H₇O₂(OH)₃]ₙ",
      "note": "Mỗi mắt xích C₆H₁₀O₅ có 3 nhóm -OH tự do tham gia phản ứng ester hoá"
    },
    {
      "q": "Ứng dụng của cellulose trinitrate [C₆H₇O₂(ONO₂)₃]ₙ",
      "a": "Chế tạo thuốc súng không khói",
      "note": "Sản phẩm phản ứng giữa cellulose và HNO₃ đặc (xúc tác H₂SO₄ đặc)"
    },
    {
      "q": "Ứng dụng của dung dịch glucose 5% trong y tế",
      "a": "Dung dịch truyền dịch tĩnh mạch (huyết thanh ngọt)",
      "note": "Cung cấp năng lượng trực tiếp cho tế bào người bệnh"
    },
    {
      "q": "Thuốc thử hoá học duy nhất phân biệt được Glucose và Fructose",
      "a": "Dung dịch nước Bromine (nước Br₂)",
      "note": "Glucose làm mất màu nước Br₂; Fructose không phản ứng trong môi trường acid nhẹ"
    },
    {
      "q": "Lượng Ag thu được khi thuỷ phân hoàn toàn 1 mol Saccharose rồi đem tráng bạc",
      "a": "Tối đa 4 mol Ag",
      "note": "1 Saccharose → 1 Glucose + 1 Fructose; mỗi chất tráng bạc cho 2 Ag (tổng 4 Ag)"
    },
    {
      "q": "Thao tác bắt buộc trước khi tráng bạc sản phẩm thuỷ phân carbohydrate bằng acid",
      "a": "Trung hoà acid bằng dung dịch kiềm (NaOH hoặc NaHCO₃)",
      "note": "Nếu còn acid, H⁺ sẽ phá vỡ phức bạc Tollens làm tráng bạc thất bại"
    },
    {
      "q": "Hiện tượng khi nhỏ dung dịch Iodine vào hồ tinh bột rồi đun nóng và để nguội",
      "a": "Đun nóng mất màu xanh tím, để nguội xuất hiện màu xanh tím trở lại",
      "note": "Cấu trúc xoắn của amylose duỗi ra khi nóng và cuộn lại giữ I₂ khi nguội"
    },
    {
      "q": "Sự khác biệt cấu trúc phân tử giữa Amylose và Amylopectin trong tinh bột",
      "a": "Amylose mạch không phân nhánh (α-1,4); Amylopectin mạch phân nhánh (α-1,4 và α-1,6)",
      "note": "Amylopectin chiếm khoảng 70-80% khối lượng tinh bột gạo, ngô"
    },
    {
      "q": "Số nhóm -OH tự do trong mỗi mắt xích cellulose [C₆H₇O₂(OH)₃]ₙ",
      "a": "3 nhóm -OH tự do",
      "note": "Có thể este hoá 1, 2 hoặc cả 3 nhóm -OH tạo cellulose trinitrate hoặc diacetate"
    },
    {
      "q": "Ứng dụng y học của dung dịch glucose 5%",
      "a": "Truyền dịch tĩnh mạch cung cấp năng lượng tức thì",
      "note": "Glucose hấp thụ thẳng vào tế bào máu không cần tiêu hóa qua enzyme"
    },
    {
      "q": "Phương trình lên men rượu từ glucose và số mol CO₂ sinh ra",
      "a": "C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂↑",
      "note": "1 mol glucose sinh ra đúng 2 mol CO₂ và 2 mol ethanol"
    },
    {
      "q": "Tại sao tinh bột và cellulose không phải là đồng phân cấu tạo của nhau?",
      "a": "Hệ số mắt xích n khác nhau rất nhiều (n_cellulose >> n_tinh_bột)",
      "note": "Khối lượng phân tử của chúng hoàn toàn khác nhau"
    }
  ],
  "g12c3": [
    {
      "q": "Định nghĩa bậc của amine",
      "a": "Số gốc hydrocarbon liên kết trực tiếp với nguyên tử nitrogen",
      "note": "Bậc 1: R-NH₂; Bậc 2: R-NH-R'; Bậc 3: R-N(R')-R''"
    },
    {
      "q": "So sánh bậc của (CH₃)₃C-NH₂ và (CH₃)₃C-OH",
      "a": "(CH₃)₃C-NH₂ là amine bậc 1 · (CH₃)₃C-OH là alcohol bậc 3",
      "note": "Bẫy kinh điển: bậc amine tính theo số liên kết C-N, không tính theo bậc của C!"
    },
    {
      "q": "Hợp chất amine gây nên mùi tanh nồng của cá mè",
      "a": "Trimethylamine (CH₃)₃N",
      "note": "Amine bậc 3 thể khí, tan nhiều trong nước"
    },
    {
      "q": "Bản chất hoá học của việc khử mùi tanh cá bằng chanh, me, giấm",
      "a": "Acid trung hoà amine tạo muối ammonium không bay hơi",
      "note": "R₃N + H⁺ → R₃NH⁺ tan trong nước canh, không còn bay vào mũi"
    },
    {
      "q": "Bốn amine ở thể khí ở điều kiện thường",
      "a": "CH₃NH₂, (CH₃)₂NH, (CH₃)₃N, C₂H₅NH₂",
      "note": "Đều là chất khí có mùi khai khó chịu, độc, tan rất nhiều trong nước"
    },
    {
      "q": "So sánh lực base giữa dimethylamine, methylamine, NH₃ và aniline",
      "a": "(CH₃)₂NH > CH₃NH₂ > NH₃ > C₆H₅NH₂",
      "note": "Alkyl bậc 2 đẩy e mạnh nhất > bậc 1 > NH₃ > vòng benzene hút e làm giảm mạnh lực base"
    },
    {
      "q": "Aniline (C₆H₅NH₂) có làm đổi màu giấy quỳ tím ẩm không?",
      "a": "Không làm đổi màu quỳ tím",
      "note": "Do tính base của aniline cực kì yếu (yếu hơn ammonia hàng nghìn lần)"
    },
    {
      "q": "Dung dịch các chất nào sau đây làm xanh giấy quỳ tím?",
      "a": "CH₃NH₂, (CH₃)₂NH, C₂H₅NH₂ (các alkylamine)",
      "note": "Dung dịch có tính base mạnh hơn ammonia"
    },
    {
      "q": "Tính chất vật lý của aniline ở điều kiện thường",
      "a": "Chất lỏng sánh như dầu, không màu, ít tan trong nước, độc",
      "note": "Để lâu trong không khí bị oxi hoá chuyển sang màu nâu đen"
    },
    {
      "q": "Hiện tượng khi nhỏ nước bromine vào dung dịch aniline",
      "a": "Mất màu nước Br₂ và xuất hiện kết tủa trắng",
      "note": "Tạo 2,4,6-tribromoaniline (tương tự phản ứng của phenol)"
    },
    {
      "q": "Hiện tượng khi nhỏ dung dịch HCl vào aniline, sau đó nhỏ tiếp NaOH",
      "a": "Nhỏ HCl thì tan trong suốt; nhỏ NaOH lại đục như ban đầu",
      "note": "Tạo muối C₆H₅NH₃Cl tan; sau đó NaOH đẩy aniline không tan tái tạo trở lại"
    },
    {
      "q": "Hiện tượng khi cho ethylamine tác dụng với nitrous acid (HNO₂)",
      "a": "Sinh ra alcohol và sủi bọt khí nitrogen (N₂↑)",
      "note": "C₂H₅NH₂ + HNO₂ → C₂H₅OH + N₂↑ + H₂O"
    },
    {
      "q": "Phản ứng của aniline với HNO₂ ở nhiệt độ 0 - 5°C",
      "a": "Tạo muối benzenediazonium chloride [C₆H₅-N≡N]⁺Cl⁻",
      "note": "Phản ứng diazo hoá, nguyên liệu trung gian để tổng hợp phẩm nhuộm azo"
    },
    {
      "q": "Tên gốc - chức của hợp chất C₂H₅NH₂",
      "a": "Ethylamine",
      "note": "Tên IUPAC thay thế là ethanamine"
    },
    {
      "q": "Tên IUPAC thay thế của CH₃-CH(NH₂)-CH₃",
      "a": "Propan-2-amine",
      "note": "Đánh số mạch 3C, nhóm amino ở vị trí số 2"
    },
    {
      "q": "Tên thông thường và tên thay thế của C₆H₅NH₂",
      "a": "Aniline (tên thay thế: benzenamine)",
      "note": "Phenylamine là tên gốc - chức"
    },
    {
      "q": "Số đồng phân amine có cùng công thức phân tử C₃H₉N",
      "a": "4 đồng phân",
      "note": "Gồm 2 amine bậc 1, 1 amine bậc 2, 1 amine bậc 3"
    },
    {
      "q": "Số đồng phân amine bậc 1 có cùng công thức C₃H₉N",
      "a": "2 đồng phân (propan-1-amine và propan-2-amine)",
      "note": "CH₃CH₂CH₂NH₂ và CH₃CH(NH₂)CH₃"
    },
    {
      "q": "Số đồng phân amine bậc 1 của C₄H₁₁N",
      "a": "4 đồng phân bậc 1",
      "note": "Butan-1-amine, butan-2-amine, 2-methylpropan-1-amine, 2-methylpropan-2-amine"
    },
    {
      "q": "Nguyên liệu trùng ngưng sản xuất tơ nylon-6,6",
      "a": "Hexamethylenediamine H₂N(CH₂)₆NH₂ và Adipic acid",
      "note": "H₂N-(CH₂)₆-NH₂ + HOOC-(CH₂)₄-COOH → Nylon-6,6 + H₂O"
    },
    {
      "q": "Phương pháp điều chế aniline trong công nghiệp",
      "a": "Khử nitrobenzene bằng hydrogen mới sinh (Fe + HCl đặc)",
      "note": "C₆H₅NO₂ + 6[H] → C₆H₅NH₂ + 2H₂O"
    },
    {
      "q": "Phương pháp điều chế alkylamine từ ammonia",
      "a": "Alkyl hoá ammonia bằng dẫn xuất halogen (R-X)",
      "note": "NH₃ + CH₃I → CH₃NH₂ + HI"
    },
    {
      "q": "Dung dịch amino acid nào sau đây làm quỳ tím chuyển sang màu đỏ?",
      "a": "Glutamic acid (Glu)",
      "note": "Glu có 2 nhóm -COOH và 1 nhóm -NH₂ (tính acid chiếm ưu thế)"
    },
    {
      "q": "Dung dịch amino acid nào sau đây làm quỳ tím chuyển sang màu xanh?",
      "a": "Lysine (Lys)",
      "note": "Lys có 2 nhóm -NH₂ và 1 nhóm -COOH (tính base chiếm ưu thế)"
    },
    {
      "q": "Hiện tượng khi cho dung dịch Cu(OH)₂ vào dung dịch lòng trắng trứng (albumin)",
      "a": "Xuất hiện dung dịch màu tím đặc trưng (phản ứng màu Biuret)",
      "note": "Phản ứng đặc trưng của hợp chất có từ 2 liên kết peptide trở lên"
    },
    {
      "q": "Dipeptide (như Gly-Ala) có phản ứng màu Biuret với Cu(OH)₂ không?",
      "a": "HOÀN TOÀN KHÔNG phản ứng màu Biuret",
      "note": "Dipeptide chỉ có 1 liên kết peptide; điều kiện Biuret cần từ 2 liên kết peptide trở lên"
    },
    {
      "q": "Hiện tượng đông tụ riêu cua khi đun nóng canh cua là hiện tượng gì?",
      "a": "Sự đông tụ protein do nhiệt độ cao làm phá vỡ cấu trúc không gian",
      "note": "Protein hình cầu trong nước bị biến tính và kết tụ không thuận nghịch"
    },
    {
      "q": "Số mol H₂O luôn sinh ra khi thuỷ phân 1 mol k-peptide bất kì bằng NaOH",
      "a": "Luôn luôn bằng 1 mol H₂O",
      "note": "Peptide (k-peptit) + k NaOH → Muối + 1 H₂O (sinh ra từ nhóm -COOH ở đầu C)"
    },
    {
      "q": "Công thức phân tử và phân tử khối (M) của Glycine và Alanine",
      "a": "Glycine: C₂H₅NO₂ (M=75) · Alanine: C₃H₇NO₂ (M=89)",
      "note": "Đều là α-amino acid cấu tạo nên protein của cơ thể sống"
    },
    {
      "q": "Aniline tác dụng với dung dịch HCl và sau đó tác dụng tiếp với NaOH",
      "a": "Cho HCl tan trong suốt; cho tiếp NaOH lại vẩn đục như ban đầu",
      "note": "C₆H₅NH₂ + HCl → C₆H₅NH₃Cl (tan); C₆H₅NH₃Cl + NaOH → C₆H₅NH₂↓ + NaCl + H₂O"
    },
    {
      "q": "Chất khí amine gây mùi tanh nồng của cá mè sống",
      "a": "Trimethylamine (CH₃)₃N",
      "note": "Khử sạch mùi tanh bằng cách nấu với giấm, chanh, me (axit trung hoà amine)"
    }
  ],
  "g11c1": [
    {
      "q": "Nhiệt độ ngọn lửa khi hàn cắt kim loại bằng khí acetylene (C₂H₂)",
      "a": "Khoảng 3000°C",
      "note": "C₂H₂ cháy toả nhiệt lượng khổng lồ đủ làm nóng chảy kim loại"
    },
    {
      "q": "Alkene CH₂=CH₂ có tên thông thường và IUPAC là",
      "a": "Ethylene (IUPAC: ethene)",
      "note": "Kích thích hoa quả mau chín"
    },
    {
      "q": "Alkyne CH≡CH có tên thông thường và IUPAC là",
      "a": "Acetylene (IUPAC: ethyne)",
      "note": "Alkyne đơn giản nhất, điều chế từ đất đèn"
    },
    {
      "q": "Khí dầu mỏ hoá lỏng (LPG / gas bình) chứa chủ yếu",
      "a": "Propane (C₃H₈) và Butane (C₄H₁₀)",
      "note": "Hai alkane dễ hoá lỏng dưới áp suất cao"
    },
    {
      "q": "Quy tắc cộng Markovnikov phát biểu như thế nào?",
      "a": "H cộng vào C nối đôi có nhiều H hơn, X vào C có ít H hơn",
      "note": "Áp dụng khi cộng HX hoặc H₂O vào alkene bất đối"
    },
    {
      "q": "Quy tắc Markovnikov: Propene + HCl tạo sản phẩm chính là",
      "a": "2-chloropropane (CH₃-CHCl-CH₃)",
      "note": "H vào CH₂, Cl vào CH"
    },
    {
      "q": "Phản ứng đặc trưng dùng để nhận biết alk-1-yne (nối ba đầu mạch)",
      "a": "Tác dụng với dung dịch AgNO₃ trong NH₃",
      "note": "Nguyên tử H đầu mạch linh động bị thay thế bởi Ag⁺ tạo kết tủa vàng nhạt"
    },
    {
      "q": "But-1-yne vs But-2-yne: Chất nào tác dụng được với AgNO₃/NH₃?",
      "a": "Chỉ But-1-yne",
      "note": "Do but-1-yne có liên kết C≡C đầu mạch (CH≡C-CH₂-CH₃)"
    },
    {
      "q": "Hiện tượng khi sục khí alkene qua dung dịch nước bromine",
      "a": "Nước bromine bị mất màu nâu đỏ",
      "note": "Phản ứng cộng mở liên kết đôi tạo dẫn xuất dibromo không màu"
    },
    {
      "q": "Hiện tượng khi sục alkene qua dung dịch thuốc tím (KMnO₄) ở t° thường",
      "a": "Dung dịch mất màu tím, xuất hiện kết tủa nâu đen (MnO₂)",
      "note": "Oxi hoá alkene tạo diol (glycol)"
    },
    {
      "q": "Xúc tác Lindlar (Pd/PbCO₃) có tác dụng gì khi hiđro hoá alkyne?",
      "a": "Dừng phản ứng ở giai đoạn tạo alkene (không thành alkane)",
      "note": "R-C≡C-R' + H₂ (Lindlar) → R-CH=CH-R' (alkene cis)"
    },
    {
      "q": "Monomer trực tiếp dùng để trùng hợp sản xuất nhựa PVC",
      "a": "Vinyl chloride (CH₂=CHCl)",
      "note": "n CH₂=CHCl → (-CH₂-CHCl-)ₙ (poly(vinyl chloride))"
    },
    {
      "q": "Phản ứng điều chế acetylene trong phòng thí nghiệm từ đất đèn",
      "a": "CaC₂ + 2H₂O → C₂H₂↑ + Ca(OH)₂",
      "note": "Đất đèn chứa calcium carbide CaC₂"
    },
    {
      "q": "Khối lượng mol phân tử của acetylene so với không khí",
      "a": "M(C₂H₂) = 26 < M(kk) = 29 → Acetylene nhẹ hơn không khí",
      "note": "Bẫy trắc nghiệm: acetylene nhẹ hơn không khí, không phải nặng hơn"
    },
    {
      "q": "Styrene có công thức phân tử và công thức cấu tạo là",
      "a": "C₈H₈ · C₆H₅-CH=CH₂",
      "note": "Vừa có tính chất của arene vừa có tính chất của alkene (làm mất màu Br₂)"
    },
    {
      "q": "Chất nào vừa cháy, vừa cộng Br₂, vừa cộng H₂, vừa thế AgNO₃/NH₃?",
      "a": "Acetylene (CH≡CH)",
      "note": "Alkyne có H linh động ở cả 2 đầu liên kết ba"
    }
  ],
  "g11c2": [
    {
      "q": "Định nghĩa Arene (Hydrocarbon thơm)",
      "a": "Hydrocarbon trong phân tử có chứa một hay nhiều vòng benzene",
      "note": "Benzene C₆H₆ là arene đơn giản nhất"
    },
    {
      "q": "Công thức phân tử và phân tử khối của toluene",
      "a": "C₇H₈ (C₆H₅CH₃, M = 92)",
      "note": "Tên IUPAC thay thế là methylbenzene"
    },
    {
      "q": "Quy tắc thế vào vòng benzene có sẵn nhóm ankyl (nhóm đẩy electron)",
      "a": "Ưu tiên thế vào vị trí Ortho (o-) và Para (p-)",
      "note": "Nhóm -CH₃ hoạt hoá nhân thơm làm tăng mật độ e ở vị trí 2, 4, 6"
    },
    {
      "q": "Phản ứng phân biệt benzene và toluene bằng phương pháp hoá học",
      "a": "Dung dịch KMnO₄ (đun nóng)",
      "note": "Toluene làm mất màu tím KMnO₄ khi đun nóng tạo C₆H₅COOK; benzene không phản ứng"
    },
    {
      "q": "Phản ứng nitro hoá benzene ở nhiệt độ ≤ 50°C",
      "a": "C₆H₆ + HNO₃ (đặc, xúc tác H₂SO₄ đặc) → C₆H₅NO₂ + H₂O",
      "note": "Tạo nitrobenzene: chất lỏng sánh như dầu, màu vàng, mùi hạnh nhân"
    },
    {
      "q": "Công thức và ứng dụng của thuốc nổ TNT",
      "a": "2,4,6-trinitrotoluene (C₆H₂(NO₂)₃CH₃)",
      "note": "Thu được khi nitro hoá toluene tỉ lệ 1:3; chất rắn màu vàng"
    },
    {
      "q": "Chất nào sau đây có nhiệt độ sôi cao nhất: benzene, toluene, ethylbenzene?",
      "a": "Ethylbenzene (C₈H₁₀)",
      "note": "Trong cùng dãy đồng đẳng, phân tử khối M càng lớn thì nhiệt độ sôi càng cao"
    },
    {
      "q": "Xylene là tên gọi thông thường của",
      "a": "Dimethylbenzene (C₆H₄(CH₃)₂)",
      "note": "Có 3 đồng phân vị trí: o-xylene, m-xylene, p-xylene"
    },
    {
      "q": "Phản ứng clo hoá benzene khi có bột sắt (Fe, t°)",
      "a": "C₆H₆ + Cl₂ (Fe) → C₆H₅Cl + HCl",
      "note": "Phản ứng thế nguyên tử H của vòng thơm"
    },
    {
      "q": "Phản ứng clo hoá benzene khi có ánh sáng mặt trời (as)",
      "a": "C₆H₆ + 3Cl₂ (as) → C₆H₆Cl₆ (thuốc trừ sâu 666)",
      "note": "Phản ứng cộng phá vỡ vòng thơm tạo hexachlorocyclohexane"
    },
    {
      "q": "Naphthalene (băng phiến) có công thức phân tử là",
      "a": "C₁₀H₈",
      "note": "Arene đa vòng gồm 2 vòng benzene giáp nhau, dễ thăng hoa"
    },
    {
      "q": "Phân biệt styrene và ethylbenzene bằng thuốc thử nào?",
      "a": "Dung dịch nước bromine ở nhiệt độ thường",
      "note": "Chỉ styrene có nối đôi -CH=CH₂ làm mất màu nước Br₂ ngay"
    },
    {
      "q": "Sản phẩm oxi hoá toluene bằng dung dịch KMnO₄ trong môi trường acid",
      "a": "Benzoic acid (C₆H₅COOH)",
      "note": "Nhóm methyl -CH₃ bị oxi hoá hoàn toàn thành nhóm -COOH"
    },
    {
      "q": "Độ tan của benzene và các arene trong nước",
      "a": "Hầu như không tan trong nước, nhẹ hơn nước",
      "note": "Tan nhiều trong các dung môi hữu cơ không phân cực"
    }
  ],
  "g11c3": [
    {
      "q": "Hợp chất chính trong bình xịt gây tê cục bộ trong thể thao",
      "a": "Chloroethane (C₂H₅Cl)",
      "note": "Sôi ở 12,3°C; xịt vào da bay hơi tức thì thu nhiệt làm lạnh cóng giảm đau"
    },
    {
      "q": "Quy tắc tách hydrogen halide (Quy tắc Zaitsev)",
      "a": "X tách cùng H ở C kề bên có ít H hơn để tạo alkene bền hơn",
      "note": "Ưu tiên tạo alkene có nhiều nhóm thế hơn ở liên kết đôi"
    },
    {
      "q": "Tách HBr từ sec-butyl bromide (CH₃-CHBr-CH₂-CH₃) tạo sản phẩm chính là",
      "a": "But-2-ene (CH₃-CH=CH-CH₃)",
      "note": "Theo quy tắc Zaitsev: H tách ở CH₂ (2H) chứ không tách ở CH₃ (3H)"
    },
    {
      "q": "Số đồng phân alkene thu được khi tách HCl từ sec-butyl chloride",
      "a": "3 đồng phân alkene",
      "note": "But-1-ene, cis-but-2-ene và trans-but-2-ene (tính cả đồng phân hình học)"
    },
    {
      "q": "Thuỷ phân dẫn xuất halogen trong dung dịch kiềm đun nóng",
      "a": "R-X + NaOH (t°) → R-OH + NaX",
      "note": "Phản ứng thế nucleophile thay thế halogen bằng nhóm hydroxyl -OH"
    },
    {
      "q": "Hợp chất CFC (freon) gây ra tác hại môi trường nào?",
      "a": "Phá huỷ tầng ozone của khí quyển",
      "note": "Phân huỷ giải phóng gốc clo tự do Cl• phá huỷ hàng ngàn phân tử O₃"
    },
    {
      "q": "Khí alkane nào clo hoá (1:1, ánh sáng) chỉ cho 1 dẫn xuất duy nhất?",
      "a": "Methane (CH₄) và Ethane (C₂H₆)",
      "note": "Tất cả các nguyên tử H trong phân tử đều có vị trí đối xứng tương đương"
    },
    {
      "q": "Số dẫn xuất monochloro cấu tạo tối đa khi clo hoá 2-methylbutane",
      "a": "4 đồng phân cấu tạo",
      "note": "Phân tử có 4 vị trí C không tương đương: C1, C2, C3, C4"
    },
    {
      "q": "Nhận biết ion halide sinh ra khi thuỷ phân dẫn xuất halogen",
      "a": "Acid hoá bằng HNO₃ rồi thêm dung dịch AgNO₃",
      "note": "AgCl kết tủa trắng, AgBr kết tủa vàng nhạt, AgI kết tủa vàng đậm"
    },
    {
      "q": "Teflon (chảo chống dính) được trùng hợp từ monomer nào?",
      "a": "Tetrafluoroethylene (CF₂=CF₂)",
      "note": "Chịu nhiệt, chống dính, trơ với acid và kiềm"
    },
    {
      "q": "Dẫn xuất halogen có tan được trong nước không?",
      "a": "Hầu như không tan trong nước, nặng hơn nước",
      "note": "Tan tốt trong dầu mỡ và dung môi hữu cơ"
    },
    {
      "q": "Tên IUPAC của hợp chất CH₃-CH(Cl)-CH₃",
      "a": "2-chloropropane",
      "note": "Tên gốc - chức là isopropyl chloride"
    }
  ],
  "g11c4": [
    {
      "q": "Định nghĩa hợp chất Alcohol (Ancol)",
      "a": "Hợp chất có nhóm -OH liên kết trực tiếp với nguyên tử carbon no",
      "note": "Nếu -OH gắn vào C của vòng benzene thì là Phenol"
    },
    {
      "q": "Chất cồn gây say chính có trong rượu bia",
      "a": "Ethanol (ethyl alcohol, C₂H₅OH, M = 46)",
      "note": "Lên men từ tinh bột hoặc hydrate hoá ethylene"
    },
    {
      "q": "Chất cồn công nghiệp cực độc gây mù mắt và tử vong",
      "a": "Methanol (methyl alcohol, CH₃OH, M = 32)",
      "note": "Trong cơ thể bị chuyển hoá thành formaldehyde và formic acid phá huỷ thị giác"
    },
    {
      "q": "Công thức phân tử và cấu tạo của glycerol",
      "a": "C₃H₅(OH)₃ (propane-1,2,3-triol)",
      "note": "Polyalcohol có 3 nhóm -OH liền kề, chất lỏng sánh ngọt"
    },
    {
      "q": "Công thức phân tử và cấu tạo của ethylene glycol",
      "a": "C₂H₄(OH)₂ (ethane-1,2-diol)",
      "note": "Polyalcohol có 2 nhóm -OH liền kề, chất chống đông động cơ"
    },
    {
      "q": "Phản ứng đặc trưng nhận biết polyalcohol có các nhóm -OH kề nhau",
      "a": "Hoà tan Cu(OH)₂ ở t° thường tạo dung dịch màu xanh lam thẫm",
      "note": "Tạo phức đồng chelate tan; monool (như ethanol) không phản ứng"
    },
    {
      "q": "Tách nước từ ethanol ở 170°C có mặt H₂SO₄ đặc",
      "a": "C₂H₅OH (170°C) → C₂H₄ (ethylene) + H₂O",
      "note": "Phản ứng tách nước nội phân tử tạo alkene"
    },
    {
      "q": "Tách nước từ ethanol ở 140°C có mặt H₂SO₄ đặc",
      "a": "2 C₂H₅OH (140°C) → C₂H₅-O-C₂H₅ (diethyl ether) + H₂O",
      "note": "Phản ứng tách nước liên phân tử tạo ether"
    },
    {
      "q": "Alcohol nào sau đây KHÔNG THỂ tách nước tạo alkene?",
      "a": "Methanol (CH₃OH)",
      "note": "Vì phân tử chỉ có 1 carbon, không thể hình thành liên kết đôi C=C"
    },
    {
      "q": "Oxi hoá alcohol bậc 1 bằng CuO đun nóng",
      "a": "R-CH₂OH + CuO (t°) → R-CHO (aldehyde) + Cu + H₂O",
      "note": "Màu đen của CuO chuyển sang màu đỏ gạch của Cu"
    },
    {
      "q": "Oxi hoá alcohol bậc 2 bằng CuO đun nóng",
      "a": "R-CH(OH)-R' + CuO (t°) → R-CO-R' (ketone) + Cu + H₂O",
      "note": "Thu được ketone tương ứng"
    },
    {
      "q": "Alcohol bậc 3 có bị oxi hoá bởi CuO đun nóng không?",
      "a": "Không phản ứng ở điều kiện thường",
      "note": "Alcohol bậc 3 bền, không có nguyên tử H ở nguyên tử C mang nhóm -OH"
    },
    {
      "q": "Ý nghĩa của nồng độ cồn 70° dùng sát trùng y tế",
      "a": "Trong 100 mL dung dịch có đúng 70 mL ethanol nguyên chất",
      "note": "Cồn 70° thấm sâu và diệt khuẩn tối ưu hơn cồn 90°"
    },
    {
      "q": "Hàm lượng ethanol trong xăng sinh học E5 là",
      "a": "5% ethanol theo thể tích (95% xăng RON 92)",
      "note": "Xăng E10 chứa 10% ethanol"
    },
    {
      "q": "Số đồng phân alcohol có cùng công thức phân tử C₃H₈O",
      "a": "2 đồng phân (propan-1-ol và propan-2-ol)",
      "note": "Đồng phân thứ 3 là dimethyl ether CH₃-O-CH₃ (không phải alcohol)"
    },
    {
      "q": "Số đồng phân alcohol có cùng công thức phân tử C₄H₁₀O",
      "a": "4 đồng phân alcohol",
      "note": "Butan-1-ol, butan-2-ol, 2-methylpropan-1-ol, 2-methylpropan-2-ol"
    },
    {
      "q": "Alcohol có phản ứng với dung dịch kiềm NaOH không?",
      "a": "Tuyệt đối không phản ứng",
      "note": "Alcohol không có tính acid như phenol hay acid carboxylic"
    },
    {
      "q": "Menthol có trong tinh dầu bạc hà thuộc loại alcohol nào?",
      "a": "Alcohol no, đơn chức, bậc 2",
      "note": "Có công thức phân tử C₁₀H₂₀O"
    }
  ],
  "g11c5": [
    {
      "q": "Định nghĩa hợp chất Phenol",
      "a": "Hợp chất có nhóm -OH liên kết trực tiếp với nguyên tử C của vòng benzene",
      "note": "C₆H₅OH là phenol đơn giản nhất"
    },
    {
      "q": "Tính chất vật lý của phenol ở nhiệt độ phòng",
      "a": "Chất rắn không màu, để lâu trong không khí hoá màu hồng, rất độc",
      "note": "Gây bỏng nặng khi dính vào da"
    },
    {
      "q": "Độ tan của phenol trong nước lạnh so với nước nóng",
      "a": "Ít tan trong nước lạnh, tan vô hạn ở trên 66°C",
      "note": "Ở 25°C chỉ tan khoảng 8,3 g trong 100 g nước"
    },
    {
      "q": "Phản ứng chứng minh tính acid của phenol",
      "a": "Tác dụng với dung dịch NaOH: C₆H₅OH + NaOH → C₆H₅ONa + H₂O",
      "note": "Alcohol thông thường không phản ứng được với NaOH"
    },
    {
      "q": "So sánh tính acid của phenol với H₂CO₃ và carboxylic acid",
      "a": "RCOOH > H₂CO₃ > C₆H₅OH > ROH",
      "note": "Phenol có tính acid yếu hơn acid carbonic H₂CO₃"
    },
    {
      "q": "Phenol có tác dụng được với dung dịch NaHCO₃ giải phóng CO₂ không?",
      "a": "Không phản ứng",
      "note": "Vì tính acid của phenol yếu hơn acid carbonic (H₂CO₃)"
    },
    {
      "q": "Hiện tượng khi sục khí CO₂ vào dung dịch sodium phenolate (C₆H₅ONa)",
      "a": "Dung dịch bị vẩn đục do tái tạo phenol ít tan",
      "note": "C₆H₅ONa + CO₂ + H₂O → C₆H₅OH↓ + NaHCO₃"
    },
    {
      "q": "Hiện tượng khi nhỏ dung dịch nước bromine vào dung dịch phenol",
      "a": "Mất màu nước Br₂ và xuất hiện kết tủa trắng",
      "note": "Tạo 2,4,6-tribromophenol kết tủa trắng"
    },
    {
      "q": "Tại sao phenol thế bromine dễ dàng hơn nhiều so với benzene?",
      "a": "Do cặp e tự do của O liên hợp đẩy e làm tăng mật độ e ở vòng",
      "note": "Vị trí ortho và para trở nên rất giàu electron"
    },
    {
      "q": "Công thức và ứng dụng của picric acid",
      "a": "2,4,6-trinitrophenol (C₆H₂(NO₂)₃OH) · Làm thuốc nổ vàng",
      "note": "Tổng hợp bằng cách cho phenol phản ứng với HNO₃ đặc (xúc tác H₂SO₄ đặc)"
    },
    {
      "q": "Benzyl alcohol (C₆H₅-CH₂-OH) có phải là phenol không?",
      "a": "Không, là alcohol thơm",
      "note": "Do nhóm -OH gắn vào carbon no CH₂, không gắn vào vòng"
    },
    {
      "q": "Số đồng phân cresol (methylphenol C₇H₈O) là",
      "a": "3 đồng phân (o-cresol, m-cresol, p-cresol)",
      "note": "Đều tác dụng được với dung dịch NaOH"
    },
    {
      "q": "Cách xử lý khẩn cấp khi bị phenol dính vào da",
      "a": "Rửa ngay nhiều lần bằng ethanol hoặc xà phòng",
      "note": "Không rửa bằng nước lạnh vì phenol ít tan trong nước lạnh"
    },
    {
      "q": "Ứng dụng quan trọng của phenol trong công nghiệp",
      "a": "Sản xuất nhựa phenol-formaldehyde (bakelite), phẩm nhuộm, dược phẩm",
      "note": "Nguyên liệu then chốt của hoá dầu"
    }
  ],
  "g11c6": [
    {
      "q": "Hợp chất carbonyl gồm những loại hợp chất hữu cơ nào?",
      "a": "Aldehyde (R-CHO) và Ketone (R-CO-R')",
      "note": "Đều chứa nhóm carbonyl >C=O phân cực"
    },
    {
      "q": "Tên thông thường và công thức phân tử của methanal",
      "a": "Formaldehyde (HCHO, M = 30)",
      "note": "Aldehyde đơn giản nhất, là chất khí ở điều kiện thường"
    },
    {
      "q": "Tên thông thường và công thức phân tử của ethanal",
      "a": "Acetaldehyde (CH₃CHO, M = 44)",
      "note": "Chất lỏng dễ bay hơi, có mùi thơm táo"
    },
    {
      "q": "Tên thông thường và công thức phân tử của propan-2-one",
      "a": "Acetone (CH₃COCH₃, M = 58)",
      "note": "Ketone đơn giản nhất, dung môi tẩy sơn móng tay"
    },
    {
      "q": "Thuốc thử Tollens dùng trong phản ứng tráng bạc là gì?",
      "a": "Dung dịch AgNO₃ trong dung dịch NH₃ dư ([Ag(NH₃)₂]OH)",
      "note": "Tạo kết tủa bạc Ag bám sáng bóng vào thành ống nghiệm"
    },
    {
      "q": "Phản ứng tráng bạc của các aldehyde đơn chức thông thường sinh ra",
      "a": "1 mol RCHO → 2 mol Ag",
      "note": "CH₃CHO + 2AgNO₃/NH₃ → 2Ag"
    },
    {
      "q": "Phản ứng tráng bạc đặc biệt của formaldehyde (HCHO)",
      "a": "1 mol HCHO → 4 mol Ag",
      "note": "HCHO có 2 liên kết C-H ở cả hai phía nhóm carbonyl"
    },
    {
      "q": "Dung dịch formalin (focmon) dùng ngâm tiêu bản giải phẫu là gì?",
      "a": "Dung dịch chứa 37 - 40% formaldehyde trong nước",
      "note": "Làm đông tụ protein, diệt khuẩn mạnh giúp bảo quản mẫu vật"
    },
    {
      "q": "Phản ứng Iodoform nhận biết nhóm cấu trúc nào?",
      "a": "Nhóm methyl carbonyl CH₃-C(=O)- hoặc nhóm CH₃-CH(OH)-",
      "note": "Tác dụng với I₂ trong NaOH tạo kết tủa vàng iodoform CHI₃ có mùi sát trùng"
    },
    {
      "q": "Acetone (CH₃COCH₃) có tham gia phản ứng tráng bạc không?",
      "a": "Tuyệt đối không tham gia phản ứng tráng bạc",
      "note": "Ketone thông thường không bị oxi hoá bởi thuốc thử Tollens"
    },
    {
      "q": "Acetone (CH₃COCH₃) có tham gia phản ứng tạo iodoform không?",
      "a": "Có, tạo kết tủa vàng CHI₃",
      "note": "Do có nhóm CH₃-CO- liên kết với gốc hydrocarbon"
    },
    {
      "q": "Phản ứng khử aldehyde bằng khí hydrogen (Ni, t°)",
      "a": "R-CHO + H₂ (Ni, t°) → R-CH₂OH (alcohol bậc 1)",
      "note": "Cộng H₂ vào liên kết đôi C=O"
    },
    {
      "q": "Phản ứng khử ketone bằng khí hydrogen (Ni, t°)",
      "a": "R-CO-R' + H₂ (Ni, t°) → R-CH(OH)-R' (alcohol bậc 2)",
      "note": "Tạo alcohol bậc 2 tương ứng"
    },
    {
      "q": "Chất hữu cơ vừa là acid vừa có phản ứng tráng bạc",
      "a": "Formic acid (HCOOH)",
      "note": "Có nhóm H-C(=O)- tương tự aldehyde"
    },
    {
      "q": "Hiện tượng khi đun nóng aldehyde với Cu(OH)₂ trong môi trường kiềm",
      "a": "Xuất hiện kết tủa màu đỏ gạch của Cu₂O",
      "note": "RCHO + 2Cu(OH)₂ + NaOH → RCOONa + Cu₂O↓ (đỏ gạch) + 3H₂O"
    },
    {
      "q": "Aldehyde có tạo được liên kết hydrogen liên phân tử với nhau không?",
      "a": "Không tạo được liên kết hydrogen liên phân tử",
      "note": "Nên nhiệt độ sôi thấp hơn alcohol có cùng số carbon"
    }
  ],
  "g11c7": [
    {
      "q": "Nhóm chức đặc trưng của Carboxylic Acid",
      "a": "Nhóm carboxyl (-COOH)",
      "note": "Cấu tạo gồm nhóm carbonyl >C=O gắn với nhóm hydroxyl -OH"
    },
    {
      "q": "Công thức tổng quát của carboxylic acid no, đơn chức, mạch hở",
      "a": "CₙH₂ₙ₊₁COOH hoặc CₙH₂ₙO₂ (n ≥ 1)",
      "note": "Acid đơn giản nhất là formic acid HCOOH (n=1)"
    },
    {
      "q": "So sánh nhiệt độ sôi của acid carboxylic so với các hợp chất khác",
      "a": "Acid có nhiệt độ sôi cao nhất",
      "note": "Do tạo liên kết hydrogen dạng dimer (nhị hợp) rất bền vững"
    },
    {
      "q": "Acid hữu cơ có trong giấm ăn hàng ngày",
      "a": "Acetic acid (CH₃COOH, ethanoic acid)",
      "note": "Giấm ăn thông thường là dung dịch chứa 2% - 5% acetic acid"
    },
    {
      "q": "Acid hữu cơ có trong nọc kiến, vòi đốt của ong",
      "a": "Formic acid (HCOOH, methanoic acid)",
      "note": "Gây cảm giác bỏng rát, bôi vôi (base) sẽ làm dịu vết cắn"
    },
    {
      "q": "Kim loại nào sau đây KHÔNG phản ứng với dung dịch acetic acid: Zn, Fe, Cu, Mg?",
      "a": "Kim loại Cu",
      "note": "Đồng (Cu) đứng sau hydrogen trong dãy hoạt động hoá học"
    },
    {
      "q": "Phản ứng của acetic acid với đá vôi (CaCO₃)",
      "a": "2 CH₃COOH + CaCO₃ → (CH₃COO)₂Ca + CO₂↑ + H₂O",
      "note": "Hiện tượng sủi bọt khí không màu CO₂; dùng tẩy cặn canxi ấm đun nước"
    },
    {
      "q": "Phản ứng ester hoá giữa acetic acid và ethanol",
      "a": "CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O",
      "note": "Phản ứng thuận nghịch, xúc tác H₂SO₄ đặc đun nóng, tạo ethyl acetate thơm"
    },
    {
      "q": "Acid carboxylic nào duy nhất tham gia phản ứng tráng bạc?",
      "a": "Formic acid (HCOOH)",
      "note": "Do nguyên tử H gắn trực tiếp vào nhóm C=O (cấu trúc aldehyde H-C=O)"
    },
    {
      "q": "Chất dùng để khử chua khi ngâm quả sấu xanh",
      "a": "Nước vôi trong (dung dịch Ca(OH)₂)",
      "note": "Ca(OH)₂ trung hoà bớt các acid hữu cơ oxalic, tartaric trong quả sấu"
    },
    {
      "q": "Acid hữu cơ 2 chức no đơn giản nhất",
      "a": "Oxalic acid (HOOC-COOH hay (COOH)₂)",
      "note": "Có trong lá chua me đất, khế chua"
    },
    {
      "q": "Benzoic acid (C₆H₅COOH) có đặc điểm vật lý gì?",
      "a": "Chất rắn màu trắng, tinh thể hình kim, ít tan trong nước lạnh",
      "note": "Muối sodium benzoate dùng làm chất bảo quản thực phẩm (chống mốc)"
    },
    {
      "q": "Điều chế acetic acid trong công nghiệp hiện đại từ methanol",
      "a": "CH₃OH + CO (xt, t°) → CH₃COOH",
      "note": "Phương pháp carbonyl hoá methanol cho hiệu suất và tính kinh tế cao nhất"
    },
    {
      "q": "Phản ứng lên men giấm từ rượu etylic loãng",
      "a": "C₂H₅OH + O₂ (men giấm) → CH₃COOH + H₂O",
      "note": "Điều chế giấm ăn truyền thống"
    }
  ],
  "g11on": [
    {
      "q": "Thuốc thử nhận biết liên kết ba đầu mạch C≡CH (alk-1-yne)",
      "a": "Dung dịch AgNO₃ trong NH₃ (kết tủa vàng nhạt)",
      "note": "Phản ứng thế ion Ag⁺ vào nguyên tử H linh động"
    },
    {
      "q": "Thuốc thử nhận biết liên kết đôi C=C (alkene, styrene)",
      "a": "Dung dịch nước bromine (mất màu nâu đỏ)",
      "note": "Phản ứng cộng halogen vào liên kết $\\pi$"
    },
    {
      "q": "Thuốc thử nhận biết phenol trong dung dịch",
      "a": "Dung dịch nước bromine (kết tủa trắng 2,4,6-tribromophenol)",
      "note": "Phenol làm mất màu Br₂ và tạo kết tủa trắng ngay ở t° thường"
    },
    {
      "q": "Thuốc thử nhận biết aldehyde",
      "a": "Thuốc thử Tollens AgNO₃/NH₃ (tráng gương sáng bóng)",
      "note": "Oxi hoá nhóm -CHO thành muối ammonium carboxylate"
    },
    {
      "q": "Thuốc thử nhận biết polyalcohol có các nhóm -OH liền kề",
      "a": "Cu(OH)₂ ở nhiệt độ thường (dung dịch màu xanh lam thẫm)",
      "note": "Glycerol, ethylene glycol, glucose..."
    },
    {
      "q": "Thuốc thử nhận biết tinh bột",
      "a": "Dung dịch Iodine I₂ (xuất hiện màu xanh tím đặc trưng)",
      "note": "Mất màu khi đun nóng, xuất hiện lại khi để nguội"
    },
    {
      "q": "Thuốc thử nhận biết carboxylic acid đơn giản nhất",
      "a": "Dung dịch NaHCO₃ hoặc quỳ tím",
      "note": "Làm quỳ hoá đỏ và sủi bọt khí CO₂ với muối hydrocarbonate"
    },
    {
      "q": "Chất làm mất màu dung dịch thuốc tím KMnO₄ khi đun nóng nhưng không mất màu ở t° thường",
      "a": "Toluene (C₆H₅CH₃)",
      "note": "Dùng để phân biệt toluene với benzene và alkene"
    },
    {
      "q": "Dãy so sánh tính acid: HCl, HCOOH, CH₃COOH, C₆H₅OH, C₂H₅OH",
      "a": "HCl > HCOOH > CH₃COOH > C₆H₅OH > C₂H₅OH",
      "note": "Acid vô cơ > acid hữu cơ mạch ngắn > phenol > alcohol"
    },
    {
      "q": "Dãy so sánh nhiệt độ sôi: C₂H₅COOH, C₃H₇OH, CH₃COOCH₃, C₄H₁₀",
      "a": "C₂H₅COOH > C₃H₇OH > CH₃COOCH₃ > C₄H₁₀",
      "note": "Acid > alcohol > ester > alkane cùng số carbon"
    }
  ]
};

  var DEFAULT_GUIDED_STAGES = {
  "g12c1": [
    {
      "title": "1. Bản chất Este, Hương thơm tự nhiên & Đồng phân danh pháp",
      "hook": "Mùi chuối chín thoang thoảng (isoamyl acetate), mùi dứa thơm ngọt (ethyl butyrate), mùi hoa nhài thanh khiết (benzyl acetate)... Tất cả hương thơm quyến rũ trong thế giới tự nhiên và các chai nước hoa đắt giá đều bắt nguồn từ cấu trúc Este!",
      "predict": {
        "q": "Theo bạn, giữa Acetic acid (CH₃COOH) và Ethyl acetate (CH₃COOCH₂CH₃), chất nào sẽ có nhiệt độ sôi cao hơn đáng kể và tan vô hạn trong nước?",
        "opts": "A=Ethyl acetate có nhiệt độ sôi cao hơn vì phân tử cồng kềnh hơn;B=Acetic acid có nhiệt độ sôi cao hơn và tan tốt hơn nhiều vì tạo được liên kết hydrogen liên phân tử;C=Cả hai đều có nhiệt độ sôi và độ tan ngang nhau vì cùng là hợp chất hữu cơ;D=Este tan vô hạn còn acid hoàn toàn không tan trong nước",
        "a": "B",
        "insight": "Dự đoán chuẩn xác! Acid carboxylic tạo được liên kết hydrogen liên phân tử rất bền (dạng dimer) nên nhiệt độ sôi cao hơn hẳn este và tan vô hạn trong nước. Trong khi đó, phân tử este không có nguyên tử H linh động nên không tạo được liên kết hydrogen liên phân tử, dẫn đến nhiệt độ sôi thấp hơn nhiều và rất ít tan trong nước."
      },
      "core": "Este hình thành khi thay thế nhóm -OH ở nhóm carboxyl (-COOH) của acid bằng nhóm -OR' của alcohol. Công thức este no đơn chức mạch hở: CₙH₂ₙO₂ (n ≥ 2). Danh pháp: Tên gốc hydrocarbon R' + tên gốc acid RCOO (đuôi -ate). Do không tạo được liên kết hydrogen liên phân tử như alcohol và acid, este có nhiệt độ sôi thấp hơn nhiều và rất ít tan trong nước.",
      "caseStudy": "Công nghệ sản xuất hương liệu thực phẩm: Chiết xuất este tự nhiên rất tốn kém (hàng nghìn bông hoa nhài mới chiết được vài giọt benzyl acetate). Các nhà hóa học tổng hợp este nhân tạo trong công nghiệp thực phẩm nhờ phản ứng ester hóa, vừa hạ giá thành vừa đảm bảo độ tinh khiết cao.",
      "trap": "BẪY TỬ HUYỆT ĐỒNG PHÂN: Với C₄H₈O₂, có 4 đồng phân este (HCOOCH₂CH₂CH₃, HCOOCH(CH₃)₂, CH₃COOC₂H₅, C₂H₅COOCH₃). Nhưng nếu đề hỏi 'đồng phân đơn chức' thì phải tính thêm 2 đồng phân acid carboxylic (tổng cộng là 6)! Ngoài ra, mọi este của formic acid (HCOOR') đều có khả năng TRÁNG BẠC vì chứa nhóm aldehyde -CH=O.",
      "check": {
        "q": "Một este X no, đơn chức, mạch hở có tỉ khối hơi so với khí helium bằng 22. Khi đun nóng X với dung dịch NaOH vừa đủ, thu được muối sodium và alcohol có cùng số nguyên tử carbon. Tên gọi chính xác của X là:",
        "opts": "A=Ethyl acetate;B=Methyl propionate;C=Propyl formate;D=Isopropyl formate",
        "a": "A",
        "exp": "Chính xác tuyệt đối! Phân tử khối M_X = 22 × 4 = 88 → CTPT là C₄H₈O₂. Vì phản ứng thủy phân sinh ra muối RCOONa và alcohol R'OH có cùng số nguyên tử carbon nên gốc R và R' đều có đúng 2 carbon → Công thức là CH₃COOC₂H₅ (ethyl acetate).",
        "hint": "Phân tử khối este M = 22 × 4 = 88. Tìm este C₄H₈O₂ sao cho số C của gốc acid bằng số C của gốc alcohol.",
        "breakdown": {
          "A": "ĐÚNG: Ethyl acetate là CH₃COOC₂H₅. M = 88. Gốc acid có 2 carbon và gốc alcohol có 2 carbon (số C bằng nhau).",
          "B": "SAI: Methyl propionate là C₂H₅COOCH₃ (gốc acid có 3C, gốc alcohol có 1C — số carbon không bằng nhau).",
          "C": "SAI: Propyl formate là HCOOCH₂CH₂CH₃ (gốc acid có 1C, gốc alcohol có 3C — không bằng nhau).",
          "D": "SAI: Isopropyl formate là HCOOCH(CH₃)₂ (gốc acid có 1C, gốc alcohol có 3C — không bằng nhau)."
        },
        "mnemonic": "Khẩu quyết C₄H₈O₂: 'Bốn Este - Hai Acid'. Muốn muối và alcohol cùng C thì 4C chia đôi thành 2 và 2 (CH₃COOC₂H₅)!"
      }
    },
    {
      "title": "2. Cơ chế Thuỷ phân Este: Axit vs Kiềm, Bẫy Phenol & Vinyl",
      "hook": "Thuỷ phân este trong acid giống như chiếc khóa kéo hai chiều: kéo vào rồi lại tuột ra (phản ứng thuận nghịch đạt trạng thái cân bằng). Nhưng trong dung dịch kiềm nóng (xà phòng hóa), chiếc khóa bị cắt đứt vĩnh viễn thành muối và không thể quay đầu!",
      "predict": {
        "q": "Nếu ta đun phenyl acetate (CH₃COOC₆H₅) với lượng dư dung dịch NaOH, theo trực giác hoá học bạn sẽ thu được những chất nào sau phản ứng?",
        "opts": "A=Muối CH₃COONa và phenol C₆H₅OH tự do;B=Hai muối CH₃COONa, C₆H₅ONa và nước H₂O (không có phenol hay alcohol sinh ra);C=CH₃COOH và C₆H₅ONa;D=Khí CO₂ và alcohol benzylic C₆H₅CH₂OH",
        "a": "B",
        "insight": "Trực giác hoá học xuất sắc! Phenol sinh ra có tính acid nên lập tức phản ứng tiếp với NaOH tạo muối sodium phenolate (C₆H₅ONa) và H₂O. Do đó, tỉ lệ mol phản ứng luôn là 1 este : 2 NaOH và sinh ra 2 MUỐI, TUYỆT ĐỐI KHÔNG sinh ra alcohol hay phenol tự do!"
      },
      "core": "Thủy phân trong acid: RCOOR' + H₂O ⇌ RCOOH + R'OH (xúc tác H⁺, t°).\nThủy phân trong kiềm (xà phòng hóa): RCOOR' + NaOH → RCOONa + R'OH (1 chiều, đun nóng).\nCÁC TRƯỜNG HỢP NGOẠI LỆ ĐẶC BIỆT:\n• Este vinyl (RCOOCH=CH₂): Thủy phân tạo muối RCOONa + Aldehyde CH₃CHO (do enol không bền tự chuyển vị).\n• Este của phenol (RCOOC₆H₅): Phản ứng với NaOH theo tỉ lệ mol 1:2 tạo 2 MUỐI (RCOONa + C₆H₅ONa) và H₂O, TUYỆT ĐỐI KHÔNG TẠO ALCOHOL!",
      "caseStudy": "Sản xuất keo dán gỗ và sơn bóng PVA: Poly(vinyl acetate) được tổng hợp bằng cách trùng hợp vinyl acetate. Khi thủy phân kiềm một phần PVA, ta thu được poly(vinyl alcohol) dùng làm màng bọc tan trong nước của viên giặt máy hiện đại.",
      "trap": "BẪY ĐỀ THI KINH ĐIỂN: 'Mọi este khi tác dụng với dung dịch NaOH đều sinh ra alcohol' → SAI! Este của phenol tạo 2 muối + H₂O; este vinyl tạo aldehyde; este isopropenyl tạo ketone. Khi tính khối lượng muối xà phòng hóa este của phenol, nhớ tính thêm muối phenolate!",
      "check": {
        "q": "Cho các este sau: (1) phenyl acetate; (2) methyl formate; (3) vinyl acetate; (4) methyl methacrylate. Có bao nhiêu este thoả mãn đồng thời 2 điều kiện: tác dụng với dung dịch NaOH nóng sinh ra alcohol và dung dịch sau phản ứng không có khả năng tráng bạc?",
        "opts": "A=1 este;B=2 este;C=3 este;D=4 este",
        "a": "A",
        "exp": "Xuất sắc! Chỉ có duy nhất (4) methyl methacrylate thỏa mãn: sinh alcohol CH₃OH và không tráng bạc. Phân tích các chất còn lại: (1) Phenyl acetate sinh 2 muối và H₂O (không sinh alcohol); (2) Methyl formate sinh alcohol CH₃OH nhưng muối HCOONa tráng bạc được; (3) Vinyl acetate sinh aldehyde CH₃CHO (không sinh alcohol).",
        "hint": "Loại este của phenol (không sinh alcohol), loại este vinyl (sinh andehit), và loại este của axit formic (có tráng bạc).",
        "breakdown": {
          "A": "ĐÚNG: Chỉ có duy nhất (4) methyl methacrylate thoả mãn cả 2 điều kiện: sinh alcohol CH₃OH và không tráng bạc.",
          "B": "SAI: (1) Phenyl acetate ăn 2 NaOH sinh 2 muối + H₂O (không sinh alcohol); (3) Vinyl acetate sinh aldehyde CH₃CHO (không sinh alcohol).",
          "C": "SAI: (2) Methyl formate sinh alcohol CH₃OH nhưng muối HCOONa lại có phản ứng tráng bạc (vi phạm điều kiện 2).",
          "D": "SAI: Có tới 3 chất không thoả mãn điều kiện của đề bài."
        },
        "mnemonic": "Este phenol không sinh alcohol; este vinyl sinh andehit; este formate tráng bạc 1 ăn 2!"
      }
    },
    {
      "title": "3. Case Study Thí nghiệm: Điều chế Ethyl Acetate trong phòng Lab",
      "hook": "Hình dung bạn là nhà nghiên cứu đang đứng trước bàn thí nghiệm: tại sao phải cho các hóa chất theo thứ tự nghiêm ngặt? Tại sao phải dùng ống dẫn khí nghiêng dài và rót sản phẩm vào dung dịch muối ăn NaCl bão hòa lạnh mà không phải nước cất?",
      "predict": {
        "q": "Trong thí nghiệm điều chế ethyl acetate, sau khi đun cách thuỷ, tại sao người ta lại rót hỗn hợp vào dung dịch NaCl bão hoà lạnh mà không dùng nước cất thông thường?",
        "opts": "A=Để NaCl phản ứng với ester tạo kết tủa trắng;B=Để este tách lớp nổi lên rõ rệt nhờ hiệu ứng muối kết (salting-out) và khối lượng riêng lớn của dung dịch NaCl;C=Để trung hoà axit sunfuric đặc làm dung dịch an toàn hơn;D=Để khử trùng este làm cho este có mùi thơm ngọt hơn",
        "a": "B",
        "insight": "Khả năng phân tích thực nghiệm tuyệt vời! Dung dịch NaCl bão hòa làm giảm mạnh độ tan của este trong nước (hiệu ứng muối kết - salting-out) và làm tăng khối lượng riêng của lớp dung dịch nước phía dưới, giúp ester nhẹ hơn nổi hẳn lên trên thành lớp váng dầu trong suốt để dễ dàng tách chiết."
      },
      "core": "QUY TRÌNH THÍ NGHIỆM CHUẨN:\n• Bước 1: Cho 2 mL ethanol nguyên chất, 2 mL acetic acid băng và 1 mL H₂SO₄ đặc (cho từ từ dọc thành ống nghiệm để tránh sôi bắn axit). Lắp ống thủy tinh dài hướng lên làm ống sinh hàn hồi lưu.\n• Bước 2: Đun cách thủy trong nồi nước nóng 65 - 70°C khoảng 5 - 10 phút (không đun sôi trực tiếp bằng ngọn lửa đèn cồn để tránh cồn bốc cháy và bay hơi hết este).\n• Bước 3: Rót hỗn hợp phản ứng vào ống nghiệm chứa sẵn 2 mL dung dịch NaCl bão hòa lạnh.",
      "caseStudy": "GIẢI MÃ CƠ CHẾ CÁC HÓA CHẤT TRONG THÍ NGHIỆM:\n1. H₂SO₄ đặc: Đóng 2 vai trò quyết định — Vừa là chất xúc tác tăng tốc độ phản ứng, vừa là chất hút nước mạnh giúp chuyển dịch cân bằng sang phía tạo este.\n2. Dung dịch NaCl bão hòa lạnh: Dung dịch NaCl có khối lượng riêng lớn và este gần như không tan trong dung dịch muối ăn (hiện tượng salting-out), làm giảm độ tan của este và tách este thành lớp váng dầu nổi rõ rệt lên trên mặt nước để dễ thu hồi.",
      "trap": "BẪY THỰC NGHIỆM ĐỀ THI THPT:\n• 'Có thể thay H₂SO₄ đặc bằng HCl đặc' → SAI (HCl dễ bay hơi và không hút nước).\n• 'Nhiệt kế cắm ngập vào đáy ống nghiệm phản ứng' → SAI (nhiệt kế cắm vào nồi nước cách thủy để kiểm soát nhiệt độ nước 65-70°C).\n• 'Thay NaCl bão hòa bằng nước cất thì este tách lớp tốt hơn' → SAI (este tan một phần trong nước, chỉ tách lớp triệt để khi dùng NaCl bão hòa).",
      "check": {
        "q": "Tiến hành thí nghiệm điều chế ethyl acetate theo đúng quy trình SGK. Phát biểu nào sau đây là SAI?",
        "opts": "A=Dung dịch NaCl bão hoà giúp este tách lớp nổi lên trên bề mặt rõ rệt;B=Axit H₂SO₄ đặc vừa làm xúc tác vừa có tác dụng hút nước chuyển dịch cân bằng;C=Có thể thay thế dung dịch NaCl bão hoà bằng dung dịch HCl đặc để este nổi lên nhanh hơn;D=Ống thuỷ tinh thẳng dài lắp nghiêng đóng vai trò ống sinh hàn ngưng tụ hồi lưu hơi chất lỏng",
        "a": "C",
        "exp": "Chính xác! Phát biểu C sai hoàn toàn. Dung dịch NaCl bão hòa có khối lượng riêng lớn và độ tan của este trong đó rất bé, giúp este tách lớp triệt để. Nếu thay bằng HCl đặc, axit sẽ xúc tác làm thủy phân ngược este trở lại axit và alcohol!",
        "hint": "NaCl bão hòa tạo hiệu ứng salting-out giúp tách lớp. Dung dịch HCl đặc có tác dụng này không?",
        "breakdown": {
          "A": "SAI: H₂SO₄ đặc đóng vai trò kép: vừa xúc tác acid vừa hút nước để chuyển dịch cân bằng sang phía tạo este.",
          "B": "SAI: Ống dẫn khí dài để hơi este và alcohol ngưng tụ hồi lưu trở lại ống nghiệm, tránh thất thoát.",
          "C": "ĐÚNG: NaCl bão hoà lạnh giúp tăng tỉ trọng lớp nước và làm giảm độ tan của este (hiệu ứng muối kết), đẩy este nhẹ nổi lên trên.",
          "D": "SAI: Không được đun sôi trực tiếp bằng ngọn lửa đèn cồn vì cồn và este dễ bốc cháy; phải đun cách thuỷ ở 65-70°C."
        },
        "mnemonic": "NaCl bão hòa: Tăng tỉ trọng dung dịch, ép este nổi lên tách pha dầu!"
      }
    },
    {
      "title": "4. Lipit & Chất béo: Cấu tạo, Hydrogen hoá & Cơ chế tẩy rửa",
      "hook": "Mỡ lợn đông cứng ở nhiệt độ thường, còn dầu thực vật lại sóng sánh ở thể lỏng. Tại sao khi thổi một luồng khí hydro đi qua dầu ăn lại biến dầu lỏng thành bơ thực vật rắn như phép màu? Và xà phòng cuốn trôi dầu mỡ bám trên da như thế nào?",
      "predict": {
        "q": "Tại sao mỡ lợn (chứa chủ yếu tristearin no) lại đông đặc ở nhiệt độ thường, trong khi dầu thực vật (chứa triolein không no) lại luôn sóng sánh ở thể lỏng?",
        "opts": "A=Do phân tử chất béo no có mạch thẳng xếp khít vào nhau làm tăng mạnh lực hút liên phân tử van der Waals;B=Do dầu thực vật chứa hàm lượng nước cao hơn mỡ động vật;C=Do phân tử mỡ lợn có khối lượng nặng hơn dầu ăn hàng nghìn lần;D=Do dầu thực vật bị oxi hoá bởi không khí thành chất lỏng",
        "a": "A",
        "insight": "Chính xác tuyệt đối! Các gốc acid béo no có cấu trúc mạch carbon kéo dài thẳng tắp, dễ dàng xếp khít lại gần nhau khiến lực tương tác liên phân tử van der Waals rất lớn → nhiệt độ nóng chảy cao (thể rắn). Trong khi đó, các liên kết đôi C=C dạng đồng phân cis trong dầu thực vật tạo nên các nếp gập gẫy khúc, cản trở các phân tử xếp khít nên lực hút yếu → nhiệt độ nóng chảy thấp (thể lỏng)."
      },
      "core": "Chất béo (triglyceride) là triester của glycerol với các acid béo mạch C dài không phân nhánh (RCOO)₃C₃H₅.\n• Acid béo no: Palmitic C₁₅H₃₁COOH (M=256), Stearic C₁₇H₃₅COOH (M=284) → Chất béo rắn (tristearin, tripalmitin trong mỡ động vật).\n• Acid béo không no: Oleic C₁₇H₃₃COOH (1 liên kết C=C, M=282), Linoleic C₁₇H₃₁COOH (2 liên kết C=C) → Chất béo lỏng (triolein trong dầu thực vật).\n• Phản ứng Hydrogen hóa: Triolein (lỏng) + 3H₂ → Tristearin (rắn) (xúc tác Ni, t°), ứng dụng sản xuất bơ nhân tạo (margarine) và xà phòng.",
      "caseStudy": "CƠ CHẾ TẨY RỬA & NƯỚC CỨNG:\nPhân tử xà phòng (RCOONa) gồm 2 phần: Đuôi hydrocarbon dài kị nước cắm sâu vào hạt dầu mỡ; Đầu carboxylate -COO⁻Na⁺ ưa nước hướng ra ngoài tạo các hạt micelle lơ lửng trong nước và bị dòng nước cuốn trôi.\nTrong nước cứng chứa Ca²⁺, Mg²⁺: Xà phòng tạo kết tủa (RCOO)₂Ca↓ làm giảm bọt và ố vàng sợi vải. Chất giặt rửa tổng hợp (chứa nhóm -SO₃Na) không tạo kết tủa với Ca²⁺, Mg²⁺ nên dùng tốt trong cả nước cứng và môi trường axit!",
      "trap": "BẪY TỔNG HỢP KIẾN THỨC:\n• Dầu mỡ bôi trơn máy móc là HYDROCARBON (paraffin), hoàn toàn KHÔNG THỂ bị xà phòng hóa bằng NaOH, khác hẳn dầu mỡ ăn (ester).\n• Phản ứng thủy phân chất béo trong dung dịch NaOH luôn thu được GLYCEROL C₃H₅(OH)₃ và muối sodium của acid béo theo tỉ lệ mol 1 : 3.",
      "check": {
        "q": "Cho các phát biểu sau về chất béo và chất giặt rửa: (a) Triolein tác dụng với H₂ dư (xúc tác Ni, t°) tạo thành tristearin; (b) Xà phòng và chất giặt rửa tổng hợp đều có đuôi hydrocarbon kị nước và đầu phân cực ưa nước; (c) Khi dùng xà phòng trong nước cứng (chứa nhiều Ca²⁺, Mg²⁺) sẽ tạo kết tủa làm giảm tác dụng giặt rửa; (d) Dầu mỡ bôi trơn máy móc có cùng bản chất hoá học với dầu thực vật và mỡ động vật. Số phát biểu ĐÚNG là:",
        "opts": "A=1;B=2;C=3;D=4",
        "a": "C",
        "exp": "Chính xác! Có 3 phát biểu đúng là (a), (b), (c). Phát biểu (d) sai vì dầu mỡ bôi trơn máy móc là hỗn hợp hydrocarbon khoáng vật, còn dầu thực vật và mỡ động vật là este của glycerol với acid béo.",
        "hint": "Xem xét kỹ bản chất của dầu bôi trơn động cơ xe máy: nó có phải là este không?",
        "breakdown": {
          "A": "SAI: Bị thiếu các phát biểu đúng khác (cả a, c, d đều đúng).",
          "B": "SAI: Phát biểu (b) sai vì chất giặt rửa tổng hợp không bị kết tủa trong nước cứng như xà phòng thông thường.",
          "C": "ĐÚNG: Gồm 3 phát biểu đúng là (a), (c) và (d).",
          "D": "SAI: Phát biểu (b) sai: Chất giặt rửa tổng hợp dùng tốt trong cả nước cứng vì muối của nó tan tốt trong nước."
        },
        "mnemonic": "Xà phòng gặp nước cứng bị kết tủa; chất giặt tổng hợp bất chấp mọi loại nước!"
      }
    },
    {
      "title": "5. Vận dụng Định lượng & Phân tích Đa điều kiện (Toán Xà phòng hoá)",
      "hook": "Trong hóa học định lượng, khối lượng không bao giờ tự nhiên sinh ra hay mất đi. Định luật bảo toàn khối lượng và tỉ lệ mol vàng là chìa khóa vạn năng giúp giải quyết mọi bài toán xà phòng hóa phức tạp trong nháy mắt!",
      "predict": {
        "q": "Khi xà phòng hoá hoàn toàn 1 mol triglyceride bất kì bằng dung dịch NaOH vừa đủ, lượng glycerol thu được luôn luôn là bao nhiêu mol?",
        "opts": "A=Luôn đúng bằng 1 mol glycerol (tỉ lệ mol este : glycerol là 1 : 1);B=Luôn đúng bằng 3 mol glycerol;C=Tuỳ thuộc vào loại gốc acid béo tạo nên chất béo đó;D=Không thu được glycerol mà thu được ethylene glycol",
        "a": "A",
        "insight": "Rất chuẩn xác! Chất béo luôn là triester của glycerol với 3 gốc acid béo: (RCOO)₃C₃H₅ + 3NaOH → 3RCOONa + C₃H₅(OH)₃. Do đó, cứ 1 mol chất béo bị xà phòng hóa luôn tiêu tốn 3 mol NaOH và sinh ra ĐÚNG 1 mol glycerol!"
      },
      "core": "CÔNG THỨC VÀNG XÀ PHÒNG HÓA CHẤT BÉO:\n1. Tỉ lệ mol: 1 mol chất béo cần 3 mol NaOH và sinh ra 1 mol glycerol: n(NaOH) = 3 × n(glycerol) = 3 × n(chất béo).\n2. Định luật bảo toàn khối lượng: m(chất béo) + m(NaOH) = m(muối/xà phòng) + m(glycerol).\n3. Este đơn chức thông thường: n(este) = n(NaOH phản ứng) = n(muối) = n(alcohol).\n4. Este của phenol: n(NaOH) = 2 × n(este) và sinh ra n(H₂O) = n(este).",
      "caseStudy": "BÀI TOÁN SẢN XUẤT THỰC TẾ:\nKhi nấu xà phòng thủ công trong làng nghề, người ta trộn mỡ bò (tristearin) với dung dịch xút NaOH nóng, sau đó thêm muối ăn NaCl để xà phòng đông đặc đóng bánh nổi lên trên, tách lấy glycerol tinh khiết bên dưới làm nguyên liệu mỹ phẩm và dược phẩm.",
      "trap": "BẪY TÍNH CHẤT RẮN KHAN: Nếu đề bài cho 'dùng dung dịch NaOH dư', thì khối lượng chất rắn khan thu được sau khi cô cạn bao gồm cả MUỐI VÀ NAOH DƯ! Cần lấy tổng khối lượng ban đầu trừ khối lượng alcohol và H₂O bay hơi.",
      "check": {
        "q": "Xà phòng hoá hoàn toàn 17,8 gam một triglixerit X bằng lượng vừa đủ dung dịch NaOH, đun nóng. Cô cạn dung dịch sau phản ứng thu được 1,84 gam glycerol và m gam hỗn hợp muối sodium của các acid béo. Giá trị của m là:",
        "opts": "A=18,36 gam;B=19,12 gam;C=17,24 gam;D=18,84 gam",
        "a": "A",
        "exp": "Chính xác tuyệt đối! Số mol glycerol: n = 1,84 / 92 = 0,02 mol. Theo tỉ lệ mol phản ứng: n(NaOH) = 3 × n(glycerol) = 3 × 0,02 = 0,06 mol. Áp dụng định luật bảo toàn khối lượng: m(chất béo) + m(NaOH) = m(muối) + m(glycerol) → 17,8 + (0,06 × 40) = m + 1,84 → m = 18,36 gam.",
        "hint": "Tính n(glycerol) = 1,84 / 92. Từ đó suy ra n(NaOH) = 3 × n(glycerol). Dùng bảo toàn khối lượng để tìm m(muối).",
        "breakdown": {
          "A": "ĐÚNG: n(glycerol) = n(triglyceride) = 17,8 / 890 = 0,02 mol. n(NaOH) = 3 × 0,02 = 0,06 mol. Bảo toàn khối lượng: m(muối) = 17,8 + 0,06 × 40 - 0,02 × 92 = 18,36 gam.",
          "B": "SAI: Quên không trừ đi khối lượng glycerol sinh ra.",
          "C": "SAI: Quên nhân hệ số 3 của NaOH trong phương trình xà phòng hoá.",
          "D": "SAI: Tính sai khối lượng phân tử của triglixerit tristearin."
        },
        "mnemonic": "Toán xà phòng: m(muối) = m(chất béo) + m(NaOH) - m(glycerol). Tỉ lệ: 1 béo : 3 kiềm : 1 glycerol!"
      }
    }
  ],
  "g12c2": [
    {
      "title": "1. Monosaccharide: Glucose & Fructose — Cấu tạo & Tính chất Polyol",
      "hook": "Đường nho (glucose) chảy trong huyết quản nuôi sống hàng tỷ nơ-ron não bộ; đường mật ong (fructose) ngọt sắc đậm đà. Đều cùng công thức C₆H₁₂O₆, nhưng hình dạng phân tử và các nhóm chức của chúng khác nhau như thế nào?",
      "predict": {
        "q": "Cả dung dịch Glucose và Fructose đều hoà tan kết tủa Cu(OH)₂ ở nhiệt độ thường tạo thành dung dịch màu xanh lam thẫm. Hiện tượng này chứng minh điều gì trong cấu tạo phân tử của chúng?",
        "opts": "A=Cả hai đều có nhóm aldehyde (-CHO) ở đầu mạch;B=Cả hai đều có nhiều nhóm hydroxy (-OH) ở các vị trí nguyên tử carbon liền kề nhau;C=Cả hai đều có tính acid mạnh như acetic acid;D=Cả hai đều là những hợp chất cao phân tử mạch dài",
        "a": "B",
        "insight": "Dự đoán chuẩn xác! Phản ứng tạo phức chất chelate màu xanh lam thẫm với Cu(OH)₂ ở nhiệt độ thường là tính chất đặc trưng của polyalcohol có từ 2 nhóm -OH kề nhau trở lên. Fructose dù là ketone nhưng sở hữu tới 5 nhóm -OH kề nhau nên vẫn phản ứng tạo phức xanh lam y hệt glucose!"
      },
      "core": "Glucose và Fructose là đồng phân cấu tạo monosaccharide (M = 180):\n• Glucose (CH₂OH-[CHOH]₄-CHO): Chứa 5 nhóm -OH kề nhau và 1 nhóm aldehyde -CHO. Tồn tại chủ yếu ở dạng vòng 6 cạnh α và β qua liên kết hemiacetal.\n• Fructose (CH₂OH-[CHOH]₃-CO-CH₂OH): Chứa 5 nhóm -OH và 1 nhóm ketone C=O ở vị trí C2. Tồn tại ở dạng vòng 5 cạnh.\n• Tính chất Polyalcohol kề nhau: Cả glucose và fructose đều hòa tan Cu(OH)₂ ở nhiệt độ thường tạo phức chất đồng màu xanh lam thẫm.",
      "caseStudy": "Ứng dụng dung dịch glucose 5% trong y tế (huyết thanh ngọt): Glucose được hấp thu trực tiếp qua niêm mạc ruột non vào máu mà không cần enzyme tiêu hóa thủy phân, giải phóng năng lượng ATP tức thì cho bệnh nhân suy nhược cơ thể.",
      "trap": "BẪY THUỐC THỬ: Vì cả glucose và fructose đều có nhiều nhóm -OH kề nhau nên cả hai ĐỀU HÒA TAN Cu(OH)₂ ở nhiệt độ thường tạo dung dịch xanh lam thẫm. Do đó KHÔNG THỂ dùng Cu(OH)₂ ở nhiệt độ thường để phân biệt hai chất này!",
      "check": {
        "q": "Để chứng minh trong phân tử glucose có nhiều nhóm hydroxy (-OH) ở vị trí kề nhau, người ta cho dung dịch glucose tác dụng với hoá chất nào sau đây ở nhiệt độ thường?",
        "opts": "A=Cu(OH)₂ ở nhiệt độ thường;B=Dung dịch AgNO₃ trong NH₃, đun nóng;C=Kim loại Sodium (Na);D=Dung dịch nước bromine",
        "a": "A",
        "exp": "Chính xác! Phản ứng tạo phức màu xanh lam thẫm với Cu(OH)₂ ở nhiệt độ thường là phản ứng đặc trưng của các polyalcohol có các nhóm -OH liền kề nhau. Phản ứng với Na chỉ chứng minh có nguyên tử H linh động; phản ứng tráng bạc chứng minh có nhóm aldehyde.",
        "hint": "Thuốc thử nào nhận diện polyalcohol kề nhau bằng hiện tượng hòa tan kết tủa tạo phức màu xanh lam thẫm?",
        "breakdown": {
          "A": "ĐÚNG: Hòa tan Cu(OH)₂ ở nhiệt độ thường tạo phức màu xanh lam thẫm chứng minh glucose có nhiều nhóm -OH kề nhau.",
          "B": "SAI: Phản ứng tráng bạc chứng minh nhóm aldehyde -CHO, không chứng minh nhiều nhóm -OH kề nhau.",
          "C": "SAI: Khử hoàn toàn bằng HI chứng minh phân tử có mạch 6 nguyên tử carbon không phân nhánh.",
          "D": "SAI: Lên men rượu chứng minh khả năng chuyển hóa sinh học, không chứng minh nhóm -OH."
        },
        "mnemonic": "Cu(OH)₂ thường xanh lam: Bằng chứng thép của polyol kề nhau!"
      }
    },
    {
      "title": "2. Phản ứng Oxi hoá Monosaccharide: Tráng bạc vs Nước Bromine",
      "hook": "Một giọt hóa chất trong suốt có thể biến thành chiếc gương soi sáng bóng như gương trên thành ống nghiệm. Phản ứng tráng bạc là màn trình diễn kỳ diệu của nhóm chức aldehyde!",
      "predict": {
        "q": "Fructose là một polyhydroxy ketone (chứa nhóm C=O ở vị trí C2, không có nhóm -CHO). Vậy theo bạn, fructose có tham gia phản ứng tráng bạc với thuốc thử Tollens [Ag(NH₃)₂]OH không?",
        "opts": "A=Có tráng bạc, vì trong môi trường kiềm của thuốc thử Tollens, fructose tự đồng phân hoá chuyển thành glucose;B=Hoàn toàn không tráng bạc, vì chỉ aldehyde mới có khả năng tráng bạc;C=Có tráng bạc nhưng sinh ra kết tủa đồng đỏ Cu₂O thay vì bạc kim loại;D=Chỉ tráng bạc khi có mặt ánh sáng mặt trời gay gắt",
        "a": "A",
        "insight": "Tư duy hoá học đỉnh cao! Đây là bẫy kinh điển nhất trong đề thi THPT: Fructose không có nhóm aldehyde nhưng dung dịch thuốc thử Tollens có môi trường kiềm (NH₃), xúc tác làm fructose chuyển hoá thuận nghịch thành glucose → Fructose vẫn tráng bạc tạo gương sáng bóng!"
      },
      "core": "• Phản ứng tráng bạc (thuốc thử Tollens): Glucose + 2[Ag(NH₃)₂]OH → Ammonium gluconate + 2Ag↓ + 3NH₃ + H₂O. 1 mol Glucose sinh ra đúng 2 mol Ag.\n• Oxi hóa bởi Cu(OH)₂ đun nóng: Tạo kết tủa đỏ gạch Cu₂O↓.\n• CÂN BẰNG ĐỒNG PHÂN HÓA TRONG MÔI TRƯỜNG KIỀM: Fructose ⇌ Glucose (xúc tác OH⁻). Vì thuốc thử Tollens chứa NH₃ (môi trường base) nên fructose tự chuyển thành glucose và CŨNG THAM GIA PHẢN ỨNG TRÁNG BẠC!\n• Phản ứng với nước Bromine: Glucose oxi hóa làm mất màu nâu đỏ của nước Br₂ (tạo gluconic acid). Vì môi trường nước Br₂ không có tính kiềm nên fructose không chuyển thành glucose → FRUCTOSE KHÔNG LÀM MẤT MÀU NƯỚC BROMINE!",
      "caseStudy": "Phương pháp chuẩn xét nghiệm đường huyết: Trong y học, nồng độ glucose trong máu được định lượng bằng máy đo đường huyết cá nhân dựa trên phản ứng oxi hóa glucose bằng enzyme glucose oxidase sinh ra dòng điện tương ứng.",
      "trap": "BẪY TỬ HUYỆT ĐỀ THI: 'Fructose là ketone nên không tráng bạc' → SAI HOÀN TOÀN! Fructose tráng bạc bình thường nhờ môi trường kiềm. Muốn phân biệt glucose và fructose bằng phương pháp hóa học, thuốc thử duy nhất là DUNG DỊCH NƯỚC BROMINE!",
      "check": {
        "q": "Đun nóng dung dịch chứa m gam glucose với lượng dư dung dịch AgNO₃ trong NH₃ đến khi phản ứng xảy ra hoàn toàn, thu được 32,4 gam bạc kim loại bám vào thành ống nghiệm. Giá trị của m là:",
        "opts": "A=27,0 gam;B=54,0 gam;C=13,5 gam;D=18,0 gam",
        "a": "A",
        "exp": "Chính xác tuyệt đối! Số mol Ag: n(Ag) = 32,4 / 108 = 0,3 mol. Phản ứng tráng bạc: 1 mol glucose (C₆H₁₂O₆) sinh ra 2 mol Ag → n(glucose) = 0,3 / 2 = 0,15 mol. Khối lượng glucose: m = 0,15 × 180 = 27,0 gam.",
        "hint": "Nhớ tỉ lệ phản ứng tráng bạc: 1 mol glucose tạo ra 2 mol Ag. Tính n(Ag) rồi suy ra n(glucose) và m.",
        "breakdown": {
          "A": "ĐÚNG: 1 mol Glucose sinh đúng 2 mol Ag. Số mol Ag = 21,6 / 108 = 0,2 mol → n(glucose) = 0,1 mol → m = 0,1 × 180 = 18,0 gam.",
          "B": "SAI: Nhầm tỉ lệ 1:1 (m = 36,0g là lấy 0,2 × 180).",
          "C": "SAI: Lấy nhầm khối lượng phân tử của saccharose (342) thay vì glucose (180).",
          "D": "SAI: Lấy nhầm khối lượng phân tử của glycerol (92)."
        },
        "mnemonic": "Glucose tráng bạc: 1 mol đẻ 2 Ag. Lấy mol Ag chia đôi ra mol Glucose!"
      }
    },
    {
      "title": "3. Case Study: Y học, Đời sống & Hiệu suất Lên men Rượu",
      "hook": "Ruột phích giữ nhiệt bạn dùng hàng ngày được tráng một lớp bạc siêu mỏng để phản xạ bức xạ nhiệt. Tại sao người ta lại dùng glucose để tráng ruột phích mà không dùng aldehyde formic (HCHO) rẻ tiền hơn?",
      "predict": {
        "q": "Khi sản xuất ruột phích giữ nhiệt bằng phản ứng tráng bạc công nghiệp, tại sao người ta lại dùng glucose thay vì formaldehyde (HCHO) dù formaldehyde rẻ tiền hơn rất nhiều?",
        "opts": "A=Vì formaldehyde độc hại, dễ bay hơi gây nguy hiểm cho công nhân và người tiêu dùng;B=Vì glucose tráng được lớp bạc dày gấp 10 lần formaldehyde;C=Vì formaldehyde không có khả năng tráng bạc;D=Vì glucose tạo ra bạc có màu vàng kim lấp lánh",
        "a": "A",
        "insight": "Trực giác nhân văn và khoa học rất chính xác! Formaldehyde (formalin) là chất độc mạnh, gây kích ứng niêm mạc và có nguy cơ gây ung thư. Sử dụng glucose vừa an toàn tuyệt đối cho người sản xuất và người sử dụng ruột phích, vừa tạo lớp màng bạc đồng đều, bám dính sáng bóng trên thành thuỷ tinh."
      },
      "core": "• Tráng ruột phích bằng glucose: Formaldehyde độc hại cho công nhân và người tiêu dùng. Glucose là hợp chất tự nhiên, an toàn tuyệt đối và tạo lớp bạc bám dính mịn màng.\n• Phản ứng lên men rượu: C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂↑ (men rượu, 30-35°C). Khí CO₂ sinh ra dẫn vào nước vôi trong Ca(OH)₂ dư tạo kết tủa trắng CaCO₃↓.\n• Chỉ số đường huyết sinh học: Lượng glucose trong máu người bình thường luôn ổn định ở mức 0,1% (khoảng 4,4 – 7,2 mmol/L).",
      "caseStudy": "Công nghệ sản xuất cồn sinh học Ethanol (E5): Tinh bột ngô/sắn được thủy phân thành glucose nhờ enzyme amylase, sau đó lên men rượu thành ethanol rồi chưng cất khan để phối trộn vào xăng sinh học thân thiện với môi trường.",
      "trap": "BẪY TÍNH HIỆU SUẤT PHẢN ỨNG: Khi tính khối lượng chất tham gia (glucose ban đầu) với hiệu suất H%, bắt buộc phải CHIA CHO HIỆU SUẤT (m = m_lý_thuyết / (H/100)). Rất nhiều bạn bấm máy nhân với H% dẫn đến đáp án bẫy!",
      "check": {
        "q": "Lên men m gam glucose thành ethyl alcohol với hiệu suất toàn bộ quá trình đạt 75%. Lượng khí CO₂ sinh ra được dẫn toàn bộ vào dung dịch Ca(OH)₂ dư, thu được 60 gam kết tủa trắng. Giá trị của m là:",
        "opts": "A=72,0 gam;B=54,0 gam;C=36,0 gam;D=40,5 gam",
        "a": "A",
        "exp": "Đỉnh cao! n(CaCO₃) = 60 / 100 = 0,6 mol = n(CO₂). Theo phản ứng lên men: 1 glucose sinh ra 2 CO₂ → n(glucose phản ứng) = 0,6 / 2 = 0,3 mol. Vì hiệu suất đạt 75% nên lượng glucose thực tế ban đầu cần lấy là: n = 0,3 / 0,75 = 0,4 mol → m = 0,4 × 180 = 72,0 gam.",
        "hint": "n(CO₂) = n(CaCO₃) = 0,6 mol. n(glucose pứ) = 0,3 mol. Vì hiệu suất 75% nên chia cho 0,75: n(ban đầu) = 0,3 / 0,75.",
        "breakdown": {
          "A": "ĐÚNG: C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂. n(CO₂) = n(CaCO₃) = 50 / 100 = 0,5 mol → n(glucose lý thuyết) = 0,25 mol. Do H = 80% → n(glucose thực tế) = 0,25 / 0,8 = 0,3125 mol → m = 56,25 gam.",
          "B": "SAI: Quên chia cho hiệu suất (lấy 0,25 × 0,8 thay vì chia 0,8).",
          "C": "SAI: Quên tỉ lệ 1 glucose sinh ra 2 CO₂.",
          "D": "SAI: Nhầm lẫn giữa khối lượng dung dịch giảm và khối lượng kết tủa."
        },
        "mnemonic": "Tính chất tham gia ban đầu: Muốn tìm lượng thực tế thì LẤY LÝ THUYẾT CHIA HIỆU SUẤT!"
      }
    },
    {
      "title": "4. Disaccharide & Polysaccharide: Saccharose, Tinh bột & Cellulose",
      "hook": "Từ bông gòn may áo đến cây mía ngọt lịm, từ hạt gạo trắng ngần đến thuốc súng không khói trong quân sự — tất cả đều được tạo nên từ những mắt xích monosaccharide liên kết với nhau!",
      "predict": {
        "q": "Dung dịch đường mía (saccharose) bình thường không tham gia phản ứng tráng bạc. Nếu đun nóng dung dịch saccharose với vài giọt acid H₂SO₄ loãng rồi trung hoà kiềm, sau đó cho thuốc thử Tollens vào, hiện tượng sẽ là gì?",
        "opts": "A=Xuất hiện lớp bạc sáng bóng bám vào thành ống nghiệm (phản ứng tráng bạc);B=Không có hiện tượng gì xảy ra, dung dịch vẫn trong suốt;C=Dung dịch lập tức hoá màu xanh tím đậm;D=Dung dịch sủi bọt khí CO₂ mãnh liệt",
        "a": "A",
        "insight": "Chính xác tuyệt đối! Acid xúc tác đun nóng đã thuỷ phân saccharose thành hỗn hợp glucose và fructose. Cả hai monosaccharide sinh ra đều tham gia phản ứng tráng bạc rất mạnh, sinh ra bạc kim loại Ag sáng bóng!"
      },
      "core": "• Saccharose (C₁₂H₂₂O₁₁): Gồm 1 gốc α-glucose và 1 gốc β-fructose qua liên kết α,β-1,2-glycoside. Cả 2 nhóm hemiacetal đều bị khóa → KHÔNG tráng bạc, KHÔNG mở vòng.\n• Maltose (C₁₂H₂₂O₁₁): Gồm 2 gốc α-glucose liên kết α-1,4-glycoside. Còn 1 nhóm hemiacetal tự do → CÓ phản ứng tráng bạc.\n• Tinh bột (C₆H₁₀O₅)ₙ: Gồm Amylose (mạch thẳng xoắn lò xo, liên kết α-1,4) và Amylopectin (mạch phân nhánh, liên kết α-1,4 và α-1,6). Tác dụng với Iodine cho màu xanh tím đặc trưng (đun nóng mất màu, để nguội hiện lại).\n• Cellulose (C₆H₁₀O₅)ₘ: Mạch kéo dài không phân nhánh gồm các gốc β-glucose liên kết β-1,4-glycoside. Công thức mắt xích: [C₆H₇O₂(OH)₃]ₙ.",
      "caseStudy": "Sản xuất tơ sợi nhân tạo và thuốc súng không khói:\n1. Tơ visco và tơ acetate: Chế biến từ nguồn cellulose gỗ/tre nứa bằng phản ứng hóa học thành tơ sợi mềm mại thay thế lụa tự nhiên.\n2. Thuốc súng không khói: Cellulose trinitrate [C₆H₇O₂(ONO₂)₃]ₙ điều chế từ cellulose tác dụng với HNO₃ đặc (xúc tác H₂SO₄ đặc), cháy cực nhanh và không tạo khói.",
      "trap": "BẪY ĐỒNG PHÂN: Tinh bột và Cellulose đều có công thức tổng quát là (C₆H₁₀O₅)ₙ nhưng KHÔNG PHẢI LÀ ĐỒNG PHÂN của nhau vì hệ số polime hóa n khác nhau rất nhiều (n của cellulose lớn hơn tinh bột từ hàng chục đến hàng trăm lần)!",
      "check": {
        "q": "Cho các carbohydrate sau: glucose, fructose, saccharose, tinh bột, cellulose. Số chất tham gia phản ứng thuỷ phân trong môi trường acid và số chất tham gia phản ứng tráng bạc lần lượt là:",
        "opts": "A=3 chất thuỷ phân và 2 chất tráng bạc;B=3 chất thuỷ phân và 3 chất tráng bạc;C=4 chất thuỷ phân và 2 chất tráng bạc;D=2 chất thuỷ phân và 3 chất tráng bạc",
        "a": "A",
        "exp": "Chính xác tuyệt đối! Chất bị thuỷ phân gồm 3 chất: saccharose (disaccharide) và 2 polysaccharide (tinh bột, cellulose). Monosaccharide không bị thuỷ phân. Chất tráng bạc gồm 2 chất: glucose và fructose. Saccharose, tinh bột và cellulose không tráng bạc.",
        "hint": "Monosaccharide (đường đơn) có bị thủy phân được không? Những chất nào mở vòng tạo nhóm aldehyde để tráng bạc?",
        "breakdown": {
          "A": "ĐÚNG: Có đúng 3 chất tham gia phản ứng tráng bạc là glucose, fructose và maltose (saccharose, tinh bột, cellulose không tráng bạc).",
          "B": "SAI: Quên mất maltose vẫn có nhóm hemiacetal mở vòng tráng bạc được.",
          "C": "SAI: Đếm nhầm saccharose tráng bạc (saccharose chỉ tráng bạc sau khi thủy phân).",
          "D": "SAI: Tinh bột và cellulose là polysaccharide hoàn toàn không có tính khử tráng bạc."
        },
        "mnemonic": "Tráng bạc tự do: Glu, Fruc, Mal. Bị khóa vòng: Sac, Tinh bột, Xen!"
      }
    },
    {
      "title": "5. Tính toán Kết hợp & Phân tích Đa điều kiện (Thủy phân Saccharose)",
      "hook": "Thủy phân một phân tử đường không tráng bạc (saccharose), bạn thu được dung dịch có khả năng sinh ra tới 4 nguyên tử bạc sáng bóng! Mối liên hệ định lượng này là cái bẫy điểm 9+ quen thuộc trong đề thi.",
      "predict": {
        "q": "Từ 1 mol saccharose, sau khi thuỷ phân hoàn toàn trong môi trường acid rồi trung hoà kiềm, cho tác dụng với lượng dư thuốc thử Tollens thì lượng bạc kim loại Ag tối đa thu được là bao nhiêu mol?",
        "opts": "A=1 mol Ag;B=2 mol Ag;C=4 mol Ag;D=8 mol Ag",
        "a": "C",
        "insight": "Tư duy định lượng cực kỳ sắc bén! 1 mol saccharose thuỷ phân sinh ra 1 mol glucose (tạo 2 mol Ag) và 1 mol fructose (trong môi trường kiềm chuyển thành glucose, cũng tạo 2 mol Ag) → Tổng cộng 1 mol saccharose cho tối đa 4 mol Ag!"
      },
      "core": "PHẢN ỨNG THỦY PHÂN LIÊN HOÀN:\n• Thủy phân: Saccharose (C₁₂H₂₂O₁₁) + H₂O → Glucose + Fructose (xúc tác H⁺, t°).\n• 1 mol Saccharose thủy phân hoàn toàn tạo ra 1 mol Glucose và 1 mol Fructose.\n• Đem toàn bộ dung dịch sau thủy phân tráng bạc: 1 Glucose tạo 2 Ag; 1 Fructose (trong môi trường kiềm NH₃ chuyển thành glucose) cũng tạo 2 Ag.\n→ TỔNG CỘNG: 1 mol Saccharose thủy phân hoàn toàn cho tối đa 4 mol Ag!",
      "caseStudy": "Công nghiệp sản xuất bánh kẹo và mứt: Thủy phân một phần đường saccharose thành đường nghịch đảo (hỗn hợp glucose + fructose) giúp kẹo không bị lại đường (kết tinh đường thô), giữ bánh kẹo mềm mịn và có độ ngọt thanh tự nhiên.",
      "trap": "BẪY THỰC NGHIỆM ĐỀ THI: Sau khi đun thủy phân saccharose bằng H₂SO₄ loãng, BẮT BUỘC PHẢI TRUNG HÒA ACID DƯ bằng dung dịch kiềm (NaOH hoặc NaHCO₃) trước khi cho thuốc thử tráng bạc AgNO₃/NH₃ vào! Nếu quên trung hòa, môi trường acid sẽ phá hủy phức bạc Tollens và phản ứng tráng bạc thất bại hoàn toàn.",
      "check": {
        "q": "Thuỷ phân hoàn toàn 34,2 gam saccharose trong dung dịch H₂SO₄ loãng đun nóng. Sau đó trung hoà acid bằng NaOH dư rồi cho toàn bộ dung dịch thu được tác dụng với lượng dư AgNO₃ trong NH₃, đun nóng nhẹ. Khối lượng bạc kim loại kết tủa tối đa thu được là:",
        "opts": "A=43,2 gam;B=21,6 gam;C=10,8 gam;D=32,4 gam",
        "a": "A",
        "exp": "Đỉnh cao! n(saccharose) = 34,2 / 342 = 0,1 mol. Thuỷ phân 1 mol saccharose tạo 1 mol glucose và 1 mol fructose. Cả glucose và fructose trong môi trường kiềm đều tráng bạc với tỉ lệ 1 mol đường : 2 mol Ag → 1 mol saccharose cho 4 mol Ag! Do đó n(Ag) = 4 × 0,1 = 0,4 mol → m(Ag) = 0,4 × 108 = 43,2 gam.",
        "hint": "1 mol saccharose thủy phân tạo 1 glucose + 1 fructose. Mỗi chất này tráng bạc tạo 2 Ag. Vậy 1 mol saccharose tạo ra bao nhiêu mol Ag?",
        "breakdown": {
          "A": "ĐÚNG: n(saccharose) = 34,2 / 342 = 0,1 mol. Thủy phân sinh 0,1 mol Glucose + 0,1 mol Fructose. Cả 2 đều tráng bạc (tổng 0,4 mol Ag). Khối lượng Ag = 0,4 × 108 = 43,2 gam.",
          "B": "SAI: Nghĩ rằng chỉ có glucose tráng bạc nên tính ra 21,6 gam (thiếu fructose).",
          "C": "SAI: Tính nhầm saccharose tráng bạc trực tiếp.",
          "D": "SAI: Tính sai phân tử khối của saccharose."
        },
        "mnemonic": "Saccharose thủy phân: 1 mol mẹ sinh 2 con, tráng bạc 1 ăn 4 Ag!"
      }
    }
  ],
  "g12c3": [
    {
      "title": "1. Bản chất Amine, Bậc Amine & Danh pháp chuẩn",
      "hook": "Mùi tanh nồng nặc của cá mè sống làm bạn rùng mình, thủ phạm chính là trimethylamine (CH₃)₃N. Nhưng tại sao khi mẹ nấu canh chua cá với me, cà chua hoặc vắt chanh, mùi tanh lại biến mất hoàn toàn?",
      "predict": {
        "q": "Hợp chất (CH₃)₃C-NH₂ có nhóm -NH₂ gắn vào nguyên tử carbon bậc 3. Theo bạn, hợp chất này thuộc bậc amine nào?",
        "opts": "A=Amine bậc 1 (primary amine);B=Amine bậc 3 (tertiary amine);C=Amine bậc 2;D=Amine bậc 4",
        "a": "A",
        "insight": "Bẫy tư duy kinh điển đã bị bạn hóa giải! Bậc của amine được tính bằng SỐ NGUYÊN TỬ H của NH₃ BỊ THAY THẾ BỞI GỐC HYDROCARBON (tức là số gốc liên kết trực tiếp với Nitrogen), HOÀN TOÀN KHÔNG PHỤ THUỘC VÀO BẬC CỦA NGUYÊN TỬ CARBON! Phân tử (CH₃)₃C-NH₂ chỉ có 1 gốc gắn vào N nên nó là amine bậc 1."
      },
      "core": "Amine sinh ra khi thay thế nguyên tử H trong phân tử NH₃ bằng gốc hydrocarbon.\n• BẬC AMINE = SỐ GỐC HYDROCARBON liên kết trực tiếp với nguyên tử Nitrogen (Bậc 1: R-NH₂; Bậc 2: R-NH-R'; Bậc 3: R-N(R')-R'').\n• Danh pháp:\n  - Tên gốc - chức: Tên gốc alkyl + 'amine' (ví dụ: CH₃NH₂ methylamine, (CH₃)₂NH dimethylamine).\n  - Tên thay thế (IUPAC): Tên hydrocarbon - vị trí - amine (ví dụ: CH₃CH(NH₂)CH₃ propan-2-amine).\n• 4 amine ở thể khí ở điều kiện thường: CH₃NH₂, (CH₃)₂NH, (CH₃)₃N, C₂H₅NH₂ (đều có mùi khai khó chịu, độc, tan rất nhiều trong nước).",
      "caseStudy": "Hóa học khử mùi tanh cá trong ẩm thực: Trimethylamine (CH₃)₃N có tính base yếu và dễ bay hơi. Axit hữu cơ trong chanh (citric acid), giấm (acetic acid) hoặc me (tartaric acid) lập tức trung hòa amine tạo thành muối ammonium không bay hơi tan vào nước canh, khử sạch mùi tanh!",
      "trap": "BẪY TỬ HUYỆT ĐỀ THI: Nhầm lẫn giữa bậc của amine và bậc của alcohol! Hợp chất (CH₃)₃C-NH₂ có nhóm -NH₂ gắn vào carbon bậc 3 nhưng NÓ LÀ AMINE BẬC 1 (vì chỉ có 1 gốc liên kết với N)! Trong khi đó (CH₃)₃C-OH lại là alcohol bậc 3.",
      "check": {
        "q": "Số đồng phân amine bậc 1 ứng với công thức phân tử C₃H₉N là:",
        "opts": "A=2 đồng phân;B=3 đồng phân;C=4 đồng phân;D=1 đồng phân",
        "a": "A",
        "exp": "Chính xác! C₃H₉N có tổng cộng 4 đồng phân amine, nhưng chỉ có 2 đồng phân amine bậc một (chứa nhóm -NH₂): CH₃-CH₂-CH₂-NH₂ (propan-1-amine) và CH₃-CH(NH₂)-CH₃ (propan-2-amine). Hai đồng phân còn lại gồm 1 amine bậc hai và 1 amine bậc ba.",
        "hint": "Amine bậc 1 có dạng R-NH₂. Mạch carbon 3C no có mấy vị trí gắn nhóm -NH₂?",
        "breakdown": {
          "A": "ĐÚNG: Amine bậc 1 có dạng R-NH₂. Gốc propyl C₃H₇- có 2 đồng phân: CH₃CH₂CH₂NH₂ (propylamine) và CH₃CH(NH₂)CH₃ (isopropylamine) → Đúng 2 đồng phân.",
          "B": "SAI: 4 là TỔNG SỐ ĐỒNG PHÂN amine của C₃H₉N (gồm 2 bậc 1, 1 bậc 2, 1 bậc 3). Đề bài chỉ hỏi bậc 1!",
          "C": "SAI: 3 chất là đếm thiếu hoặc nhầm sang C₄H₁₁N.",
          "D": "SAI: Chỉ có 1 chất là quên đồng phân mạch nhánh isopropylamine."
        },
        "mnemonic": "C₃H₉N: '2 bậc Một - 1 bậc Hai - 1 bậc Ba' (Tổng 4). Đề hỏi bậc 1 chọn 2!"
      }
    },
    {
      "title": "2. Tính Base, Quy luật Lực Base & Tương tác Axit",
      "hook": "Cặp electron tự do chưa liên kết trên đỉnh kim tự tháp của nguyên tử Nitrogen chính là 'chiếc nam châm' hút proton H⁺. Chiếc nam châm đó mạnh lên hay yếu đi phụ thuộc hoàn toàn vào các gốc gắn xung quanh N!",
      "predict": {
        "q": "Khi nhúng mẩu giấy quỳ tím ẩm vào dung dịch aniline (C₆H₅NH₂) trong nước, màu sắc của giấy quỳ tím sẽ thay đổi như thế nào?",
        "opts": "A=Quỳ tím chuyển sang màu xanh (vì aniline là amine có tính base);B=Quỳ tím không đổi màu (vẫn giữ nguyên màu tím);C=Quỳ tím chuyển sang màu đỏ rực;D=Quỳ tím bị tẩy trắng mất màu hoàn toàn",
        "a": "B",
        "insight": "Trực giác hoá học đỉnh cao! Aniline có tính base, nhưng vì vòng benzene hút electron rất mạnh làm giảm mật độ điện tích âm trên nguyên tử Nitrogen, khiến lực base của aniline cực kỳ yếu (yếu hơn NH₃ hàng nghìn lần) và KHÔNG ĐỦ SỨC làm đổi màu quỳ tím!"
      },
      "core": "QUY LUẬT LỰC BASE:\n• Gốc alkyl (-CH₃, -C₂H₅) đẩy electron → Tăng mật độ e trên N → Lực base TĂNG (Alkylamine > NH₃).\n• Amine bậc 2 đẩy e mạnh hơn bậc 1: (CH₃)₂NH > CH₃NH₂ > NH₃.\n• Gốc phenyl (C₆H₅-) hút electron do liên hợp pi với vòng benzene → Giảm mạnh mật độ e trên N → Lực base GIẢM THẢM HẠI (Aniline C₆H₅NH₂ < NH₃ hàng nghìn lần).\n• Chỉ thị màu: Các alkylamine làm quỳ tím chuyển xanh và phenolphthalein hóa hồng. Aniline KHÔNG làm đổi màu quỳ tím!",
      "caseStudy": "Phản ứng với Nitrous acid (HNO₂) và tổng hợp phẩm nhuộm: Alkylamine bậc 1 phản ứng giải phóng bọt khí N₂↑ (C₂H₅NH₂ + HNO₂ → C₂H₅OH + N₂↑ + H₂O). Còn Aniline ở 0 - 5°C tạo muối benzenediazonium chloride [C₆H₅-N≡N]⁺Cl⁻, là nguyên liệu cốt lõi tổng hợp phẩm nhuộm azo rực rỡ trong ngành dệt may.",
      "trap": "BẪY PHÁT BIỂU ĐÚNG/SAI: 'Mọi amine đều có tính base và đều làm xanh giấy quỳ tím ẩm' → SAI! Aniline và các arylamine có tính base cực kì yếu, hoàn toàn không làm đổi màu giấy quỳ tím ẩm.",
      "check": {
        "q": "Cho dãy các chất sau: (1) aniline C₆H₅NH₂; (2) ammonia NH₃; (3) methylamine CH₃NH₂; (4) dimethylamine (CH₃)₂NH. Thứ tự sắp xếp theo chiều lực base TĂNG DẦN từ trái sang phải là:",
        "opts": "A=(1) < (2) < (3) < (4);B=(4) < (3) < (2) < (1);C=(1) < (3) < (2) < (4);D=(2) < (1) < (3) < (4)",
        "a": "A",
        "exp": "Chính xác! Gốc phenyl hút electron làm giảm mạnh lực base → (1) Aniline có lực base yếu nhất. Gốc alkyl đẩy electron làm tăng lực base: amine bậc 2 có hai gốc methyl đẩy e mạnh hơn amine bậc 1. Thứ tự lực base tăng dần: C₆H₅NH₂ < NH₃ < CH₃NH₂ < (CH₃)₂NH.",
        "hint": "Gốc phenyl (vòng thơm) hút e làm giảm lực base, gốc alkyl đẩy e làm tăng lực base. Bậc 2 đẩy mạnh hơn bậc 1.",
        "breakdown": {
          "A": "ĐÚNG: Lực base giảm dần: (CH₃)₂NH (bậc 2 no, 2 gốc đẩy e) > CH₃NH₂ (bậc 1 no) > NH₃ > C₆H₅NH₂ (vòng thơm hút e làm lực base cực yếu).",
          "B": "SAI: Đảo ngược hoàn toàn trật tự, xếp aniline mạnh nhất là sai bản chất.",
          "C": "SAI: Xếp amine bậc 1 mạnh hơn bậc 2 là sai.",
          "D": "SAI: Xếp NH₃ mạnh hơn alkylamine là sai."
        },
        "mnemonic": "Lực base amine: Bậc 2 no > Bậc 1 no > NH₃ > Amine thơm (Aniline đội sổ)!"
      }
    },
    {
      "title": "3. Aniline & Hợp chất thơm: Phản ứng thế & Chu trình Tái sinh",
      "hook": "Aniline là một chất lỏng sánh như dầu, để lâu ngoài không khí bị sẫm màu vì oxi hóa. Nhưng chỉ cần nhỏ một giọt nước bromine vào, một cơn bão tuyết kết tủa trắng tinh lập tức xuất hiện che kín ống nghiệm!",
      "predict": {
        "q": "Aniline rất ít tan trong nước lạnh tạo dung dịch vẩn đục. Nếu nhỏ tiếp dung dịch axit HCl vào ống nghiệm, hiện tượng gì sẽ xảy ra?",
        "opts": "A=Ống nghiệm lập tức trở nên trong suốt do tạo muối phenylammonium chloride tan tốt;B=Dung dịch càng vẩn đục hơn và đóng bánh kết tủa màu đen;C=Xuất hiện bọt khí thoát ra sùng sục;D=Dung dịch chuyển sang màu tím hoa cà",
        "a": "A",
        "insight": "Chính xác! Aniline tác dụng với HCl tạo muối ion [C₆H₅NH₃]⁺Cl⁻ tan tốt trong nước, làm dung dịch từ vẩn đục chuyển sang trong suốt. Nếu sau đó nhỏ tiếp NaOH vào, aniline bị đẩy ra và dung dịch lại vẩn đục trở lại!"
      },
      "core": "• Tính chất vật lý: Chất lỏng không màu, sánh, ít tan trong nước lạnh (nặng hơn nước, lắng xuống đáy), rất độc.\n• Phản ứng thế trên nhân thơm: Nhóm -NH₂ hoạt hóa vòng thơm cực mạnh ở vị trí ortho và para: C₆H₅NH₂ + 3Br₂ → C₆H₂Br₃NH₂↓ (2,4,6-tribromoaniline kết tủa trắng) + 3HBr (tương tự phenol, không cần xúc tác Fe).\n• CHU TRÌNH ĐỤC - TRONG - ĐỤC KINH ĐIỂN:\n  1. Aniline trong nước không tan → Dung dịch vẩn đục, phân lớp.\n  2. Nhỏ dung dịch HCl vào → Dung dịch trong suốt do tạo muối C₆H₅NH₃Cl tan tốt.\n  3. Nhỏ tiếp dung dịch NaOH vào → Dung dịch vẩn đục trở lại vì NaOH đẩy aniline không tan tái tạo trở lại!",
      "caseStudy": "Quy trình rửa sạch ống nghiệm dính aniline sau thí nghiệm: Không thể rửa bằng nước lã vì aniline không tan bám chặt thành thủy tinh. Người ta tráng ống nghiệm bằng dung dịch HCl để chuyển thành muối tan, sau đó mới rửa lại bằng nước sạch.",
      "trap": "BẪY PHÂN BIỆT PHENOL VÀ ANILINE: Cả phenol và aniline đều tạo kết tủa trắng với nước bromine và đều không làm đổi màu quỳ tím. Để phân biệt hai chất, dùng dung dịch HCl (aniline tan, phenol không tan) hoặc dung dịch NaOH (phenol tan, aniline không tan)!",
      "check": {
        "q": "Cho aniline tác dụng với nước bromine dư, thu được 9,90 gam kết tủa trắng 2,4,6-tribromoaniline (M = 330). Khối lượng aniline đã tham gia phản ứng là:",
        "opts": "A=2,79 gam;B=3,72 gam;C=1,86 gam;D=4,65 gam",
        "a": "A",
        "exp": "Chính xác tuyệt đối! Số mol kết tủa: n = 9,90 / 330 = 0,03 mol. Phương trình phản ứng thế 3 nguyên tử Bromine: C₆H₅NH₂ + 3Br₂ → C₆H₂Br₃NH₂↓ + 3HBr → n(aniline) = 0,03 mol. Khối lượng aniline tham gia phản ứng: m = 0,03 × 93 = 2,79 gam.",
        "hint": "Tính n(kết tủa) = 9,90 / 330. Tỉ lệ mol giữa aniline và kết tủa là 1:1. Nhân với M của aniline (93).",
        "breakdown": {
          "A": "ĐÚNG: C₆H₅NH₂ + 3 Br₂ → C₆H₂Br₃NH₂↓ + 3 HBr. M(kết tủa) = 330. n(kết tủa) = 9,9 / 330 = 0,03 mol → n(aniline) = 0,03 mol → m = 0,03 × 93 = 2,79 gam.",
          "B": "SAI: Tính nhầm kết tủa là monobromo thay vì tribromo.",
          "C": "SAI: Quên nhân phân tử khối aniline (93).",
          "D": "SAI: Nhầm phân tử khối kết tủa 2,4,6-tribromoaniline (330)."
        },
        "mnemonic": "Aniline thế bromine: 1 ăn 3 Br₂, kết tủa trắng tinh M = 330!"
      }
    },
    {
      "title": "4. Amino Acid: Cấu tạo Ion Lưỡng Cực & Tính chất Lưỡng Tính",
      "hook": "Amino acid là những viên gạch kỳ diệu xây dựng nên sự sống. Điều thú vị là trong cùng một phân tử, chúng vừa mang nhóm acid (-COOH) vừa mang nhóm base (-NH₂). Chúng hòa hợp với nhau như thế nào?",
      "predict": {
        "q": "Ở trạng thái tinh khiết và trong dung dịch nước, amino acid tồn tại chủ yếu dưới dạng nào?",
        "opts": "A=Dạng phân tử trung hoà H₂N-R-COOH;B=Dạng ion lưỡng cực ⁺H₃N-R-COO⁻;C=Dạng cation hoàn toàn;D=Dạng anion hoàn toàn",
        "a": "B",
        "insight": "Hoàn toàn chính xác! Nhóm -COOH có tính acid nhường proton H⁺ cho nhóm -NH₂ có tính base trong cùng phân tử tạo thành ion lưỡng cực. Vì thế amino acid là chất rắn kết tinh, nhiệt độ nóng chảy rất cao và dễ tan trong nước!"
      },
      "core": "• CẤU TRÚC ION LƯỠNG CỰC: Trong phân tử amino acid, proton H⁺ từ nhóm -COOH chuyển sang nhóm -NH₂ tạo thành ion lưỡng cực ⁺H₃N-R-COO⁻. Do đó amino acid là những chất rắn kết tinh không màu, nhiệt độ nóng chảy cao và tan tốt trong nước.\n• Tính chất lưỡng tính (amphoteric): Tác dụng cả với acid mạnh và base mạnh.\n• CÁC α-AMINO ACID TRỌNG TÂM CẦN NHỚ:\n  - Glycine (Gly): H₂N-CH₂-COOH (M=75, 1 -COOH, 1 -NH₂ → Quỳ không đổi màu).\n  - Alanine (Ala): CH₃-CH(NH₂)-COOH (M=89, 1 -COOH, 1 -NH₂ → Quỳ không đổi màu).\n  - Valine (Val): (CH₃)₂CH-CH(NH₂)-COOH (M=117, Quỳ không đổi màu).\n  - Glutamic acid (Glu): HOOC-(CH₂)₂-CH(NH₂)-COOH (M=147, 2 -COOH, 1 -NH₂ → Quỳ hóa ĐỎ).\n  - Lysine (Lys): H₂N-(CH₂)₄-CH(NH₂)-COOH (M=146, 1 -COOH, 2 -NH₂ → Quỳ hóa XANH).",
      "caseStudy": "Gia vị mì chính (bột ngọt): Bột ngọt chính là muối monosodium glutamate (C₅H₈NO₄Na). Tại sao không dùng dạng axit tự do hay muối disodium? Vì chỉ có dạng monosodium mới tương tác hoàn hảo với thụ thể vị giác tạo nên vị ngọt thịt umami đặc trưng.",
      "trap": "BẪY QUỲ TÍM: Không phải mọi amino acid đều có môi trường trung tính! So sánh số nhóm -COOH và -NH₂: Glu có 2 nhóm -COOH > 1 nhóm -NH₂ nên dung dịch có tính axit (quỳ hóa đỏ). Lys có 2 nhóm -NH₂ > 1 nhóm -COOH nên dung dịch có tính base (quỳ hóa xanh)!",
      "check": {
        "q": "Cho các dung dịch amino acid sau có cùng nồng độ mol: Glycine (Gly), Glutamic acid (Glu), Lysine (Lys), Alanine (Ala). Số dung dịch làm giấy quỳ tím chuyển sang màu đỏ là:",
        "opts": "A=1 dung dịch;B=2 dung dịch;C=3 dung dịch;D=0 dung dịch",
        "a": "A",
        "exp": "Chính xác tuyệt đối! Chỉ có duy nhất dung dịch Glutamic acid làm quỳ tím chuyển màu đỏ vì phân tử chứa 2 nhóm -COOH và 1 nhóm -NH₂ (tính acid chiếm ưu thế). Gly và Ala có số nhóm -COOH bằng -NH₂ nên không đổi màu quỳ; còn Lysine có 2 nhóm -NH₂ làm quỳ hóa xanh.",
        "hint": "Dung dịch làm quỳ tím hóa đỏ khi số nhóm -COOH nhiều hơn số nhóm -NH₂.",
        "breakdown": {
          "A": "ĐÚNG: Glutamic acid có 2 nhóm -COOH và 1 nhóm -NH₂ nên tính acid trội hơn, làm quỳ hóa đỏ.",
          "B": "SAI: Lysine có 2 nhóm -NH₂ và 1 nhóm -COOH nên làm quỳ hóa XANH.",
          "C": "SAI: Glycine có 1 -COOH và 1 -NH₂ cân bằng nhau nên KHÔNG đổi màu quỳ.",
          "D": "SAI: Alanine có 1 -COOH và 1 -NH₂ cân bằng nhau nên KHÔNG đổi màu quỳ."
        },
        "mnemonic": "Glu đỏ (thừa acid) - Lys xanh (thừa amine) - Gly/Ala hòa bình giữ nguyên màu!"
      }
    },
    {
      "title": "5. Peptide & Protein: Cấu trúc, Phản ứng Biuret & Sự Đông tụ",
      "hook": "Tại sao khi nấu canh cua, gạch và riêu cua lại đóng thành từng mảng nổi bồng bềnh? Tại sao khi vắt chanh vào sữa đậu nành, nước sữa lại bị vón cục lợn cợn? Đó chính là sự biến tính và đông tụ kỳ diệu của Protein!",
      "predict": {
        "q": "Cho hai chất: Dipeptide Gly-Ala và Tripeptide Gly-Ala-Val tác dụng với Cu(OH)₂ trong môi trường kiềm NaOH. Chất nào sẽ tạo dung dịch có màu tím đặc trưng (phản ứng Biuret)?",
        "opts": "A=Chỉ có tripeptide Gly-Ala-Val tạo màu tím, còn dipeptide Gly-Ala không phản ứng;B=Cả hai chất đều cho màu tím đậm;C=Chỉ có dipeptide Gly-Ala phản ứng;D=Cả hai chất đều tạo kết tủa đỏ gạch",
        "a": "A",
        "insight": "Bẫy điểm 10 quen thuộc! Phản ứng màu Biuret đòi hỏi phân tử phải có TỪ 2 LIÊN KẾT PEPTIDE TRỞ LÊN (tức từ tripeptide trở lên hoặc protein). Dipeptide Gly-Ala chỉ có 1 liên kết peptide nên KHÔNG CÓ phản ứng màu Biuret!"
      },
      "core": "• Liên kết peptide: Liên kết -CO-NH- giữa hai gốc α-amino acid.\n• Phân loại: Dipeptide (2 gốc, 1 liên kết peptide), Tripeptide (3 gốc, 2 liên kết peptide)... Polypeptide (>10 gốc).\n• Protein: Polypeptide cao phân tử (vài vạn đến vài triệu đvC) như Albumin (lòng trắng trứng), Fibroin (tơ tằm).\n• PHẢN ỨNG MÀU BIURET: Trong môi trường kiềm, peptit có từ HAI LIÊN KẾT PEPTIDE TRỞ LÊN (từ TRIPEPTIDE trở lên) hoặc protein tác dụng với Cu(OH)₂ tạo hợp chất màu tím đặc trưng.\n• Sự đông tụ protein: Dưới tác dụng của nhiệt độ cao, acid, base hoặc ion kim loại nặng, cấu trúc bậc cao của protein bị phá vỡ, làm protein kết tụ lại.",
      "caseStudy": "Kỹ thuật nấu riêu cua và làm đậu phụ truyền thống: Đun sôi canh cua làm protein cua bị nhiệt đông tụ đóng bánh riêu. Khi nấu sữa đậu nành, người làm đậu thêm nước chua (acid lactic) hoặc thạch cao (CaSO₄) để làm đông tụ protein đậu nành thành những khối đậu phụ mềm béo.",
      "trap": "BẪY TỬ HUYỆT ĐỀ THI: 'Mọi peptide đều tham gia phản ứng màu Biuret' → SAI HOÀN TOÀN! Dipeptide (như Gly-Ala) CHỈ CÓ 1 LIÊN KẾT PEPTIDE nên KHÔNG PHẢN ỨNG với Cu(OH)₂. Phải từ tripeptide trở lên mới cho màu tím!",
      "check": {
        "q": "Cho các chất sau: (1) Gly-Ala; (2) Gly-Ala-Val; (3) Lòng trắng trứng (albumin); (4) Triolein. Số chất cho phản ứng màu Biuret khi tác dụng với Cu(OH)₂ trong môi trường kiềm là:",
        "opts": "A=2 chất;B=1 chất;C=3 chất;D=4 chất",
        "a": "A",
        "exp": "Chính xác tuyệt đối! Điều kiện tham gia phản ứng màu Biuret là phân tử phải chứa từ 2 liên kết peptide trở lên (từ tripeptide trở lên hoặc protein). Gly-Ala là dipeptide chỉ có 1 liên kết peptide nên không phản ứng! Triolein là chất béo este. Vậy chỉ có 2 chất tham gia là (2) Gly-Ala-Val và (3) Lòng trắng trứng.",
        "hint": "Nhớ điều kiện phản ứng Biuret: Cần tối thiểu 2 liên kết peptide (từ tripeptit trở lên) hoặc protein.",
        "breakdown": {
          "A": "ĐÚNG: Gồm 3 chất là (2) Gly-Ala-Val (tripeptide), (3) Lòng trắng trứng (protein) và (4) Gelatin (protein). Riêng (1) Gly-Ala là dipeptide chỉ có 1 liên kết peptide nên KHÔNG CÓ phản ứng Biuret.",
          "B": "SAI: Tính cả (1) Gly-Ala là dính bẫy dipeptide kinh điển.",
          "C": "SAI: Bỏ sót protein lòng trắng trứng hoặc gelatin.",
          "D": "SAI: Bỏ sót tripeptide Gly-Ala-Val."
        },
        "mnemonic": "Dipeptide chỉ 1 khớp nối: CẤM ĐƯỢC MƠ MÀU TÍM BIURET! Phải từ Tripeptide trở lên!"
      }
    },
    {
      "title": "6. Vận dụng Định lượng & Phân tích Đa điều kiện (Thủy phân Peptide)",
      "hook": "Thủy phân một phân tử peptide giống như tháo rời từng toa tàu hỏa. Mỗi khớp nối peptide bị bẻ gãy cần đúng 1 phân tử nước hoặc 1 phân tử NaOH. Định luật bảo toàn số mắt xích giúp giải quyết bài toán thủy phân peptide siêu tốc!",
      "predict": {
        "q": "Khi thuỷ phân hoàn toàn 1 mol tripeptide mạch hở X bằng dung dịch NaOH vừa đủ, lượng H₂O sinh ra sau phản ứng là bao nhiêu mol?",
        "opts": "A=Đúng 1 mol H₂O (sinh ra từ đầu -COOH tự do duy nhất của peptide);B=3 mol H₂O (vì có 3 gốc amino acid);C=2 mol H₂O (vì có 2 liên kết peptide);D=Hoàn toàn không có H₂O sinh ra",
        "a": "A",
        "insight": "Chìa khoá vàng giải toán peptide! Tripeptide tác dụng với 3 NaOH nhưng chỉ sinh ra đúng 1 phân tử H₂O từ nhóm -COOH ở đầu C của chuỗi peptide: Tripeptit + 3NaOH → 3 Muối + 1 H₂O!"
      },
      "core": "CÔNG THỨC VÀNG THỦY PHÂN PEPTIDE BẰNG KIỀM:\n• Thủy phân bằng NaOH: Peptide (k-peptit) + k NaOH → Hỗn hợp muối của amino acid + 1 H₂O.\n  LƯU Ý VÀNG: Luôn chỉ sinh ra đúng 1 mol H₂O (từ nhóm -COOH tự do ở đầu C của peptide)!\n• Định luật bảo toàn khối lượng toàn hệ:\n  m(chất rắn khan) = m(peptide) + m(NaOH ban đầu) - m(H₂O sinh ra).\n• Phân tử khối peptide tạo từ các α-amino acid no: M(k-peptit) = Tổng M(các amino acid) - (k - 1) × 18.",
      "caseStudy": "Quá trình tiêu hóa protein trong cơ thể người: Trong dạ dày ở môi trường axit HCl pH 1,5 - 2, enzyme pepsin cắt các liên kết peptide dài thành các đoạn peptide ngắn; sau đó xuống ruột non, enzyme trypsin thủy phân triệt để thành các amino acid đơn lẻ để hấp thu vào máu.",
      "trap": "BẪY TÍNH CHẤT RẮN KHAN VÀ NAOH DƯ: Đề bài thường cho dùng dung dịch NaOH DƯ. Khi cô cạn dung dịch sau phản ứng, chất rắn khan thu được gồm CẢ MUỐI VÀ NAOH DƯ. Sử dụng bảo toàn khối lượng toàn hệ với m(NaOH ban đầu) là cách giải ngắn nhất và không bao giờ bị nhầm lẫn!",
      "check": {
        "q": "Thuỷ phân hoàn toàn 0,1 mol tripeptide Ala-Gly-Val bằng 400 mL dung dịch NaOH 1M (dùng dư). Sau khi phản ứng hoàn toàn, cô cạn cẩn thận dung dịch thu được m gam chất rắn khan. Biết nguyên tử khối: Ala = 89; Gly = 75; Val = 117. Giá trị của m là:",
        "opts": "A=38,7 gam;B=34,7 gam;C=40,5 gam;D=36,9 gam",
        "a": "A",
        "exp": "Đỉnh cao tuyệt đối! M(tripeptide) = 89 + 75 + 117 - 2 × 18 = 245 → m(peptit) = 0,1 × 245 = 24,5 gam. Lượng NaOH ban đầu: n(NaOH) = 0,4 × 1 = 0,4 mol → m(NaOH ban đầu) = 0,4 × 40 = 16,0 gam. Trong phản ứng thủy phân peptide bằng kiềm: n(H₂O sinh ra) = n(peptit) = 0,1 mol → m(H₂O) = 0,1 × 18 = 1,8 gam. Bảo toàn khối lượng toàn hệ: m(chất rắn khan) = m(peptit) + m(NaOH ban đầu) - m(H₂O) = 24,5 + 16,0 - 1,8 = 38,7 gam.",
        "hint": "M(tripeptit) = 89 + 75 + 117 - 36 = 245. n(H₂O) luôn bằng n(peptit) = 0,1 mol. Bảo toàn khối lượng: m(rắn) = m(peptit) + m(NaOH bđ) - m(H₂O).",
        "breakdown": {
          "A": "ĐÚNG: Tripeptide Ala-Gly-Val (0,1 mol) phản ứng với 3 NaOH → sinh 0,3 mol muối + 0,1 mol H₂O. n(NaOH dư) = 0,4 - 0,3 = 0,1 mol. Bảo toàn khối lượng: m(chất rắn) = m(peptide) + m(NaOH ban đầu) - m(H₂O) = 21,7 + 0,4 × 40 - 0,1 × 18 = 35,9 gam.",
          "B": "SAI: Quên không tính lượng NaOH dư nằm trong chất rắn khan.",
          "C": "SAI: Quên trừ đi khối lượng H₂O sinh ra khi cô cạn.",
          "D": "SAI: Lấy nhầm số mol NaOH phản ứng là 0,1 mol thay vì 0,3 mol."
        },
        "mnemonic": "Thủy phân peptide trong kiềm: n(H₂O) luôn bằng n(peptide). Cô cạn nhớ tính cả kiềm dư!"
      }
    }
  ],
  "g11c1": [
    {
      "title": "1. Trực giác liên kết pi & Tính không no",
      "hook": "Hydrocarbon no (alkane) như những người đã no bụng, chỉ có liên kết đơn bền vững. Còn alkene và alkyne giống như chiếc bẫy mở, chứa liên kết π kém bền luôn thèm muốn phản ứng cộng để trở về trạng thái no bền vững.",
      "predict": {
        "q": "Theo bạn, chất nào sau đây có khả năng làm mất màu dung dịch nước bromine ở nhiệt độ phòng?",
        "opts": "A=Ethylene (CH₂=CH₂);B=Ethane (CH₃-CH₃);C=Methane (CH₄);D=Propane (CH₃-CH₂-CH₃)",
        "a": "A",
        "insight": "Chính xác! Ethylene có liên kết đôi C=C chứa liên kết pi kém bền nên lập tức cộng Br₂ làm mất màu nâu đỏ của nước bromine."
      },
      "core": "Công thức chung: Alkene CₙH₂ₙ (n≥2), Alkyne CₙH₂ₙ₋₂ (n≥2). Phản ứng đặc trưng nhất là phản ứng CỘNG (cộng H₂, cộng halogen Br₂, cộng HX, cộng H₂O làm đứt liên kết pi).",
      "caseStudy": "Khí ethylene làm chín trái cây: Ethylene (C₂H₄) là hormone thực vật tự nhiên điều hòa quá trình chín của quả và rụng lá. Trong thương mại, người ta dùng khí ethylene nồng độ thấp để thúc quả chín đều và có màu sắc đẹp mắt.",
      "trap": "Cẩn thận: Alkyne có 2 liên kết π, có thể cộng theo 2 nấc tỉ lệ 1:1 hoặc 1:2 tuỳ thuộc lượng chất và xúc tác (Lindlar tạo anken, Ni tạo ankan).",
      "check": {
        "q": "Chất nào sau đây làm mất màu dung dịch nước bromine ở nhiệt độ thường?",
        "opts": "A=Ethylene (C₂H₄);B=Propane (C₃H₈);C=Methane (CH₄);D=Hexane (C₆H₁₄)",
        "a": "A",
        "hint": "Hãy tìm chất có chứa liên kết đôi hoặc liên kết ba kém bền (hydrocarbon không no).",
        "exp": "Ethylene có liên kết đôi C=C nên lập tức cộng Br₂ làm mất màu nâu đỏ. Các chất còn lại chỉ chứa liên kết đơn nên không phản ứng.",
        "breakdown": {
          "A": "SAI: Khí ethylene có nhiệt độ ngọn lửa cháy không đủ cao như acetylene.",
          "B": "SAI: Khí ethane là alkane, ngọn lửa cháy tỏa nhiệt không tập trung bằng acetylene.",
          "C": "SAI: Khí methane dùng làm nhiên liệu dân dụng và công nghiệp, không dùng làm đèn xì hàn cắt kim loại.",
          "D": "ĐÚNG: Acetylene (C₂H₂) cháy trong khí oxy cho ngọn lửa đèn xì oxy-acetylene đạt tới 3000°C, đủ làm nóng chảy kim loại."
        },
        "mnemonic": "Hàn xì kim loại: Cắt thép dùng đèn xì Acetylene (C₂H₂) nhiệt độ 3000°C!"
      }
    },
    {
      "title": "2. Quy tắc Markovnikov — 'Giàu càng thêm giàu'",
      "hook": "Tưởng tượng một bàn tiệc: người nào đã có nhiều quả bóng thì sẽ được tặng thêm bóng. Trong hóa học hữu cơ, nguyên tử hydrogen (H) ưu tiên đi vào carbon có nhiều H hơn.",
      "predict": {
        "q": "Khi propene (CH₂=CH-CH₃) cộng hợp với HCl, nguyên tử Hydrogen (H) sẽ ưu tiên gắn vào nguyên tử carbon nào?",
        "opts": "A=Carbon CH₂ ở đầu mạch (nhiều H hơn, tuân theo quy tắc Markovnikov);B=Carbon CH ở giữa mạch (ít H hơn);C=Carbon CH₃ cuối mạch;D=Phân bố đều ngẫu nhiên 50/50",
        "a": "A",
        "insight": "Chuẩn xác! Quy tắc Markovnikov: Trong phản ứng cộng HX vào alkene bất đối xứng, H ưu tiên đi vào carbon mang nối đôi có nhiều H hơn (giàu càng thêm giàu)."
      },
      "core": "Khi cộng HX hoặc H₂O vào alkene bất đối xứng: H gắn vào carbon mang nối đôi có NHIỀU H hơn (cho sản phẩm chính), còn X (hoặc OH) gắn vào carbon có ÍT H hơn.",
      "caseStudy": "Tổng hợp công nghiệp dung môi Isopropyl alcohol (IPA): Hydrat hóa propene (CH₂=CH-CH₃) với xúc tác acid H₃PO₄ tuân theo Markovnikov cho sản phẩm chính là propan-2-ol dùng làm cồn sát trùng y tế và dung môi lau rửa vi mạch điện tử.",
      "trap": "Bẫy đề thi: Nếu alkene đối xứng (như but-2-ene CH₃-CH=CH-CH₃), phản ứng cộng chỉ cho 1 sản phẩm duy nhất, không phân biệt sản phẩm chính/phụ.",
      "check": {
        "q": "Cho propene (CH₂=CH-CH₃) tác dụng với HCl, sản phẩm chính thu được là:",
        "opts": "A=2-chloropropane (CH₃-CHCl-CH₃);B=1-chloropropane (CH₃-CH₂-CH₂Cl);C=1,2-dichloropropane;D=2,2-dichloropropane",
        "a": "A",
        "hint": "Carbon CH₂ có 2H, carbon CH chỉ có 1H. H của HCl sẽ đi vào đâu để tuân theo Markovnikov?",
        "exp": "H gắn vào CH₂ (nhiều H hơn) thành CH₃, Cl gắn vào CH (ít H hơn) thành CHCl → 2-chloropropane là sản phẩm chính.",
        "breakdown": {
          "A": "ĐÚNG: Propane là alkane chỉ có liên kết đơn C-C và C-H bền vững, không phản ứng với nước bromine ở điều kiện thường.",
          "B": "SAI: Propylene có liên kết đôi C=C làm mất màu nước bromine nhanh chóng.",
          "C": "SAI: Propyne có liên kết ba C≡C làm mất màu nước bromine.",
          "D": "SAI: Styrene có liên kết đôi ở nhánh vinyl làm mất màu nước bromine."
        },
        "mnemonic": "Hydrocarbon no (Alkane) trơ lì với dung dịch Bromine ở điều kiện thường!"
      }
    },
    {
      "title": "3. Nhận biết Alk-1-yne đầu mạch",
      "hook": "Chỉ các alkyne có liên kết ba nằm ở ĐẦU MẠCH (chứa nguyên tử H linh động gắn trực tiếp vào C≡C) mới có đặc quyền thay thế H bằng nguyên tử bạc Ag.",
      "predict": {
        "q": "Trong các hydrocarbon sau, chất nào có thể tạo kết tủa màu vàng nhạt khi tác dụng với dung dịch AgNO₃ trong NH₃?",
        "opts": "A=But-1-yne (CH≡C-CH₂-CH₃);B=But-2-yne (CH₃-C≡C-CH₃);C=Ethylene (CH₂=CH₂);D=Butane (C₄H₁₀)",
        "a": "A",
        "insight": "Chính xác! Chỉ các alkyne có liên kết ba ở đầu mạch (alk-1-yne) mới có nguyên tử H linh động gắn vào C≡C để thế bằng ion Ag⁺ tạo kết tủa vàng nhạt."
      },
      "core": "Alk-1-yne + AgNO₃/NH₃ → Kết tủa vàng nhạt RC≡CAg↓. Phản ứng này dùng để phân biệt alk-1-yne với các alkyne giữa mạch (như but-2-yne) và alkene.",
      "caseStudy": "Ứng dụng khí acetylene (C₂H₂) trong hàn cắt kim loại: Ngọn lửa oxy-acetylene đạt nhiệt độ lên đến 3000°C nhờ nhiệt lượng tỏa ra cực lớn, đủ để cắt đứt các thanh thép dày trong đóng tàu và xây dựng.",
      "trap": "Rất nhiều bạn nhầm đây là phản ứng tráng bạc. Không phải! Đây là phản ứng THẾ ion kim loại Ag⁺ vào H đầu mạch, tạo kết tủa vàng chứ không tạo gương bạc Ag sáng bóng.",
      "check": {
        "q": "Chất nào sau đây tạo kết tủa vàng khi tác dụng với dung dịch AgNO₃ trong NH₃?",
        "opts": "A=But-1-yne (CH≡C-CH₂-CH₃);B=But-2-yne (CH₃-C≡C-CH₃);C=Ethylene (CH₂=CH₂);D=Propane (C₃H₈)",
        "a": "A",
        "hint": "Tìm chất có liên kết ba ở vị trí số 1 (đầu mạch C≡CH).",
        "exp": "But-1-yne có nhóm C≡CH ở đầu mạch nên nguyên tử H linh động bị thay thế bởi ion Ag⁺ tạo kết tủa vàng nhạt.",
        "breakdown": {
          "A": "ĐÚNG: Khối lượng mol C₂H₂ = 26 < không khí (≈29) nên acetylene NHẸ HƠN không khí (phát biểu nói nặng hơn là SAI).",
          "B": "SAI: Hexane là chất lỏng nhẹ hơn nước và không tan trong nước (phát biểu đúng).",
          "C": "SAI: Methane (M=16) có nhiệt độ sôi thấp hơn ethane (M=30) (phát biểu đúng).",
          "D": "SAI: Hex-1-ene là chất lỏng không tan trong nước (phát biểu đúng)."
        },
        "mnemonic": "M(C₂H₂) = 26 < 29: Acetylene bay lên vì nhẹ hơn không khí!"
      }
    }
  ]
};
  /* ---------- DATA ACCESS ---------- */
  function bankForGrade(gradeID) {
    var qb = DATA.qb || {};
    var parts = [];
    if (gradeID === "g11" || gradeID === "all") parts = parts.concat(qb.g11a || [], qb.g11b || []);
    if (gradeID === "g12" || gradeID === "all") parts = parts.concat(qb.g12 || [], qb.g12c3 || []);
    return parts;
  }
  function chaptersForGrade(gradeID) {
    return (DATA.chapters || []).filter(function (c) { return gradeID === "all" || c.grade === gradeID; });
  }
  function chapterById(id) { return DATA[id]; }
  function chapterMeta(id) {
    for (var i = 0; i < (DATA.chapters || []).length; i++) {
      if (DATA.chapters[i].id === id) return DATA.chapters[i];
    }
    return null;
  }

  /* ---------- APP STATE ---------- */
  var state = {
    theme: localStorage.getItem("hoa11_12_theme") || "light",
    mode: "theory", // "theory" | "practice" | "guided" | "coach_test" | "library"
    grade: "all",
    tab: "flash",
    chapter: null,
    bank: {},
    test: null,
    flash: null,
    lib: "fav",
    editMode: localStorage.getItem("hoa11_12_edit_mode") === "true",
    perfMode: localStorage.getItem("hoa11_12_perf") !== "gpu",
    guided: { ch: "g12c1", stageIdx: 0, checked: false, pickedOpt: null },
    coachTest: { testId: null, t: null, i: 0, picked: null, answers: {}, helped: {}, showPalette: false, showTheoryPeek: false, done: false, filterGrade: "all", searchQuery: "" },
    modal: null
  };

  function setGrade(g) { state.grade = g; state.chapter = null; window.scrollTo({ top: 0, behavior: "smooth" }); render(false); }
  function setMode(m) { state.mode = m; state.chapter = null; window.scrollTo({ top: 0, behavior: "smooth" }); render(false); }
  function setTab(t) { state.tab = t; render(); }
  function setLib(l) { state.lib = l; renderLibraryOnly(); }
  function toggleEditMode() {
    state.editMode = !state.editMode;
    try { localStorage.setItem("hoa11_12_edit_mode", state.editMode ? "true" : "false"); } catch(e){}
    if (state.editMode) {
      document.body.classList.add("edit-mode-active");
      showMiniToast(ico("edit") + " BẬT chế độ sửa: Nhấp thẳng vào chữ để gõ sửa");
    } else {
      document.body.classList.remove("edit-mode-active");
      showMiniToast(ico("close") + " Đã TẮT chế độ sửa");
    }
    render(true);
  }
  function togglePerfMode() {
    state.perfMode = !state.perfMode;
    try { localStorage.setItem("hoa11_12_perf", state.perfMode ? "perf" : "gpu"); } catch(e){}
    if (window.setPerformanceMode) {
      window.setPerformanceMode(state.perfMode);
    }
    renderShell();
  }

  function applyTheme(t) {
    state.theme = t || "light";
    document.documentElement.setAttribute("data-theme", state.theme);
    try { localStorage.setItem("hoa11_12_theme", state.theme); } catch (e) {}
  }

  function toggleTheme() {
    var next = state.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    renderShell();
    showMiniToast(next === "dark" ? ico("moon") + " Đã bật chế độ Tối (Dark Mode)" : ico("sun") + " Đã bật chế độ Sáng (Light Mode)");
  }

  /* ---------- RENDER SHELL & MOBILE NAV ---------- */
  var headerEl;
  var mobileNavEl;

  function renderMobileNav() {
    if (typeof document === "undefined") return;
    if (!mobileNavEl) {
      mobileNavEl = document.getElementById("mobileNav");
      if (!mobileNavEl) {
        mobileNavEl = document.createElement("nav");
        mobileNavEl.id = "mobileNav";
        mobileNavEl.className = "mobile-nav";
        mobileNavEl.setAttribute("aria-label", "Điều hướng chính trên di động");
        document.body.appendChild(mobileNavEl);
      }
    }
    var m = state.mode;
    var navItems = [
      { id: "theory", l: "Lý thuyết", i: "book" },
      { id: "practice", l: "Luyện tập", i: "pen" },
      { id: "guided", l: "Feynman", i: "bulb" },
      { id: "coach_test", l: "Kiểm tra", i: "target" },
      { id: "library", l: "Thư viện", i: "star" }
    ];
    mobileNavEl.innerHTML = navItems.map(function (x) {
      var active = (m === x.id) ? " on" : "";
      return '<button class="mnav-item' + active + '" data-act="mode" data-m="' + x.id + '" aria-label="' + esc(x.l) + '">' +
        '<span class="mnav-icon">' + ico(x.i) + '</span>' +
        '<span class="mnav-label">' + esc(x.l) + '</span>' +
      '</button>';
    }).join("");
  }

  function renderShell() {
    var s = profile();
    var g = state.grade;
    var gradeChips = [
      { id: "g11", l: "Hoá 11 · HK2" },
      { id: "g12", l: "Hoá 12 · HK1" },
      { id: "all", l: "Cả hai lớp" }
    ].map(function (x) {
      return '<button class="chip ' + (g === x.id ? "on" : "") + '" data-act="grade" data-g="' + x.id + '">' + x.l + "</button>";
    }).join("");

    var modeTabs = [
      { id: "theory", l: "Lý thuyết", i: "book" },
      { id: "practice", l: "Luyện tập", i: "pen" },
      { id: "guided", l: "Học có hướng dẫn", i: "bulb" },
      { id: "coach_test", l: "Kiểm tra có hướng dẫn", i: "target" },
      { id: "library", l: "Thư viện", i: "star" }
    ].map(function (x) {
      return '<button class="tab' + (state.mode === x.id ? " on" : "") + '" data-act="mode" data-m="' + x.id + '">' + ico(x.i) + x.l + "</button>";
    }).join("");

    var editToggleBtn = '<button class="edit-chip ' + (state.editMode ? "on" : "") + '" data-act="toggleEditMode" title="Bật/Tắt chế độ chỉnh sửa toàn ứng dụng">' +
      ico("pen") + ' Chế độ sửa: <b>' + (state.editMode ? "BẬT" : "TẮT") + '</b></button>';

    headerEl.innerHTML =
      '<div class="hd-row top">' +
        '<a class="brand" data-act="home" href="#" role="button" aria-label="Về trang chủ">' +
          '<span class="brand-mark">' + ico("flask") + "</span>" +
          '<span class="brand-txt"><b>Hoá 11–12</b><small>Học sâu · Nhớ lâu · Tự chủ</small></span>' +
        "</a>" +
        '<div class="stats">' +
          '<button class="stat pill theme-toggle-btn" data-act="toggleTheme" title="Chuyển chế độ Giao diện Sáng / Tối">' +
            (state.theme === "dark" ? ico("sun") + ' <small>Sáng</small>' : ico("moon") + ' <small>Tối</small>') +
          '</button>' +
          editToggleBtn +
          '<span class="stat pill cloud-pill ' + cloudSyncStatus + '" id="cloudSyncStatus" data-act="cloudSyncNow" title="Cơ sở dữ liệu Vercel cá nhân (Nhấp để đồng bộ ngay)">' + ico("cloud") + ' <small id="cloudSyncText">' + cloudSyncLabel() + '</small></span>' +
          '<span class="stat pill" title="Điểm luyện tập">' + ico("flame") + ' <b data-xp>' + s.xp + '</b> <i>XP</i></span>' +
          '<span class="stat pill" title="Số ngày luyện liên tiếp">' + ico("cal") + ' <b data-streak>' + s.streak.days + '</b> <i>ngày</i></span>' +
        "</div>" +
      "</div>" +
      '<div class="hd-row mid">' +
        '<div class="grade-group">' + gradeChips + "</div>" +
        '<div class="mode-group">' + modeTabs + "</div>" +
      "</div>";
    headerEl.classList.add("has");
    renderMobileNav();
  }

  /* ---------- EDIT TOOLBAR & PROMPTS ---------- */
  function renderEditPromptBar(sectionName) {
    if (state.editMode) return "";
    return '<div class="edit-prompt-bar">' +
      '<div class="ep-left">' +
        '<span class="ep-icon">' + ico("bulb") + '</span>' +
        '<span>Bạn muốn chỉnh sửa, xoá hoặc tạo thêm <b>' + esc(sectionName) + '</b> mới?</span>' +
      '</div>' +
      '<button class="btn-go-edit" data-act="toggleEditMode">' +
        ico("pen") + ' Bật Chế độ Sửa ngay →' +
      '</button>' +
    '</div>';
  }

  function renderFab() {
    return '<button class="fab-edit ' + (state.editMode ? "on" : "") + '" data-act="toggleEditMode" title="Nhấp để Bật/Tắt Chế độ chỉnh sửa trên toàn ứng dụng">' +
      '<span class="fab-icon">' + ico("pen") + '</span>' +
      '<span class="fab-body">' +
        '<span class="fab-title">Chế độ chỉnh sửa</span>' +
        '<span class="fab-sub">Trạng thái: <b>' + (state.editMode ? "ĐANG BẬT" : "ĐANG TẮT") + '</b></span>' +
      '</span>' +
      '<span class="fab-switch-track ' + (state.editMode ? "on" : "") + '"><span class="fab-switch-thumb"></span></span>' +
    '</button>';
  }

  function renderEditToolbar() {
    if (!state.editMode) return "";
    return '<div class="edit-toolbar" data-od-id="edit-toolbar">' +
      '<div class="edit-info">' +
        '<span class="edit-live-badge"><span class="live-dot"></span> SỬA TRỰC TIẾP ĐANG BẬT</span>' +
        '<span class="edit-desc">Nhấp thẳng vào bất kỳ chữ nào để gõ sửa trực tiếp. Thay đổi được tự động lưu.</span>' +
      '</div>' +
      '<div class="edit-actions">' +
        '<button class="btn-edit-action" data-act="exportData" title="Tải file dữ liệu JSON về máy">' +
          ico("download") + ' Xuất JSON' +
        '</button>' +
        '<button class="btn-edit-action" data-act="importDataPrompt" title="Nhập file dữ liệu JSON từ máy">' +
          ico("upload") + ' Nhập JSON' +
        '</button>' +
        '<button class="btn-edit-action warn" data-act="resetDefaultData" title="Khôi phục nội dung ban đầu">' +
          ico("refresh") + ' Khôi phục gốc' +
        '</button>' +
        '<button class="btn-edit-action close" data-act="toggleEditMode" title="Tắt chế độ chỉnh sửa">' +
          ico("close") + ' Xong' +
        '</button>' +
        '<input type="file" id="importJsonInput" accept=".json" style="display:none">' +
      '</div>' +
    '</div>';
  }

    /* ---------- MINI TOAST & INLINE EDITING ENGINE ---------- */
  function showMiniToast(msg) {
    var old = document.getElementById("miniToast");
    if (old && old.parentNode) old.parentNode.removeChild(old);
    var toast = document.createElement("div");
    toast.id = "miniToast";
    toast.className = "mini-toast";
    toast.innerHTML = msg;
    document.body.appendChild(toast);
    setTimeout(function () {
      if (toast && toast.parentNode) toast.parentNode.removeChild(toast);
    }, 2200);
  }

  function handleInlineSave(el) {
    var type = el.getAttribute("data-inline-edit");
    var chId = el.getAttribute("data-ch");
    var idx = parseInt(el.getAttribute("data-idx"), 10);
    var val = (el.innerText || "").trim();
    var ch = DATA[chId] || {};
    var changed = false;

    switch (type) {
      case "ch-feynman":
        if (ch.feynman !== val) { ch.feynman = val; changed = true; }
        break;
      case "note-title":
        if (ch.notes && ch.notes[idx] && ch.notes[idx].t !== val) {
          ch.notes[idx].t = val; changed = true;
        }
        break;
      case "note-body":
        if (ch.notes && ch.notes[idx] && ch.notes[idx].b !== val) {
          ch.notes[idx].b = val; changed = true;
        }
        break;
      case "ex-q":
        if (ch.exercises && ch.exercises[idx] && ch.exercises[idx].q !== val) {
          ch.exercises[idx].q = val; changed = true;
        }
        break;
      case "ex-ans":
        if (ch.exercises && ch.exercises[idx] && (ch.exercises[idx].ans || ch.exercises[idx].a) !== val) {
          ch.exercises[idx].ans = val; changed = true;
        }
        break;
      case "flash-q": {
        var isCust = el.getAttribute("data-custom") === "true";
        if (isCust && ch.customFlashcards && ch.customFlashcards[idx]) {
          ch.customFlashcards[idx].q = val; changed = true;
        } else if (DEFAULT_ATOMIC_FLASHCARDS[chId] && DEFAULT_ATOMIC_FLASHCARDS[chId][idx]) {
          DEFAULT_ATOMIC_FLASHCARDS[chId][idx].q = val; changed = true;
        }
        break;
      }
      case "flash-a": {
        var isCust = el.getAttribute("data-custom") === "true";
        if (isCust && ch.customFlashcards && ch.customFlashcards[idx]) {
          ch.customFlashcards[idx].a = val; changed = true;
        } else if (DEFAULT_ATOMIC_FLASHCARDS[chId] && DEFAULT_ATOMIC_FLASHCARDS[chId][idx]) {
          DEFAULT_ATOMIC_FLASHCARDS[chId][idx].a = val; changed = true;
        }
        break;
      }
      case "flash-note": {
        var isCust = el.getAttribute("data-custom") === "true";
        if (isCust && ch.customFlashcards && ch.customFlashcards[idx]) {
          ch.customFlashcards[idx].note = val; changed = true;
        } else if (DEFAULT_ATOMIC_FLASHCARDS[chId] && DEFAULT_ATOMIC_FLASHCARDS[chId][idx]) {
          DEFAULT_ATOMIC_FLASHCARDS[chId][idx].note = val; changed = true;
        }
        break;
      }
      case "qb-q": {
        var qList = (DATA.qb && (DATA.qb[chId] || DATA.qb.g11a || DATA.qb.g12a)) || [];
        if (qList[idx] && qList[idx].q !== val) {
          qList[idx].q = val; changed = true;
        }
        break;
      }
      case "qb-e": {
        var qList = (DATA.qb && (DATA.qb[chId] || DATA.qb.g11a || DATA.qb.g12a)) || [];
        if (qList[idx] && qList[idx].e !== val) {
          qList[idx].e = val; changed = true;
        }
        break;
      }
      case "guided-hook": {
        var stgs = (ch && ch.guidedStages) || DEFAULT_GUIDED_STAGES[chId] || [];
        if (stgs[idx] && stgs[idx].hook !== val) {
          stgs[idx].hook = val; ch.guidedStages = stgs; changed = true;
        }
        break;
      }
      case "guided-core": {
        var stgs = (ch && ch.guidedStages) || DEFAULT_GUIDED_STAGES[chId] || [];
        if (stgs[idx] && stgs[idx].core !== val) {
          stgs[idx].core = val; ch.guidedStages = stgs; changed = true;
        }
        break;
      }
      case "guided-trap": {
        var stgs = (ch && ch.guidedStages) || DEFAULT_GUIDED_STAGES[chId] || [];
        if (stgs[idx] && stgs[idx].trap !== val) {
          stgs[idx].trap = val; ch.guidedStages = stgs; changed = true;
        }
        break;
      }
      case "guided-case": {
        var stgs = (ch && ch.guidedStages) || DEFAULT_GUIDED_STAGES[chId] || [];
        if (stgs[idx] && stgs[idx].caseStudy !== val) {
          stgs[idx].caseStudy = val; ch.guidedStages = stgs; changed = true;
        }
        break;
      }
      case "test-q": {
        var tid = el.getAttribute("data-tid");
        var tObj = (DATA.tests || []).find(function (t) { return t.id === tid; });
        if (tObj && tObj.qs && tObj.qs[idx] && tObj.qs[idx].q !== val) {
          tObj.qs[idx].q = val; changed = true;
        }
        break;
      }
    }

    if (changed) {
      saveCustomData();
      el.classList.add("inline-edit-success");
      setTimeout(function () { el.classList.remove("inline-edit-success"); }, 1200);
      showMiniToast(ico("check") + " Đã lưu thay đổi trực tiếp");
    }
  }

  /* ---------- MAIN RENDER (WITH SCROLL PRESERVATION) ---------- */
  function render(keepScroll) {
    var prevY = (keepScroll !== false && typeof window !== "undefined") ? window.scrollY : 0;
    renderShell();
    var out = renderEditToolbar();
    if (state.mode === "theory") out += renderTheory();
    else if (state.mode === "guided") out += renderGuided();
    else if (state.mode === "coach_test") out += renderCoachTest();
    else if (state.mode === "library") out += renderLibrary();
    else out += renderPractice();

    out += renderFab();
    if (state.modal) out += renderModal(state.modal);

    $("#app").innerHTML = out;
    var s = profile();
    var x = $("[data-xp]"); if (x) x.textContent = s.xp;
    var st = $("[data-streak]"); if (st) st.textContent = s.streak.days;

    // PRESERVE SCROLL POSITION: Never arbitrarily pull scrollbar to top!
    if (keepScroll !== false && prevY > 0) {
      window.scrollTo({ top: prevY, behavior: "instant" });
    } else if (keepScroll === false) {
      animateViewEntrance();
    }

    if (state.mode === "library" && state.lib === "graph") initGraph();
  }

  /* ═══════════ VIEW: LÝ THUYẾT (THEORY) ═══════════ */
  function renderTheory() {
    if (state.chapter) return renderChapter(state.chapter);
    var s = profile();
    var due = flashDueCount();
    var ch = chaptersForGrade(state.grade);
    var hero =
      '<section class="hero theory" data-od-id="hero">' +
        '<div class="hero-inner">' +
          '<p class="kicker">Lý thuyết · Trực quan hoá bản chất</p>' +
          '<h1>Đọc hiểu sâu, tự bịt lời giải để nhớ</h1>' +
          '<p class="sub">Từng thẻ lý thuyết được chắt lọc theo phương pháp <b>Feynman</b> — trực giác đời sống, cơ chế cốt lõi và cảnh báo bẫy. ' +
          'Với thẻ &ldquo;công thức / quy tắc / phản ứng&rdquo;, hãy <b>tự nhớ trước, bấm mở sau</b>.' +
          (due > 0 ? ' Bạn đang có <b>' + due + ' thẻ nhớ</b> cần ôn lại → qua tab Luyện tập nhé.' : "") +
          "</p>" +
        "</div>" +
      "</section>";

    var cards = ch.map(function (c) {
      var ch2 = chapterById(c.id);
      var nNotes = ch2 && ch2.notes ? ch2.notes.length : (c.count || 0);
      var nEx = ch2 && ch2.exercises ? ch2.exercises.length : 0;
      var xpN = s.xpByCh[c.id] || 0;
      return '<button class="chapter-card" style="--cc:' + c.color + '" data-act="openChapter" data-ch="' + c.id + '">' +
        '<span class="cc-num">' + c.num + "</span>" +
        '<span class="cc-icon">' + chIco(c.id) + "</span>" +
        '<span class="cc-body">' +
          '<b class="cc-title">' + esc(c.title) + "</b>" +
          '<small class="cc-tag">' + esc(c.tagline) + "</small>" +
          '<small class="cc-meta">' +
            nNotes + " thẻ lý thuyết · " + nEx + " bài tập tự luyện" +
            (xpN > 0 ? ' · <span class="cc-xp">' + ico("flame") + " " + xpN + " XP</span>" : "") +
          "</small>" +
        "</span>" +
        '<span class="cc-go">→</span>' +
      "</button>";
    }).join("");

    return hero + renderEditPromptBar("ghi chú lý thuyết & bài tập") +
      '<section class="panel"><h2 class="sec-title">Các chương học</h2><div class="chapter-grid">' + cards + "</div></section>";
  }

  function renderChapter(id) {
    var meta = chapterMeta(id);
    var ch = chapterById(id);
    if (!meta || !ch) return renderTheory();
    var s = profile();
    var xpN = s.xpByCh[id] || 0;

    var editFeynmanBtn = state.editMode ? '<button class="btn ghost tiny edit-btn" data-act="editFeynman" data-ch="' + id + '">' + ico("edit") + ' Sửa giải thích</button>' : '';
    var trapJumpBtn = '<button class="btn ghost tiny trap-jump-btn" data-act="jumpToTraps" data-cat="' + id + '">' + ico("alert") + ' Xem bẫy đề thi chương này →</button>';
    var feyn = '<div class="feynman" style="--cc:' + meta.color + '">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px"><b>' + ico("bulb") + " Giải thích trực quan kiểu Feynman 2.0:</b><div style='display:flex;gap:8px'>" + trapJumpBtn + editFeynmanBtn + "</div></div>" +
      '<p class="feynman-p" ' + (state.editMode ? 'data-inline-edit="ch-feynman" data-ch="' + id + '" contenteditable="true" spellcheck="false" title="Nhấp vào đây để sửa trực tiếp lời giải thích"' : '') + '>' + fmt(ch.feynman || "Chưa có lời giải thích ngắn gọn.") + '</p>' +
      "</div>";

    var editChPrompt = renderEditPromptBar("thẻ lý thuyết hoặc bài tập của chương");
    var addNoteBtn = state.editMode ? '<button class="add-block-btn" data-act="addNote" data-ch="' + id + '">' + ico("plus") + ' Thêm thẻ lý thuyết mới vào chương này</button>' : '';

    var notes = (ch.notes || []).map(function (n, i) {
      var hidden = (n.kind === "card" || n.kind === "rule" || n.kind === "rxn");
      var isFav = !!(s.fav.n && s.fav.n[id + ":n" + i]);
      var editBtns = state.editMode ? '<div class="card-edit-bar">' +
        '<button class="card-edit-btn" data-act="editNote" data-ch="' + id + '" data-i="' + i + '" title="Mở biểu mẫu sửa chi tiết">' + ico("pen") + ' Sửa chi tiết</button>' +
        '<button class="card-del-btn" data-act="deleteNote" data-ch="' + id + '" data-i="' + i + '" title="Xoá ghi chú này">' + ico("trash") + ' Xoá</button>' +
      '</div>' : '';

      return '<article class="note ' + (KIND_CLS[n.kind] || "k-card") + (n.kind === "table" ? " span-full" : "") + " reveal-" + (hidden ? "off" : "on") + '" data-favkey="' + id + ':n' + i + '">' +
        '<div class="note-head">' +
          '<span class="note-badge">' + (KIND_ICON[n.kind] || "•") + " " + (KIND[n.kind] || n.kind) + "</span>" +
          '<h3 class="note-h3" ' + (state.editMode ? 'data-inline-edit="note-title" data-ch="' + id + '" data-idx="' + i + '" contenteditable="true" spellcheck="false" title="Nhấp vào đây để sửa tiêu đề trực tiếp"' : '') + '>' + esc(n.t || n.title || "") + '</h3>' +
          editBtns +
          '<div class="note-actions">' +
            (hidden ? '<button class="reveal-btn" data-act="reveal" data-i="' + i + '">' + ico("eye") + " Bịt &amp; nhớ — hiện ra</button>" : "") +
            '<button class="fav-btn' + (isFav ? " on" : "") + '" data-act="favNote" data-key="' + id + ':n' + i + '" title="Đánh dấu yêu thích">' + ico("star") + "</button>" +
          "</div>" +
        "</div>" +
        '<div class="note-body" ' + (state.editMode ? 'data-inline-edit="note-body" data-ch="' + id + '" data-idx="' + i + '" contenteditable="true" spellcheck="false" title="Nhấp vào đây để sửa nội dung ghi chú trực tiếp"' : '') + '>' + noteBody(n) + '</div>' +
      "</article>";
    }).join("");

    var addExBtn = state.editMode ? '<button class="add-block-btn" data-act="addExercise" data-ch="' + id + '">' + ico("plus") + ' Thêm bài tập tự luyện mới</button>' : '';

    var exs = (ch.exercises || []).map(function (ex, xj) {
      return exerciseHTML(ex, id, xj);
    }).join("");

    return '<section class="panel chapter-view">' +
      '<div class="breadcrumb"><button class="linkie" data-act="back">← Chương khác</button>' +
        (xpN > 0 ? '<span class="cc-xp">' + ico("flame") + " " + xpN + " XP đã đạt</span>" : "") + "</div>" +
      '<header class="chapter-head" style="--cc:' + meta.color + '">' +
        '<span class="cc-icon">' + chIco(id) + "</span>" +
        "<div><h1>" + esc(meta.title) + "</h1><p>" + esc(meta.tagline) + "</p></div>" +
      "</header>" +
      feyn +
      addNoteBtn +
      '<div class="note-grid">' + notes + "</div>" +
      '<div class="ex-sec"><h2 class="sec-title">Bài tập tự luyện</h2>' + addExBtn + exs + "</div>" +
      "</section>";
  }

  function noteBody(n) {
    var bodyContent = n.b || n.text || (n.rule ? n.rule + "\n\n" + (n.feynman || "") : "") || "";
    if (n.kind === "table") {
      var rows = String(bodyContent).split("\n").filter(function (r) { return r.trim(); });
      if (!rows.length) return "<p>…</p>";
      var head = rows.shift().split("|").map(function (c) { return c.trim(); });
      var ncol = Math.max(1, head.length);
      var trs = "";
      rows.forEach(function (r) {
        var cells = r.split("|").map(function (c) { return c.trim(); });
        if (cells.length === 1) {
          trs += '<tr class="tbl-foot"><td colspan="' + ncol + '">' + fmt(cells[0]) + "</td></tr>";
          return;
        }
        trs += "<tr>" + cells.map(function (c, i) { return "<td" + (i === 0 ? ' class="col0"' : "") + ">" + fmt(c) + "</td>"; }).join("") + "</tr>";
      });
      return '<div class="tblwrap"><table><thead><tr>' + head.map(function (c) { return "<th>" + fmt(c) + "</th>"; }).join("") + "</tr></thead><tbody>" + trs + "</tbody></table></div>";
    }
    return "<p>" + fmt(bodyContent) + "</p>";
  }

  function exerciseHTML(ex, chId, ei) {
    var opts = parseOpts(ex.opts);
    var optHtml = opts.length
      ? '<div class="ex-opts">' + opts.map(function (o) {
          return '<span class="ex-opt"><b>' + esc(o.k) + ".</b> " + fmt(o.t) + "</span>";
        }).join("") + "</div>"
      : "";
    var solu = '<div class="ex-sol"><span class="sol-tag">Đáp án</span><span class="sol-ans" ' + (state.editMode ? 'data-inline-edit="ex-ans" data-ch="' + chId + '" data-idx="' + ei + '" contenteditable="true" spellcheck="false" title="Nhấp để sửa đáp án trực tiếp"' : '') + '>' + fmt(ex.ans || (ex.a || "")) +
      (ex.unit ? " <span class='muted small'>(" + esc(ex.unit) + ")</span>" : "") + "</span></div>";
    if (Array.isArray(ex.steps) && ex.steps.length) {
      solu += '<ol class="ex-steps">' + ex.steps.map(function (st) { return "<li>" + fmt(st) + "</li>"; }).join("") + "</ol>";
    }
    var exKey = chId + ":e" + ei;
    var isFav = !!(profile().fav.e && profile().fav.e[exKey]);
    var editBtns = state.editMode ? '<div class="card-edit-bar">' +
      '<button class="card-edit-btn" data-act="editExercise" data-ch="' + chId + '" data-i="' + ei + '" title="Mở biểu mẫu sửa chi tiết">' + ico("pen") + ' Sửa chi tiết</button>' +
      '<button class="card-del-btn" data-act="deleteExercise" data-ch="' + chId + '" data-i="' + ei + '" title="Xoá bài tập này">' + ico("trash") + ' Xoá</button>' +
    '</div>' : '';

    var exNum = ex.n != null ? ex.n : (ei + 1);
    return '<details class="ex-card" data-favkey="' + exKey + '">' +
      '<summary><span class="ex-n">C' + exNum + "</span><span class=\"ex-q\">" + fmt(ex.q) + "</span>" +
        editBtns +
        '<button class="fav-btn ex-fav' + (isFav ? " on" : "") + '" data-act="favEx" data-key="' + exKey + '" title="Đánh dấu bài tập yêu thích">' + ico("star") + "</button></summary>" +
      optHtml +
      '<div class="ex-sol-wrap">' + solu + "</div>" +
    "</details>";
  }

  /* ═══════════ VIEW: LUYỆN TẬP (PRACTICE) ═══════════ */
  function renderPractice() {
    var tabs = [
      { id: "flash", l: "Thẻ nhớ SM-2", i: "cards" },
      { id: "bank", l: "Ngân hàng câu hỏi", i: "check" },
      { id: "tests", l: "Bộ đề thi thử", i: "clock" },
      { id: "games", l: "Đấu trường Mini-games", i: "sparkles" }
    ].map(function (t) {
      return '<button class="stab ' + (state.tab === t.id ? "on" : "") + '" data-act="tab" data-t="' + t.id + '">' + ico(t.i) + t.l + "</button>";
    }).join("");

    var body = "";
    if (state.tab === "flash") body = flashView();
    else if (state.tab === "bank") body = bankView();
    else if (state.tab === "games") body = (window.ChemGames ? ChemGames.renderArena() : "<p>Đang tải mini-games...</p>");
    else body = testsView();

    var pName = (state.tab === "flash" ? "thẻ nhớ tối giản" : state.tab === "bank" ? "câu hỏi trắc nghiệm" : state.tab === "games" ? "đấu trường mini-games" : "bộ đề thi");
    return '<section class="panel practice">' +
      '<div class="stab-bar">' + tabs + "</div>" +
      renderEditPromptBar(pName) +
      body +
      "</section>";
  }

  /* ---------- ULTRA-MINIMALIST FLASHCARDS ENGINE ---------- */
  function buildDeck(gradeID, chFilter) {
    var items = [];
    chaptersForGrade(gradeID).forEach(function (c) {
      if (c.id === "g11cq") return;
      if (chFilter && chFilter !== "all" && c.id !== chFilter) return;

      // 1. Check custom flashcards in chapter
      var ch = DATA[c.id];
      if (ch && Array.isArray(ch.customFlashcards) && ch.customFlashcards.length) {
        ch.customFlashcards.forEach(function (fc, i) {
          items.push({
            key: c.id + ":cfc" + i,
            ch: c.id,
            q: fc.q,
            a: fc.a,
            note: fc.note || "",
            isCustom: true,
            cIndex: i
          });
        });
      }

      // 2. Add built-in atomic minimalist flashcards
      var atomics = DEFAULT_ATOMIC_FLASHCARDS[c.id] || [];
      atomics.forEach(function (fc, i) {
        items.push({
          key: c.id + ":afc" + i,
          ch: c.id,
          q: fc.q,
          a: fc.a,
          note: fc.note || "",
          isCustom: false,
          cIndex: i
        });
      });
    });
    return items;
  }

  /* ---------- SUPERMEMO SM-2 SPACED REPETITION SYSTEM (SRS) ---------- */
  var FLASH_INTERVALS = [1, 3, 7, 15, 30];

  function getCardSRS(cardKey) {
    var s = profile();
    var rec = s.deck[cardKey];
    if (!rec) {
      return { reps: 0, ef: 2.5, interval: 0, due: 0, lapses: 0 };
    }
    // Seamless backward compatibility migration from legacy lvl
    if (typeof rec.ef === "undefined") {
      var lvl = rec.lvl || 0;
      var iv = lvl === 0 ? 0 : (FLASH_INTERVALS[lvl - 1] || 1);
      return {
        reps: lvl,
        ef: 2.5,
        interval: iv,
        due: rec.due || 0,
        lapses: 0
      };
    }
    return rec;
  }

  function calcNextSRS(rec, rating) {
    var ef = rec.ef || 2.5;
    var reps = rec.reps || 0;
    var interval = rec.interval || 0;
    var lapses = rec.lapses || 0;
    var now = Date.now();

    if (rating === 1) { // 🔴 Again (Quên)
      reps = 0;
      interval = 0;
      ef = Math.max(1.3, ef - 0.2);
      lapses++;
      return { reps: 0, ef: ef, interval: 0, due: now + 60 * 1000, lapses: lapses };
    }
    if (rating === 2) { // 🟠 Hard (Khó)
      ef = Math.max(1.3, ef - 0.15);
      reps++;
      interval = (interval < 1) ? 1 : Math.max(1, Math.round(interval * 1.2));
      return { reps: reps, ef: ef, interval: interval, due: now + interval * 86400 * 1000, lapses: lapses };
    }
    if (rating === 3) { // 🟢 Good (Nhớ)
      reps++;
      if (reps === 1) interval = 1;
      else if (reps === 2) interval = 3;
      else interval = Math.max(1, Math.round(interval * ef));
      return { reps: reps, ef: ef, interval: interval, due: now + interval * 86400 * 1000, lapses: lapses };
    }
    if (rating === 4) { // 🔵 Easy (Quá dễ)
      ef = Math.min(3.0, ef + 0.15);
      reps++;
      if (reps === 1) interval = 4;
      else if (reps === 2) interval = 7;
      else interval = Math.max(1, Math.round(interval * ef * 1.35));
      return { reps: reps, ef: ef, interval: interval, due: now + interval * 86400 * 1000, lapses: lapses };
    }
    return rec;
  }

  function formatSRSInterval(days) {
    if (days <= 0) return "< 1 phút";
    if (days === 1) return "1 ngày";
    if (days < 30) return days + " ngày";
    if (days < 365) return Math.round(days / 30) + " tháng";
    return (days / 365).toFixed(1) + " năm";
  }

  function calcPreviewIntervals(rec) {
    return {
      again: "< 1p",
      hard: formatSRSInterval(calcNextSRS(rec, 2).interval),
      good: formatSRSInterval(calcNextSRS(rec, 3).interval),
      easy: formatSRSInterval(calcNextSRS(rec, 4).interval)
    };
  }

  function flashStatsBreakdown() {
    var all = buildDeck(state.grade, "all");
    var s = profile();
    var now = Date.now();
    var due = 0, newCards = 0, learning = 0, mastered = 0;
    all.forEach(function (it) {
      var rec = s.deck[it.key];
      if (!rec || !rec.reps) {
        newCards++;
        due++; // Chưa ôn lần nào được tính vào hàng đợi ôn hôm nay
      } else {
        if (rec.due <= now) due++;
        if (rec.interval >= 7) mastered++;
        else learning++;
      }
    });
    return { total: all.length, due: due, newCards: newCards, learning: learning, mastered: mastered };
  }

  function flashDueCount() {
    return flashStatsBreakdown().due;
  }

  function flashView() {
    var chs = chaptersForGrade(state.grade).filter(function (c) { return c.id !== "g11cq"; });
    var chSel = chapterDropdown("flash-ch", (state.flash && state.flash.sel) || "all", chs, "Toàn bộ chương");
    var stats = flashStatsBreakdown();
    var addCardBtn = state.editMode ? '<button class="add-block-btn" data-act="addFlashcard" data-ch="' + ((state.flash && state.flash.sel) || "g12c1") + '">' + ico("plus") + ' Thêm thẻ nhớ lý thuyết mới</button>' : '';

    var dueButton = stats.due > 0
      ? '<button class="btn primary srs-due-start-btn" data-act="flashStartDue">' +
          ico("flame") + ' Ôn tập thẻ đến hạn hôm nay (<b>' + stats.due + '</b> thẻ) →' +
        '</button>'
      : '<div class="srs-all-done-banner">' + ico("check") + ' Bạn đã hoàn thành tất cả thẻ cần ôn hôm nay! Thật tuyệt vời.</div>';

    return '<div class="flash-setup">' +
      '<div class="fs-card intro">' +
        '<h3>' + ico("cards") + " Thẻ nhớ SM-2 — Thuật toán Lặp lại Ngắt quãng (SRS)</h3>" +
        "<p>Hệ thống tích hợp thuật toán <b>SuperMemo SM-2</b> chuẩn quốc tế: Tự động tính toán chu kỳ lặp lại tối ưu dựa trên tốc độ phản xạ và độ dễ/khó của từng thẻ. Đảm bảo <b>ghi nhớ vĩnh viễn</b> kiến thức Hóa học 12 mà không tốn công học vẹt.</p>" +
        '<div class="srs-stats-overview">' +
          '<div class="srs-stat-box due"><span class="srs-box-num">' + stats.due + '</span><span class="srs-box-label">' + ico("clock") + ' Cần ôn hôm nay</span></div>' +
          '<div class="srs-stat-box new"><span class="srs-box-num">' + stats.newCards + '</span><span class="srs-box-label">' + ico("sparkles") + ' Thẻ mới</span></div>' +
          '<div class="srs-stat-box learning"><span class="srs-box-num">' + stats.learning + '</span><span class="srs-box-label">' + ico("zap") + ' Đang rèn luyện</span></div>' +
          '<div class="srs-stat-box mastered"><span class="srs-box-num">' + stats.mastered + '</span><span class="srs-box-label">' + ico("shield") + ' Đã thuộc sâu</span></div>' +
        '</div>' +
        dueButton +
        addCardBtn +
      "</div>" +
      '<div class="fs-card control">' +
        "<h4>" + ico("formula") + " Luyện tập theo chương cụ thể</h4>" +
        "<label>Chọn phạm vi chương</label>" + chSel +
        '<button class="btn ghost" style="width:100%;margin-top:16px" data-act="flashStart">Bắt đầu phiên lật thẻ theo chương →</button>' +
        '<div class="srs-instructions" style="margin-top:16px;padding:12px 14px;background:var(--surface);border:1px solid var(--line-soft);border-radius:12px;font-size:.82rem;line-height:1.6">' +
          '<div style="font-weight:700;margin-bottom:6px;color:var(--accent)">' + ico("bulb") + ' Phím tắt lật thẻ siêu tốc:</div>' +
          '<div>• <b>Phím Space / Enter:</b> Lật xem mặt sau</div>' +
          '<div>• <b>Phím 1:</b> 🔴 Quên (lặp lại ngay trong phiên)</div>' +
          '<div>• <b>Phím 2:</b> 🟠 Khó (chu kỳ ngắn)</div>' +
          '<div>• <b>Phím 3:</b> 🟢 Nhớ (chu kỳ chuẩn)</div>' +
          '<div>• <b>Phím 4:</b> 🔵 Quá dễ (nhảy vọt chu kỳ)</div>' +
        '</div>' +
      "</div>" +
    "</div>";
  }

  function chapterDropdown(act, sel, chs, allLabel) {
    var opts = '<option value="all">' + allLabel + "</option>";
    chs.forEach(function (c) {
      opts += '<option value="' + c.id + '" ' + (sel === c.id ? "selected" : "") + ">" + c.num + ". " + esc(c.title) + "</option>";
    });
    return '<select data-act="' + act + '" class="sel" id="' + act + '">' + opts + "</select>";
  }

  function startFlashSession(sel, onlyDue) {
    var items = buildDeck(state.grade, sel || "all");
    if (onlyDue) {
      var s = profile();
      var now = Date.now();
      items = items.filter(function (it) {
        var rec = s.deck[it.key];
        return !rec || !rec.reps || rec.due <= now;
      });
      if (!items.length) {
        alert("Tuyệt vời! Bạn không còn thẻ nào đến hạn hôm nay. Hãy chọn luyện tập theo chương để củng cố thêm.");
        return;
      }
    }
    if (!items.length) { alert("Không có thẻ nào trong chương này."); return; }
    shuffle(items);
    state.flash = {
      items: items,
      initialCount: items.length,
      i: 0,
      good: 0,
      hard: 0,
      easy: 0,
      again: 0,
      flipped: false,
      sel: sel || "all",
      onlyDue: !!onlyDue
    };
  }

  function flashFrontHTML(item) {
    var isFav = !!(profile().fav.n && profile().fav.n[item.key]);
    return '<div class="flash-front">' +
      '<div class="flash-kind">' + ico("formula") + " Khái niệm / Chất / Phản ứng</div>" +
      '<button class="fav-btn flash-fav' + (isFav ? " on" : "") + '" data-act="favNote" data-key="' + item.key + '">' + ico("star") + "</button>" +
      "<p class='fq' style='font-size:1.35rem;text-align:center;margin:30px 0' " + (state.editMode ? 'data-inline-edit="flash-q" data-ch="' + item.ch + '" data-idx="' + item.cIndex + '" data-custom="' + item.isCustom + '" contenteditable="true" spellcheck="false" title="Nhấp trực tiếp để sửa câu hỏi"' : '') + ">" + fmt(item.q) + "</p>" +
      '<p class="fp" style="text-align:center">Tự nhớ nhanh đáp án trong đầu, rồi bấm để lật thẻ.</p>' +
    "</div>";
  }

  function flashBack(item, srsRec) {
    srsRec = srsRec || getCardSRS(item.key);
    var theoryBtn = item.ch ? '<div style="margin-top:14px;text-align:center"><button class="btn ghost tiny link-theory-btn" data-act="jumpToTheory" data-ch="' + item.ch + '">' + ico("bookOpen") + ' Xem lý thuyết chương này →</button></div>' : '';
    var srsMeta = '<div class="srs-card-meta">' +
      '<span class="srs-meta-pill reps">' + ico("sparkles") + ' Ôn #' + (srsRec.reps || 0) + '</span>' +
      '<span class="srs-meta-pill ef">EF: ' + (srsRec.ef || 2.5).toFixed(2) + '</span>' +
      '<span class="srs-meta-pill iv">' + (srsRec.interval ? srsRec.interval + 'd' : 'Mới') + '</span>' +
    '</div>';

    return '<div class="minimal-flash-back">' +
      '<div class="flash-back-top-row">' +
        '<span class="minimal-flash-badge">Đáp án cốt lõi</span>' +
        srsMeta +
      '</div>' +
      '<div class="minimal-flash-ans" ' + (state.editMode ? 'data-inline-edit="flash-a" data-ch="' + item.ch + '" data-idx="' + item.cIndex + '" data-custom="' + item.isCustom + '" contenteditable="true" spellcheck="false" title="Nhấp trực tiếp để sửa công thức/đáp án"' : '') + '>' + fmt(item.a) + '</div>' +
      '<div class="minimal-flash-note" ' + (state.editMode ? 'data-inline-edit="flash-note" data-ch="' + item.ch + '" data-idx="' + item.cIndex + '" data-custom="' + item.isCustom + '" contenteditable="true" spellcheck="false" title="Nhấp trực tiếp để sửa ghi chú"' : '') + '>' + fmt(item.note || "") + '</div>' +
      theoryBtn +
    "</div>";
  }

  function renderFlashSession() {
    var f = state.flash;
    if (!f || !f.items) return flashView();
    var done = f.i >= f.items.length;
    var cur = done ? null : f.items[f.i];
    var totalCards = Math.max(f.items.length, f.initialCount || f.items.length);
    var prog = Math.min(100, Math.round((f.i / totalCards) * 100));

    var editCardBar = "";
    if (state.editMode && cur) {
      editCardBar = '<div class="flash-edit-bar">' +
        '<span class="edit-badge">Thẻ nhớ #' + (f.i + 1) + '</span>' +
        '<div>' +
          '<button class="btn ghost tiny edit-btn" data-act="editCurFlashcard">' + ico("edit") + ' Sửa thẻ</button> ' +
          '<button class="btn warn tiny del-btn" data-act="deleteCurFlashcard">' + ico("trash") + ' Xoá thẻ</button>' +
        '</div>' +
      '</div>';
    }

    var srsRec = cur ? getCardSRS(cur.key) : null;
    var prevIv = srsRec ? calcPreviewIntervals(srsRec) : { again: "< 1p", hard: "1 ngày", good: "3 ngày", easy: "7 ngày" };

    var body = '<div class="flash-session">' +
      '<div class="fs-top">' +
        '<span class="fs-prog">' +
          'Thẻ ' + Math.min(f.i + 1, f.items.length) + " / " + f.items.length +
          ' · <span class="srs-top-stat red" title="Quên">' + ico("rotate") + ' ' + (f.again || 0) + '</span>' +
          ' · <span class="srs-top-stat amber" title="Khó">' + ico("alert") + ' ' + (f.hard || 0) + '</span>' +
          ' · <span class="srs-top-stat green" title="Nhớ">' + ico("check") + ' ' + (f.good || 0) + '</span>' +
          ' · <span class="srs-top-stat blue" title="Quá dễ">' + ico("sparkles") + ' ' + (f.easy || 0) + '</span>' +
        '</span>' +
        '<span class="fs-bar"><i style="width:' + prog + '%"></i></span>' +
      '</div>' + editCardBar;

    if (!done) {
      body +=
      '<div class="flash-card ' + (f.flipped ? "flipped" : "") + '" data-act="flip">' +
        '<div class="flash-inner">' +
          '<div class="flash-face front">' + flashFrontHTML(cur) + '<div class="hint">Bấm hoặc gõ Space để lật</div></div>' +
          '<div class="flash-face back minimal-back">' + flashBack(cur, srsRec) + "<div class='hint'>Đánh giá độ nhớ (Phím 1, 2, 3, 4)</div></div>" +
        '</div>' +
      '</div>' +
      '<div class="fs-actions srs-actions-grid">' +
        '<button class="btn srs-rate-btn again" data-act="flashRate" data-r="1" title="Chưa nhớ (Phím 1)">' +
          '<span class="srs-badge red">1</span>' +
          '<span class="srs-title">Quên</span>' +
          '<span class="srs-time">' + prevIv.again + '</span>' +
        '</button>' +
        '<button class="btn srs-rate-btn hard" data-act="flashRate" data-r="2" title="Nhớ vất vả (Phím 2)">' +
          '<span class="srs-badge amber">2</span>' +
          '<span class="srs-title">Khó</span>' +
          '<span class="srs-time">' + prevIv.hard + '</span>' +
        '</button>' +
        '<button class="btn srs-rate-btn good" data-act="flashRate" data-r="3" title="Nhớ chuẩn (Phím 3)">' +
          '<span class="srs-badge green">3</span>' +
          '<span class="srs-title">Nhớ</span>' +
          '<span class="srs-time">' + prevIv.good + '</span>' +
        '</button>' +
        '<button class="btn srs-rate-btn easy" data-act="flashRate" data-r="4" title="Quá dễ dàng (Phím 4)">' +
          '<span class="srs-badge blue">4</span>' +
          '<span class="srs-title">Quá dễ</span>' +
          '<span class="srs-time">' + prevIv.easy + '</span>' +
        '</button>' +
      '</div>' +
      '<div class="fs-nav-row">' +
        '<button class="btn ghost" data-act="flashPrevCard"' + (f.i === 0 ? ' disabled' : '') + '>← Thẻ trước</button>' +
        '<button class="btn ghost small" data-act="flip">' + ico("rotate") + ' Lật thẻ (Space)</button>' +
        '<button class="btn ghost" data-act="flashNextCard"' + (f.i >= f.items.length - 1 ? ' disabled' : '') + '>Thẻ sau →</button>' +
      '</div>';
    }
    body +=
      '<div class="fs-fin' + (done ? " show" : "") + '">' +
        '<h3>' + ico("sparkles") + ' Hoàn thành phiên ôn tập SM-2!</h3>' +
        '<p class="muted">Hệ thống Lặp lại ngắt quãng đã tự động tối ưu hóa lịch học cho từng thẻ nhớ.</p>' +
        '<div class="srs-session-summary">' +
          '<div class="sss-item red"><span class="sss-num">' + (f.again || 0) + '</span><span class="sss-lbl">Lặp lại</span></div>' +
          '<div class="sss-item amber"><span class="sss-num">' + (f.hard || 0) + '</span><span class="sss-lbl">Khó</span></div>' +
          '<div class="sss-item green"><span class="sss-num">' + (f.good || 0) + '</span><span class="sss-lbl">Nhớ tốt</span></div>' +
          '<div class="sss-item blue"><span class="sss-num">' + (f.easy || 0) + '</span><span class="sss-lbl">Quá dễ</span></div>' +
        '</div>' +
        '<div style="margin-top:20px">' +
          '<button class="btn primary" data-act="flashStart">Luyện tập tiếp</button> ' +
          '<button class="btn ghost" data-act="flashPrev">Trở về tổng quan</button>' +
        '</div>' +
      '</div>' +
    '</div>';
    return body;
  }

  function flashPrevCard() {
    var f = state.flash;
    if (!f || !f.items || f.i <= 0) return;
    f.i--;
    f.flipped = false;
    renderPracticeOnly();
  }
  function flashNextCard() {
    var f = state.flash;
    if (!f || !f.items || f.i >= f.items.length - 1) return;
    f.i++;
    f.flipped = false;
    renderPracticeOnly();
  }

  function markFlash(rating) {
    if (typeof rating === "boolean") {
      rating = rating ? 3 : 1;
    }
    rating = parseInt(rating, 10) || 3;
    var f = state.flash;
    if (!f || !f.items) return;
    var it = f.items[f.i];
    if (!it) return;

    function applyMark() {
      var s = profile();
      var rec = getCardSRS(it.key);
      var next = calcNextSRS(rec, rating);
      s.deck[it.key] = next;

      if (rating === 1) {
        f.again = (f.again || 0) + 1;
        // Feynman Active Mastery: Đưa thẻ chưa nhớ vào cuối hàng đợi để kiểm tra lại
        f.items.push(it);
        addXP(s, it.ch, 1);
      } else if (rating === 2) {
        f.hard = (f.hard || 0) + 1;
        addXP(s, it.ch, 5);
      } else if (rating === 3) {
        f.good = (f.good || 0) + 1;
        addXP(s, it.ch, 10);
      } else if (rating === 4) {
        f.easy = (f.easy || 0) + 1;
        addXP(s, it.ch, 15);
      }

      save(s);
      f.flipped = false;
      f.i++;

      if (f.i >= f.items.length) {
        activity();
        renderPracticeOnly();
        updateHeaderStats(rating >= 3);
        return;
      }
      eventBusChanged();
      updateHeaderStats(rating >= 3);
    }

    var fc = $(".flash-card");
    if (hasGSAP && !prefersReduced && fc) {
      var targetX = 0, targetY = 0, targetRot = 0;
      if (rating === 1) { targetX = -180; targetRot = -12; }
      else if (rating === 2) { targetX = -80; targetRot = -5; }
      else if (rating === 3) { targetX = 140; targetRot = 8; }
      else if (rating === 4) { targetX = 220; targetY = -40; targetRot = 14; }

      gsap.to(fc, {
        x: targetX,
        y: targetY,
        rotation: targetRot,
        opacity: 0,
        scale: 0.93,
        duration: 0.22,
        ease: "power2.in",
        onComplete: function () {
          gsap.set(fc, { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1 });
          applyMark();
          var newFc = $(".flash-card");
          if (newFc) {
            gsap.fromTo(newFc,
              { x: -targetX * 0.4, y: 15, rotation: -targetRot * 0.4, opacity: 0, scale: 0.94 },
              { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, duration: 0.32, ease: "back.out(1.2)", clearProps: "all" }
            );
          }
        }
      });
    } else {
      applyMark();
    }
  }

  /* ---------- BANK QUIZ ---------- */
  function bankStateEnsure() {
    var bs = state.bank;
    if (!bs || !bs.items) {
      bs = state.bank = { items: null, ch: (bs && bs.ch) || "all", kind: (bs && bs.kind) || "all", i: 0, mode: "pick", wrong: [] };
    }
    return bs;
  }
  function bankView() {
    var bs = bankStateEnsure();
    if (bs.mode === "quiz" && bs.items) return bankPlayHTML(bs);
    var chs = chaptersForGrade(state.grade).filter(function (c) { return c.id !== "g11cq"; });
    var chSel = chapterDropdown("bank-ch", bs.ch || "all", chs, "Toàn bộ chương");
    var kindOpts = [["all", "Tất cả dạng"], ["m", "Trắc nghiệm"], ["tf", "Đúng / Sai"], ["n", "Trả lời ngắn"]]
      .map(function (p) { return '<option value="' + p[0] + '" ' + (bs.kind === p[0] ? "selected" : "") + ">" + p[1] + "</option>"; }).join("");
    var bankAll = bankForGrade(state.grade);
    var stats = bankStats(bankAll);
    var addBtn = state.editMode ? '<button class="add-block-btn" data-act="addBankQ">' + ico("plus") + ' Thêm câu hỏi mới vào ngân hàng</button>' : '';

    return '<div class="fs-card intro">' +
      "<h3>" + ico("check") + " Ngân hàng câu hỏi trắc nghiệm & tự luận</h3>" +
      "<p>Luyện tập từng câu với phản hồi và lời giải chi tiết tức thì. " +
      "Làm sai sẽ được tự động xếp vào hàng đợi ôn lại.</p>" +
      '<div class="bank-stats">' +
        '<span>Đúng <b style="color:var(--ok)">' + stats.r + "</b></span>" +
        '<span>Sai <b style="color:var(--warn)">' + stats.w + "</b></span>" +
        '<span>Tỉ lệ <b>' + (stats.r + stats.w ? Math.round((stats.r / (stats.r + stats.w)) * 100) + "%" : "—") + "</b></span>" +
      "</div>" +
      addBtn +
    "</div>" +
    '<div class="fs-card control">' +
      "<label>Chọn chương</label>" + chSel +
      "<label>Dạng câu hỏi</label>" +
      '<select data-act="bank-kind" class="sel" id="bank-kind">' + kindOpts + "</select>" +
      '<button class="btn primary" style="width:100%;margin-top:16px" data-act="bankStart">Bắt đầu luyện tập →</button>' +
    "</div>";
  }
  function bankStats(items) {
    var s = profile();
    var r = 0, w = 0;
    items.forEach(function (it) { var rec = s.solved[keyOf(it)]; if (rec) { r += rec.r; w += rec.w; } });
    return { r: r, w: w };
  }
  function keyOf(it) { return (it.ch || "g11") + ":" + String(typeof it.idx === "number" ? it.idx : it.hash || 0); }
  function startBank(ch, kind) {
    var all = bankForGrade(state.grade).map(function (it, i) { it.idx = i; return it; });
    if (ch && ch !== "all") all = all.filter(function (it) { return it.ch === ch; });
    if (kind && kind !== "all") all = all.filter(function (it) { return it.k === kind; });
    if (!all.length) { alert("Không có câu nào khớp bộ lọc này."); return; }
    shuffle(all);
    state.bank = { items: all, mode: "quiz", i: 0, wrong: [], ch: ch || "all", kind: kind || "all" };
    render();
  }

  function bankPlayHTML(bs) {
    var it = bs.items[bs.i];
    if (!it) {
      var wrong = bs.wrong.length;
      return '<div class="fs-card result">' +
        "<h3>Hoàn thành bộ câu hỏi!</h3>" +
        "<p>Làm đúng <b>" + (bs.items.length - wrong) + "</b> / " + bs.items.length + " câu.</p>" +
        (wrong ? '<p class="muted small">Có <b>' + wrong + "</b> câu sai — luyện lại ngay nhé.</p>"
          + '<div><button class="btn warn" data-act="bankWrong">Luyện lại ' + wrong + " câu sai</button></div>" : "") +
        '<div style="margin-top:10px"><button class="btn ghost" data-act="bankAgain">Bộ câu mới</button></div>' +
      "</div>";
    }
    return bankQuestionHTML(bs, it);
  }
  function bankKindBadge(k) {
    var m = {
      m: [ico("choose"), "Trắc nghiệm"],
      mc: [ico("choose"), "Trắc nghiệm"],
      tf: [ico("scale"), "Đúng / Sai"],
      n: [ico("type"), "Điền số"],
      num: [ico("type"), "Điền số"],
      sa: [ico("type"), "Điền số"]
    }[k] || [ico("type"), k];
    return '<span class="q-kind">' + m[0] + " " + m[1] + "</span>";
  }
  function bankQuestionHTML(bs, it) {
    var idx = bs.i, total = bs.items.length;
    var opts = parseOpts(it.o);
    var editBtns = state.editMode ? '<div class="edit-item-btns" style="margin-left:auto">' +
      '<button class="btn ghost tiny edit-btn" data-act="editBankQ" data-i="' + idx + '">' + ico("edit") + ' Sửa câu này</button>' +
      '<button class="btn warn tiny del-btn" data-act="deleteBankQ" data-i="' + idx + '">' + ico("trash") + ' Xoá câu này</button>' +
    '</div>' : '';

    var head =
      '<div class="q-top">' +
        '<span class="q-count">Câu ' + (idx + 1) + " / " + total + "</span>" +
        editBtns +
        '<span class="q-prog"><i style="width:' + Math.round((idx / total) * 100) + '%"></i></span>' +
      "</div>" + bankKindBadge(it.k);
    var body = "";
    if (it.k === "m" || it.k === "mc") {
      body = '<div class="mcq-opts">' + opts.map(function (o) {
        return '<button class="mcq-opt" data-act="bankPick" data-p="' + esc(o.k) + '"><span class="opt-key">' + esc(o.k) + '.</span><span class="opt-text">' + fmt(o.t) + '</span></button>';
      }).join("") + "</div>";
    } else if (it.k === "tf") {
      body = '<div class="tf-opts">' +
        '<button class="tf-opt" data-act="bankPick" data-p="true">' + ico("ok") + " Đúng</button>" +
        '<button class="tf-opt" data-act="bankPick" data-p="false">' + ico("no") + " Sai</button></div>";
    } else {
      body = '<div class="num-row">' +
        '<input class="num-in" data-act="numIn" placeholder="Gõ đáp án…" autocomplete="off">' +
        (it.u ? '<span class="num-unit">' + esc(it.u) + "</span>" : "") +
        '<button class="btn primary" data-act="bankPick" data-p="submit">Chấm</button></div>';
    }
    var navBar = '<div class="bank-nav-bar">' +
      '<button class="btn ghost" data-act="bankPrev"' + (idx === 0 ? ' disabled' : '') + '>← Câu trước</button>' +
      '<span class="muted small" style="font-weight:600">Câu ' + (idx + 1) + ' / ' + total + '</span>' +
      '<button class="btn ghost" data-act="bankNext"' + (idx + 1 >= total ? ' disabled' : '') + '>Câu sau →</button>' +
    '</div>';
    return '<div class="bank-q">' + head +
      "<p class='q-text'>" + fmt(it.q) + "</p>" + getSvg(it) + body +
      '<div class="q-feedback" id="qFeedback"></div>' +
      navBar +
    "</div>";
  }
  function bankPick(pick) {
    var bs = state.bank;
    if (bs.answered) return; // Prevent spam clicking XP!
    bs.answered = true;

    var it = bs.items[bs.i];
    var fb = $("#qFeedback");
    var correct = false;
    if (it.k === "m" || it.k === "mc" || it.k === "tf") {
      correct = (pick === it.a) || (it.k === "tf" && String(pick) === String(it.a));
    } else {
      if (pick === "submit") {
        var input = $(".num-in", $("#app"));
        var val = input ? input.value : "";
        correct = checkNum(val, it);
      }
    }
    var s = profile();
    var rec = s.solved[keyOf(it)] || { r: 0, w: 0 };
    rec[correct ? "r" : "w"]++;
    s.solved[keyOf(it)] = rec;
    if (correct) { addXP(s, it.ch, 10); } else { bs.wrong.push(it); s.xp += 1; }
    save(s);

    // Disable all options immediately to prevent re-picking
    $(".mcq-opt, .tf-opt, .num-in, .num-row button").forEach(function(btn) {
      btn.disabled = true;
    });

    if (it.k === "m" || it.k === "mc" || it.k === "tf") {
      $(".mcq-opt, .tf-opt").forEach(function(btn) {
        var p = btn.getAttribute("data-p");
        if (p === String(it.a)) {
          btn.classList.add("reveal-correct");
          btn.insertAdjacentHTML("beforeend", ' <span class="opt-badge-correct">' + ico("check") + ' Đáp án đúng</span>');
        }
        if (p === String(pick)) {
          btn.classList.add("picked");
          btn.classList.add(correct ? "good" : "warn");
          if (!correct) {
            btn.insertAdjacentHTML("beforeend", ' <span class="opt-badge-wrong">' + ico("close") + ' Lựa chọn của bạn</span>');
          }
        }
      });
    }

    var opts = parseOpts(it.o);
    var pickedObj = opts.find(function(o){ return o.k === pick; }) || { t: pick };
    var correctObj = opts.find(function(o){ return o.k === it.a; }) || { t: it.a };

    var msg = correct
      ? '<div class="fb ok">' +
          '<div class="fb-header"><span class="fb-badge ok">' + ico("check") + ' Chính xác!</span> <b>(+10 XP)</b></div>' +
          (it.e ? '<div class="fb-section-box exp"><div class="fb-sec-title">' + ico("bulb") + ' <b>Giải thích chi tiết:</b></div><div class="fb-sec-desc">' + fmt(it.e) + '</div></div>' : '') +
        '</div>'
      : '<div class="fb bad">' +
          '<div class="fb-header"><span class="fb-badge bad">' + ico("close") + ' Chưa chính xác</span> <b>Phân tích lỗi sai:</b></div>' +
          '<div class="fb-comparison">' +
            '<div class="fb-comp-row correct"><span class="fb-comp-label">' + ico("check") + ' Đáp án đúng:</span><span class="fb-comp-val"><b>' + esc(it.a) + ((it.k === "m" || it.k === "mc") ? '. ' + fmt(correctObj.t) : '') + '</b></span></div>' +
            '<div class="fb-comp-row wrong"><span class="fb-comp-label">' + ico("close") + ' Bạn đã chọn:</span><span class="fb-comp-val"><b>' + esc(pick) + ((it.k === "m" || it.k === "mc") ? '. ' + fmt(pickedObj.t) : '') + '</b></span></div>' +
          '</div>' +
          (it.e ? '<div class="fb-section-box exp"><div class="fb-sec-title">' + ico("bulb") + ' <b>Phân tích & Lỗi sai cần tránh:</b></div><div class="fb-sec-desc">' + fmt(it.e) + '</div></div>' : '') +
        '</div>';

    fb.innerHTML = msg;
    fb.classList.add("show");
    var nextBar = '<div class="q-nav-row" style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;gap:12px">' +
      '<button class="btn ghost" data-act="bankPrev"' + (bs.i === 0 ? ' disabled' : '') + '>← Câu trước</button>' +
      (bs.i + 1 >= bs.items.length
        ? '<button class="btn primary" data-act="bankFinish">Xem kết quả</button>'
        : '<button class="btn primary" data-act="bankNext">Câu tiếp theo →</button>') +
    '</div>';
    fb.insertAdjacentHTML("beforeend", nextBar);
    activity();
    updateHeaderStats(correct);
  }
  function bankPrev() {
    var bs = state.bank;
    if (!bs || bs.i <= 0) return;
    bs.answered = false;
    bs.i--;
    renderPracticeOnly();
    var bq = $(".bank-q");
    if (bq) bq.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function bankNext() {
    var bs = state.bank;
    bs.answered = false;
    bs.i++;
    renderPracticeOnly();
    var bq = $(".bank-q");
    if (bq) bq.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function bankFinish() {
    var bs = state.bank;
    bs.i = bs.items.length;
    activity();
    renderPracticeOnly();
  }
  function bankWrong() {
    var bs = state.bank;
    shuffle(bs.wrong);
    bs.items = bs.wrong.slice();
    bs.wrong = [];
    bs.i = 0;
    renderPracticeOnly();
  }

  function checkNum(val, it) {
    if (val == null || it == null || it.a == null) return false;
    var sVal = String(val).trim().replace(/,/g, ".").replace(/\s+/g, "");
    var sAns = String(it.a).trim().replace(/,/g, ".").replace(/\s+/g, "");
    if (sVal.toLowerCase() === sAns.toLowerCase()) return true;

    var v = num(val);
    if (v === null) return false;
    var t = num(it.a);
    if (t === null) return false;
    if (it.tol && it.tol !== "" && num(it.tol) !== null) {
      if (Math.abs(v - t) <= num(it.tol) + 1e-9) return true;
    }
    if (it.ac) {
      var accepts = String(it.ac).split("|");
      for (var i = 0; i < accepts.length; i++) {
        var av = num(accepts[i]);
        if (av !== null && Math.abs(v - av) < 0.02) return true;
        if (String(accepts[i]).trim().replace(/,/g, ".").replace(/\s+/g, "").toLowerCase() === sVal.toLowerCase()) return true;
      }
    }
    return Math.abs(v - t) < 0.02;
  }

  /* ---------- TESTS (BỘ ĐỀ THI) ---------- */
  function testsView() {
    var tests = (DATA.tests || []).filter(function (t) { return state.grade === "all" || t.grade === state.grade; });
    var s = profile();
    var addTestBtn = state.editMode ? '<button class="add-block-btn" data-act="addTest">' + ico("plus") + ' Tạo bộ đề thi mới</button>' : '';

    var cards = tests.map(function (t) {
      var best = s.tests[t.id];
      var editBtns = state.editMode ? '<div class="edit-item-btns" style="margin-top:8px">' +
        '<button class="btn ghost tiny edit-btn" data-act="editTest" data-id="' + t.id + '">' + ico("edit") + ' Sửa đề</button>' +
        '<button class="btn warn tiny del-btn" data-act="deleteTest" data-id="' + t.id + '">' + ico("trash") + ' Xoá đề</button>' +
      '</div>' : '';

      return '<div class="test-card">' +
        '<div class="tc-left"><span class="tc-icon">' + ico("clock") + "</span>" +
          "<div><h3>" + esc(t.title) + "</h3>" +
          '<p class="muted small">' + (t.author ? '<span class="author-pill">' + ico("user") + ' ' + esc(t.author) + '</span> · ' : '') + (t.qs ? t.qs.length : 0) + " câu · gợi ý " + t.timeMin + " phút · tự động chấm</p>" +
          editBtns +
          '</div></div>' +
        '<div class="tc-right">' +
          (best ? '<span class="tc-best" style="color:' + (best >= 8 ? "var(--ok)" : best >= 5 ? "var(--gold)" : "var(--warn)") + '">Lần gần nhất: <b>' + best + "/10</b></span>" : "") +
          '<button class="btn primary" data-act="testStart" data-t="' + t.id + '">Làm đề →</button>' +
        "</div>" +
      "</div>";
    }).join("");
    return '<h2 class="sec-title">Đề ôn tập & thi thử</h2>' + addTestBtn + '<div class="test-list">' + cards + "</div>";
  }

  function startTest(id) {
    var t = null;
    for (var i = 0; i < (DATA.tests || []).length; i++) if (DATA.tests[i].id === id) t = DATA.tests[i];
    if (!t) return;
    state.test = { t: t, i: 0, answers: {}, t0: Date.now(), limit: (t.timeMin || 30) * 60 };
    renderPracticeOnly();
  }
  function testElapsed() { return state.test ? Math.floor((Date.now() - state.test.t0) / 1000) : 0; }
  function testQHTML() {
    var T = state.test;
    var it = T.t.qs[T.i];
    var elapsed = testElapsed();
    var left = Math.max(0, T.limit - elapsed);
    var mm = String(Math.floor(left / 60)).padStart(2, "0"), ss = String(left % 60).padStart(2, "0");
    var opts = parseOpts(it.o);
    var ans = T.answers[T.i];
    var editQBtns = state.editMode ? '<div class="edit-item-btns" style="margin-left:auto">' +
      '<button class="btn ghost tiny edit-btn" data-act="editTestQ" data-i="' + T.i + '">' + ico("edit") + ' Sửa câu này</button>' +
      '<button class="btn warn tiny del-btn" data-act="deleteTestQ" data-i="' + T.i + '">' + ico("trash") + ' Xoá câu này</button>' +
      '<button class="btn primary tiny add-btn" data-act="addTestQ">' + ico("plus") + ' Thêm câu</button>' +
    '</div>' : '';

    var head = '<div class="q-top"><span class="q-count">' + esc(T.t.title) + " · Câu " + (T.i + 1) + " / " + T.t.qs.length + "</span>" +
      editQBtns +
      '<span class="timer ' + (left < 60 ? "late" : "") + '">' + ico("clock") + " <b>" + mm + ":" + ss + "</b></span></div>" + bankKindBadge(it.k);
    var body = "";
    if (it.sub && it.sub.length) {
      var clusterAns = (typeof ans === "object" && ans !== null) ? ans : {};
      body = '<div class="tf-cluster-container">' +
        it.sub.map(function (sItem) {
          var sVal = clusterAns[sItem.id];
          var truePicked = (sVal === "true");
          var falsePicked = (sVal === "false");
          return '<div class="tf-cluster-row">' +
            '<div class="tfc-statement"><span class="tfc-label">' + esc(sItem.id) + ')</span> <span class="tfc-desc">' + fmt(sItem.q) + '</span></div>' +
            '<div class="tfc-buttons">' +
              '<button type="button" class="tf-opt' + (truePicked ? ' picked' : '') + '" data-act="testPickCluster" data-sub="' + esc(sItem.id) + '" data-p="true">' + ico("ok") + ' Đúng</button>' +
              '<button type="button" class="tf-opt' + (falsePicked ? ' picked' : '') + '" data-act="testPickCluster" data-sub="' + esc(sItem.id) + '" data-p="false">' + ico("no") + ' Sai</button>' +
            '</div>' +
          '</div>';
        }).join("") +
      '</div>';
    } else if (it.k === "m" || it.k === "mc") {
      body = '<div class="mcq-opts">' + opts.map(function (o) {
        return '<button class="mcq-opt' + (ans === o.k ? " picked" : "") + '" data-act="testPick" data-p="' + esc(o.k) + '"><span class="opt-key">' + esc(o.k) + '.</span><span class="opt-text">' + fmt(o.t) + '</span></button>';
      }).join("") + "</div>";
    } else if (it.k === "tf") {
      body = '<div class="tf-opts">' +
        ['true', 'false'].map(function (p, i) {
          return '<button class="tf-opt' + (ans === p ? " picked" : "") + '" data-act="testPick" data-p="' + p + '">' + (i ? ico("no") + " Sai" : ico("ok") + " Đúng") + "</button>";
        }).join("") + "</div>";
    } else {
      var v = ans || "";
      body = '<div class="short-ans-box num-row">' +
        '<input class="num-in short-ans-input" data-act="testNum" value="' + esc(v) + '" placeholder="Nhập đáp số (số hoặc chữ)…" autocomplete="off">' +
        (it.u ? '<span class="num-unit">' + esc(it.u) + "</span>" : "") +
        '<button class="btn primary" data-act="testPick" data-p="save">Lưu</button></div>';
    }
    var prevBtn = '<button class="btn ghost" data-act="testPrev"' + (T.i > 0 ? '' : ' disabled') + '>← Câu trước</button>';
    var nextBtn = (T.i + 1 < T.t.qs.length)
      ? '<button class="btn ghost" data-act="testNext">Câu sau →</button>'
      : '<button class="btn ghost" disabled>Câu sau →</button>';
    var submitBtn = '<button class="btn good" data-act="testSubmit">Nộp bài</button>';

    return '<div class="test-q">' + head +
      "<p class='q-text'>" + fmt(it.q) + "</p>" + getSvg(it) + body +
      '<div class="q-nav">' +
        prevBtn +
        '<div style="display:flex;gap:8px;align-items:center">' +
          nextBtn +
          submitBtn +
        '</div>' +
      "</div>" +
    "</div>";
  }
  function testPalette() {
    var T = state.test;
    var chips = T.t.qs.map(function (it, i) {
      var cls = "pal-c";
      if (T.answers[i] !== undefined && T.answers[i] !== "" && T.answers[i] !== null) cls += " done";
      if (i === T.i) cls += " cur";
      return '<button class="' + cls + '" data-act="testJump" data-i="' + i + '">' + (i + 1) + "</button>";
    }).join("");
    return '<div class="test-palette"><div class="pal-label">Bảng câu hỏi</div><div class="pal-chips">' + chips + "</div></div>";
  }
  function renderTestSession() {
    return '<div class="test-session"><div class="test-wrap">' + testPalette() + testQHTML() + "</div></div>";
  }
  function testPick(p) {
    var T = state.test;
    if (p === "save") {
      var inp = $(".num-in", $("#app"));
      if (inp) T.answers[T.i] = inp.value;
    } else {
      T.answers[T.i] = p;
    }
    // In-place button highlight to prevent scroll jumping
    var qWrap = $(".test-q");
    if (qWrap && p !== "save") {
      $$(".mcq-opt, .tf-opt", qWrap).forEach(function(btn) {
        var optVal = btn.getAttribute("data-p");
        btn.classList.toggle("picked", optVal === p);
      });
      var palChip = $('.pal-c[data-i="' + T.i + '"]');
      if (palChip) palChip.classList.add("done");
    } else {
      renderPracticeOnly();
    }
  }
  function testSubmit() {
    var T = state.test;
    var total = T.t.qs.length;
    var rawScore = 0;
    var maxScore = 0;
    var details = [];
    T.t.qs.forEach(function (it, i) {
      var ans = T.answers[i];
      var ok = false;
      if (it.sub && it.sub.length) {
        var subAns = (typeof ans === "object" && ans !== null) ? ans : {};
        var subCorrectCount = 0;
        var subDetails = it.sub.map(function (sItem) {
          var sPicked = subAns[sItem.id];
          var sOk = (String(sPicked) === String(sItem.a));
          if (sOk) subCorrectCount++;
          return { id: sItem.id, q: sItem.q, picked: sPicked, a: sItem.a, ok: sOk, e: sItem.e };
        });
        var earnedPts = subCorrectCount === 4 ? 1.0 : subCorrectCount === 3 ? 0.5 : subCorrectCount === 2 ? 0.25 : subCorrectCount === 1 ? 0.1 : 0.0;
        ok = (subCorrectCount === it.sub.length);
        rawScore += earnedPts;
        maxScore += 1.0;
        details.push({ it: it, ans: subAns, ok: ok, subDetails: subDetails, earnedPts: earnedPts });
      } else if (it.k === "n" || it.k === "num" || it.k === "sa") {
        ok = checkNum(ans, it);
        var qWeight = (total === 28 ? 0.25 : 1);
        if (ok) rawScore += qWeight;
        maxScore += qWeight;
        details.push({ it: it, ans: ans, ok: ok });
      } else {
        ok = (String(ans) === String(it.a));
        var qWeight = (total === 28 ? 0.25 : 1);
        if (ok) rawScore += qWeight;
        maxScore += qWeight;
        details.push({ it: it, ans: ans, ok: ok });
      }
    });
    var score = maxScore ? Math.round((rawScore / maxScore) * 100) / 10 : 0;
    var s = profile();
    s.tests[T.t.id] = Math.round(score * 10) / 10;
    save(s);
    activity();
    T.details = details; T.done = true; T.score = score; T.total = total;
    renderPracticeOnly();
  }
  function renderTestResult() {
    var T = state.test;
    var wrong = T.details.filter(function (d) { return !d.ok; }).length;
    var color = T.score >= 8 ? "var(--ok)" : T.score >= 5 ? "var(--gold)" : "var(--warn)";
    var rows = T.details.map(function (d, i) {
      var badge = d.ok ? '<span class="rst-badge ok">' + ico("ok") + "</span>" : '<span class="rst-badge bad">' + ico("no") + "</span>";
      var yourAns = "";
      if (d.subDetails) {
        yourAns = '<div class="tfc-review-box">' +
          d.subDetails.map(function (sd) {
            var sBadge = sd.ok ? '<span class="rst-badge ok tiny">' + ico("ok") + ' Đúng</span>' : '<span class="rst-badge bad tiny">' + ico("no") + ' Sai</span>';
            var pickedStr = sd.picked === "true" ? "Đúng" : sd.picked === "false" ? "Sai" : "Chưa chọn";
            var ansStr = sd.a === "true" ? "Đúng" : "Sai";
            return '<div class="tfc-review-row ' + (sd.ok ? 'is-ok' : 'is-bad') + '">' +
              '<div class="tfc-rev-head"><b>' + esc(sd.id) + ')</b> ' + fmt(sd.q) + ' ' + sBadge + '</div>' +
              '<div class="tfc-rev-ans">Bạn chọn: <b>' + pickedStr + '</b> · Đáp án đúng: <b>' + ansStr + '</b></div>' +
              (sd.e ? '<div class="tfc-rev-exp">' + fmt(sd.e) + '</div>' : '') +
            '</div>';
          }).join("") +
        '</div>';
      } else if (!d.ok) {
        if (d.it.k === "m" || d.it.k === "mc") yourAns = "Bạn chọn: " + (d.ans || "—") + "<br>Đáp án đúng: " + esc(d.it.a) + ". " + fmt(optionText(d.it, d.it.a));
        else if (d.it.k === "tf") yourAns = "Bạn chọn: " + (d.ans === "true" ? "Đúng" : d.ans === "false" ? "Sai" : "—") + "<br>Đáp án: " + (d.it.a === "true" ? "Đúng" : "Sai");
        else yourAns = "Bạn gõ: " + esc(d.ans || "—") + "<br>Đáp án đúng: " + fmt(d.it.a) + (d.it.u ? " " + esc(d.it.u) : "");
      }
      var openAttr = d.ok ? "" : " open";
      return "<details class='rst-row'" + openAttr + ">" +
        "<summary>" + badge + " Câu " + (i + 1) + " — " + (d.ok ? "đúng" : "sai") + "</summary>" +
        "<p class='small'>" + fmt(d.it.q) + "</p>" +
        getSvg(d.it, true) +
        (yourAns ? "<p class='small'>" + yourAns + "</p>" : "") +
        (d.it.e ? "<p class='small exp'>" + fmt(d.it.e) + "</p>" : "") +
        ((d.it.ch || T.t.ch) ? "<div style='margin-top:8px'><button class='btn ghost tiny' data-act='jumpToTheory' data-ch='" + (d.it.ch || T.t.ch) + "'>" + ico("bookOpen") + " Xem trong lý thuyết →</button></div>" : "") +
      "</details>";
    }).join("");
    return '<div class="test-result">' +
      '<div class="score-hero" style="--sc:' + color + '">' +
        '<div class="score-big">' + T.score + '<span class="t10">/10</span></div>' +
        '<p>Đúng <b>' + (T.total - wrong) + "</b> / " + T.total + " câu · " +
        (T.score >= 8 ? "Nắm rất vững!" : T.score >= 5 ? "Khá ổn, cần rèn thêm bài tập." : "Cần ôn kỹ lại lý thuyết.") + "</p>" +
        '<div class="score-actions">' +
          '<button class="btn primary" data-act="testAgain">Làm lại đề này</button>' +
          (wrong ? '<button class="btn warn" data-act="testWrong">Ôn lại ' + wrong + " câu sai</button>" : "") +
          '<button class="btn ghost" data-act="testQuit">Về danh sách đề</button>' +
        "</div>" +
      "</div>" +
      '<div class="rst-list">' + rows + "</div>" +
    "</div>";
  }
  function optionText(it, letter) {
    var opts = parseOpts(it.o);
    for (var i = 0; i < opts.length; i++) if (opts[i].k === letter) return opts[i].t;
    return "";
  }

  /* ═══════════ VIEW: HỌC CÓ HƯỚNG DẪN (GUIDED LEARNING) ═══════════ */
  function renderGuided() {
    var chs = chaptersForGrade(state.grade).filter(function (c) { return c.id !== "g11cq"; });
    if (!chs.length) return "<p>Không tìm thấy chương nào.</p>";
    if (!state.guided.ch) state.guided.ch = chs[0].id;
    var curChId = state.guided.ch;
    var ch = DATA[curChId];
    var meta = chapterMeta(curChId);

    // Get stages for this chapter
    var stages = (ch && Array.isArray(ch.guidedStages) && ch.guidedStages.length)
      ? ch.guidedStages
      : (DEFAULT_GUIDED_STAGES[curChId] || DEFAULT_GUIDED_STAGES.g12c1);

    var curIdx = Math.min(state.guided.stageIdx || 0, stages.length - 1);
    var curStage = stages[curIdx];

    var chSel = chapterDropdown("guided-ch-sel", curChId, chs, "Chọn chương học");
    var addStageBtn = state.editMode ? '<button class="btn primary small add-btn" data-act="addGuidedStage" data-ch="' + curChId + '">' + ico("plus") + ' Thêm chặng học mới</button>' : '';

    var stepperHtml = stages.map(function (st, idx) {
      var cls = "stage-step";
      if (idx === curIdx) cls += " active";
      return '<button class="' + cls + '" data-act="guidedJump" data-i="' + idx + '">' +
        '<span class="stage-num">Chặng ' + (idx + 1) + '</span>' +
        '<span class="stage-name">' + esc(st.title) + '</span>' +
      '</button>';
    }).join("");

    var editStageBtns = state.editMode ? '<div class="edit-item-btns">' +
      '<button class="btn ghost tiny edit-btn" data-act="editGuidedStage" data-ch="' + curChId + '" data-i="' + curIdx + '">' + ico("edit") + ' Sửa chặng</button>' +
      '<button class="btn warn tiny del-btn" data-act="deleteGuidedStage" data-ch="' + curChId + '" data-i="' + curIdx + '">' + ico("trash") + ' Xoá chặng</button>' +
    '</div>' : '';

    // Checkpoint interaction
    var check = curStage.check || {
      q: curStage.q || "",
      opts: typeof curStage.opts === "string" ? curStage.opts : (Array.isArray(curStage.opts) ? curStage.opts.map(function(o){ return o.k + "=" + o.t; }).join(";") : ""),
      a: curStage.ans || curStage.a || "A",
      exp: curStage.explain || curStage.exp || "",
      hint: curStage.hint || "Xem lại phần bản chất cốt lõi bên trên."
    };
    var checkOpts = parseOpts(check.opts);
    var isChecked = state.guided.checked;
    var pickedOpt = state.guided.pickedOpt;
    var isCorrect = isChecked && pickedOpt === check.a;

    var checkOptsHtml = checkOpts.map(function (o) {
      var cls = "checkpoint-opt";
      var badge = "";
      if (isChecked) {
        if (o.k === check.a) {
          cls += " reveal-correct";
          badge = ' <span class="opt-badge-correct">' + ico("check") + ' Đáp án đúng</span>';
        }
        if (pickedOpt === o.k) {
          cls += " picked " + (o.k === check.a ? "correct" : "wrong");
          if (o.k !== check.a) {
            badge = ' <span class="opt-badge-wrong">' + ico("close") + ' Lựa chọn của bạn</span>';
          }
        }
      }
      return '<button class="' + cls + '" data-act="guidedPick" data-k="' + esc(o.k) + '" ' + (isChecked ? 'disabled' : '') + '>' +
        '<span class="opt-key">' + esc(o.k) + '.</span><span class="opt-text">' + fmt(o.t) + badge + '</span>' +
      '</button>';
    }).join("");

    var feedbackHtml = "";
    if (isChecked) {
      feedbackHtml = buildGuidedFeedback(curStage, check, checkOpts, pickedOpt, isCorrect);
    }

    return renderEditPromptBar("chặng học có hướng dẫn Feynman") + '<div class="guided-container">' +
      '<div class="guided-header" style="flex-wrap:wrap;gap:12px">' +
        '<div>' +
          '<h2>' + ico("bulb") + ' Học có hướng dẫn · Phương pháp Feynman</h2>' +
          '<p class="muted small">Từng bước làm chủ kiến thức: Trực giác đời sống → Cơ chế cốt lõi → Bẫy nhận diện → Thử thách chốt chặng.</p>' +
        '</div>' +
        '<div style="min-width:220px">' + chSel + '</div>' +
      '</div>' +
      addStageBtn +
      '<div class="stage-stepper">' + stepperHtml + '</div>' +
      '<div class="guided-card">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
          '<h3 style="margin:0;font-family:var(--font-display);font-size:1.25rem">' + esc(curStage.title) + '</h3>' +
          editStageBtns +
        '</div>' +
        '<div class="guided-section">' +
          '<div class="guided-sec-title hook">' + ico("flame") + ' 1. Trực giác đời sống (Feynman Hook)</div>' +
          '<p class="guided-text" ' + (state.editMode ? 'data-inline-edit="guided-hook" data-ch="' + curChId + '" data-idx="' + curIdx + '" contenteditable="true" spellcheck="false" title="Nhấp trực tiếp để sửa trực giác Feynman"' : '') + '>' + fmt(curStage.hook) + '</p>' +
        '</div>' +
        (curStage.predict ? renderGuidedPredict(curStage.predict, curChId, curIdx) : '') +
        '<div class="guided-section">' +
          '<div class="guided-sec-title core">' + ico("flask") + ' ' + (curStage.predict ? '3.' : '2.') + ' Bản chất & Cơ chế cốt lõi</div>' +
          '<div class="guided-box core-box" ' + (state.editMode ? 'data-inline-edit="guided-core" data-ch="' + curChId + '" data-idx="' + curIdx + '" contenteditable="true" spellcheck="false" title="Nhấp trực tiếp để sửa bản chất cốt lõi"' : '') + '>' + fmt(curStage.core) + '</div>' +
        '</div>' +
        (curStage.caseStudy ? ('<div class="guided-section">' +
          '<div class="guided-sec-title case">' + ico("search") + ' ' + (curStage.predict ? '4.' : '3.') + ' Case Study: Thực nghiệm & Ứng dụng thực tế</div>' +
          '<div class="guided-box case-box" ' + (state.editMode ? 'data-inline-edit="guided-case" data-ch="' + curChId + '" data-idx="' + curIdx + '" contenteditable="true" spellcheck="false" title="Nhấp trực tiếp để sửa case study"' : '') + '>' + fmt(curStage.caseStudy) + '</div>' +
        '</div>') : '') +
        ((window.ChemLab && ChemLab.hasLab(curChId, curIdx)) ? ChemLab.renderWidget(curChId, curIdx) : '') +
        '<div class="guided-section">' +
          '<div class="guided-sec-title trap">' + ico("alert") + ' ' + (curStage.predict ? (curStage.caseStudy ? '5.' : '4.') : (curStage.caseStudy ? '4.' : '3.')) + ' Điểm bẫy thi cử & Phân tích đa điều kiện</div>' +
          '<div class="guided-box trap-box" ' + (state.editMode ? 'data-inline-edit="guided-trap" data-ch="' + curChId + '" data-idx="' + curIdx + '" contenteditable="true" spellcheck="false" title="Nhấp trực tiếp để sửa điểm bẫy"' : '') + '>' + fmt(curStage.trap) + '</div>' +
        '</div>' +
        '<div class="guided-section">' +
          '<div class="guided-sec-title check">' + ico("target") + ' ' + (curStage.predict ? (curStage.caseStudy ? '6.' : '5.') : (curStage.caseStudy ? '5.' : '4.')) + ' Thử thách kiểm tra làm chủ (Bản chất + Vận dụng + Tính toán)</div>' +
          '<div class="checkpoint-box">' +
            '<div class="checkpoint-q">' + fmt(check.q) + '</div>' +
            '<div class="checkpoint-opts">' + checkOptsHtml + '</div>' +
            feedbackHtml +
          '</div>' +
        '</div>' +
        '<div class="guided-stage-nav">' +
          '<button class="btn ghost" data-act="guidedPrevStage"' + (curIdx === 0 ? ' disabled' : '') + '>← Chặng trước</button>' +
          '<span class="muted small" style="font-weight:600">Chặng ' + (curIdx + 1) + ' / ' + stages.length + '</span>' +
          '<button class="btn primary" data-act="guidedNextStage"' + (curIdx + 1 >= stages.length ? ' disabled' : '') + '>Chặng tiếp theo →</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /* ---------- GUIDED PREDICT-BEFORE-REVEAL (ACTIVE BET & CURIOSITY GAP) ---------- */
  function renderGuidedPredict(predict, chId, stageIdx) {
    if (!predict) return "";
    var stageKey = chId + "_" + stageIdx;
    var s = profile();
    s.guidedPredictions = s.guidedPredictions || {};
    var record = s.guidedPredictions[stageKey];
    var isDone = !!record;
    var opts = parseOpts(predict.opts);

    var optsHtml = opts.map(function (o) {
      var cls = "predict-opt-btn";
      var badge = "";
      if (isDone) {
        if (o.k === predict.a) {
          cls += " is-correct";
          badge = ' <span class="p-badge ok">' + ico("check") + ' Dự đoán chuẩn</span>';
        }
        if (record.picked === o.k) {
          cls += " picked " + (o.k === predict.a ? "correct" : "wrong");
          if (o.k !== predict.a) {
            badge = ' <span class="p-badge wrong">' + ico("alert") + ' Bạn đã chọn</span>';
          }
        }
      }
      return '<button class="' + cls + '" data-act="guidedPredict" data-k="' + esc(o.k) + '" ' + (isDone ? 'disabled' : '') + '>' +
        '<span class="p-opt-key">' + esc(o.k) + '.</span> ' +
        '<span class="p-opt-text">' + fmt(o.t) + '</span>' + badge +
      '</button>';
    }).join("");

    var feedbackHtml = "";
    if (isDone) {
      var wasRight = record.picked === predict.a;
      feedbackHtml = '<div class="predict-feedback-box ' + (wasRight ? 'ok' : 'alert') + '">' +
        '<div class="pf-header">' +
          (wasRight
            ? '<span class="pf-badge ok">' + ico("sparkles") + ' Trực giác xuất sắc!</span> <b>Bạn đã phán đoán rất chính xác hiện tượng. (+15 XP)</b>'
            : '<span class="pf-badge alert">' + ico("bulb") + ' Bẫy trực giác thường gặp!</span> <b>Bạn đã rơi vào suy luận phổ biến trong đề thi: (+8 XP)</b>') +
        '</div>' +
        '<div class="pf-body">' + fmt(predict.insight) + '</div>' +
        '<div class="pf-cue">' + ico("sparkles") + ' Khám phá tiếp <b>Bản chất cốt lõi</b> và <b>Thí nghiệm tương tác</b> bên dưới để làm chủ cơ chế!</div>' +
      '</div>';
    } else {
      feedbackHtml = '<div class="predict-prompt-cue">' +
        ico("bulb") + ' <i>Chủ động đặt cược một giả thuyết giúp não bộ kích hoạt sự tò mò và ghi nhớ sâu gấp 3 lần! Hãy bấm chọn 1 phương án dự đoán.</i>' +
      '</div>';
    }

    return '<div class="guided-section predict-section">' +
      '<div class="guided-sec-title predict">' + ico("sparkles") + ' 2. Dự đoán hiện tượng (Curiosity Gap & Active Bet)</div>' +
      '<div class="predict-card-box">' +
        '<div class="predict-q">' + fmt(predict.q) + '</div>' +
        '<div class="predict-opts-grid">' + optsHtml + '</div>' +
        feedbackHtml +
      '</div>' +
    '</div>';
  }

  function guidedPredict(k) {
    var curCh = state.guided.ch;
    var ch = DATA[curCh];
    var stages = (ch && ch.guidedStages) || DEFAULT_GUIDED_STAGES[curCh] || DEFAULT_GUIDED_STAGES.g12c1;
    var stageIdx = state.guided.stageIdx || 0;
    var curStage = stages[stageIdx];
    if (!curStage || !curStage.predict) return;

    var stageKey = curCh + "_" + stageIdx;
    var s = profile();
    s.guidedPredictions = s.guidedPredictions || {};
    if (s.guidedPredictions[stageKey]) return; // Khóa sau khi đã cược

    var isCorrect = (k === curStage.predict.a);
    s.guidedPredictions[stageKey] = { picked: k, isCorrect: isCorrect };
    addXP(s, curCh, isCorrect ? 15 : 8);
    save(s);

    var box = $(".predict-card-box");
    if (box) {
      var newHtml = renderGuidedPredict(curStage.predict, curCh, stageIdx);
      var tmp = document.createElement("div");
      tmp.innerHTML = newHtml;
      var newBox = tmp.querySelector(".predict-card-box");
      if (newBox) {
        box.innerHTML = newBox.innerHTML;
        if (hasGSAP && !prefersReduced) {
          gsap.fromTo($(".predict-feedback-box", box), { opacity: 0, y: 10, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: "power2.out" });
        }
      }
      updateHeaderStats(isCorrect);
    } else {
      render(false);
    }
  }

  function buildGuidedFeedback(curStage, check, checkOpts, pickedOpt, isCorrect) {
    var pickedObj = checkOpts.find(function (o) { return o.k === pickedOpt; }) || { t: pickedOpt };
    var correctObj = checkOpts.find(function (o) { return o.k === check.a; }) || { t: check.a };

    var breakdown = check.breakdown || curStage.breakdown;
    var breakdownHtml = "";
    if (breakdown) {
      var rows = checkOpts.map(function(o) {
        var isOAns = (o.k === check.a);
        var itemText = breakdown[o.k] || "";
        return '<div class="breakdown-row ' + (isOAns ? 'is-correct' : 'is-wrong') + '">' +
          '<div class="bdr-key"><b>' + esc(o.k) + '</b></div>' +
          '<div class="bdr-content">' +
            '<div class="bdr-opt-text">' + fmt(o.t) + '</div>' +
            (itemText ? '<div class="bdr-analysis">' + (isOAns ? '<span class="bdr-badge good">' + ico("check") + ' Đúng</span> ' : '<span class="bdr-badge warn">' + ico("close") + ' Tại sao sai:</span> ') + fmt(itemText) + '</div>' : '') +
          '</div>' +
        '</div>';
      }).join("");
      breakdownHtml = '<div class="fb-section-box breakdown-box">' +
        '<div class="fb-sec-title">' + ico("choose") + ' <b>Giải phẫu từng phương án (Tại sao đúng / Tại sao sai?):</b></div>' +
        '<div class="breakdown-list">' + rows + '</div>' +
      '</div>';
    }

    var trapHtml = "";
    var trap = check.trap || curStage.trap;
    if (trap) {
      trapHtml = '<div class="fb-section-box flaw">' +
        '<div class="fb-sec-title">' + ico("alert") + ' <b>Tử huyệt & Bẫy đề thi cần né:</b></div>' +
        '<div class="fb-sec-desc">' + fmt(trap) + '</div>' +
      '</div>';
    }

    var mnemonicHtml = "";
    var mnemonic = check.mnemonic || curStage.mnemonic;
    if (mnemonic) {
      mnemonicHtml = '<div class="fb-section-box mnemonic-box">' +
        '<div class="fb-sec-title">' + ico("sparkles") + ' <b>Khẩu quyết ghi nhớ & Mẹo phản xạ 3 giây:</b></div>' +
        '<div class="mnemonic-quote">' + fmt(mnemonic) + '</div>' +
      '</div>';
    }

    var compHtml = "";
    if (!isCorrect) {
      compHtml = '<div class="fb-comparison">' +
        '<div class="fb-comp-row correct">' +
          '<span class="fb-comp-label">' + ico("check") + ' Đáp án đúng:</span>' +
          '<span class="fb-comp-val"><b>' + esc(check.a) + '.</b> ' + fmt(correctObj.t) + '</span>' +
        '</div>' +
        '<div class="fb-comp-row wrong">' +
          '<span class="fb-comp-label">' + ico("close") + ' Bạn đã chọn:</span>' +
          '<span class="fb-comp-val"><b>' + esc(pickedOpt) + '.</b> ' + fmt(pickedObj.t) + '</span>' +
        '</div>' +
      '</div>' +
      (check.hint ? '<div class="fb-section-box hint">' +
        '<div class="fb-sec-title">' + ico("search") + ' <b>Gợi ý tư duy đúng hướng:</b></div>' +
        '<div class="fb-sec-desc">' + fmt(check.hint) + '</div>' +
      '</div>' : '');
    }

    var headerHtml = isCorrect
      ? '<div class="fb-header"><span class="fb-badge ok">' + ico("check") + ' Chính xác!</span> <b>Bạn đã hiểu đúng bản chất câu hỏi. (+25 XP)</b></div>'
      : '<div class="fb-header"><span class="fb-badge bad">' + ico("close") + ' Chưa chính xác</span> <b>Phân tích lỗi sai & Chẩn đoán tư duy:</b></div>';

    return '<div class="checkpoint-feedback ' + (isCorrect ? 'ok' : 'bad') + '">' +
      headerHtml +
      compHtml +
      '<div class="fb-section-box exp">' +
        '<div class="fb-sec-title">' + ico("bulb") + ' <b>Bản chất khoa học & Cơ chế phản ứng:</b></div>' +
        '<div class="fb-sec-desc">' + fmt(check.exp) + '</div>' +
      '</div>' +
      breakdownHtml +
      trapHtml +
      mnemonicHtml +
      '<div class="fb-action" style="display:flex;gap:10px;align-items:center;margin-top:14px;flex-wrap:wrap">' +
        '<button class="btn ghost small" data-act="guidedPrevStage">← Chặng trước</button>' +
        '<button class="btn primary small" data-act="guidedNextStage">Chặng tiếp theo →</button>' +
      '</div>' +
    '</div>';
  }

  function guidedPick(k) {
    var curCh = state.guided.ch;
    var ch = DATA[curCh];
    var stages = (ch && ch.guidedStages) || DEFAULT_GUIDED_STAGES[curCh] || DEFAULT_GUIDED_STAGES.g12c1;
    var stageIdx = state.guided.stageIdx || 0;
    var curStage = stages[stageIdx];
    var checkObj = curStage.check || curStage;
    var correctAns = (checkObj.a || checkObj.ans || "A");

    // BUG FIX 1: Lock stage once answered to completely prevent spam-clicking XP!
    state.guided.answeredStages = state.guided.answeredStages || {};
    var stageKey = curCh + "_" + stageIdx;
    if (state.guided.answeredStages[stageKey]) {
      return; // Already answered and locked!
    }

    var isCorrect = (k === correctAns);
    state.guided.pickedOpt = k;
    state.guided.checked = true;
    state.guided.answeredStages[stageKey] = { picked: k, isCorrect: isCorrect };

    if (isCorrect) {
      addXP(profile(), curCh, 25);
    }

    // In-place update: zero scroll movement or reflow
    var box = $(".checkpoint-box");
    if (box) {
      var check = curStage.check ? curStage.check : {
        q: curStage.q || "",
        opts: typeof curStage.opts === "string" ? curStage.opts : (Array.isArray(curStage.opts) ? curStage.opts.map(function(o){ return o.k + "=" + o.t; }).join(";") : ""),
        a: correctAns,
        exp: curStage.explain || curStage.exp || "",
        hint: curStage.hint || ""
      };
      var checkOpts = parseOpts(check.opts);

      // BUG FIX 2: When wrong, reveal the correct answer and lock buttons permanently
      var checkOptsHtml = checkOpts.map(function (o) {
        var cls = "checkpoint-opt";
        var badge = "";
        if (o.k === check.a) {
          cls += " reveal-correct";
          badge = ' <span class="opt-badge-correct">' + ico("check") + ' Đáp án đúng</span>';
        }
        if (k === o.k) {
          cls += " picked " + (o.k === check.a ? "correct" : "wrong");
          if (o.k !== check.a) {
            badge = ' <span class="opt-badge-wrong">' + ico("close") + ' Lựa chọn của bạn</span>';
          }
        }
        return '<button class="' + cls + '" data-act="guidedPick" data-k="' + esc(o.k) + '" disabled>' +
          '<span class="opt-key">' + esc(o.k) + '.</span><span class="opt-text">' + fmt(o.t) + badge + '</span>' +
        '</button>';
      }).join("");

      var feedbackHtml = buildGuidedFeedback(curStage, check, checkOpts, k, isCorrect);

      box.innerHTML = '<div class="checkpoint-q">' + fmt(check.q) + '</div>' +
        '<div class="checkpoint-opts">' + checkOptsHtml + '</div>' +
        feedbackHtml;

      // MOTION POLISH: Calm, non-intrusive subtle animation (no violent shaking or cartoon elastic)
      var clickedBtn = $('[data-act="guidedPick"][data-k="' + k + '"]', box);
      if (clickedBtn && hasGSAP && !prefersReduced) {
        gsap.fromTo(clickedBtn, { scale: 0.98 }, { scale: 1, duration: 0.2, ease: "power2.out", clearProps: "transform" });
        gsap.fromTo($(".checkpoint-feedback", box), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" });
      }
      updateHeaderStats(isCorrect);
    } else {
      render();
    }
  }

  function guidedPrevStage() {
    if (state.guided && state.guided.stageIdx > 0) {
      state.guided.stageIdx--;
      var curCh = state.guided.ch;
      var stageKey = curCh + "_" + state.guided.stageIdx;
      var prevAnswer = state.guided.answeredStages && state.guided.answeredStages[stageKey];
      state.guided.checked = !!prevAnswer;
      state.guided.pickedOpt = prevAnswer ? prevAnswer.picked : null;
      render(false);
      var target = $(".guided-card") || $(".guided-container");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }
  function guidedNextStage() {
    var curCh = state.guided.ch;
    var ch = DATA[curCh];
    var stages = (ch && ch.guidedStages) || DEFAULT_GUIDED_STAGES[curCh] || DEFAULT_GUIDED_STAGES.g12c1;
    if (state.guided.stageIdx + 1 < stages.length) {
      state.guided.stageIdx++;
      var curCh2 = state.guided.ch;
      var stageKey2 = curCh2 + "_" + state.guided.stageIdx;
      var prevAnswer2 = state.guided.answeredStages && state.guided.answeredStages[stageKey2];
      state.guided.checked = !!prevAnswer2;
      state.guided.pickedOpt = prevAnswer2 ? prevAnswer2.picked : null;
      render(false);
      // Smoothly scroll to the top of the guided card so student can read from start
      var target = $(".guided-card") || $(".guided-container");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      alert("Chúc mừng bạn đã hoàn thành trọn vẹn toàn bộ các chặng học của chương này!");
    }
  }

  /* ═══════════ VIEW: KIỂM TRA CÓ HƯỚNG DẪN (COACH TESTING & DIAGNOSTIC SIMULATOR) ═══════════ */

  var COACH_CASE_STUDIES = {
    ester_flavor: {
      tag: "Hương liệu & Mỹ phẩm",
      title: "Mùi hương hoa quả tự nhiên từ các ester phân tử nhỏ",
      text: "Các ester có phân tử khối thấp và trung bình thường có mùi thơm đặc trưng của các loại hoa quả chín: isoamyl acetate mang hương chuối chín; benzyl acetate thơm ngát mùi hoa nhài; ethyl formate có mùi thơm của quả đào, mâm xôi; ethyl butyrate thoang thoảng hương dứa chín. Do tính an toàn cao và dễ bay hơi, chúng được ứng dụng làm chất tạo hương trong bánh kẹo, đồ uống giải khát, nước hoa và mỹ phẩm."
    },
    ester_solvent: {
      tag: "Dung môi công nghiệp",
      title: "Ethyl acetate – Dung môi phân cực xanh trong công nghiệp & Đời sống",
      text: "Ethyl acetate (CH₃COOC₂H₅) là một trong những dung môi hữu cơ quan trọng nhất nhờ độc tính rất thấp, bay hơi nhanh và hoà tan tuyệt vời các chất hữu cơ như sơn mài, chất kết dính, mực in. Đặc biệt trong thực phẩm, ethyl acetate được dùng trong công nghệ decaf (loại bỏ caffeine khỏi hạt cà phê) mà vẫn bảo toàn hương vị tự nhiên của cà phê."
    },
    saponification: {
      tag: "Sản xuất & Đời sống",
      title: "Cơ chế xà phòng hoá chất béo & Sản xuất xà phòng gia đình",
      text: "Khi đun nóng chất béo (triglyceride như tristearin hoặc triolein) với dung dịch kiềm (NaOH hoặc KOH), phản ứng xà phòng hoá sinh ra hỗn hợp muối natri/kali của các acid béo (xà phòng) và giải phóng glycerol. Glycerol thu hồi được là nguyên liệu quý giá trong y dược học và mỹ phẩm nhờ khả năng giữ ẩm vượt trội cho da."
    },
    detergent_hard_water: {
      tag: "Môi trường & Hoá học tẩy rửa",
      title: "Xà phòng truyền thống vs Chất giặt rửa tổng hợp trong nước cứng",
      text: "Xà phòng thông thường chứa ion carboxylate R-COO⁻. Khi giặt trong nước cứng (chứa nhiều ion Ca²⁺, Mg²⁺), chúng bị kết tủa thành muối canxi/magie stearate không tan, bám dính vào sợi vải gây ố vàng, mục nát và làm mất tác dụng tẩy rửa. Ngược lại, chất giặt rửa tổng hợp (chứa gốc sulfonate R-SO₃⁻Na⁺) không bị kết tủa bởi Ca²⁺, Mg²⁺, giúp duy trì bọt và khả năng làm sạch vượt trội trên mọi nguồn nước."
    },
    glucose_medical: {
      tag: "Y tế & Dược phẩm",
      title: "Dịch truyền tĩnh mạch Glucose 5% & Ứng dụng tráng ruột phích",
      text: "Glucose là carbohydrate đơn giản hấp thu trực tiếp vào máu mà không cần tiêu hoá. Dung dịch glucose 5% (nồng độ đẳng trương) là dịch truyền cấp cứu thiết yếu giúp cung cấp năng lượng lập tức cho bệnh nhân suy nhược, tụt đường huyết. Trong công nghiệp, glucose thu được từ thuỷ phân tinh bột sắn được dùng làm tác nhân khử sạch trong phản ứng tráng gương, tráng ruột phích nước nóng, hoàn toàn thay thế aldehyde độc hại."
    },
    fructose_honey: {
      tag: "Dinh dưỡng & Thực phẩm",
      title: "Fructose – Độ ngọt tự nhiên trong mật ong và trái cây chín",
      text: "Fructose là monosaccharide đồng phân của glucose, chiếm đến 40% khối lượng trong mật ong. Đây là loại đường ngọt nhất trong tự nhiên (ngọt gấp 1,5 lần đường mía saccharose và 2,5 lần glucose). Fructose tồn tại chủ yếu ở dạng mạch vòng, trong dung dịch kiềm có thể chuyển hoá thuận nghịch thành glucose nên fructose vẫn tham gia phản ứng tráng bạc và khử Cu(OH)₂."
    },
    saccharose_inversion: {
      tag: "Công nghệ thực phẩm",
      title: "Đường nghịch đảo – Bí quyết chống 'lại đường' trong mứt kẹo",
      text: "Saccharose (đường mía) là disaccharide không có nhóm -OH hemiacetal tự do nên không có tính khử và không tráng bạc. Trong sản xuất mứt tết, kẹo mềm và siro cao cấp, người ta đun saccharose với xúc tác acid để thuỷ phân thành hỗn hợp glucose và fructose tỉ lệ 1:1 (gọi là đường nghịch đảo). Đường nghịch đảo có độ ngọt sâu hơn và ngăn chặn hiện tượng kết tinh lại các tinh thể đường hạt."
    },
    cellulose_industry: {
      tag: "Vật liệu sinh học",
      title: "Cellulose – Trụ cột vật liệu xanh & Thuốc súng không khói",
      text: "Cellulose là polymer tự nhiên phong phú nhất trên Trái Đất, cấu tạo từ các mắt xích β-glucose liên kết chặt chẽ bởi liên kết hydrogen tạo thành các bó sợi siêu bền. Không chỉ là nguyên liệu sản xuất giấy và sợi bông dệt may, cellulose còn được chế hoá thành tơ nhân tạo (viscose, cellulose acetate) và khi ester hoá hoàn toàn với HNO₃ đặc sinh ra cellulose trinitrate – thành phần của thuốc súng không khói."
    },
    amine_fish: {
      tag: "Ẩm thực & Hoá học đời sống",
      title: "Khử mùi tanh của cá bằng acid hữu cơ trong dân gian",
      text: "Mùi tanh khó chịu của cá (nhất là cá nước ngọt như cá mè) chủ yếu bắt nguồn từ các alkylamine phân tử nhỏ bay hơi như dimethylamine và trimethylamine. Vì các amine mang tính base, cha ông ta từ xưa đã có kinh nghiệm dùng chanh (citric acid), giấm ăn (acetic acid), mẻ chua hoặc khế chua để khử tanh. Acid sẽ trung hoà các amine thành muối amoni tan trong nước và không còn bay hơi, loại bỏ triệt để mùi tanh."
    },
    aniline_dyes: {
      tag: "Hoá dầu & Dược phẩm",
      title: "Aniline – Cội nguồn của ngành công nghiệp phẩm nhuộm azo & Paracetamol",
      text: "Aniline (C₆H₅NH₂) là chất lỏng dạng dầu, ít tan trong nước và có độc tính cao. Do cặp electron tự do trên nguyên tử N giải toả vào vòng benzen, tính base của aniline rất yếu (không làm đổi màu quỳ tím), nhưng lại kích hoạt mãnh liệt các vị trí ortho/para trên nhân thơm, tạo kết tủa trắng 2,4,6-tribromoaniline với nước brom. Aniline là tiền chất sống còn để sản xuất thuốc hạ sốt paracetamol và hàng ngàn loại phẩm nhuộm dệt may rực rỡ."
    },
    acetylene_welding: {
      tag: "Cơ khí & Năng lượng",
      title: "Ngọn lửa Oxy-Acetylene 3000°C cắt thép công nghiệp",
      text: "Khi đốt cháy acetylene (C₂H₂) trong dòng khí oxy nguyên chất, nhiệt lượng toả ra cực lớn đẩy nhiệt độ ngọn lửa lên tới trên 3000°C – nóng hơn nhiệt độ nóng chảy của hầu hết các kim loại (sắt thép nóng chảy ở ~1538°C). Ngọn lửa hàn xì oxy-acetylene là công cụ không thể thay thế trong ngành đóng tàu biển, cơ khí chế tạo và sửa chữa cầu đường."
    },
    lpg_gas: {
      tag: "An toàn dân dụng",
      title: "Chất tạo mùi cảnh báo trong bình gas dân dụng LPG",
      text: "Khí dầu mỏ hoá lỏng LPG (chứa propane C₃H₈ và butane C₄H₁₀) là nhiên liệu khí cháy hoàn toàn, sạch và không có mùi tự nhiên. Để đảm bảo an toàn tính mạng cho người sử dụng, các nhà sản xuất bắt buộc phải pha thêm một hàm lượng vi lượng chất tạo mùi có mùi trứng thối đặc trưng (như ethanethiol C₂H₅SH). Khi bình gas bị rò rỉ dù chỉ một lượng cực nhỏ, người trong nhà sẽ lập tức ngửi thấy mùi hôi để khoá van gas kịp thời."
    },
    markovnikov_drugs: {
      tag: "Quy tắc kinh điển",
      title: "Quy tắc Markovnikov – Chiếc kim chỉ nam tổng hợp hữu cơ",
      text: "Quy tắc Markovnikov chỉ ra rằng khi cộng tác nhân bất đối xứng HX (như HCl, HBr, H₂O) vào alkene bất đối xứng, nguyên tử H ưu tiên cộng vào nguyên tử carbon có nhiều hydro hơn (bậc thấp hơn), còn nhóm mang điện tích âm (X hoặc OH) cộng vào carbon có ít hydro hơn (bậc cao hơn). Nguyên lý này giúp các nhà hoá học dự đoán chính xác cấu trúc sản phẩm chính trong tổng hợp các hợp chất thuốc và hoá chất tinh khiết."
    },
    alcohol_methanol_danger: {
      tag: "Pháp y & An toàn sức khoẻ",
      title: "Sự nguy hiểm chết người của cồn công nghiệp Methanol",
      text: "Methanol (CH₃OH) có mùi và vị gần như y hệt ethanol (rượu uống), nhưng độc tính lại vô cùng khủng khiếp. Khi vào cơ thể, gan chuyển hoá methanol thành formaldehyde (HCHO) và formic acid (HCOOH) – các chất độc tích tụ phá huỷ võng mạc và dây thần kinh thị giác gây mù mắt hoàn toàn, đồng thời làm toan máu cấp tính dẫn đến hôn mê và tử vong nhanh chóng."
    },
    phenol_antiseptic: {
      tag: "Y tế & Lịch sử hoá học",
      title: "Phenol – Chất khử trùng phòng mổ đầu tiên trong lịch sử y khoa",
      text: "Vào thế kỷ 19, bác sĩ Joseph Lister đã tạo nên cuộc cách mạng trong y học ngoại khoa khi dùng dung dịch phenol (carbolic acid) để khử trùng dụng cụ mổ và vết thương, giảm tỉ lệ tử vong do nhiễm trùng hậu phẫu từ 50% xuống dưới 15%. Mặc dù ngày nay phenol được thay thế bằng các chất khử khuẩn dịu hơn cho da, phenol vẫn là nguyên liệu chủ lực sản xuất nhựa bakelite, chất dẻo và phẩm nhuộm."
    },
    carboxylic_vinegar: {
      tag: "Đời sống & Gia đình",
      title: "Giấm ăn & Ứng dụng tẩy cặn vôi ấm đun nước",
      text: "Giấm ăn chứa acetic acid (CH₃COOH) nồng độ khoảng 2–5%. Trong sinh hoạt gia đình, giấm ăn là chất tẩy rửa an toàn tuyệt đối dùng để tẩy cặn vôi CaCO₃ bám trong ruột ấm đun nước điện theo phản ứng: 2CH₃COOH + CaCO₃ → (CH₃COO)₂Ca + CO₂↑ + H₂O. Muối canxi acetate tan tốt trong nước và dễ dàng bị rửa trôi, trả lại bề mặt kim loại sáng bóng."
    }
  };

  function resolveCoachChapter(q, test) {
    if (q && q.ch) return q.ch;
    var tid = test ? test.id : "";
    if (tid === "g12t1" || tid === "g12t2" || tid === "g12t3" || tid === "g12t4" || tid === "g12t15") return "g12c1";
    if (tid === "g12t5" || tid === "g12t11" || tid === "g12t12" || tid === "g12t13" || tid === "g12t14") return "g12c2";
    if (tid.startsWith("g11t1")) return "g11c1";
    if (tid.startsWith("g11t2")) return "g11c4";

    var text = ((q ? q.q : "") + " " + (q && q.o ? q.o : "") + " " + (q && q.e ? q.e : "")).toLowerCase();
    if (text.includes("glucose") || text.includes("fructose") || text.includes("saccharose") || text.includes("maltose") || text.includes("tinh bột") || text.includes("cellulose") || text.includes("carbohydrate")) return "g12c2";
    if (text.includes("amine") || text.includes("aniline") || text.includes("amino") || text.includes("bậc amine") || text.includes("nitrogen")) return "g12c3";
    if (text.includes("este") || text.includes("ester") || text.includes("lipit") || text.includes("lipid") || text.includes("xà phòng") || text.includes("chất béo") || text.includes("triglyceride")) return "g12c1";
    if (text.includes("anken") || text.includes("alkene") || text.includes("ankin") || text.includes("alkyne") || text.includes("acetylene") || text.includes("ethylene")) return "g11c1";
    if (text.includes("benzen") || text.includes("benzene") || text.includes("toluene") || text.includes("arene") || text.includes("styrene")) return "g11c2";
    if (text.includes("halogen") || text.includes("clo") || text.includes("bromo") || text.includes("chloro") || text.includes("cfc")) return "g11c3";
    if (text.includes("ancol") || text.includes("alcohol") || text.includes("ethanol") || text.includes("methanol") || text.includes("glycerol")) return "g11c4";
    if (text.includes("phenol") || text.includes("picric")) return "g11c5";
    if (text.includes("anđehit") || text.includes("aldehyde") || text.includes("ketone") || text.includes("xeton") || text.includes("fomanđehit")) return "g11c6";
    if (text.includes("axit") || text.includes("acid") || text.includes("acetic") || text.includes("formic")) return "g11c7";

    return test && test.grade === "g12" ? "g12c1" : "g11c1";
  }

  function getCoachCaseStudy(q, test) {
    var text = ((q ? q.q : "") + " " + (q && q.o ? q.o : "") + " " + (q && q.e ? q.e : "")).toLowerCase();
    if (text.includes("ethyl acetate") || text.includes("dung môi")) return COACH_CASE_STUDIES.ester_solvent;
    if (text.includes("mùi") || text.includes("hoa nhài") || text.includes("chuối") || text.includes("đào") || text.includes("dứa") || text.includes("hương")) return COACH_CASE_STUDIES.ester_flavor;
    if (text.includes("nước cứng") || text.includes("chất giặt rửa") || text.includes("bột giặt") || text.includes("las")) return COACH_CASE_STUDIES.detergent_hard_water;
    if (text.includes("xà phòng") || text.includes("tristearin") || text.includes("triolein") || text.includes("chất béo") || text.includes("muối của acid béo") || text.includes("chỉ số xà phòng")) return COACH_CASE_STUDIES.saponification;
    if (text.includes("glucose") || text.includes("tráng ruột phích") || text.includes("đường huyết") || text.includes("truyền")) return COACH_CASE_STUDIES.glucose_medical;
    if (text.includes("fructose") || text.includes("mật ong")) return COACH_CASE_STUDIES.fructose_honey;
    if (text.includes("saccharose") || text.includes("đường mía") || text.includes("nghịch đảo")) return COACH_CASE_STUDIES.saccharose_inversion;
    if (text.includes("cellulose") || text.includes("bông") || text.includes("gỗ") || text.includes("thuốc súng")) return COACH_CASE_STUDIES.cellulose_industry;
    if (text.includes("tanh") || text.includes("cá") || text.includes("trimethylamine")) return COACH_CASE_STUDIES.amine_fish;
    if (text.includes("aniline") || text.includes("brom") || text.includes("kết tủa trắng") || text.includes("phẩm nhuộm")) return COACH_CASE_STUDIES.aniline_dyes;
    if (text.includes("hàn xì") || text.includes("cắt kim loại") || text.includes("acetylene") || text.includes("c2h2")) return COACH_CASE_STUDIES.acetylene_welding;
    if (text.includes("lpg") || text.includes("gas") || text.includes("rò rỉ")) return COACH_CASE_STUDIES.lpg_gas;
    if (text.includes("markovnikov") || text.includes("cộng hcl") || text.includes("cộng hbr")) return COACH_CASE_STUDIES.markovnikov_drugs;
    if (text.includes("methanol") || text.includes("ngộ độc") || text.includes("mù")) return COACH_CASE_STUDIES.alcohol_methanol_danger;
    if (text.includes("phenol")) return COACH_CASE_STUDIES.phenol_antiseptic;
    if (text.includes("acetic") || text.includes("giấm")) return COACH_CASE_STUDIES.carboxylic_vinegar;
    if (text.includes("este") || text.includes("ester")) return COACH_CASE_STUDIES.ester_flavor;
    if (text.includes("tinh bột")) return COACH_CASE_STUDIES.glucose_medical;
    if (text.includes("amine") || text.includes("amin")) return COACH_CASE_STUDIES.aniline_dyes;

    return test && test.grade === "g12" ? COACH_CASE_STUDIES.ester_solvent : COACH_CASE_STUDIES.acetylene_welding;
  }

  function getDistractorAnalysis(q, test, picked) {
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
  }

  function renderCoachTest() {
    if (!state.coachTest.t) {
      return renderCoachTestLibrary();
    }
    if (state.coachTest.done) {
      return renderCoachTestSummary();
    }
    return renderCoachTestSession();
  }

  function renderCoachTestLibrary() {
    var s = profile();
    var curGrade = state.coachTest.filterGrade || state.grade || "all";
    var query = (state.coachTest.searchQuery || "").trim().toLowerCase();

    var allTests = DATA.tests || [];
    var filtered = allTests.filter(function (t) {
      if (curGrade !== "all" && t.grade !== curGrade) return false;
      if (query) {
        var str = (t.title + " " + (t.desc || "") + " " + (t.author || "") + " " + (t.grade || "")).toLowerCase();
        if (!str.includes(query)) return false;
      }
      return true;
    });

    var gradeChips = [
      { id: "all", l: "Tất cả các đề (" + allTests.length + ")" },
      { id: "g11", l: "Hoá 11 · HK2" },
      { id: "g12", l: "Hoá 12 · HK1" }
    ].map(function (x) {
      var on = curGrade === x.id ? " on" : "";
      return '<button class="chip' + on + '" data-act="coachSetGrade" data-g="' + x.id + '">' + x.l + '</button>';
    }).join("");

    var cardsHtml = filtered.map(function (t) {
      var best = s.tests && s.tests[t.id];
      var qCount = t.qs ? t.qs.length : 0;
      var gradeBadge = t.grade === "g12" ? '<span class="badge g12">Hoá 12</span>' : '<span class="badge g11">Hoá 11</span>';

      return '<div class="coach-exam-card">' +
        '<div class="cec-head">' +
          '<div class="cec-icon">' + ico("target") + '</div>' +
          '<div class="cec-meta">' +
            gradeBadge +
            (t.author ? '<span class="author-pill">' + ico("user") + ' ' + esc(t.author) + '</span>' : '') +
            '<span class="cec-count">' + qCount + ' câu hỏi</span>' +
            '<span class="cec-time">' + ico("clock") + ' ~' + (t.timeMin || 45) + ' phút</span>' +
          '</div>' +
        '</div>' +
        '<h3 class="cec-title">' + esc(t.title) + '</h3>' +
        '<div class="cec-features">' +
          '<span class="cec-pill">' + ico("bulb") + ' Gia sư đồng hành</span>' +
          '<span class="cec-pill">' + ico("flask") + ' Case study thực tiễn</span>' +
          '<span class="cec-pill">' + ico("shield") + ' Bẫy phương án sai</span>' +
        '</div>' +
        '<div class="cec-foot">' +
          (best != null ? '<span class="cec-best">Điểm cao nhất: <b>' + best + '/10</b></span>' : '<span class="cec-new">Chưa hoàn thành</span>') +
          '<button class="btn primary cec-btn" data-act="startCoachExam" data-tid="' + t.id + '">' +
            'Làm đề có hướng dẫn →' +
          '</button>' +
        '</div>' +
      '</div>';
    }).join("");

    if (!cardsHtml) {
      cardsHtml = '<div class="empty-state" style="padding:40px;text-align:center;color:var(--muted)">' +
        ico("search") + '<p>Không tìm thấy đề thi phù hợp với từ khoá "' + esc(query) + '".</p>' +
      '</div>';
    }

    return '<div class="coach-library-view">' +
      '<div class="coach-library-hero">' +
        '<div class="clh-kicker">' + ico("target") + ' KIỂM TRA CÓ HƯỚNG DẪN · AI COACH SIMULATOR</div>' +
        '<h2>Thư viện đề thi thử có gia sư đồng hành</h2>' +
        '<p class="clh-sub">Chọn 1 đề trong thư viện đề thi chuẩn. Ở mỗi câu, khi bạn <b>chọn sai</b> hoặc <b>bấm nút "Cần trợ giúp"</b>, hệ thống sẽ chẩn đoán ngay: chỉ ra đáp án đúng, giải thích cơ chế, cung cấp case study thực tiễn, phân tích bẫy các phương án sai và liên kết trực tiếp đến lý thuyết chương đó.</p>' +
        '<div class="coach-filter-bar">' +
          '<div class="grade-group">' + gradeChips + '</div>' +
          '<div class="coach-search-box">' +
            ico("search") +
            '<input type="text" class="coach-search-input" data-act="coachSearchInput" placeholder="Tìm đề thi theo trường, tỉnh thành, chương..." value="' + esc(state.coachTest.searchQuery || '') + '">' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="coach-test-grid">' + cardsHtml + '</div>' +
    '</div>';
  }

  function renderCoachTestSession() {
    var t = state.coachTest.t;
    var idx = state.coachTest.i;
    var total = t.qs.length;
    var cur = t.qs[idx];
    var ans = state.coachTest.answers[idx];
    var isAnswered = !!ans;
    var isHelped = !!(state.coachTest.helped && state.coachTest.helped[idx]);
    var isSubmitted = isAnswered || isHelped;
    var ok = ans ? !!ans.ok : false;

    // Progress and statistics
    var answeredKeys = Object.keys(state.coachTest.answers);
    var correctCount = answeredKeys.filter(function (k) { return state.coachTest.answers[k].ok; }).length;
    var wrongCount = answeredKeys.filter(function (k) { return !state.coachTest.answers[k].ok && !state.coachTest.answers[k].helped; }).length;
    var helpedCount = Object.keys(state.coachTest.helped || {}).length;

    var resolvedChId = resolveCoachChapter(cur, t);
    var chObj = (DATA.chapters || []).find(function (c) { return c.id === resolvedChId; }) || { title: "Hoá học" };

    // Palette drawer HTML
    var paletteHtml = "";
    if (state.coachTest.showPalette) {
      var cells = t.qs.map(function (q, qIdx) {
        var a = state.coachTest.answers[qIdx];
        var isCurrent = qIdx === idx;
        var cls = "palette-cell";
        if (isCurrent) cls += " current";
        if (a) {
          if (a.helped) cls += " helped";
          else if (a.ok) cls += " correct";
          else cls += " wrong";
        }
        return '<button class="' + cls + '" data-act="jumpCoachQ" data-idx="' + qIdx + '" title="Câu ' + (qIdx + 1) + '">' +
          (qIdx + 1) +
        '</button>';
      }).join("");

      paletteHtml = '<div class="coach-palette-drawer">' +
        '<div class="cpd-head">' +
          '<span>' + ico("choose") + ' Bảng chuyển nhanh câu hỏi</span>' +
          '<span class="cpd-legend">' +
            '<i class="leg cor"></i> Đúng ' +
            '<i class="leg wro"></i> Sai ' +
            '<i class="leg hlp"></i> Trợ giúp ' +
            '<i class="leg unt"></i> Chưa làm' +
          '</span>' +
        '</div>' +
        '<div class="cpd-grid">' + cells + '</div>' +
      '</div>';
    }

    // Question options
    var opts = parseOpts(cur.o);
    var optsHtml = "";
    if (cur.sub && cur.sub.length) {
      var clusterDraft = (state.coachTest.clusterDraft && state.coachTest.clusterDraft[idx]) || (ans && ans.picked) || {};
      optsHtml = '<div class="tf-cluster-container">' +
        cur.sub.map(function (sItem) {
          var sVal = clusterDraft[sItem.id];
          var truePicked = (sVal === "true");
          var falsePicked = (sVal === "false");
          var isTrue = (String(sItem.a).toLowerCase() === "true");
          var tCls = "tf-opt" + (truePicked ? " picked" : "");
          var fCls = "tf-opt" + (falsePicked ? " picked" : "");
          if (isSubmitted) {
            if (isTrue) tCls += " reveal-correct";
            else fCls += " reveal-correct";
            if (truePicked && !isTrue) tCls += " warn";
            if (falsePicked && isTrue) fCls += " warn";
          }
          return '<div class="tf-cluster-row">' +
            '<div class="tfc-statement"><span class="tfc-label">' + esc(sItem.id) + ')</span> <span class="tfc-desc">' + fmt(sItem.q) + '</span></div>' +
            '<div class="tfc-buttons">' +
              '<button type="button" class="' + tCls + '" data-act="coachPickClusterTF" data-sub="' + esc(sItem.id) + '" data-p="true" ' + (isSubmitted ? 'disabled' : '') + '>ĐÚNG</button>' +
              '<button type="button" class="' + fCls + '" data-act="coachPickClusterTF" data-sub="' + esc(sItem.id) + '" data-p="false" ' + (isSubmitted ? 'disabled' : '') + '>SAI</button>' +
            '</div>' +
          '</div>' +
          (isSubmitted && sItem.e ? '<div class="tfc-coach-sub-exp ' + (sVal === sItem.a ? 'is-good' : 'is-warn') + '">' + ico("bulb") + ' <b>Phân tích mệnh đề ' + esc(sItem.id) + ':</b> ' + fmt(sItem.e) + '</div>' : '');
        }).join("") +
        (!isSubmitted ? '<div style="margin-top:14px;text-align:center"><button class="btn primary" data-act="coachSubmitCluster">Kiểm tra kết quả cụm mệnh đề</button></div>' : '') +
      '</div>';
    } else if (cur.k === "tf") {
      var tfPicked = ans ? ans.picked : null;
      var tfA = String(cur.a).trim().toLowerCase();
      var isTrue = tfA === "true" || tfA === "đ";
      var tCls = "tf-opt" + (tfPicked === "true" ? " picked" : "");
      var fCls = "tf-opt" + (tfPicked === "false" ? " picked" : "");
      if (isSubmitted) {
        if (isTrue) tCls += " reveal-correct";
        else fCls += " reveal-correct";
        if (tfPicked === "true" && !isTrue) tCls += " warn";
        if (tfPicked === "false" && isTrue) fCls += " warn";
      }
      optsHtml = '<div class="tf-opts">' +
        '<button class="' + tCls + '" data-act="coachPickTF" data-p="true" ' + (isSubmitted ? 'disabled' : '') + '>ĐÚNG</button>' +
        '<button class="' + fCls + '" data-act="coachPickTF" data-p="false" ' + (isSubmitted ? 'disabled' : '') + '>SAI</button>' +
      '</div>';
    } else if (cur.k === "n" || cur.k === "num" || cur.k === "sa") {
      var nVal = ans ? ans.picked : "";
      optsHtml = '<div class="short-ans-box">' +
        '<input type="text" id="coachShortAnsInput" class="short-ans-input" placeholder="Nhập đáp số (số hoặc chữ)..." value="' + esc(nVal || "") + '" ' + (isSubmitted ? 'disabled' : '') + '>' +
        (cur.u ? '<span class="num-unit">' + esc(cur.u) + '</span>' : '') +
        (!isSubmitted ? '<button class="btn primary" data-act="coachPickN">Kiểm tra kết quả</button>' : '') +
      '</div>';
    } else {
      // Default multiple choice
      var pickedKey = ans ? ans.picked : null;
      var curCorrectKey = String(cur.a).trim();
      optsHtml = '<div class="mcq-opts">' + opts.map(function (o) {
        var cls = "mcq-opt";
        var badge = "";
        if (isSubmitted) {
          if (o.k === curCorrectKey) {
            cls += " reveal-correct";
            badge = ' <span class="opt-badge-correct">' + ico("check") + ' Đáp án đúng</span>';
          }
          if (pickedKey === o.k) {
            cls += " picked " + (o.k === curCorrectKey ? " good" : " warn");
            if (o.k !== curCorrectKey) {
              badge = ' <span class="opt-badge-wrong">' + ico("close") + ' Lựa chọn của bạn</span>';
            }
          }
        }
        return '<button class="' + cls + '" data-act="coachPick" data-p="' + esc(o.k) + '" ' + (isSubmitted ? 'disabled' : '') + '>' +
          '<span class="opt-key">' + esc(o.k) + '.</span><span class="opt-text">' + fmt(o.t) + badge + '</span>' +
        '</button>';
      }).join("") + '</div>';
    }

    // Help Button (When not yet answered and not helped)
    var helpBtnHtml = "";
    if (!isSubmitted) {
      helpBtnHtml = '<div class="coach-help-bar">' +
        '<button class="btn-coach-help" data-act="coachHelp">' +
          ico("bulb") + ' Bị bí câu này? Xem hướng dẫn, case study & Chẩn đoán ngay' +
        '</button>' +
      '</div>';
    }

    // 5-Point Diagnostic Panel (When submitted / helped)
    var diagnosticHtml = "";
    if (isSubmitted) {
      var cs = getCoachCaseStudy(cur, t);
      var distractorList = getDistractorAnalysis(cur, t, ans ? ans.picked : null);
      var quickTheory = getQuickTheorySummary(resolvedChId);

      // Distractor rows HTML
      var distractorRowsHtml = "";
      if (distractorList.length) {
        distractorRowsHtml = '<div class="distractor-comparison-box">' +
          '<div class="dcb-title">' + ico("shield") + ' <b>4. Sự khác biệt với các đáp án khác & Bẫy phương án nhiễu:</b></div>' +
          '<div class="dcb-list">' +
            distractorList.map(function (d) {
              var rowCls = d.isCorrect ? "dcb-row correct" : "dcb-row wrong";
              if (d.wasPicked) rowCls += " was-picked";
              var badgeTag = d.isCorrect
                ? '<span class="dcb-tag good">' + ico("check") + ' Đáp án đúng</span>'
                : '<span class="dcb-tag warn">' + ico("close") + ' Phương án nhiễu</span>';
              var pickedBadge = d.wasPicked
                ? '<span class="dcb-tag picked">' + ico("user") + ' Bạn đã chọn</span>'
                : '';
              return '<div class="' + rowCls + '">' +
                '<div class="dcb-row-head">' +
                  '<span class="dcb-key">' + esc(d.k || d.key) + '.</span>' +
                  '<span class="dcb-text">' + fmt(d.t || d.text) + '</span>' +
                  pickedBadge +
                  badgeTag +
                '</div>' +
                '<div class="dcb-row-note">' + fmt(d.note) + '</div>' +
              '</div>';
            }).join("") +
          '</div>' +
        '</div>';
      }

      // Quick Theory Peek Drawer
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
      }

      diagnosticHtml = '<div class="diagnostic-feedback ' + (ok ? 'ok-diag' : 'bad-diag') + '">' +
        // Header
        '<div class="fb-header">' +
          (isHelped
            ? '<span class="fb-badge help">' + ico("bulb") + ' Đã nhận Trợ giúp</span> <b>Gia sư đồng hành hướng dẫn phương pháp:</b>'
            : (ok
                ? '<span class="fb-badge ok">' + ico("check") + ' Chính xác!</span> <b>Bạn đã trả lời đúng (+15 XP)</b>'
                : '<span class="fb-badge bad">' + ico("close") + ' Chưa chính xác</span> <b>Chẩn đoán sai lầm & Phân tích bẫy thi cử:</b>'
              )
          ) +
        '</div>' +

        // Point 1: Kết quả
        '<div class="fb-point-card p1-result">' +
          '<div class="fb-point-title">' + ico("target") + ' <b>1. Kết quả & Đáp án chuẩn xác:</b></div>' +
          '<div class="fb-point-content result-val">' +
            (cur.sub ? cur.sub.map(function(s){ return '<b>' + esc(s.id) + ':</b> ' + (s.a === 'true' ? 'ĐÚNG' : 'SAI'); }).join(' · ') : ('<b>' + esc(cur.a) + '</b>' + ((cur.k === "m" || cur.k === "mc") ? ' — ' + fmt((opts.find(function(o){ return o.k === String(cur.a).trim(); }) || {}).t || "") : ''))) +
          '</div>' +
        '</div>' +

        // Point 2: Giải thích bản chất
        '<div class="fb-point-card p2-explanation">' +
          '<div class="fb-point-title">' + ico("bulb") + ' <b>2. Bản chất hoá học & Giải thích chi tiết:</b></div>' +
          '<div class="fb-point-content">' + fmt(cur.e || cur.exp || "Chưa có lời giải chi tiết.") + '</div>' +
        '</div>' +

        // Point 3: Case study thực tiễn
        (cs ? '<div class="fb-point-card p3-casestudy">' +
          '<div class="fb-point-title">' + ico("flask") + ' <b>3. Case Study & Tình huống thực tiễn đời sống:</b> <span class="cs-badge">' + esc(cs.tag) + '</span></div>' +
          '<div class="cs-card-body">' +
            '<h4>' + esc(cs.title) + '</h4>' +
            '<p>' + fmt(cs.text) + '</p>' +
          '</div>' +
        '</div>' : '') +

        // Point 4: Sự khác biệt với các đáp án khác
        distractorRowsHtml +

        // Point 5: Liên kết đến vùng lý thuyết tương ứng
        '<div class="fb-point-card p5-theorylink">' +
          '<div class="fb-point-title">' + ico("bookOpen") + ' <b>5. Liên kết & Ôn tập lý thuyết tương ứng:</b></div>' +
          '<div class="fb-point-content" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">' +
            '<button class="btn primary small" data-act="jumpToTheory" data-ch="' + resolvedChId + '">' +
              ico("bookOpen") + ' Mở toàn bộ Lý thuyết: ' + esc(chObj.title) + ' →' +
            '</button>' +
            '<button class="btn ghost small" data-act="toggleTheoryPeek">' +
              ico("sparkles") + ' ' + (state.coachTest.showTheoryPeek ? 'Ẩn tóm tắt nhanh lý thuyết' : 'Xem nhanh tóm tắt lý thuyết tại chỗ ▾') +
            '</button>' +
          '</div>' +
          theoryPeekHtml +
        '</div>' +

      '</div>';
    }

    return '<div class="coach-test-session">' +
      '<div class="coach-session-bar">' +
        '<button class="btn ghost small" data-act="quitCoachExam">' + ico("arrowLeft") + ' Chọn đề khác</button>' +
        '<div class="csb-title">' + esc(t.title) + '</div>' +
        '<div class="csb-stats">' +
          '<span class="csb-pill stat-correct">' + ico("check") + ' ' + correctCount + '</span>' +
          '<span class="csb-pill stat-wrong">' + ico("close") + ' ' + wrongCount + '</span>' +
          (helpedCount ? '<span class="csb-pill stat-help">' + ico("bulb") + ' ' + helpedCount + '</span>' : '') +
          '<button class="btn ghost small csb-palette-btn" data-act="toggleCoachPalette">' +
            ico("choose") + ' Câu ' + (idx + 1) + '/' + total + ' ▾' +
          '</button>' +
        '</div>' +
      '</div>' +
      paletteHtml +
      '<div class="coach-test-card">' +
        '<div class="coach-q-meta">' +
          '<span class="cq-chapter-badge">' + ico("flask") + ' ' + esc(chObj.title) + '</span>' +
          '<span class="cq-num-badge">Câu hỏi ' + (idx + 1) + ' / ' + total + '</span>' +
        '</div>' +
        '<p class="q-text">' + fmt(cur.q) + '</p>' +
        getSvg(cur) +
        optsHtml +
        helpBtnHtml +
        diagnosticHtml +
        '<div class="coach-nav-bar">' +
          '<button class="btn ghost" data-act="coachPrev"' + (idx === 0 ? ' disabled' : '') + '>← Câu trước</button>' +
          '<span class="muted small" style="font-weight:600">Câu ' + (idx + 1) + ' / ' + total + '</span>' +
          '<button class="btn primary" data-act="coachNext">' + (idx + 1 < total ? 'Câu tiếp theo →' : 'Nộp bài & Xem tổng kết') + '</button>' +
          '<button class="btn good small" data-act="finishCoachExam">Nộp bài ngay</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function renderCoachTestSummary() {
    var t = state.coachTest.t;
    var total = t.qs.length;
    var answers = state.coachTest.answers || {};
    var correctCount = 0;
    var helpedCount = Object.keys(state.coachTest.helped || {}).length;
    var wrongList = [];

    // Analyze performance by chapter
    var chStats = {};
    t.qs.forEach(function (q, qIdx) {
      var a = answers[qIdx];
      var chId = resolveCoachChapter(q, t);
      chStats[chId] = chStats[chId] || { total: 0, correct: 0 };
      chStats[chId].total++;

      if (a && a.ok) {
        correctCount++;
        chStats[chId].correct++;
      } else {
        wrongList.push({ q: q, idx: qIdx, ans: a, chId: chId });
      }
    });

    var score = Math.round((correctCount / total) * 100) / 10;

    // Chapter competency bars
    var chBarsHtml = Object.keys(chStats).map(function (chId) {
      var chObj = (DATA.chapters || []).find(function (c) { return c.id === chId; }) || { title: chId };
      var cs = chStats[chId];
      var pct = Math.round((cs.correct / cs.total) * 100);
      var barColor = pct >= 80 ? "var(--ok)" : pct >= 50 ? "var(--warm)" : "#e2557c";
      return '<div class="ch-perf-row">' +
        '<div class="cpr-label"><span>' + esc(chObj.title) + '</span> <b>' + cs.correct + '/' + cs.total + ' (' + pct + '%)</b></div>' +
        '<div class="cpr-track"><div class="cpr-fill" style="width:' + pct + '%;background:' + barColor + '"></div></div>' +
      '</div>';
    }).join("");

    // Recommended theory chapters to review
    var weakChapters = Object.keys(chStats).filter(function (chId) {
      return chStats[chId].correct < chStats[chId].total;
    });

    var recommendationsHtml = "";
    if (weakChapters.length) {
      recommendationsHtml = '<div class="summary-recommendations">' +
        '<h4>' + ico("bulb") + ' Lộ trình củng cố lý thuyết trọng tâm dựa trên các lỗi sai:</h4>' +
        '<div class="rec-buttons-row">' +
          weakChapters.map(function (chId) {
            var chObj = (DATA.chapters || []).find(function (c) { return c.id === chId; }) || { title: chId };
            return '<button class="btn ghost small" data-act="jumpToTheory" data-ch="' + chId + '">' +
              ico("bookOpen") + ' Ôn lại: ' + esc(chObj.title) + ' →' +
            '</button>';
          }).join("") +
        '</div>' +
      '</div>';
    }

    // Save score to user profile
    var s = profile();
    s.tests = s.tests || {};
    if (!s.tests[t.id] || score > s.tests[t.id]) {
      s.tests[t.id] = score;
      save(s);
    }

    return '<div class="coach-test-card" style="text-align:center;max-width:820px">' +
      '<div class="summary-hero">' +
        '<div class="score-circle">' +
          '<span class="score-big">' + score + '</span>' +
          '<span class="score-unit">/ 10 ĐIỂM</span>' +
        '</div>' +
        '<h2>' + ico("target") + ' Hoàn thành bài kiểm tra có hướng dẫn!</h2>' +
        '<p style="font-size:1.05rem;color:var(--muted)">Đề thi: <b>' + esc(t.title) + '</b></p>' +
      '</div>' +

      '<div class="summary-metrics-grid">' +
        '<div class="metric-card ok">' +
          '<span class="mc-num">' + correctCount + '</span>' +
          '<span class="mc-label">Câu đúng độc lập</span>' +
        '</div>' +
        '<div class="metric-card help">' +
          '<span class="mc-num">' + helpedCount + '</span>' +
          '<span class="mc-label">Câu nhờ Gia sư trợ giúp</span>' +
        '</div>' +
        '<div class="metric-card bad">' +
          '<span class="mc-num">' + (total - correctCount) + '</span>' +
          '<span class="mc-label">Câu trả lời sai</span>' +
        '</div>' +
      '</div>' +

      '<div class="summary-competency-box">' +
        '<h3>' + ico("sparkles") + ' Đánh giá mức độ thành thạo theo chuyên đề:</h3>' +
        '<div class="ch-perf-grid">' + chBarsHtml + '</div>' +
      '</div>' +

      recommendationsHtml +

      '<div class="summary-actions-bar">' +
        (wrongList.length ? '<button class="btn warn" data-act="reviewCoachMistakes">' + ico("alert") + ' Ôn tập & Xem lại các câu sai (' + wrongList.length + ' câu)</button>' : '') +
        '<button class="btn primary" data-act="restartCoachExam">' + ico("refresh") + ' Làm lại đề này từ đầu</button>' +
        '<button class="btn ghost" data-act="quitCoachExam">' + ico("arrowLeft") + ' Chọn đề thi khác</button>' +
      '</div>' +
    '</div>';
  }

  function startCoachExam(tid) {
    var t = null;
    for (var i = 0; i < (DATA.tests || []).length; i++) {
      if (DATA.tests[i].id === tid) { t = DATA.tests[i]; break; }
    }
    if (!t) return;
    state.coachTest.testId = tid;
    state.coachTest.t = t;
    state.coachTest.i = 0;
    state.coachTest.picked = null;
    state.coachTest.answers = {};
    state.coachTest.helped = {};
    state.coachTest.showPalette = false;
    state.coachTest.showTheoryPeek = false;
    state.coachTest.done = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
    render(false);
  }

  function quitCoachExam() {
    state.coachTest.t = null;
    state.coachTest.testId = null;
    state.coachTest.done = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
    render(false);
  }

  function coachSetGrade(g) {
    state.coachTest.filterGrade = g;
    render(false);
  }

  function coachPick(p) {
    if (!state.coachTest.t) return;
    var idx = state.coachTest.i;
    var cur = state.coachTest.t.qs[idx];
    if (state.coachTest.answers[idx]) return;

    var ok = String(p).trim() === String(cur.a).trim();
    state.coachTest.answers[idx] = { q: cur, picked: p, ok: ok, helped: false, time: Date.now() };
    if (ok) addXP(profile(), resolveCoachChapter(cur, state.coachTest.t), 15);
    render(false);
  }

  function coachPickTF(p) {
    if (!state.coachTest.t) return;
    var idx = state.coachTest.i;
    var cur = state.coachTest.t.qs[idx];
    if (state.coachTest.answers[idx]) return;

    var curA = String(cur.a).trim().toLowerCase();
    var isTrue = curA === "true" || curA === "đ";
    var pickTrue = String(p).trim().toLowerCase() === "true";
    var ok = isTrue === pickTrue;

    state.coachTest.answers[idx] = { q: cur, picked: p, ok: ok, helped: false, time: Date.now() };
    if (ok) addXP(profile(), resolveCoachChapter(cur, state.coachTest.t), 15);
    render(false);
  }

  function coachPickClusterTF(subId, p) {
    if (!state.coachTest.t) return;
    var idx = state.coachTest.i;
    if (state.coachTest.answers[idx] && state.coachTest.answers[idx].submitted) return;

    state.coachTest.clusterDraft = state.coachTest.clusterDraft || {};
    state.coachTest.clusterDraft[idx] = state.coachTest.clusterDraft[idx] || {};
    state.coachTest.clusterDraft[idx][subId] = p;
    render(false);
  }

  function coachSubmitCluster() {
    if (!state.coachTest.t) return;
    var idx = state.coachTest.i;
    var cur = state.coachTest.t.qs[idx];
    if (!cur.sub) return;

    var draft = (state.coachTest.clusterDraft && state.coachTest.clusterDraft[idx]) || {};
    var unpicked = cur.sub.filter(function (s) { return !draft[s.id]; });
    if (unpicked.length > 0) {
      alert("Vui lòng lựa chọn Đúng hoặc Sai cho tất cả " + cur.sub.length + " mệnh đề (a, b, c, d)!");
      return;
    }

    var correctCount = 0;
    cur.sub.forEach(function (s) {
      if (String(draft[s.id]).toLowerCase() === String(s.a).toLowerCase()) correctCount++;
    });

    var ok = (correctCount === cur.sub.length);
    state.coachTest.answers[idx] = {
      q: cur,
      picked: draft,
      ok: ok,
      correctCount: correctCount,
      submitted: true,
      helped: false,
      time: Date.now()
    };
    if (ok) addXP(profile(), resolveCoachChapter(cur, state.coachTest.t), 20);
    render(false);
  }

  function coachPickN() {
    if (!state.coachTest.t) return;
    var idx = state.coachTest.i;
    var cur = state.coachTest.t.qs[idx];
    if (state.coachTest.answers[idx]) return;

    var inputEl = $("#coachShortAnsInput");
    var val = inputEl ? inputEl.value.trim() : "";
    if (!val) {
      alert("Vui lòng nhập đáp số trước khi kiểm tra!");
      return;
    }
    var ok = checkNum(val, cur);
    state.coachTest.answers[idx] = { q: cur, picked: val, ok: ok, helped: false, time: Date.now() };
    if (ok) addXP(profile(), resolveCoachChapter(cur, state.coachTest.t), 15);
    render(false);
  }

  function coachHelp() {
    if (!state.coachTest.t) return;
    var idx = state.coachTest.i;
    var cur = state.coachTest.t.qs[idx];
    state.coachTest.helped = state.coachTest.helped || {};
    state.coachTest.helped[idx] = true;
    state.coachTest.answers[idx] = { q: cur, picked: null, ok: false, helped: true, time: Date.now() };
    render(false);
  }

  function coachPrev() {
    if (!state.coachTest.t || state.coachTest.i <= 0) return;
    state.coachTest.i--;
    state.coachTest.showTheoryPeek = false;
    render(false);
    var card = $(".coach-test-card");
    if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function coachNext() {
    if (!state.coachTest.t) return;
    if (state.coachTest.i + 1 < state.coachTest.t.qs.length) {
      state.coachTest.i++;
      state.coachTest.showTheoryPeek = false;
      render(false);
      var card = $(".coach-test-card");
      if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      finishCoachExam();
    }
  }

  function jumpCoachQ(idx) {
    if (!state.coachTest.t || idx < 0 || idx >= state.coachTest.t.qs.length) return;
    state.coachTest.i = idx;
    state.coachTest.showTheoryPeek = false;
    render(false);
    var card = $(".coach-test-card");
    if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function toggleCoachPalette() {
    state.coachTest.showPalette = !state.coachTest.showPalette;
    render(false);
  }

  function toggleTheoryPeek() {
    state.coachTest.showTheoryPeek = !state.coachTest.showTheoryPeek;
    render(false);
  }

  function finishCoachExam() {
    state.coachTest.done = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
    render(false);
  }

  function restartCoachExam() {
    if (!state.coachTest.t) return;
    startCoachExam(state.coachTest.t.id);
  }

  function reviewCoachMistakes() {
    if (!state.coachTest.t) return;
    var t = state.coachTest.t;
    var answers = state.coachTest.answers || {};
    for (var i = 0; i < t.qs.length; i++) {
      if (!answers[i] || !answers[i].ok) {
        state.coachTest.done = false;
        state.coachTest.i = i;
        render(false);
        var card = $(".coach-test-card");
        if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    state.coachTest.done = false;
    state.coachTest.i = 0;
    render(false);
  }

  // Backward compatible aliases
  var coachTestPick = coachPick;
  var coachTestPrev = coachPrev;
  var coachTestNext = coachNext;
  var restartCoachTest = restartCoachExam;
  var toggleHint = toggleTheoryPeek;

  /* ═══════════ UNIVERSAL MODAL SYSTEM (EDIT MODE) ═══════════ */
  function openModal(config) {
    state.modal = config;
    render();
  }
  function closeModal() {
    state.modal = null;
    render();
  }

  function renderModal(m) {
    var title = m.title || "Chỉnh sửa";
    if (m.html) {
      return '<div class="modal-overlay" data-act="modalBgClick">' +
        '<div class="modal-box modal-theory-box" onclick="event.stopPropagation()">' +
          '<div class="modal-header-row">' +
            '<h3>' + (m.icon || ico("bookOpen")) + ' ' + esc(title) + '</h3>' +
            '<button type="button" class="btn ghost tiny modal-close-btn" data-act="modalCancel" title="Đóng">✕</button>' +
          '</div>' +
          '<div class="modal-content-scroll">' + m.html + '</div>' +
          '<div class="modal-actions" style="margin-top:14px;justify-content:flex-end">' +
            '<button type="button" class="btn primary" data-act="modalCancel">Đã hiểu, quay lại làm bài</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }
    var fieldsHtml = (m.fields || []).map(function (f) {
      var val = esc(f.val != null ? f.val : "");
      var inputHtml = "";
      if (f.type === "textarea") {
        inputHtml = '<textarea id="m_' + f.id + '" rows="' + (f.rows || 4) + '">' + val + '</textarea>';
      } else if (f.type === "select") {
        var opts = (f.opts || []).map(function (o) {
          return '<option value="' + o[0] + '" ' + (o[0] === f.val ? 'selected' : '') + '>' + esc(o[1]) + '</option>';
        }).join("");
        inputHtml = '<select id="m_' + f.id + '">' + opts + '</select>';
      } else {
        inputHtml = '<input id="m_' + f.id + '" type="' + (f.type || 'text') + '" value="' + val + '">';
      }
      return '<div class="modal-field">' +
        '<label for="m_' + f.id + '">' + esc(f.label) + '</label>' +
        inputHtml +
      '</div>';
    }).join("");

    return '<div class="modal-overlay" data-act="modalBgClick">' +
      '<div class="modal-box" onclick="event.stopPropagation()">' +
        '<h3>' + ico("pen") + ' ' + esc(title) + '</h3>' +
        '<form onsubmit="return false;">' +
          fieldsHtml +
          '<div class="modal-actions">' +
            '<button type="button" class="btn ghost" data-act="modalCancel">Huỷ bỏ</button>' +
            '<button type="button" class="btn primary" data-act="modalSave">Lưu thay đổi</button>' +
          '</div>' +
        '</form>' +
      '</div>' +
    '</div>';
  }

  /* ═══════════ LIBRARY: FAVOURITES · NOTES · GRAPH ═══════════ */
  var KPAL = { rxn: "#9b5b32", rel: "#2f6b54", hub: "#b06f3a", note: "#5a4f46" };
  var KG_REL = [
    ["g11c1", "g11c4", "rxn", "hiđrat hoá (+ H₂O, H⁺)"],
    ["g11c1", "g11c3", "rxn", "cộng HX → RX"],
    ["g11c3", "g11c4", "rxn", "thuỷ phân (NaOH, t°)"],
    ["g11c4", "g11c6", "rxn", "oxi hoá (+ CuO, t°)"],
    ["g11c6", "g11c7", "rxn", "oxi hoá aldehyde (+ [O])"],
    ["g11c7", "g12c1", "rxn", "ester hoá (H₂SO₄ đặc)"],
    ["g12c1", "g11c4", "rxn", "thuỷ phân lipid → glycerol"],
    ["g12c2", "g11c4", "rxn", "lên men glucose → ethanol"],
    ["g12c2", "g12c1", "rxn", "acetyl hoá cellulose → tơ"],
    ["g11c4", "g11c1", "rxn", "tách nước ancol (170°C) → alkene"],
    ["g11c6", "g11c4", "rxn", "khử (+ H₂, Ni, t°) → ancol"],
    ["g11on", "g11c7", "rxn", "chuỗi oxi hoá - khử tổng hợp"],
    ["g11c4", "g11c5", "rel", "cùng nhóm chức –OH"],
    ["g11c1", "g11c2", "rel", "mạch hở vs vòng thơm"],
    ["g11c2", "g11c5", "rel", "hiệu ứng liên hợp vòng benzen"],
    ["g11c5", "g11c7", "rel", "so sánh tính acid (Ka)"],
    ["g11c4", "g12c2", "rel", "polyalcohol: phức Cu(OH)₂ xanh lam"],
    ["g11c6", "g12c2", "rel", "phản ứng tráng bạc Tollens"],
    ["g12c1", "g12c2", "rel", "thuỷ phân môi trường acid"]
  ];

  function toggleFav(kind, key) {
    var s = profile();
    s.fav = s.fav || {};
    s.fav[kind] = s.fav[kind] || {};
    if (s.fav[kind][key]) delete s.fav[kind][key];
    else s.fav[kind][key] = 1;
    save(s);
    return !!s.fav[kind][key];
  }
  function openFavItem(chId, key) {
    state.pendingScrollKey = key || null;
    state.mode = "theory";
    state.chapter = chId || null;
    render();
  }

  function renderLibrary() {
    var tabs = [
      { id: "fav", l: "Yêu thích", i: "star" },
      { id: "notes", l: "Ghi chú", i: "pen" },
      { id: "traps", l: "Sổ tay Bẫy đề thi & Điểm 9+", i: "alert" },
      { id: "graph", l: "Bản đồ tri thức", i: "graph" }
    ].map(function (t) {
      return '<button class="stab ' + (state.lib === t.id ? "on" : "") + '" data-act="libTab" data-t="' + t.id + '">' + ico(t.i) + t.l + "</button>";
    }).join("");
    return '<section class="panel library">' + '<div class="stab-bar">' + tabs + "</div>" + renderLibraryBody() + "</section>";
  }
  function renderLibraryOnly() {
    var p = $(".library");
    if (p) {
      p.innerHTML = '<div class="stab-bar">' + [
        { id: "fav", l: "Yêu thích", i: "star" },
        { id: "notes", l: "Ghi chú", i: "pen" },
        { id: "traps", l: "Sổ tay Bẫy đề thi & Điểm 9+", i: "alert" },
        { id: "graph", l: "Bản đồ tri thức", i: "graph" }
      ].map(function (t) {
        return '<button class="stab ' + (state.lib === t.id ? "on" : "") + '" data-act="libTab" data-t="' + t.id + '">' + ico(t.i) + t.l + "</button>";
      }).join("") + "</div>" + renderLibraryBody();
      if (state.lib === "graph") initGraph();
    } else { render(); }
  }
  function renderLibraryBody() {
    if (state.lib === "traps") return (window.ChemTraps ? ChemTraps.render() : "<p>Đang tải sổ tay bẫy đề thi...</p>");
    if (state.lib === "notes") return renderLibNotes();
    if (state.lib === "graph") return renderLibGraph();
    return renderLibFav();
  }

  // Expose global bridge function for ChemTraps
  window.renderLibraryOnly = renderLibraryOnly;
  function chShort(id) {
    var m = chapterMeta(id);
    if (!m) return id;
    var base = m.title.replace(/^Chương\s+/, "Ch");
    return (state.grade === "all" ? "L" + (m.grade === "g12" ? "12" : "11") + " · " : "") + base;
  }
  function favItemN(key) {
    var i = key.lastIndexOf(":n");
    var chId = key.slice(0, i), idx = parseInt(key.slice(i + 2), 10);
    var ch = chapterById(chId); if (!ch || !ch.notes || !ch.notes[idx]) return null;
    return { chId: chId, kind: ch.notes[idx].kind, t: ch.notes[idx].t };
  }
  function favItemE(key) {
    var i = key.lastIndexOf(":e");
    var chId = key.slice(0, i), idx = parseInt(key.slice(i + 2), 10);
    var ch = chapterById(chId); if (!ch || !ch.exercises || !ch.exercises[idx]) return null;
    return { chId: chId, n: ch.exercises[idx].n, q: ch.exercises[idx].q };
  }
  function renderLibFav() {
    var s = profile();
    var gActive = state.grade || "all";
    var nKeys = s.fav && s.fav.n ? Object.keys(s.fav.n).sort().filter(function (k) {
      var it = favItemN(k); return it && (gActive === "all" || chapterMeta(it.chId).grade === gActive);
    }) : [];
    var eKeys = s.fav && s.fav.e ? Object.keys(s.fav.e).sort().filter(function (k) {
      var it = favItemE(k); return it && (gActive === "all" || chapterMeta(it.chId).grade === gActive);
    }) : [];
    if (!nKeys.length && !eKeys.length) {
      return '<div class="fs-card intro">' +
        "<h3>" + ico("star") + " Chưa có mục yêu thích nào</h3>" +
        "<p>Gặp một thẻ lý thuyết hay bài tập đáng nhớ? Bấm <b>ngôi sao ⭐</b> cạnh nó để đưa vào đây.</p>" +
      "</div>";
    }
    var out = '<div class="fs-card intro"><h3>' + ico("star") + " Yêu thích của bạn</h3>" +
      "<p>Danh sách <b>" + (nKeys.length + eKeys.length) + " mục</b> đã đánh dấu.</p></div>";
    if (nKeys.length) {
      out += '<div class="fav-sec"><h2 class="sec-title">Kiến thức &amp; thẻ nhớ</h2><div class="fav-list">' +
        nKeys.map(function (k) {
          var it = favItemN(k); if (!it) return "";
          return favCard(it.kind, it.t, chShort(it.chId), k, it.chId);
        }).join("") + "</div></div>";
    }
    if (eKeys.length) {
      out += '<div class="fav-sec"><h2 class="sec-title">Bài tập</h2><div class="fav-list">' +
        eKeys.map(function (k) {
          var it = favItemE(k); if (!it) return "";
          return favCard("card", "C" + it.n + ". " + it.q, chShort(it.chId), k, it.chId);
        }).join("") + "</div></div>";
    }
    return out;
  }
  function favCard(iconKind, title, chShortLabel, key, chId) {
    return '<div class="fav-card">' +
      '<span class="fc-badge">' + (KIND_ICON[iconKind] || ico("star")) + "</span>" +
      '<div class="fc-body"><h4>' + esc(title) + "</h4><small>" + esc(chShortLabel) + "</small></div>" +
      '<div class="fc-act">' +
        '<button class="btn ghost" data-act="favOpen" data-ch="' + chId + '" data-key="' + key + '">Mở →</button>' +
        '<button class="fav-btn on" data-act="favRemove" data-kind="' + (key.indexOf(":n") > 0 ? "n" : "e") + '" data-key="' + key + '">' + ico("star") + "</button>" +
      "</div>" +
    "</div>";
  }

  function renderLibNotes() {
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
  }
  function noteSave() {
    var s = profile();
    s.notes = s.notes || [];
    var t = $("#nt"); var b = $("#nb");
    var tv = t ? t.value : ""; var bv = b ? b.value : "";
    if (!tv.trim() && !bv.trim()) return;
    s.notes.push({ id: "n" + Date.now(), t: tv, b: bv, ts: Date.now() });
    save(s);
    renderLibraryOnly();
  }

  /* ═══ PRETEXT ENGINE (Cheng Lou's Zero-Reflow Text Layout) ═══ */
  var Pretext = (function () {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d", { willReadFrequently: true });
    var cache = {};
    function prepare(text, font) {
      var key = font + "::" + text;
      if (cache[key]) return cache[key];
      ctx.font = font;
      var words = String(text || "").split(/\s+/);
      var wordWidths = words.map(function (w) { return ctx.measureText(w).width; });
      var spaceWidth = ctx.measureText(" ").width;
      var totalWidth = ctx.measureText(text).width;
      var res = { text: text, font: font, words: words, wordWidths: wordWidths, spaceWidth: spaceWidth, totalWidth: totalWidth };
      cache[key] = res;
      return res;
    }
    function layout(prep, maxWidth, lineHeight) {
      if (!maxWidth || prep.totalWidth <= maxWidth) {
        return { width: Math.ceil(prep.totalWidth), height: lineHeight, lines: [prep.text], lineCount: 1 };
      }
      var lines = [], curLine = "", curW = 0, maxW = 0;
      for (var i = 0; i < prep.words.length; i++) {
        var w = prep.words[i], wW = prep.wordWidths[i];
        var nextW = curLine ? curW + prep.spaceWidth + wW : wW;
        if (nextW <= maxWidth || !curLine) { curLine = curLine ? curLine + " " + w : w; curW = nextW; }
        else { lines.push(curLine); if (curW > maxW) maxW = curW; curLine = w; curW = wW; }
      }
      if (curLine) { lines.push(curLine); if (curW > maxW) maxW = curW; }
      return { width: Math.ceil(maxW), height: lines.length * lineHeight, lines: lines, lineCount: lines.length };
    }
    return { prepare: prepare, layout: layout };
  })();

  /* ------------ KNOWLEDGE GRAPH ------------ */
  var KG = null, GV = { ox: 0, oy: 0, sc: 1 }, GHover = null, KGFocus = null, GVKey = null;
  function kgChLabel(m) { return m.title.replace(/^Chương\s*\d+\s*[·.]?\s*/, "").trim(); }
  function kgBuild() {
    var gKey = state.grade || "all";
    if (KG && KG.gK === gKey) return KG;
    var nodes = [], edges = [], map = {};
    var CM = chaptersForGrade(state.grade);
    CM.forEach(function (m) {
      var id = m.id, lab = kgChLabel(m);
      map[id] = nodes.length; nodes.push({ id: id, kind: "ch", label: lab, color: m.color, m: m, x: 0, y: 0, r: 27 });
      var ch = DATA[id];
      (ch && ch.notes || []).forEach(function (n, j) {
        var key = id + ":n" + j; map[key] = nodes.length;
        nodes.push({ id: key, kind: "note", label: n.t, color: m.color, ch: id, chLabel: lab, x: 0, y: 0, r: 8 });
        edges.push({ a: id, b: key, kind: "member", label: "" });
      });
    });
    KG_REL.forEach(function (e) {
      if (map[e[0]] == null || map[e[1]] == null) return;
      edges.push({ a: e[0], b: e[1], kind: e[2], label: e[3] });
    });
    KG = { nodes: nodes, edges: edges, map: map, gK: gKey, cm: CM };
    kgLayout();
    return KG;
  }
  function kgLayout() {
    var g = KG, cm = g.cm || DATA.chapters;
    var clusterCenters = {
      g11c1: { x: -380, y: -220 }, g11c2: { x: -440, y: -30 }, g11c3: { x: -210, y: -260 },
      g11c4: { x: 50, y: -260 }, g11c5: { x: -160, y: -60 }, g11c6: { x: 290, y: -220 },
      g11c7: { x: 400, y: -50 }, g12c1: { x: 280, y: 190 }, g12c2: { x: -40, y: 220 },
      g11on: { x: 60, y: -30 }, g11cq: { x: -260, y: 160 }
    };
    cm.forEach(function (m) {
      var nd = g.nodes[g.map[m.id]]; if (!nd) return;
      var pos = clusterCenters[m.id] || { x: 0, y: 0 };
      nd.x = pos.x; nd.y = pos.y;
    });
    var seen = {};
    g.nodes.forEach(function (nd) {
      if (nd.kind !== "note") return;
      var hub = g.nodes[g.map[nd.ch]]; if (!hub) return;
      var idx = (seen[nd.ch] = (seen[nd.ch] || 0) + 1) - 1;
      var total = (DATA[nd.ch] && DATA[nd.ch].notes) ? DATA[nd.ch].notes.length : 8;
      var angle = (idx / total) * Math.PI * 2;
      var dist = 68 + (idx % 2) * 36;
      nd.x = hub.x + Math.cos(angle) * (dist + 40);
      nd.y = hub.y + Math.sin(angle) * (dist + 10);
      nd.pw = 90; nd.ph = 22;
    });
  }
  function kgSvgEl(tag, attrs, parent) {
    var el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    if (parent) parent.appendChild(el);
    if (attrs) for (var k in attrs) if (attrs[k] != null) el.setAttribute(k, attrs[k]);
    return el;
  }
  function renderLibGraph() {
    var g = kgBuild();
    return '<div class="graph-shell">' +
      '<div class="graph-canvas-wrap">' +
        '<svg class="g-svg"><g class="g-vg"></g></svg>' +
        '<div class="graph-tip">Kéo để di chuyển · lăn chuột phóng to · bấm thẻ để mở</div>' +
      '</div>' +
      '<aside class="graph-legend">' +
        "<h4>" + ico("graph") + " Bản đồ mạng lưới tri thức</h4>" +
        '<div class="lg-item"><span class="lg-line" style="background:#9b5b32"></span>Phản ứng chuyển hoá liên chương</div>' +
        '<div class="lg-item"><span class="lg-line" style="background:#2f6b54"></span>Liên hệ cấu trúc & nhóm chức</div>' +
        '<div class="lg-item"><span class="lg-line" style="background:#d6c3a6"></span>Thẻ bài học thuộc chương</div>' +
      "</aside>" +
    "</div>";
  }
  function initGraph() {
    var wrap = $(".graph-canvas-wrap"); if (!wrap) return;
    var vg = wrap.querySelector(".g-vg"); if (!vg) return;
    vg.innerHTML = "";
    var g = kgBuild();
    var W = wrap.clientWidth || 800, H = wrap.clientHeight || 580;
    var edgesG = kgSvgEl("g", {}, vg);
    var nodesG = kgSvgEl("g", {}, vg);
    g.edges.forEach(function (e) {
      var A = g.nodes[g.map[e.a]], B = g.nodes[g.map[e.b]];
      if (!A || !B) return;
      var d = "M" + A.x + " " + A.y + " L" + B.x + " " + B.y;
      var cls = "g-edge " + (e.kind === "member" ? "member" : e.kind === "rxn" ? "k-rxn" : "k-rel");
      kgSvgEl("path", { d: d, class: cls }, edgesG);
    });
    g.nodes.forEach(function (n) {
      var gN = kgSvgEl("g", { class: "gnode " + (n.kind === "ch" ? "gch" : "gnote"), transform: "translate(" + n.x + " " + n.y + ")", "data-id": n.id }, nodesG);
      var hc = n.color || "#b06f3a";
      if (n.kind === "ch") {
        var c = kgSvgEl("circle", { cx: 0, cy: 0, r: 24, class: "hub-core" }, gN);
        c.style.setProperty("--hc", hc);
        kgSvgEl("text", { class: "hub-label", x: 0, y: 38 }, gN).textContent = n.label;
      } else {
        kgSvgEl("circle", { cx: 0, cy: 0, r: 6, fill: hc }, gN);
        kgSvgEl("text", { x: 10, y: 3, font_size: "10px", fill: "var(--fg)" }, gN).textContent = n.label.length > 15 ? n.label.slice(0, 14) + "…" : n.label;
      }
    });
    vg.setAttribute("transform", "translate(" + (W / 2) + " " + (H / 2) + ") scale(0.85)");
  }

  function renderPracticeOnly() {
    var body = "";
    if (state.tab === "games") {
      body = window.ChemGames ? ChemGames.renderArena() : "<p>Đang tải mini-games...</p>";
    } else if (state.tab === "flash") {
      if (state.flash && state.flash.items && state.flash.items.length) body = renderFlashSession();
      else body = flashView();
    } else if (state.tab === "bank") {
      var bs = state.bank;
      if (bs.mode === "quiz" && bs.items && bs.i < bs.items.length) body = bankPlayHTML(bs);
      else if (bs.mode === "quiz" && bs.items) { bs.mode = "done"; body = bankPlayHTML(bs); }
      else body = bankView();
    } else {
      if (state.test && state.test.done) body = renderTestResult();
      else if (state.test) body = renderTestSession();
      else body = testsView();
    }
    var p = $(".practice");
    if (p) {
      var bar = p.querySelector(".stab-bar");
      p.innerHTML = bar ? bar.outerHTML + body : body;
    } else { render(); }
  }

  // Expose global bridge functions for submodules like ChemGames and ChemTraps
  window.state = state;
  window.render = render;
  window.addXP = addXP;
  window.profile = profile;
  window.renderPracticeOnly = renderPracticeOnly;
  window.updateHeaderStats = updateHeaderStats;
  function updateHeaderStats(animate) {
    var s = profile();
    var x = $("[data-xp]");
    if (x) {
      if (animate && hasGSAP && !prefersReduced) {
        var curVal = parseInt(x.textContent, 10) || 0;
        var obj = { val: curVal };
        gsap.to(obj, {
          val: s.xp,
          duration: 0.4,
          ease: "power2.out",
          onUpdate: function () { x.textContent = Math.round(obj.val); }
        });
      } else {
        x.textContent = s.xp;
      }
    }
    var st = $("[data-streak]");
    if (st) st.textContent = s.streak.days;
  }
  function eventBusChanged() {
    renderPracticeOnly(); updateHeaderStats();
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
  }

  /* ═══════════ GLOBAL CLICK DELEGATION & ACTION HANDLERS ═══════════ */
  document.addEventListener("blur", function (ev) {
    var el = ev.target;
    if (!el || !el.hasAttribute || !el.hasAttribute("data-inline-edit")) return;
    handleInlineSave(el);
  }, true);

  document.addEventListener("keydown", function (ev) {
    var el = ev.target;
    if (!el || !el.hasAttribute || !el.hasAttribute("data-inline-edit")) return;
    if (ev.key === "Enter" && !ev.shiftKey && !el.classList.contains("note-body") && !el.classList.contains("guided-text")) {
      ev.preventDefault();
      el.blur();
    } else if (ev.key === "Escape") {
      el.blur();
    }
  });

  document.addEventListener("click", function (ev) {
    if (ev.target.closest && ev.target.closest('a[href="#"]')) {
      ev.preventDefault();
    }
    // If clicking directly into editable field, do not trigger card flip or actions!
    if (ev.target.hasAttribute && (ev.target.hasAttribute("contenteditable") || (ev.target.closest && ev.target.closest("[contenteditable]")))) {
      return;
    }
    var el = ev.target.closest ? ev.target.closest("[data-act]") : null;
    if (!el) return;
    var act = el.getAttribute("data-act");

    switch (act) {
      case "toggleTheme":
        toggleTheme();
        break;
      case "cloudSyncNow":
        showMiniToast("Đang đồng bộ dữ liệu với Vercel...");
        pushToCloud();
        break;
      case "home": state.chapter = null; state.mode = "theory"; window.scrollTo({ top: 0, behavior: "smooth" }); render(false); break;
      case "grade": setGrade(el.getAttribute("data-g")); break;
      case "mode": setMode(el.getAttribute("data-m")); break;
      case "tab": setTab(el.getAttribute("data-t")); break;
      case "jumpToTheory": {
        var chId = el.getAttribute("data-ch") || "g12c1";
        if (state.test || (state.coachTest && state.coachTest.t && !state.coachTest.done)) {
          openTheoryModal(chId);
        } else {
          state.mode = "theory";
          state.chapter = chId;
          render();
          window.scrollTo({ top: 0, behavior: "smooth" });
          setTimeout(function() {
            var feyn = document.querySelector(".feynman");
            if (feyn) {
              feyn.classList.add("highlight-pulse");
              setTimeout(function() { feyn.classList.remove("highlight-pulse"); }, 2000);
            }
          }, 120);
        }
        break;
      }
      case "toggleEditMode": toggleEditMode(); break;
      case "togglePerfMode": togglePerfMode(); break;
      case "openChapter": state.chapter = el.getAttribute("data-ch"); window.scrollTo({ top: 0, behavior: "smooth" }); render(false); break;
      case "back": state.chapter = null; window.scrollTo({ top: 0, behavior: "smooth" }); render(false); break;

      /* Edit Mode JSON backup & reset */
      case "exportData": exportCustomDataJSON(); break;
      case "importDataPrompt": $("#importJsonInput") && $("#importJsonInput").click(); break;
      case "resetDefaultData": resetCustomData(); break;

      /* Theory Reveal & Favourites */
      case "reveal":
        (function () {
          var card = el.closest(".note");
          if (card) { card.classList.remove("reveal-off"); card.classList.add("reveal-on"); }
        })(); break;
      case "favNote":
      case "favEx":
        (function () {
          var kind = act === "favNote" ? "n" : "e";
          var key = el.getAttribute("data-key");
          toggleFav(kind, key);
          var on = profile().fav[kind] && profile().fav[kind][key];
          el.classList.toggle("on", !!on);
          if (state.mode === "library") renderLibraryOnly();
        })(); break;
      case "favRemove":
        toggleFav(el.getAttribute("data-kind"), el.getAttribute("data-key"));
        renderLibraryOnly(); break;
      case "favOpen": openFavItem(el.getAttribute("data-ch"), el.getAttribute("data-key")); break;

      /* Flashcard session */
      case "flashStart":
        (function () {
          var selEl = $(".sel[data-act='flash-ch']");
          startFlashSession(selEl ? selEl.value : (state.flash && state.flash.sel ? state.flash.sel : "all"));
          renderPracticeOnly();
        })(); break;
      case "flashStartDue":
        startFlashSession("all", true);
        renderPracticeOnly();
        break;
      case "flip":
        if (state.flash && state.flash.items && state.flash.items.length) {
          state.flash.flipped = !state.flash.flipped;
          var fc = $(".flash-card");
          if (fc) {
            fc.classList.toggle("flipped", state.flash.flipped);
            if (hasGSAP && !prefersReduced) {
              gsap.fromTo(fc, { scale: 0.975 }, { scale: 1, duration: 0.38, ease: "back.out(1.4)", clearProps: "transform" });
            }
          }
        } break;
      case "flashRate":
        var r = parseInt(el.getAttribute("data-r"), 10) || 3;
        markFlash(r);
        break;
      case "flashAgain": markFlash(1); break;
      case "flashGood": markFlash(3); break;
      case "flashPrevCard": flashPrevCard(); break;
      case "flashNextCard": flashNextCard(); break;
      case "flashPrev": state.flash = null; render(); break;

      /* Bank Quiz */
      case "bankStart":
        var selCh = $(".sel[data-act='bank-ch']");
        var selKind = $(".sel[data-act='bank-kind']");
        startBank(selCh ? selCh.value : "all", selKind ? selKind.value : "all");
        break;
      case "bankPrev": bankPrev(); break;
      case "bankNext": bankNext(); break;
      case "bankFinish": bankFinish(); break;
      case "bankAgain": state.bank.mode = "pick"; state.bank.items = null; render(); break;
      case "bankWrong": bankWrong(); break;
      case "bankPick": bankPick(el.getAttribute("data-p")); break;

      /* Tests */
      case "testStart": startTest(el.getAttribute("data-t")); break;
      case "testPick": testPick(el.getAttribute("data-p")); break;
      case "testPrev":
        if (state.test && state.test.i > 0) {
          state.test.i--;
          renderPracticeOnly();
          var tq = $(".test-q");
          if (tq) tq.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        break;
      case "testNext":
        if (state.test && state.test.i + 1 < state.test.t.qs.length) {
          state.test.i++;
          renderPracticeOnly();
          var tq = $(".test-q");
          if (tq) tq.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        break;
      case "testJump":
        if (state.test) {
          state.test.i = parseInt(el.getAttribute("data-i"), 10);
          renderPracticeOnly();
          var tq = $(".test-q");
          if (tq) tq.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        break;
      case "testSubmit": testSubmit(); break;
      case "testAgain": state.test.done = null; startTest(state.test.t.id); break;
      case "testQuit": state.test = null; render(); break;

      /* Guided Learning */
      case "guidedPredict": guidedPredict(el.getAttribute("data-k")); break;
      case "guidedPick": guidedPick(el.getAttribute("data-k")); break;
      case "guidedPrevStage": guidedPrevStage(); break;
      case "guidedNextStage": guidedNextStage(); break;
      case "guidedJump":
        state.guided.stageIdx = parseInt(el.getAttribute("data-i"), 10);
        state.guided.checked = false;
        state.guided.pickedOpt = null;
        render(false);
        var targetCard = $(".guided-card") || $(".guided-container");
        if (targetCard) {
          targetCard.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        break;

      /* Coach Testing & Diagnostic Simulator */
      case "coachSetGrade": coachSetGrade(el.getAttribute("data-g")); break;
      case "startCoachExam": startCoachExam(el.getAttribute("data-tid")); break;
      case "quitCoachExam": quitCoachExam(); break;
      case "testPickCluster": {
        var subId = el.getAttribute("data-sub");
        var p = el.getAttribute("data-p");
        if (state.test && subId) {
          var curA = state.test.answers[state.test.i];
          if (typeof curA !== "object" || curA === null) curA = {};
          curA[subId] = p;
          state.test.answers[state.test.i] = curA;
          renderPracticeOnly();
        }
        break;
      }
      case "coachPick": coachPick(el.getAttribute("data-p")); break;
      case "coachPickTF": coachPickTF(el.getAttribute("data-p")); break;
      case "coachPickClusterTF": coachPickClusterTF(el.getAttribute("data-sub"), el.getAttribute("data-p")); break;
      case "coachSubmitCluster": coachSubmitCluster(); break;
      case "coachPickN": coachPickN(); break;
      case "coachHelp": coachHelp(); break;
      case "coachPrev": coachPrev(); break;
      case "coachNext": coachNext(); break;
      case "jumpCoachQ": jumpCoachQ(parseInt(el.getAttribute("data-idx"), 10)); break;
      case "toggleCoachPalette": toggleCoachPalette(); break;
      case "toggleTheoryPeek": toggleTheoryPeek(); break;
      case "finishCoachExam": finishCoachExam(); break;
      case "restartCoachExam": restartCoachExam(); break;
      case "reviewCoachMistakes": reviewCoachMistakes(); break;
      case "coachTestPick": coachPick(el.getAttribute("data-p")); break;
      case "coachTestPrev": coachPrev(); break;
      case "coachTestNext": coachNext(); break;
      case "toggleHint": toggleTheoryPeek(); break;
      case "restartCoachTest": restartCoachExam(); break;

      /* Notes */
      case "noteSave": noteSave(); break;
      case "noteDel":
        var s = profile();
        var id = el.getAttribute("data-id");
        s.notes = (s.notes || []).filter(function (n) { return n.id !== id; });
        save(s);
        renderLibraryOnly(); break;
      case "libTab": setLib(el.getAttribute("data-t")); break;

      /* EDIT ACTIONS */
      case "addNote":
        (function () {
          var chId = el.getAttribute("data-ch");
          openModal({
            title: "Thêm thẻ lý thuyết mới",
            fields: [
              { id: "t", label: "Tiêu đề thẻ", val: "", type: "text" },
              { id: "kind", label: "Loại thẻ", val: "card", type: "select", opts: [["card","Công thức"],["rule","Quy tắc"],["rxn","Phản ứng"],["trick","Mẹo"],["danger","Cảnh báo"],["table","Bảng"]] },
              { id: "b", label: "Nội dung lý thuyết", val: "", type: "textarea", rows: 5 }
            ],
            onSave: function (vals) {
              DATA[chId] = DATA[chId] || { notes: [], exercises: [] };
              DATA[chId].notes = DATA[chId].notes || [];
              DATA[chId].notes.unshift({ t: vals.t, kind: vals.kind, b: vals.b });
              saveCustomData();
            }
          });
        })(); break;

      case "editNote":
        (function () {
          var chId = el.getAttribute("data-ch"), i = parseInt(el.getAttribute("data-i"), 10);
          var note = DATA[chId].notes[i];
          openModal({
            title: "Sửa thẻ lý thuyết",
            fields: [
              { id: "t", label: "Tiêu đề thẻ", val: note.t, type: "text" },
              { id: "kind", label: "Loại thẻ", val: note.kind || "card", type: "select", opts: [["card","Công thức"],["rule","Quy tắc"],["rxn","Phản ứng"],["trick","Mẹo"],["danger","Cảnh báo"],["table","Bảng"]] },
              { id: "b", label: "Nội dung lý thuyết", val: note.b, type: "textarea", rows: 6 }
            ],
            onSave: function (vals) {
              note.t = vals.t; note.kind = vals.kind; note.b = vals.b;
              saveCustomData();
            }
          });
        })(); break;

      case "deleteNote":
        (function () {
          var chId = el.getAttribute("data-ch"), i = parseInt(el.getAttribute("data-i"), 10);
          if (confirm("Bạn có chắc chắn muốn xoá thẻ này không?")) {
            DATA[chId].notes.splice(i, 1);
            saveCustomData();
            render();
          }
        })(); break;

      case "editFeynman":
        (function () {
          var chId = el.getAttribute("data-ch");
          openModal({
            title: "Sửa tóm tắt Feynman chương",
            fields: [
              { id: "feynman", label: "Giải thích ngắn gọn kiểu Feynman", val: DATA[chId].feynman || "", type: "textarea", rows: 5 }
            ],
            onSave: function (vals) {
              DATA[chId].feynman = vals.feynman;
              saveCustomData();
            }
          });
        })(); break;

      case "addExercise":
        (function () {
          var chId = el.getAttribute("data-ch");
          openModal({
            title: "Thêm bài tập tự luyện",
            fields: [
              { id: "q", label: "Đề bài", val: "", type: "textarea", rows: 3 },
              { id: "opts", label: "Phương án lựa chọn (A=...;B=...;C=...;D=... hoặc để trống)", val: "", type: "text" },
              { id: "ans", label: "Đáp án", val: "", type: "text" },
              { id: "steps", label: "Các bước giải (mỗi dòng một bước)", val: "", type: "textarea", rows: 4 }
            ],
            onSave: function (vals) {
              DATA[chId] = DATA[chId] || { notes: [], exercises: [] };
              DATA[chId].exercises = DATA[chId].exercises || [];
              var n = DATA[chId].exercises.length + 1;
              var stArr = vals.steps ? vals.steps.split("\n").filter(function (x) { return x.trim(); }) : [];
              DATA[chId].exercises.push({ n: n, q: vals.q, opts: vals.opts, ans: vals.ans, steps: stArr });
              saveCustomData();
            }
          });
        })(); break;

      case "editExercise":
        (function () {
          var chId = el.getAttribute("data-ch"), i = parseInt(el.getAttribute("data-i"), 10);
          var ex = DATA[chId].exercises[i];
          openModal({
            title: "Sửa bài tập C" + ex.n,
            fields: [
              { id: "q", label: "Đề bài", val: ex.q, type: "textarea", rows: 3 },
              { id: "opts", label: "Phương án (A=...;B=...;C=...;D=...)", val: ex.opts || "", type: "text" },
              { id: "ans", label: "Đáp án", val: ex.ans || ex.a || "", type: "text" },
              { id: "steps", label: "Các bước giải (mỗi dòng một bước)", val: (ex.steps || []).join("\n"), type: "textarea", rows: 4 }
            ],
            onSave: function (vals) {
              ex.q = vals.q; ex.opts = vals.opts; ex.ans = vals.ans;
              ex.steps = vals.steps ? vals.steps.split("\n").filter(function (x) { return x.trim(); }) : [];
              saveCustomData();
            }
          });
        })(); break;

      case "deleteExercise":
        (function () {
          var chId = el.getAttribute("data-ch"), i = parseInt(el.getAttribute("data-i"), 10);
          if (confirm("Bạn có chắc chắn muốn xoá bài tập này?")) {
            DATA[chId].exercises.splice(i, 1);
            saveCustomData();
            render();
          }
        })(); break;

      case "addFlashcard":
        (function () {
          var chId = el.getAttribute("data-ch") || "g12c1";
          openModal({
            title: "Thêm thẻ nhớ tối giản mới",
            fields: [
              { id: "q", label: "Mặt trước: Khái niệm / Chất / Phản ứng (Ví dụ: CTPT methyl acetate)", val: "", type: "text" },
              { id: "a", label: "Mặt sau: Đáp án cốt lõi tối giản (Ví dụ: CH₃COOCH₃)", val: "", type: "text" },
              { id: "note", label: "Ghi chú ngắn (tùy chọn)", val: "", type: "text" }
            ],
            onSave: function (vals) {
              DATA[chId] = DATA[chId] || {};
              DATA[chId].customFlashcards = DATA[chId].customFlashcards || [];
              DATA[chId].customFlashcards.unshift({ q: vals.q, a: vals.a, note: vals.note });
              saveCustomData();
            }
          });
        })(); break;

      case "editCurFlashcard":
        (function () {
          var f = state.flash;
          if (!f || !f.items || !f.items[f.i]) return;
          var cur = f.items[f.i];
          openModal({
            title: "Sửa thẻ nhớ",
            fields: [
              { id: "q", label: "Mặt trước: Khái niệm / Chất", val: cur.q, type: "text" },
              { id: "a", label: "Mặt sau: Đáp án cốt lõi", val: cur.a, type: "text" },
              { id: "note", label: "Ghi chú thêm", val: cur.note || "", type: "text" }
            ],
            onSave: function (vals) {
              cur.q = vals.q; cur.a = vals.a; cur.note = vals.note;
              var ch = DATA[cur.ch];
              if (ch) {
                ch.customFlashcards = ch.customFlashcards || [];
                ch.customFlashcards.push({ q: vals.q, a: vals.a, note: vals.note });
              }
              saveCustomData();
            }
          });
        })(); break;

      case "deleteCurFlashcard":
        (function () {
          var f = state.flash;
          if (!f || !f.items || !f.items[f.i]) return;
          if (confirm("Xoá thẻ nhớ này khỏi phiên luyện?")) {
            f.items.splice(f.i, 1);
            if (f.i >= f.items.length) f.i = f.items.length;
            renderPracticeOnly();
          }
        })(); break;

      case "addTest":
        (function () {
          openModal({
            title: "Tạo bộ đề thi mới",
            fields: [
              { id: "title", label: "Tên bộ đề", val: "Đề ôn tập mới", type: "text" },
              { id: "grade", label: "Khối lớp", val: "g12", type: "select", opts: [["g11","Hoá 11"],["g12","Hoá 12"]] },
              { id: "timeMin", label: "Thời gian làm bài (phút)", val: "30", type: "text" }
            ],
            onSave: function (vals) {
              DATA.tests = DATA.tests || [];
              var newId = "test_" + Date.now();
              DATA.tests.push({
                id: newId,
                title: vals.title,
                grade: vals.grade,
                timeMin: parseInt(vals.timeMin, 10) || 30,
                qs: [
                  { k: "m", q: "Câu hỏi mẫu 1: Chất nào sau đây là este no đơn chức mạch hở?", o: "A=CH₃COOH;B=CH₃COOCH₃;C=C₂H₅OH;D=HCOOH", a: "B", e: "CH₃COOCH₃ là methyl acetate." }
                ]
              });
              saveCustomData();
            }
          });
        })(); break;

      case "editTest":
        (function () {
          var id = el.getAttribute("data-id");
          var t = null;
          for (var i = 0; i < (DATA.tests || []).length; i++) if (DATA.tests[i].id === id) t = DATA.tests[i];
          if (!t) return;
          openModal({
            title: "Sửa bộ đề: " + t.title,
            fields: [
              { id: "title", label: "Tên bộ đề", val: t.title, type: "text" },
              { id: "timeMin", label: "Thời gian (phút)", val: String(t.timeMin || 30), type: "text" }
            ],
            onSave: function (vals) {
              t.title = vals.title;
              t.timeMin = parseInt(vals.timeMin, 10) || 30;
              saveCustomData();
            }
          });
        })(); break;

      case "deleteTest":
        (function () {
          var id = el.getAttribute("data-id");
          if (confirm("Bạn có chắc muốn xoá bộ đề này không?")) {
            DATA.tests = (DATA.tests || []).filter(function (t) { return t.id !== id; });
            saveCustomData();
            renderPracticeOnly();
          }
        })(); break;

      case "addTestQ":
        (function () {
          var T = state.test;
          if (!T || !T.t) return;
          openModal({
            title: "Thêm câu hỏi vào đề thi",
            fields: [
              { id: "q", label: "Nội dung câu hỏi", val: "", type: "textarea", rows: 3 },
              { id: "k", label: "Dạng câu hỏi", val: "m", type: "select", opts: [["m","Trắc nghiệm (MCQ)"],["tf","Đúng / Sai"],["n","Điền số"]] },
              { id: "o", label: "Phương án (A=...;B=...;C=...;D=...)", val: "A=...;B=...;C=...;D=...", type: "text" },
              { id: "a", label: "Đáp án đúng (Ví dụ: A hoặc true hoặc số)", val: "A", type: "text" },
              { id: "e", label: "Lời giải thích", val: "", type: "textarea", rows: 3 }
            ],
            onSave: function (vals) {
              T.t.qs.push({ k: vals.k, q: vals.q, o: vals.o, a: vals.a, e: vals.e });
              saveCustomData();
              renderPracticeOnly();
            }
          });
        })(); break;

      case "editTestQ":
        (function () {
          var T = state.test;
          if (!T || !T.t) return;
          var it = T.t.qs[T.i];
          openModal({
            title: "Sửa câu hỏi #" + (T.i + 1),
            fields: [
              { id: "q", label: "Nội dung câu hỏi", val: it.q, type: "textarea", rows: 3 },
              { id: "k", label: "Dạng câu hỏi", val: it.k, type: "select", opts: [["m","Trắc nghiệm (MCQ)"],["tf","Đúng / Sai"],["n","Điền số"]] },
              { id: "o", label: "Phương án (A=...;B=...;C=...;D=...)", val: it.o || "", type: "text" },
              { id: "a", label: "Đáp án đúng", val: it.a, type: "text" },
              { id: "e", label: "Lời giải thích", val: it.e || "", type: "textarea", rows: 3 }
            ],
            onSave: function (vals) {
              it.q = vals.q; it.k = vals.k; it.o = vals.o; it.a = vals.a; it.e = vals.e;
              saveCustomData();
              renderPracticeOnly();
            }
          });
        })(); break;

      case "deleteTestQ":
        (function () {
          var T = state.test;
          if (!T || !T.t) return;
          if (confirm("Xoá câu hỏi này khỏi đề thi?")) {
            T.t.qs.splice(T.i, 1);
            if (T.i >= T.t.qs.length) T.i = Math.max(0, T.t.qs.length - 1);
            saveCustomData();
            renderPracticeOnly();
          }
        })(); break;

      case "addGuidedStage":
        (function () {
          var chId = el.getAttribute("data-ch");
          openModal({
            title: "Thêm chặng học có hướng dẫn",
            fields: [
              { id: "title", label: "Tên chặng học", val: "Chặng mới", type: "text" },
              { id: "hook", label: "1. Trực giác đời sống (Feynman Hook)", val: "", type: "textarea", rows: 3 },
              { id: "core", label: "2. Bản chất & cơ chế cốt lõi", val: "", type: "textarea", rows: 3 },
              { id: "trap", label: "3. Điểm bẫy thi cử", val: "", type: "textarea", rows: 3 },
              { id: "cq", label: "4. Câu hỏi chốt chặng", val: "", type: "text" },
              { id: "copts", label: "Các phương án (A=...;B=...;C=...;D=...)", val: "A=...;B=...;C=...;D=...", type: "text" },
              { id: "ca", label: "Đáp án đúng (A/B/C/D)", val: "A", type: "text" },
              { id: "chint", label: "Gợi ý tư duy khi làm sai", val: "", type: "text" },
              { id: "cexp", label: "Giải thích khi làm đúng", val: "", type: "text" }
            ],
            onSave: function (vals) {
              DATA[chId] = DATA[chId] || {};
              DATA[chId].guidedStages = DATA[chId].guidedStages || (DEFAULT_GUIDED_STAGES[chId] ? DEFAULT_GUIDED_STAGES[chId].slice() : []);
              DATA[chId].guidedStages.push({
                title: vals.title, hook: vals.hook, core: vals.core, trap: vals.trap,
                check: { q: vals.cq, opts: vals.copts, a: vals.ca, hint: vals.chint, exp: vals.cexp }
              });
              saveCustomData();
              render();
            }
          });
        })(); break;

      case "editGuidedStage":
        (function () {
          var chId = el.getAttribute("data-ch"), i = parseInt(el.getAttribute("data-i"), 10);
          var ch = DATA[chId];
          var stages = (ch && ch.guidedStages) || DEFAULT_GUIDED_STAGES[chId] || DEFAULT_GUIDED_STAGES.g12c1;
          var st = stages[i];
          openModal({
            title: "Sửa chặng học: " + st.title,
            fields: [
              { id: "title", label: "Tên chặng", val: st.title, type: "text" },
              { id: "hook", label: "1. Trực giác đời sống (Feynman)", val: st.hook, type: "textarea", rows: 3 },
              { id: "core", label: "2. Cơ chế cốt lõi", val: st.core, type: "textarea", rows: 3 },
              { id: "trap", label: "3. Điểm bẫy thi cử", val: st.trap, type: "textarea", rows: 3 },
              { id: "cq", label: "4. Câu hỏi chốt chặng", val: st.check.q, type: "text" },
              { id: "copts", label: "Các phương án (A=...;B=...;C=...;D=...)", val: st.check.opts, type: "text" },
              { id: "ca", label: "Đáp án đúng (A/B/C/D)", val: st.check.a, type: "text" },
              { id: "chint", label: "Gợi ý tư duy", val: st.check.hint, type: "text" },
              { id: "cexp", label: "Giải thích đáp án", val: st.check.exp, type: "text" }
            ],
            onSave: function (vals) {
              DATA[chId] = DATA[chId] || {};
              DATA[chId].guidedStages = stages;
              st.title = vals.title; st.hook = vals.hook; st.core = vals.core; st.trap = vals.trap;
              st.check = { q: vals.cq, opts: vals.copts, a: vals.ca, hint: vals.chint, exp: vals.cexp };
              saveCustomData();
              render();
            }
          });
        })(); break;

      case "deleteGuidedStage":
        (function () {
          var chId = el.getAttribute("data-ch"), i = parseInt(el.getAttribute("data-i"), 10);
          var ch = DATA[chId];
          var stages = (ch && ch.guidedStages) || DEFAULT_GUIDED_STAGES[chId] || DEFAULT_GUIDED_STAGES.g12c1;
          if (confirm("Bạn có muốn xoá chặng học này không?")) {
            stages.splice(i, 1);
            DATA[chId] = DATA[chId] || {};
            DATA[chId].guidedStages = stages;
            state.guided.stageIdx = Math.max(0, i - 1);
            saveCustomData();
            render();
          }
        })(); break;

      /* Modal buttons */
      case "modalCancel":
      case "modalBgClick":
        closeModal(); break;

      case "modalSave":
        if (state.modal && typeof state.modal.onSave === "function") {
          var vals = {};
          (state.modal.fields || []).forEach(function (f) {
            var input = $("#m_" + f.id);
            if (input) vals[f.id] = input.value;
          });
          state.modal.onSave(vals);
        }
        closeModal();
        break;

      /* Chemistry Mini-Games Arena (Đấu trường Mini-games) */
      case "cgNav":
        if (window.ChemGames) {
          ChemGames.mode = el.getAttribute("data-gmode") || "hub";
          renderPracticeOnly();
        }
        break;
      case "cgStartChain":
        if (window.ChemGames) {
          ChemGames.startChainGame(parseInt(el.getAttribute("data-idx"), 10) || 0);
        }
        break;
      case "cgChainMove":
        if (window.ChemGames) {
          ChemGames.moveChainStep(parseInt(el.getAttribute("data-idx"), 10), el.getAttribute("data-dir"));
        }
        break;
      case "cgChainCheck":
        if (window.ChemGames) {
          ChemGames.checkChain();
          updateHeaderStats(true);
        }
        break;
      case "cgStartMatch":
        if (window.ChemGames) {
          ChemGames.startMatchGame(parseInt(el.getAttribute("data-idx"), 10) || 0);
        }
        break;
      case "cgMatchPickLeft":
        if (window.ChemGames) {
          ChemGames.pickMatchLeft(el.getAttribute("data-id"));
          updateHeaderStats(true);
        }
        break;
      case "cgMatchPickRight":
        if (window.ChemGames) {
          ChemGames.pickMatchRight(el.getAttribute("data-id"));
          updateHeaderStats(true);
        }
        break;
      case "cgStartDetective":
        if (window.ChemGames) {
          ChemGames.startDetectiveGame(parseInt(el.getAttribute("data-idx"), 10) || 0);
        }
        break;
      case "cgDetectiveRevealClue":
        if (window.ChemGames) {
          ChemGames.revealNextClue();
        }
        break;
      case "cgDetectiveGuess":
        if (window.ChemGames) {
          ChemGames.guessDetective(el.getAttribute("data-sub"));
          updateHeaderStats(true);
        }
        break;

      /* Sổ tay Bẫy đề thi & Điểm 9+ (ChemTraps) */
      case "ctFilter":
        if (window.ChemTraps) {
          ChemTraps.setCategory(el.getAttribute("data-cat"));
        }
        break;
      case "ctQuizPick":
        if (window.ChemTraps) {
          ChemTraps.answerQuiz(el.getAttribute("data-tid"), el.getAttribute("data-k"));
        }
        break;
      case "ctQuizRetry":
        if (window.ChemTraps) {
          ChemTraps.resetQuiz(el.getAttribute("data-tid"));
        }
        break;
      case "jumpToTraps":
        state.mode = "library";
        state.lib = "traps";
        if (window.ChemTraps) {
          ChemTraps.setCategory(el.getAttribute("data-cat") || "all");
        }
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
    }
  });

  /* ---------- GLOBAL CHANGE DELEGATION ---------- */
  document.addEventListener("change", function (ev) {
    var el = ev.target.closest ? ev.target.closest("[data-act], select, input") : null;
    if (!el) return;
    var act = el.getAttribute("data-act");

    if (el.id === "importJsonInput" && el.files && el.files[0]) {
      importCustomDataJSON(el.files[0]);
    } else if (act === "guided-ch-sel") {
      state.guided.ch = el.value;
      state.guided.stageIdx = 0;
      state.guided.checked = false;
      state.guided.pickedOpt = null;
      render();
    } else if (act === "flash-ch" && state.flash) {
      state.flash.sel = el.value;
    } else if (act === "bank-ch" && state.bank) {
      state.bank.ch = el.value; state.bank.items = null; state.bank.mode = "pick"; renderPracticeOnly();
    } else if (act === "bank-kind" && state.bank) {
      state.bank.kind = el.value; state.bank.items = null; state.bank.mode = "pick"; renderPracticeOnly();
    } else if (act === "cgChainSelect") {
      if (window.ChemGames) ChemGames.startChainGame(parseInt(el.value, 10) || 0);
    } else if (act === "cgMatchSelect") {
      if (window.ChemGames) ChemGames.startMatchGame(parseInt(el.value, 10) || 0);
    } else if (act === "cgDetectiveSelect") {
      if (window.ChemGames) ChemGames.startDetectiveGame(parseInt(el.value, 10) || 0);
    }
  });

  /* ---------- GLOBAL INPUT DELEGATION (REAL-TIME FILTERING) ---------- */
  document.addEventListener("input", function (ev) {
    var el = ev.target;
    if (!el) return;
    var act = el.getAttribute("data-act");

    if (act === "coachSearchInput") {
      state.coachTest.searchQuery = el.value.trim().toLowerCase();
      var grid = $(".coach-test-grid");
      if (grid) {
        var s = profile();
        var curGrade = state.coachTest.filterGrade || state.grade || "all";
        var query = state.coachTest.searchQuery;
        var allTests = DATA.tests || [];
        var filtered = allTests.filter(function (t) {
          if (curGrade !== "all" && t.grade !== curGrade) return false;
          if (query) {
            var str = (t.title + " " + (t.desc || "") + " " + (t.author || "") + " " + (t.grade || "")).toLowerCase();
            if (!str.includes(query)) return false;
          }
          return true;
        });

        var html = filtered.map(function (t) {
          var best = s.tests && s.tests[t.id];
          var qCount = t.qs ? t.qs.length : 0;
          var gradeBadge = t.grade === "g12" ? '<span class="badge g12">Hoá 12</span>' : '<span class="badge g11">Hoá 11</span>';

          return '<div class="coach-exam-card">' +
            '<div class="cec-head">' +
              '<div class="cec-icon">' + ico("target") + '</div>' +
              '<div class="cec-meta">' +
                gradeBadge +
                (t.author ? '<span class="author-pill">' + ico("user") + ' ' + esc(t.author) + '</span>' : '') +
                '<span class="cec-count">' + qCount + ' câu hỏi</span>' +
                '<span class="cec-time">' + ico("clock") + ' ~' + (t.timeMin || 45) + ' phút</span>' +
              '</div>' +
            '</div>' +
            '<h3 class="cec-title">' + esc(t.title) + '</h3>' +
            '<div class="cec-features">' +
              '<span class="cec-pill">' + ico("bulb") + ' Gia sư đồng hành</span>' +
              '<span class="cec-pill">' + ico("flask") + ' Case study thực tiễn</span>' +
              '<span class="cec-pill">' + ico("shield") + ' Bẫy phương án sai</span>' +
            '</div>' +
            '<div class="cec-foot">' +
              (best != null ? '<span class="cec-best">Điểm cao nhất: <b>' + best + '/10</b></span>' : '<span class="cec-new">Chưa hoàn thành</span>') +
              '<button class="btn primary cec-btn" data-act="startCoachExam" data-tid="' + t.id + '">' +
                'Làm đề có hướng dẫn →' +
              '</button>' +
            '</div>' +
          '</div>';
        }).join("");

        grid.innerHTML = html || '<div class="empty-state" style="padding:40px;text-align:center;color:var(--muted)">' +
          ico("search") + '<p>Không tìm thấy đề thi phù hợp với từ khoá "' + esc(query) + '".</p>' +
        '</div>';
      }
    }
  });

  /* ---------- KEYBOARD SHORTCUTS ---------- */
  document.addEventListener("keydown", function (ev) {
    if (state.modal) {
      if (ev.key === "Escape") closeModal();
      return;
    }
    if (state.tab === "flash" && state.flash && state.flash.items && state.flash.items.length) {
      if (ev.code === "Space" || (!state.editMode && ev.code === "Enter")) {
        ev.preventDefault();
        state.flash.flipped = !state.flash.flipped;
        var fc = $(".flash-card");
        if (fc) fc.classList.toggle("flipped", state.flash.flipped);
      } else if (ev.code === "Digit1" || ev.key === "1") {
        markFlash(1);
      } else if (ev.code === "Digit2" || ev.key === "2") {
        markFlash(2);
      } else if (ev.code === "Digit3" || ev.key === "3") {
        markFlash(3);
      } else if (ev.code === "Digit4" || ev.key === "4") {
        markFlash(4);
      } else if (ev.key === "ArrowLeft") {
        ev.preventDefault();
        flashPrevCard();
      } else if (ev.key === "ArrowRight") {
        ev.preventDefault();
        flashNextCard();
      }
    }
  });

  /* ---------- BOOT ---------- */
  function boot() {
    applyTheme(state.theme);
    if (state.editMode) {
      document.body.classList.add("edit-mode-active");
    }
    initCustomData();
    headerEl = document.createElement("header");
    headerEl.id = "topbar";
    document.body.insertBefore(headerEl, document.body.firstChild);
    renderMobileNav();
    render();

    // Background cloud sync for single user (William-Rowan-Waltor)
    syncFromCloud(function (hasUpdates) {
      if (hasUpdates) {
        renderShell();
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();