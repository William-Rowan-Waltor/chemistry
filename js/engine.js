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
  var num = function (s) {
    s = String(s == null ? "" : s).trim().replace(/\s/g, "").replace(/,/g, ".");
    if (s === "" || s === "-" || s === ".") return null;
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
    book: '<path d="M2 4.5h5a5 5 0 0 1 5 4V20a4 4 0 0 0-4-4H2z"/><path d="M22 4.5h-5a5 5 0 0 0-5 4V20a4 4 0 0 1 4-4h6z"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>',
    cards: '<path d="M12 3l9 4.5-9 4.5-9-4.5L12 3z"/><path d="M3 12.2l9 4.5 9-4.5"/><path d="M3 16.2l9 4.5 9-4.5"/>',
    check: '<path d="M9 4.5h6v2.5H9z"/><path d="M6.5 7h11A2.5 2.5 0 0 1 20 9.5v9A2.5 2.5 0 0 1 17.5 21h-11A2.5 2.5 0 0 1 4 18.5v-9A2.5 2.5 0 0 1 6.5 7z"/><path d="M8.5 13.5l2.5 2.5 4.5-4.5"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3.5 2"/>',
    flame: '<path d="M12 2.5c1.7 2.9 4.5 4.3 4.5 7.6a4.5 4.5 0 0 1-9 0C7.5 6.8 10.3 4.6 12 2.5z"/><path d="M12 15.5a2.3 2.3 0 0 1-2.3-2.2c0-1.6 1.3-2.7 2.3-3.9 1 1.2 2.3 2.3 2.3 3.9A2.3 2.3 0 0 1 12 15.5z"/>',
    cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M8 3v4M16 3v4"/><path d="M3.5 9.5h17"/>',
    flask: '<path d="M10 2.5h4M10.5 2.5V7L7 14.5A3.5 3.5 0 0 0 9.5 20h5a3.5 3.5 0 0 0 2.5-5.5L13.5 7V2.5"/><path d="M8 12h8"/>',
    ring: '<path d="M12 3.5l7 4v9l-7 4-7-4v-9l7-4z"/><circle cx="12" cy="12" r="2.3"/>',
    tube: '<path d="M9.5 2.5h5M10.5 2.5v6.5a3.5 3.5 0 0 1-2.5 3.3A4.5 4.5 0 0 0 12 17a4.5 4.5 0 0 0 4-4.7A3.5 3.5 0 0 1 13.5 9V2.5"/><path d="M8.5 14h7"/>',
    drop: '<path d="M12 3s6 6.7 6 10a6 6 0 0 1-12 0c0-3.3 6-10 6-10z"/>',
    pump: '<path d="M9 3.5h6M9.5 3.5v2l2 1.6 2-1.6v-2"/><path d="M7.5 9h9l1.5 2.5V18a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6.5L7.5 9z"/><path d="M10 14h4"/>',
    carbonyl: '<path d="M12 3.5l7 4v9l-7 4-7-4v-9l7-4z"/><path d="M19 7.5l2.6 1.4"/><circle cx="22.4" cy="9.8" r="1.4"/>',
    acid: '<path d="M10 2.5h4M10.5 2.5v4.5l-3.8 7A3.6 3.6 0 0 0 9.5 20h5a3.6 3.6 0 0 0 3.3-6l-3.8-7V2.5"/><circle cx="11.5" cy="10" r=".8"/><circle cx="13.5" cy="12.5" r=".9"/><circle cx="12" cy="15" r=".8"/>',
    books: '<path d="M5 4h14v16H5z"/><path d="M9.5 8h5M9.5 11.5h5M9.5 15h3"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/>',
    lipid: '<path d="M12 3s6 6.7 6 10a6 6 0 0 1-12 0c0-3.3 6-10 6-10z"/><path d="M9 12h6M9.5 14.5h5"/>',
    formula: '<path d="M4 5h16l-8 7 8 7H4"/>',
    rule: '<path d="M9 4.5h6v2.5H9z"/><path d="M6.5 7h11A2.5 2.5 0 0 1 20 9.5v9A2.5 2.5 0 0 1 17.5 21h-11A2.5 2.5 0 0 1 4 18.5v-9A2.5 2.5 0 0 1 6.5 7z"/><path d="M8.5 12.5h7M8.5 15.5h7"/>',
    bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.4c.7.6 1 1.5 1 2.6h6c0-1.1.3-2 1-2.6A6 6 0 0 0 12 3z"/>',
    alert: '<path d="M10.5 4.2 3.5 17a2 2 0 0 0 1.7 3h13.6a2 2 0 0 0 1.7-3L13.5 4.2a2 2 0 0 0-3 0z"/><path d="M12 9.5v4M12 17h.01"/>',
    tbl: '<path d="M4 4h16v16H4z"/><path d="M4 9.5h16M9.5 4v16"/>',
    scale: '<path d="M12 3.5v15.5M6 21h12"/><path d="M7.5 8.5h9"/><path d="M7.5 8.5 5.3 12.6a2.6 2.6 0 0 0 4.4 0L7.5 8.5z"/><path d="M16.5 8.5l-2.2 4.1a2.6 2.6 0 0 0 4.4 0l-2.2-4.1z"/>',
    type: '<path d="M9 4l-2 16M17 4l-2 16M4.5 9h15M4.5 15h15"/>',
    ok: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    no: '<path d="M7 7l10 10M17 7L7 17"/>',
    choose: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    eye: '<path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.5"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v4.5M12 7.5h.01"/>',
    star: '<path d="M12 3.2l2.8 5.7 6.3.9-4.6 4.5 1.1 6.3-5.6-2.9-5.6 2.9 1.1-6.3-4.6-4.5 6.3-.9L12 3.2z"/>',
    graph: '<circle cx="5" cy="12" r="2.6"/><circle cx="19" cy="5.5" r="2.6"/><circle cx="19" cy="18.5" r="2.6"/><path d="M7.3 10.9l8.4-3.5M7.3 13.1l8.4 3.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    trash: '<path d="M4.5 7.5h15M9.5 7.5V5.5h5v2M7 7.5l1.1 12h7.8l1.1-12M10 11v5M14 11v5"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="M15.5 15.5L20 20"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
    refresh: '<path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
    close: '<path d="M18 6L6 18M6 6l12 12"/>',
    dna: '<path d="M2 15c6.667-6 13.333 0 20-6M2 9c6.667 6 13.333 0 20 6M5 7v10M12 4v16M19 7v10"/>'
  };
  function ico(n) { return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (ICONS[n] || "") + '</svg>'; }
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
    if (cloudSyncStatus === "synced") return "Vercel DB ✓";
    if (cloudSyncStatus === "local") return "Cục bộ";
    if (cloudSyncStatus === "offline") return "Offline";
    return "Đồng bộ";
  }

  function updateCloudIndicator(status, text) {
    cloudSyncStatus = status;
    var el = document.getElementById("cloudSyncStatus");
    if (!el) return;
    var icon = (status === "syncing") ? "⏳" : (status === "offline" ? "📡" : (status === "local" ? "💻" : "☁️"));
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
          updateCloudIndicator("synced", "Vercel DB ✓");
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

          updateCloudIndicator("synced", "Vercel DB ✓");
          if (callback) callback(updated);
        } else {
          updateCloudIndicator("synced", "Vercel DB ✓");
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
    g12c1: [
      { q: "Công thức tổng quát của ester no, đơn chức, mạch hở", a: "CₙH₂ₙO₂ (n ≥ 2)", note: "Ester đơn giản nhất là methyl formate HCOOCH₃ (n=2)" },
      { q: "Mùi hương đặc trưng của isoamyl acetate", a: "Mùi chuối chín", note: "CH₃COOCH₂CH₂CH(CH₃)₂ dùng làm hương liệu thực phẩm" },
      { q: "Mùi thơm đặc trưng của ethyl butyrate và ethyl propionate", a: "Mùi quả dứa chín", note: "Ester tạo hương dứa thơm ngọt tự nhiên" },
      { q: "Mùi thơm đặc trưng của benzyl acetate", a: "Mùi hoa nhài", note: "CH₃COOCH₂C₆H₅ dùng trong công nghiệp nước hoa" },
      { q: "Mùi thơm đặc trưng của methyl acetate", a: "Mùi quả táo", note: "CH₃COOCH₃ là ester no đơn chức C₃H₆O₂" },
      { q: "So sánh nhiệt độ sôi của ester so với alcohol và acid cùng số C", a: "Ester thấp hơn nhiều", note: "Do phân tử ester không tạo được liên kết hydrogen liên phân tử" },
      { q: "Thuỷ phân vinyl acetate (CH₃COOCH=CH₂) trong dung dịch NaOH", a: "CH₃COONa + CH₃CHO (acetaldehyde)", note: "Gốc vinyl gắn trực tiếp vào oxy tạo enol không bền, tự chuyển thành aldehyde" },
      { q: "Thuỷ phân phenyl acetate (CH₃COOC₆H₅) với NaOH dư", a: "CH₃COONa + C₆H₅ONa + H₂O", note: "Tỉ lệ mol 1:2 tạo 2 muối và nước, TUYỆT ĐỐI KHÔNG sinh ra alcohol!" },
      { q: "Số đồng phân ester đơn chức ứng với C₄H₈O₂", a: "4 đồng phân ester", note: "HCOOCH₂CH₂CH₃, HCOOCH(CH₃)₂, CH₃COOC₂H₅, C₂H₅COOCH₃" },
      { q: "Số đồng phân đơn chức (ester và acid) của C₄H₈O₂", a: "6 đồng phân (4 ester + 2 acid)", note: "Gồm 4 ester trên cùng với 2 acid: butanoic acid và isobutanoic acid" },
      { q: "Vai trò của H₂SO₄ đặc trong phản ứng ester hoá", a: "Xúc tác và hút nước", note: "Hút nước giúp chuyển dịch cân bằng hoá học sang chiều tạo ester" },
      { q: "Công thức phân tử và phân tử khối của triolein", a: "(C₁₇H₃₃COO)₃C₃H₅ (M = 884)", note: "Chất béo lỏng không no, chứa 3 liên kết đôi C=C ở gốc acid" },
      { q: "Công thức phân tử và phân tử khối của tristearin", a: "(C₁₇H₃₅COO)₃C₃H₅ (M = 890)", note: "Chất béo rắn no, có trong mỡ bò, mỡ cừu" },
      { q: "Công thức phân tử và phân tử khối của tripalmitin", a: "(C₁₅H₃₁COO)₃C₃H₅ (M = 806)", note: "Chất béo rắn no, có trong mỡ động vật và dầu cọ" },
      { q: "Phản ứng biến dầu ăn lỏng thành bơ nhân tạo / mỡ rắn", a: "Hydrogen hoá (cộng H₂, xúc tác Ni, t°)", note: "Triolein (lỏng) + 3H₂ → Tristearin (rắn)" },
      { q: "Sản phẩm thu được khi xà phòng hoá mọi chất béo bằng NaOH", a: "Glycerol + Muối sodium của acid béo (xà phòng)", note: "1 mol chất béo luôn sinh ra 1 mol glycerol C₃H₅(OH)₃" },
      { q: "Công thức đại diện của xà phòng bánh truyền thống", a: "C₁₇H₃₅COONa hoặc C₁₅H₃₁COONa", note: "Sodium stearate hoặc sodium palmitate có đầu ưa nước và đuôi kị nước" },
      { q: "Công thức đại diện của chất giặt rửa tổng hợp", a: "CH₃[CH₂]₁₁-C₆H₄-SO₃Na", note: "Sodium alkylbenzenesulfonate (chứa nhóm sunfonat -SO₃Na)" },
      { q: "Dấu hiệu nhận biết công thức xà phòng và chất giặt rửa tổng hợp", a: "Xà phòng có đuôi -COO-; chất giặt rửa có nhóm -SO₃- hoặc -OSO₃-", note: "Thấy lưu huỳnh (S) trong muối là chất giặt rửa tổng hợp" },
      { q: "Tại sao xà phòng bị giảm bọt và mất tác dụng trong nước cứng?", a: "Tạo kết tủa không tan với ion Ca²⁺ và Mg²⁺", note: "2RCOO⁻ + Ca²⁺ → (RCOO)₂Ca↓ làm tắc sợi vải và lãng phí xà phòng" },
      { q: "Ưu điểm vượt trội của chất giặt rửa tổng hợp so với xà phòng", a: "Dùng tốt cả trong nước cứng và môi trường acid", note: "Muối alkylsulfonate của Ca²⁺, Mg²⁺ tan tốt trong nước, không bị kết tủa" },
      { q: "Chất tự nhiên có trong quả bồ kết giúp giặt rửa sạch tóc", a: "Saponin", note: "Chất hoạt động bề mặt tự nhiên tạo bọt và cuốn trôi dầu mỡ" },
      { q: "Phân biệt acetic acid, glycerol và triolein chỉ bằng nước và quỳ tím", a: "Triolein tách lớp; acid làm đỏ quỳ; glycerol tan không đổi màu", note: "Triolein không tan trong nước; acid hữu cơ làm quỳ hoá đỏ; glycerol tan vô hạn" },
      { q: "Phản ứng thuỷ phân ester trong môi trường acid là phản ứng gì?", a: "Phản ứng thuận nghịch (hai chiều)", note: "RCOOR' + H₂O ⇌ RCOOH + R'OH (xúc tác H⁺, đun nóng)" },
      { q: "Phản ứng thuỷ phân ester trong môi trường kiềm (xà phòng hoá) là", a: "Phản ứng một chiều", note: "RCOOR' + NaOH → RCOONa + R'OH (đun nóng)" }
    ],
    g12c2: [
      { q: "Công thức phân tử của glucose và fructose", a: "C₆H₁₂O₆ (M = 180)", note: "Đều là monosaccharide, là đồng phân cấu tạo của nhau" },
      { q: "Công thức phân tử của saccharose và maltose", a: "C₁₂H₂₂O₁₁ (M = 342)", note: "Đều là disaccharide, là đồng phân cấu tạo của nhau" },
      { q: "Công thức phân tử của tinh bột và cellulose", a: "(C₆H₁₀O₅)ₙ (M = 162n)", note: "Đều là polysaccharide, KHÔNG phải đồng phân vì n khác nhau" },
      { q: "Tên gọi dân gian của glucose và nồng độ trong máu", a: "Đường nho · Chiếm 0,1% trong máu người", note: "Còn gọi là dextrose, có nhiều trong quả nho chín" },
      { q: "Tên gọi dân gian của fructose và độ ngọt", a: "Đường mật ong · Là loại đường tự nhiên ngọt nhất", note: "Chiếm khoảng 40% khối lượng mật ong" },
      { q: "Tên gọi dân gian của saccharose và nguồn gốc", a: "Đường mía (đường củ cải, đường thốt nốt)", note: "Chiết xuất công nghiệp từ cây mía đường hoặc củ cải đường" },
      { q: "Tên gọi dân gian của maltose và nguồn gốc", a: "Đường mạch nha", note: "Sản xuất bằng cách thuỷ phân tinh bột nhờ men trong mầm lúa" },
      { q: "Các nhóm chức có trong phân tử glucose mạch hở", a: "5 nhóm -OH kề nhau và 1 nhóm -CHO", note: "Vừa có tính chất của polyalcohol vừa có tính chất của aldehyde" },
      { q: "Các nhóm chức có trong phân tử fructose mạch hở", a: "5 nhóm -OH kề nhau và 1 nhóm C=O (ketone)", note: "Polyhydroxyketone có vị ngọt sắc" },
      { q: "Tại sao fructose là ketone mà vẫn tham gia phản ứng tráng bạc?", a: "Trong môi trường kiềm, fructose chuyển hoá thành glucose", note: "Fructose ⇌ Glucose trong môi trường base của thuốc thử Tollens" },
      { q: "Thuốc thử hoá học dùng để phân biệt glucose và fructose", a: "Dung dịch nước bromine (nước Br₂)", note: "Glucose làm mất màu nước Br₂ (môi trường acid); fructose không phản ứng" },
      { q: "Lượng Ag thu được khi 1 mol glucose tráng bạc hoàn toàn", a: "2 mol Ag", note: "1 mol R-CHO sinh ra 2 mol Ag kết tủa bám sáng bóng" },
      { q: "Những carbohydrate nào KHÔNG tham gia phản ứng tráng bạc?", a: "Saccharose, Tinh bột, Cellulose", note: "Do không có nhóm -CHO tự do và không chuyển hoá thành -CHO" },
      { q: "Cấu tạo phân tử của saccharose", a: "1 gốc α-glucose liên kết 1 gốc β-fructose qua cầu oxy", note: "Liên kết α,β-1,2-glycoside; cả 2 nhóm -OH hemiacetal đều bị khoá" },
      { q: "Cấu tạo phân tử của maltose", a: "2 gốc α-glucose liên kết qua cầu oxy", note: "Liên kết α-1,4-glycoside; còn 1 nhóm -OH hemiacetal tự do nên tráng bạc được" },
      { q: "Thuỷ phân hoàn toàn 1 mol saccharose trong môi trường acid thu được", a: "1 mol glucose và 1 mol fructose", note: "Dung dịch sau khi thuỷ phân đem tráng bạc cho tối đa 4 mol Ag" },
      { q: "Thuỷ phân hoàn toàn tinh bột hoặc cellulose thu được duy nhất", a: "Glucose", note: "Đều cấu tạo từ các mắt xích glucose liên kết glycoside" },
      { q: "Hai dạng cấu trúc của tinh bột", a: "Amylose (mạch không phân nhánh) và Amylopectin (mạch phân nhánh)", note: "Amylose xoắn ốc; Amylopectin chứa liên kết nhánh α-1,6-glycoside" },
      { q: "Thuốc thử nhận biết hồ tinh bột và hiện tượng", a: "Dung dịch Iodine (I₂) → Xuất hiện màu xanh tím", note: "Phân tử I₂ bị hấp phụ lọt vào lòng ống xoắn của amylose" },
      { q: "Hiện tượng khi đun nóng rồi để nguội dung dịch tinh bột + I₂", a: "Đun nóng mất màu xanh tím, để nguội xuất hiện trở lại", note: "Do cấu trúc xoắn bị duỗi ra khi nóng và cuộn lại khi nguội" },
      { q: "Cấu tạo phân tử của cellulose", a: "Mạch thẳng không phân nhánh gồm các gốc β-glucose", note: "Liên kết β-1,4-glycoside, phân tử duỗi thẳng kéo dài thành sợi bền vững" },
      { q: "Công thức dạng mắt xích của cellulose", a: "[C₆H₇O₂(OH)₃]ₙ", note: "Mỗi mắt xích C₆H₁₀O₅ có 3 nhóm -OH tự do tham gia phản ứng ester hoá" },
      { q: "Ứng dụng của cellulose trinitrate [C₆H₇O₂(ONO₂)₃]ₙ", a: "Chế tạo thuốc súng không khói", note: "Sản phẩm phản ứng giữa cellulose và HNO₃ đặc (xúc tác H₂SO₄ đặc)" },
      { q: "Ứng dụng của dung dịch glucose 5% trong y tế", a: "Dung dịch truyền dịch tĩnh mạch (huyết thanh ngọt)", note: "Cung cấp năng lượng trực tiếp cho tế bào người bệnh" }
    ],
    g12c3: [
      { q: "Định nghĩa bậc của amine", a: "Số gốc hydrocarbon liên kết trực tiếp với nguyên tử nitrogen", note: "Bậc 1: R-NH₂; Bậc 2: R-NH-R'; Bậc 3: R-N(R')-R''" },
      { q: "So sánh bậc của (CH₃)₃C-NH₂ và (CH₃)₃C-OH", a: "(CH₃)₃C-NH₂ là amine bậc 1 · (CH₃)₃C-OH là alcohol bậc 3", note: "Bẫy kinh điển: bậc amine tính theo số liên kết C-N, không tính theo bậc của C!" },
      { q: "Hợp chất amine gây nên mùi tanh nồng của cá mè", a: "Trimethylamine (CH₃)₃N", note: "Amine bậc 3 thể khí, tan nhiều trong nước" },
      { q: "Bản chất hoá học của việc khử mùi tanh cá bằng chanh, me, giấm", a: "Acid trung hoà amine tạo muối ammonium không bay hơi", note: "R₃N + H⁺ → R₃NH⁺ tan trong nước canh, không còn bay vào mũi" },
      { q: "Bốn amine ở thể khí ở điều kiện thường", a: "CH₃NH₂, (CH₃)₂NH, (CH₃)₃N, C₂H₅NH₂", note: "Đều là chất khí có mùi khai khó chịu, độc, tan rất nhiều trong nước" },
      { q: "So sánh lực base giữa dimethylamine, methylamine, NH₃ và aniline", a: "(CH₃)₂NH > CH₃NH₂ > NH₃ > C₆H₅NH₂", note: "Alkyl bậc 2 đẩy e mạnh nhất > bậc 1 > NH₃ > vòng benzene hút e làm giảm mạnh lực base" },
      { q: "Aniline (C₆H₅NH₂) có làm đổi màu giấy quỳ tím ẩm không?", a: "Không làm đổi màu quỳ tím", note: "Do tính base của aniline cực kì yếu (yếu hơn ammonia hàng nghìn lần)" },
      { q: "Dung dịch các chất nào sau đây làm xanh giấy quỳ tím?", a: "CH₃NH₂, (CH₃)₂NH, C₂H₅NH₂ (các alkylamine)", note: "Dung dịch có tính base mạnh hơn ammonia" },
      { q: "Tính chất vật lý của aniline ở điều kiện thường", a: "Chất lỏng sánh như dầu, không màu, ít tan trong nước, độc", note: "Để lâu trong không khí bị oxi hoá chuyển sang màu nâu đen" },
      { q: "Hiện tượng khi nhỏ nước bromine vào dung dịch aniline", a: "Mất màu nước Br₂ và xuất hiện kết tủa trắng", note: "Tạo 2,4,6-tribromoaniline (tương tự phản ứng của phenol)" },
      { q: "Hiện tượng khi nhỏ dung dịch HCl vào aniline, sau đó nhỏ tiếp NaOH", a: "Nhỏ HCl thì tan trong suốt; nhỏ NaOH lại đục như ban đầu", note: "Tạo muối C₆H₅NH₃Cl tan; sau đó NaOH đẩy aniline không tan tái tạo trở lại" },
      { q: "Hiện tượng khi cho ethylamine tác dụng với nitrous acid (HNO₂)", a: "Sinh ra alcohol và sủi bọt khí nitrogen (N₂↑)", note: "C₂H₅NH₂ + HNO₂ → C₂H₅OH + N₂↑ + H₂O" },
      { q: "Phản ứng của aniline với HNO₂ ở nhiệt độ 0 - 5°C", a: "Tạo muối benzenediazonium chloride [C₆H₅-N≡N]⁺Cl⁻", note: "Phản ứng diazo hoá, nguyên liệu trung gian để tổng hợp phẩm nhuộm azo" },
      { q: "Tên gốc - chức của hợp chất C₂H₅NH₂", a: "Ethylamine", note: "Tên IUPAC thay thế là ethanamine" },
      { q: "Tên IUPAC thay thế của CH₃-CH(NH₂)-CH₃", a: "Propan-2-amine", note: "Đánh số mạch 3C, nhóm amino ở vị trí số 2" },
      { q: "Tên thông thường và tên thay thế của C₆H₅NH₂", a: "Aniline (tên thay thế: benzenamine)", note: "Phenylamine là tên gốc - chức" },
      { q: "Số đồng phân amine có cùng công thức phân tử C₃H₉N", a: "4 đồng phân", note: "Gồm 2 amine bậc 1, 1 amine bậc 2, 1 amine bậc 3" },
      { q: "Số đồng phân amine bậc 1 có cùng công thức C₃H₉N", a: "2 đồng phân (propan-1-amine và propan-2-amine)", note: "CH₃CH₂CH₂NH₂ và CH₃CH(NH₂)CH₃" },
      { q: "Số đồng phân amine bậc 1 của C₄H₁₁N", a: "4 đồng phân bậc 1", note: "Butan-1-amine, butan-2-amine, 2-methylpropan-1-amine, 2-methylpropan-2-amine" },
      { q: "Nguyên liệu trùng ngưng sản xuất tơ nylon-6,6", a: "Hexamethylenediamine H₂N(CH₂)₆NH₂ và Adipic acid", note: "H₂N-(CH₂)₆-NH₂ + HOOC-(CH₂)₄-COOH → Nylon-6,6 + H₂O" },
      { q: "Phương pháp điều chế aniline trong công nghiệp", a: "Khử nitrobenzene bằng hydrogen mới sinh (Fe + HCl đặc)", note: "C₆H₅NO₂ + 6[H] → C₆H₅NH₂ + 2H₂O" },
      { q: "Phương pháp điều chế alkylamine từ ammonia", a: "Alkyl hoá ammonia bằng dẫn xuất halogen (R-X)", note: "NH₃ + CH₃I → CH₃NH₂ + HI" }
    ],
    g11c1: [
      { q: "Nhiệt độ ngọn lửa khi hàn cắt kim loại bằng khí acetylene (C₂H₂)", a: "Khoảng 3000°C", note: "C₂H₂ cháy toả nhiệt lượng khổng lồ đủ làm nóng chảy kim loại" },
      { q: "Alkene CH₂=CH₂ có tên thông thường và IUPAC là", a: "Ethylene (IUPAC: ethene)", note: "Kích thích hoa quả mau chín" },
      { q: "Alkyne CH≡CH có tên thông thường và IUPAC là", a: "Acetylene (IUPAC: ethyne)", note: "Alkyne đơn giản nhất, điều chế từ đất đèn" },
      { q: "Khí dầu mỏ hoá lỏng (LPG / gas bình) chứa chủ yếu", a: "Propane (C₃H₈) và Butane (C₄H₁₀)", note: "Hai alkane dễ hoá lỏng dưới áp suất cao" },
      { q: "Quy tắc cộng Markovnikov phát biểu như thế nào?", a: "H cộng vào C nối đôi có nhiều H hơn, X vào C có ít H hơn", note: "Áp dụng khi cộng HX hoặc H₂O vào alkene bất đối" },
      { q: "Quy tắc Markovnikov: Propene + HCl tạo sản phẩm chính là", a: "2-chloropropane (CH₃-CHCl-CH₃)", note: "H vào CH₂, Cl vào CH" },
      { q: "Phản ứng đặc trưng dùng để nhận biết alk-1-yne (nối ba đầu mạch)", a: "Tác dụng với dung dịch AgNO₃ trong NH₃", note: "Nguyên tử H đầu mạch linh động bị thay thế bởi Ag⁺ tạo kết tủa vàng nhạt" },
      { q: "But-1-yne vs But-2-yne: Chất nào tác dụng được với AgNO₃/NH₃?", a: "Chỉ But-1-yne", note: "Do but-1-yne có liên kết C≡C đầu mạch (CH≡C-CH₂-CH₃)" },
      { q: "Hiện tượng khi sục khí alkene qua dung dịch nước bromine", a: "Nước bromine bị mất màu nâu đỏ", note: "Phản ứng cộng mở liên kết đôi tạo dẫn xuất dibromo không màu" },
      { q: "Hiện tượng khi sục alkene qua dung dịch thuốc tím (KMnO₄) ở t° thường", a: "Dung dịch mất màu tím, xuất hiện kết tủa nâu đen (MnO₂)", note: "Oxi hoá alkene tạo diol (glycol)" },
      { q: "Xúc tác Lindlar (Pd/PbCO₃) có tác dụng gì khi hiđro hoá alkyne?", a: "Dừng phản ứng ở giai đoạn tạo alkene (không thành alkane)", note: "R-C≡C-R' + H₂ (Lindlar) → R-CH=CH-R' (alkene cis)" },
      { q: "Monomer trực tiếp dùng để trùng hợp sản xuất nhựa PVC", a: "Vinyl chloride (CH₂=CHCl)", note: "n CH₂=CHCl → (-CH₂-CHCl-)ₙ (poly(vinyl chloride))" },
      { q: "Phản ứng điều chế acetylene trong phòng thí nghiệm từ đất đèn", a: "CaC₂ + 2H₂O → C₂H₂↑ + Ca(OH)₂", note: "Đất đèn chứa calcium carbide CaC₂" },
      { q: "Khối lượng mol phân tử của acetylene so với không khí", a: "M(C₂H₂) = 26 < M(kk) = 29 → Acetylene nhẹ hơn không khí", note: "Bẫy trắc nghiệm: acetylene nhẹ hơn không khí, không phải nặng hơn" },
      { q: "Styrene có công thức phân tử và công thức cấu tạo là", a: "C₈H₈ · C₆H₅-CH=CH₂", note: "Vừa có tính chất của arene vừa có tính chất của alkene (làm mất màu Br₂)" },
      { q: "Chất nào vừa cháy, vừa cộng Br₂, vừa cộng H₂, vừa thế AgNO₃/NH₃?", a: "Acetylene (CH≡CH)", note: "Alkyne có H linh động ở cả 2 đầu liên kết ba" }
    ],
    g11c2: [
      { q: "Định nghĩa Arene (Hydrocarbon thơm)", a: "Hydrocarbon trong phân tử có chứa một hay nhiều vòng benzene", note: "Benzene C₆H₆ là arene đơn giản nhất" },
      { q: "Công thức phân tử và phân tử khối của toluene", a: "C₇H₈ (C₆H₅CH₃, M = 92)", note: "Tên IUPAC thay thế là methylbenzene" },
      { q: "Quy tắc thế vào vòng benzene có sẵn nhóm ankyl (nhóm đẩy electron)", a: "Ưu tiên thế vào vị trí Ortho (o-) và Para (p-)", note: "Nhóm -CH₃ hoạt hoá nhân thơm làm tăng mật độ e ở vị trí 2, 4, 6" },
      { q: "Phản ứng phân biệt benzene và toluene bằng phương pháp hoá học", a: "Dung dịch KMnO₄ (đun nóng)", note: "Toluene làm mất màu tím KMnO₄ khi đun nóng tạo C₆H₅COOK; benzene không phản ứng" },
      { q: "Phản ứng nitro hoá benzene ở nhiệt độ ≤ 50°C", a: "C₆H₆ + HNO₃ (đặc, xúc tác H₂SO₄ đặc) → C₆H₅NO₂ + H₂O", note: "Tạo nitrobenzene: chất lỏng sánh như dầu, màu vàng, mùi hạnh nhân" },
      { q: "Công thức và ứng dụng của thuốc nổ TNT", a: "2,4,6-trinitrotoluene (C₆H₂(NO₂)₃CH₃)", note: "Thu được khi nitro hoá toluene tỉ lệ 1:3; chất rắn màu vàng" },
      { q: "Chất nào sau đây có nhiệt độ sôi cao nhất: benzene, toluene, ethylbenzene?", a: "Ethylbenzene (C₈H₁₀)", note: "Trong cùng dãy đồng đẳng, phân tử khối M càng lớn thì nhiệt độ sôi càng cao" },
      { q: "Xylene là tên gọi thông thường của", a: "Dimethylbenzene (C₆H₄(CH₃)₂)", note: "Có 3 đồng phân vị trí: o-xylene, m-xylene, p-xylene" },
      { q: "Phản ứng clo hoá benzene khi có bột sắt (Fe, t°)", a: "C₆H₆ + Cl₂ (Fe) → C₆H₅Cl + HCl", note: "Phản ứng thế nguyên tử H của vòng thơm" },
      { q: "Phản ứng clo hoá benzene khi có ánh sáng mặt trời (as)", a: "C₆H₆ + 3Cl₂ (as) → C₆H₆Cl₆ (thuốc trừ sâu 666)", note: "Phản ứng cộng phá vỡ vòng thơm tạo hexachlorocyclohexane" },
      { q: "Naphthalene (băng phiến) có công thức phân tử là", a: "C₁₀H₈", note: "Arene đa vòng gồm 2 vòng benzene giáp nhau, dễ thăng hoa" },
      { q: "Phân biệt styrene và ethylbenzene bằng thuốc thử nào?", a: "Dung dịch nước bromine ở nhiệt độ thường", note: "Chỉ styrene có nối đôi -CH=CH₂ làm mất màu nước Br₂ ngay" },
      { q: "Sản phẩm oxi hoá toluene bằng dung dịch KMnO₄ trong môi trường acid", a: "Benzoic acid (C₆H₅COOH)", note: "Nhóm methyl -CH₃ bị oxi hoá hoàn toàn thành nhóm -COOH" },
      { q: "Độ tan của benzene và các arene trong nước", a: "Hầu như không tan trong nước, nhẹ hơn nước", note: "Tan nhiều trong các dung môi hữu cơ không phân cực" }
    ],
    g11c3: [
      { q: "Hợp chất chính trong bình xịt gây tê cục bộ trong thể thao", a: "Chloroethane (C₂H₅Cl)", note: "Sôi ở 12,3°C; xịt vào da bay hơi tức thì thu nhiệt làm lạnh cóng giảm đau" },
      { q: "Quy tắc tách hydrogen halide (Quy tắc Zaitsev)", a: "X tách cùng H ở C kề bên có ít H hơn để tạo alkene bền hơn", note: "Ưu tiên tạo alkene có nhiều nhóm thế hơn ở liên kết đôi" },
      { q: "Tách HBr từ sec-butyl bromide (CH₃-CHBr-CH₂-CH₃) tạo sản phẩm chính là", a: "But-2-ene (CH₃-CH=CH-CH₃)", note: "Theo quy tắc Zaitsev: H tách ở CH₂ (2H) chứ không tách ở CH₃ (3H)" },
      { q: "Số đồng phân alkene thu được khi tách HCl từ sec-butyl chloride", a: "3 đồng phân alkene", note: "But-1-ene, cis-but-2-ene và trans-but-2-ene (tính cả đồng phân hình học)" },
      { q: "Thuỷ phân dẫn xuất halogen trong dung dịch kiềm đun nóng", a: "R-X + NaOH (t°) → R-OH + NaX", note: "Phản ứng thế nucleophile thay thế halogen bằng nhóm hydroxyl -OH" },
      { q: "Hợp chất CFC (freon) gây ra tác hại môi trường nào?", a: "Phá huỷ tầng ozone của khí quyển", note: "Phân huỷ giải phóng gốc clo tự do Cl• phá huỷ hàng ngàn phân tử O₃" },
      { q: "Khí alkane nào clo hoá (1:1, ánh sáng) chỉ cho 1 dẫn xuất duy nhất?", a: "Methane (CH₄) và Ethane (C₂H₆)", note: "Tất cả các nguyên tử H trong phân tử đều có vị trí đối xứng tương đương" },
      { q: "Số dẫn xuất monochloro cấu tạo tối đa khi clo hoá 2-methylbutane", a: "4 đồng phân cấu tạo", note: "Phân tử có 4 vị trí C không tương đương: C1, C2, C3, C4" },
      { q: "Nhận biết ion halide sinh ra khi thuỷ phân dẫn xuất halogen", a: "Acid hoá bằng HNO₃ rồi thêm dung dịch AgNO₃", note: "AgCl kết tủa trắng, AgBr kết tủa vàng nhạt, AgI kết tủa vàng đậm" },
      { q: "Teflon (chảo chống dính) được trùng hợp từ monomer nào?", a: "Tetrafluoroethylene (CF₂=CF₂)", note: "Chịu nhiệt, chống dính, trơ với acid và kiềm" },
      { q: "Dẫn xuất halogen có tan được trong nước không?", a: "Hầu như không tan trong nước, nặng hơn nước", note: "Tan tốt trong dầu mỡ và dung môi hữu cơ" },
      { q: "Tên IUPAC của hợp chất CH₃-CH(Cl)-CH₃", a: "2-chloropropane", note: "Tên gốc - chức là isopropyl chloride" }
    ],
    g11c4: [
      { q: "Định nghĩa hợp chất Alcohol (Ancol)", a: "Hợp chất có nhóm -OH liên kết trực tiếp với nguyên tử carbon no", note: "Nếu -OH gắn vào C của vòng benzene thì là Phenol" },
      { q: "Chất cồn gây say chính có trong rượu bia", a: "Ethanol (ethyl alcohol, C₂H₅OH, M = 46)", note: "Lên men từ tinh bột hoặc hydrate hoá ethylene" },
      { q: "Chất cồn công nghiệp cực độc gây mù mắt và tử vong", a: "Methanol (methyl alcohol, CH₃OH, M = 32)", note: "Trong cơ thể bị chuyển hoá thành formaldehyde và formic acid phá huỷ thị giác" },
      { q: "Công thức phân tử và cấu tạo của glycerol", a: "C₃H₅(OH)₃ (propane-1,2,3-triol)", note: "Polyalcohol có 3 nhóm -OH liền kề, chất lỏng sánh ngọt" },
      { q: "Công thức phân tử và cấu tạo của ethylene glycol", a: "C₂H₄(OH)₂ (ethane-1,2-diol)", note: "Polyalcohol có 2 nhóm -OH liền kề, chất chống đông động cơ" },
      { q: "Phản ứng đặc trưng nhận biết polyalcohol có các nhóm -OH kề nhau", a: "Hoà tan Cu(OH)₂ ở t° thường tạo dung dịch màu xanh lam thẫm", note: "Tạo phức đồng chelate tan; monool (như ethanol) không phản ứng" },
      { q: "Tách nước từ ethanol ở 170°C có mặt H₂SO₄ đặc", a: "C₂H₅OH (170°C) → C₂H₄ (ethylene) + H₂O", note: "Phản ứng tách nước nội phân tử tạo alkene" },
      { q: "Tách nước từ ethanol ở 140°C có mặt H₂SO₄ đặc", a: "2 C₂H₅OH (140°C) → C₂H₅-O-C₂H₅ (diethyl ether) + H₂O", note: "Phản ứng tách nước liên phân tử tạo ether" },
      { q: "Alcohol nào sau đây KHÔNG THỂ tách nước tạo alkene?", a: "Methanol (CH₃OH)", note: "Vì phân tử chỉ có 1 carbon, không thể hình thành liên kết đôi C=C" },
      { q: "Oxi hoá alcohol bậc 1 bằng CuO đun nóng", a: "R-CH₂OH + CuO (t°) → R-CHO (aldehyde) + Cu + H₂O", note: "Màu đen của CuO chuyển sang màu đỏ gạch của Cu" },
      { q: "Oxi hoá alcohol bậc 2 bằng CuO đun nóng", a: "R-CH(OH)-R' + CuO (t°) → R-CO-R' (ketone) + Cu + H₂O", note: "Thu được ketone tương ứng" },
      { q: "Alcohol bậc 3 có bị oxi hoá bởi CuO đun nóng không?", a: "Không phản ứng ở điều kiện thường", note: "Alcohol bậc 3 bền, không có nguyên tử H ở nguyên tử C mang nhóm -OH" },
      { q: "Ý nghĩa của nồng độ cồn 70° dùng sát trùng y tế", a: "Trong 100 mL dung dịch có đúng 70 mL ethanol nguyên chất", note: "Cồn 70° thấm sâu và diệt khuẩn tối ưu hơn cồn 90°" },
      { q: "Hàm lượng ethanol trong xăng sinh học E5 là", a: "5% ethanol theo thể tích (95% xăng RON 92)", note: "Xăng E10 chứa 10% ethanol" },
      { q: "Số đồng phân alcohol có cùng công thức phân tử C₃H₈O", a: "2 đồng phân (propan-1-ol và propan-2-ol)", note: "Đồng phân thứ 3 là dimethyl ether CH₃-O-CH₃ (không phải alcohol)" },
      { q: "Số đồng phân alcohol có cùng công thức phân tử C₄H₁₀O", a: "4 đồng phân alcohol", note: "Butan-1-ol, butan-2-ol, 2-methylpropan-1-ol, 2-methylpropan-2-ol" },
      { q: "Alcohol có phản ứng với dung dịch kiềm NaOH không?", a: "Tuyệt đối không phản ứng", note: "Alcohol không có tính acid như phenol hay acid carboxylic" },
      { q: "Menthol có trong tinh dầu bạc hà thuộc loại alcohol nào?", a: "Alcohol no, đơn chức, bậc 2", note: "Có công thức phân tử C₁₀H₂₀O" }
    ],
    g11c5: [
      { q: "Định nghĩa hợp chất Phenol", a: "Hợp chất có nhóm -OH liên kết trực tiếp với nguyên tử C của vòng benzene", note: "C₆H₅OH là phenol đơn giản nhất" },
      { q: "Tính chất vật lý của phenol ở nhiệt độ phòng", a: "Chất rắn không màu, để lâu trong không khí hoá màu hồng, rất độc", note: "Gây bỏng nặng khi dính vào da" },
      { q: "Độ tan của phenol trong nước lạnh so với nước nóng", a: "Ít tan trong nước lạnh, tan vô hạn ở trên 66°C", note: "Ở 25°C chỉ tan khoảng 8,3 g trong 100 g nước" },
      { q: "Phản ứng chứng minh tính acid của phenol", a: "Tác dụng với dung dịch NaOH: C₆H₅OH + NaOH → C₆H₅ONa + H₂O", note: "Alcohol thông thường không phản ứng được với NaOH" },
      { q: "So sánh tính acid của phenol với H₂CO₃ và carboxylic acid", a: "RCOOH > H₂CO₃ > C₆H₅OH > ROH", note: "Phenol có tính acid yếu hơn acid carbonic H₂CO₃" },
      { q: "Phenol có tác dụng được với dung dịch NaHCO₃ giải phóng CO₂ không?", a: "Không phản ứng", note: "Vì tính acid của phenol yếu hơn acid carbonic (H₂CO₃)" },
      { q: "Hiện tượng khi sục khí CO₂ vào dung dịch sodium phenolate (C₆H₅ONa)", a: "Dung dịch bị vẩn đục do tái tạo phenol ít tan", note: "C₆H₅ONa + CO₂ + H₂O → C₆H₅OH↓ + NaHCO₃" },
      { q: "Hiện tượng khi nhỏ dung dịch nước bromine vào dung dịch phenol", a: "Mất màu nước Br₂ và xuất hiện kết tủa trắng", note: "Tạo 2,4,6-tribromophenol kết tủa trắng" },
      { q: "Tại sao phenol thế bromine dễ dàng hơn nhiều so với benzene?", a: "Do cặp e tự do của O liên hợp đẩy e làm tăng mật độ e ở vòng", note: "Vị trí ortho và para trở nên rất giàu electron" },
      { q: "Công thức và ứng dụng của picric acid", a: "2,4,6-trinitrophenol (C₆H₂(NO₂)₃OH) · Làm thuốc nổ vàng", note: "Tổng hợp bằng cách cho phenol phản ứng với HNO₃ đặc (xúc tác H₂SO₄ đặc)" },
      { q: "Benzyl alcohol (C₆H₅-CH₂-OH) có phải là phenol không?", a: "Không, là alcohol thơm", note: "Do nhóm -OH gắn vào carbon no CH₂, không gắn vào vòng" },
      { q: "Số đồng phân cresol (methylphenol C₇H₈O) là", a: "3 đồng phân (o-cresol, m-cresol, p-cresol)", note: "Đều tác dụng được với dung dịch NaOH" },
      { q: "Cách xử lý khẩn cấp khi bị phenol dính vào da", a: "Rửa ngay nhiều lần bằng ethanol hoặc xà phòng", note: "Không rửa bằng nước lạnh vì phenol ít tan trong nước lạnh" },
      { q: "Ứng dụng quan trọng của phenol trong công nghiệp", a: "Sản xuất nhựa phenol-formaldehyde (bakelite), phẩm nhuộm, dược phẩm", note: "Nguyên liệu then chốt của hoá dầu" }
    ],
    g11c6: [
      { q: "Hợp chất carbonyl gồm những loại hợp chất hữu cơ nào?", a: "Aldehyde (R-CHO) và Ketone (R-CO-R')", note: "Đều chứa nhóm carbonyl >C=O phân cực" },
      { q: "Tên thông thường và công thức phân tử của methanal", a: "Formaldehyde (HCHO, M = 30)", note: "Aldehyde đơn giản nhất, là chất khí ở điều kiện thường" },
      { q: "Tên thông thường và công thức phân tử của ethanal", a: "Acetaldehyde (CH₃CHO, M = 44)", note: "Chất lỏng dễ bay hơi, có mùi thơm táo" },
      { q: "Tên thông thường và công thức phân tử của propan-2-one", a: "Acetone (CH₃COCH₃, M = 58)", note: "Ketone đơn giản nhất, dung môi tẩy sơn móng tay" },
      { q: "Thuốc thử Tollens dùng trong phản ứng tráng bạc là gì?", a: "Dung dịch AgNO₃ trong dung dịch NH₃ dư ([Ag(NH₃)₂]OH)", note: "Tạo kết tủa bạc Ag bám sáng bóng vào thành ống nghiệm" },
      { q: "Phản ứng tráng bạc của các aldehyde đơn chức thông thường sinh ra", a: "1 mol RCHO → 2 mol Ag", note: "CH₃CHO + 2AgNO₃/NH₃ → 2Ag" },
      { q: "Phản ứng tráng bạc đặc biệt của formaldehyde (HCHO)", a: "1 mol HCHO → 4 mol Ag", note: "HCHO có 2 liên kết C-H ở cả hai phía nhóm carbonyl" },
      { q: "Dung dịch formalin (focmon) dùng ngâm tiêu bản giải phẫu là gì?", a: "Dung dịch chứa 37 - 40% formaldehyde trong nước", note: "Làm đông tụ protein, diệt khuẩn mạnh giúp bảo quản mẫu vật" },
      { q: "Phản ứng Iodoform nhận biết nhóm cấu trúc nào?", a: "Nhóm methyl carbonyl CH₃-C(=O)- hoặc nhóm CH₃-CH(OH)-", note: "Tác dụng với I₂ trong NaOH tạo kết tủa vàng iodoform CHI₃ có mùi sát trùng" },
      { q: "Acetone (CH₃COCH₃) có tham gia phản ứng tráng bạc không?", a: "Tuyệt đối không tham gia phản ứng tráng bạc", note: "Ketone thông thường không bị oxi hoá bởi thuốc thử Tollens" },
      { q: "Acetone (CH₃COCH₃) có tham gia phản ứng tạo iodoform không?", a: "Có, tạo kết tủa vàng CHI₃", note: "Do có nhóm CH₃-CO- liên kết với gốc hydrocarbon" },
      { q: "Phản ứng khử aldehyde bằng khí hydrogen (Ni, t°)", a: "R-CHO + H₂ (Ni, t°) → R-CH₂OH (alcohol bậc 1)", note: "Cộng H₂ vào liên kết đôi C=O" },
      { q: "Phản ứng khử ketone bằng khí hydrogen (Ni, t°)", a: "R-CO-R' + H₂ (Ni, t°) → R-CH(OH)-R' (alcohol bậc 2)", note: "Tạo alcohol bậc 2 tương ứng" },
      { q: "Chất hữu cơ vừa là acid vừa có phản ứng tráng bạc", a: "Formic acid (HCOOH)", note: "Có nhóm H-C(=O)- tương tự aldehyde" },
      { q: "Hiện tượng khi đun nóng aldehyde với Cu(OH)₂ trong môi trường kiềm", a: "Xuất hiện kết tủa màu đỏ gạch của Cu₂O", note: "RCHO + 2Cu(OH)₂ + NaOH → RCOONa + Cu₂O↓ (đỏ gạch) + 3H₂O" },
      { q: "Aldehyde có tạo được liên kết hydrogen liên phân tử với nhau không?", a: "Không tạo được liên kết hydrogen liên phân tử", note: "Nên nhiệt độ sôi thấp hơn alcohol có cùng số carbon" }
    ],
    g11c7: [
      { q: "Nhóm chức đặc trưng của Carboxylic Acid", a: "Nhóm carboxyl (-COOH)", note: "Cấu tạo gồm nhóm carbonyl >C=O gắn với nhóm hydroxyl -OH" },
      { q: "Công thức tổng quát của carboxylic acid no, đơn chức, mạch hở", a: "CₙH₂ₙ₊₁COOH hoặc CₙH₂ₙO₂ (n ≥ 1)", note: "Acid đơn giản nhất là formic acid HCOOH (n=1)" },
      { q: "So sánh nhiệt độ sôi của acid carboxylic so với các hợp chất khác", a: "Acid có nhiệt độ sôi cao nhất", note: "Do tạo liên kết hydrogen dạng dimer (nhị hợp) rất bền vững" },
      { q: "Acid hữu cơ có trong giấm ăn hàng ngày", a: "Acetic acid (CH₃COOH, ethanoic acid)", note: "Giấm ăn thông thường là dung dịch chứa 2% - 5% acetic acid" },
      { q: "Acid hữu cơ có trong nọc kiến, vòi đốt của ong", a: "Formic acid (HCOOH, methanoic acid)", note: "Gây cảm giác bỏng rát, bôi vôi (base) sẽ làm dịu vết cắn" },
      { q: "Kim loại nào sau đây KHÔNG phản ứng với dung dịch acetic acid: Zn, Fe, Cu, Mg?", a: "Kim loại Cu", note: "Đồng (Cu) đứng sau hydrogen trong dãy hoạt động hoá học" },
      { q: "Phản ứng của acetic acid với đá vôi (CaCO₃)", a: "2 CH₃COOH + CaCO₃ → (CH₃COO)₂Ca + CO₂↑ + H₂O", note: "Hiện tượng sủi bọt khí không màu CO₂; dùng tẩy cặn canxi ấm đun nước" },
      { q: "Phản ứng ester hoá giữa acetic acid và ethanol", a: "CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O", note: "Phản ứng thuận nghịch, xúc tác H₂SO₄ đặc đun nóng, tạo ethyl acetate thơm" },
      { q: "Acid carboxylic nào duy nhất tham gia phản ứng tráng bạc?", a: "Formic acid (HCOOH)", note: "Do nguyên tử H gắn trực tiếp vào nhóm C=O (cấu trúc aldehyde H-C=O)" },
      { q: "Chất dùng để khử chua khi ngâm quả sấu xanh", a: "Nước vôi trong (dung dịch Ca(OH)₂)", note: "Ca(OH)₂ trung hoà bớt các acid hữu cơ oxalic, tartaric trong quả sấu" },
      { q: "Acid hữu cơ 2 chức no đơn giản nhất", a: "Oxalic acid (HOOC-COOH hay (COOH)₂)", note: "Có trong lá chua me đất, khế chua" },
      { q: "Benzoic acid (C₆H₅COOH) có đặc điểm vật lý gì?", a: "Chất rắn màu trắng, tinh thể hình kim, ít tan trong nước lạnh", note: "Muối sodium benzoate dùng làm chất bảo quản thực phẩm (chống mốc)" },
      { q: "Điều chế acetic acid trong công nghiệp hiện đại từ methanol", a: "CH₃OH + CO (xt, t°) → CH₃COOH", note: "Phương pháp carbonyl hoá methanol cho hiệu suất và tính kinh tế cao nhất" },
      { q: "Phản ứng lên men giấm từ rượu etylic loãng", a: "C₂H₅OH + O₂ (men giấm) → CH₃COOH + H₂O", note: "Điều chế giấm ăn truyền thống" }
    ],
    g11on: [
      { q: "Thuốc thử nhận biết liên kết ba đầu mạch C≡CH (alk-1-yne)", a: "Dung dịch AgNO₃ trong NH₃ (kết tủa vàng nhạt)", note: "Phản ứng thế ion Ag⁺ vào nguyên tử H linh động" },
      { q: "Thuốc thử nhận biết liên kết đôi C=C (alkene, styrene)", a: "Dung dịch nước bromine (mất màu nâu đỏ)", note: "Phản ứng cộng halogen vào liên kết $\\pi$" },
      { q: "Thuốc thử nhận biết phenol trong dung dịch", a: "Dung dịch nước bromine (kết tủa trắng 2,4,6-tribromophenol)", note: "Phenol làm mất màu Br₂ và tạo kết tủa trắng ngay ở t° thường" },
      { q: "Thuốc thử nhận biết aldehyde", a: "Thuốc thử Tollens AgNO₃/NH₃ (tráng gương sáng bóng)", note: "Oxi hoá nhóm -CHO thành muối ammonium carboxylate" },
      { q: "Thuốc thử nhận biết polyalcohol có các nhóm -OH liền kề", a: "Cu(OH)₂ ở nhiệt độ thường (dung dịch màu xanh lam thẫm)", note: "Glycerol, ethylene glycol, glucose..." },
      { q: "Thuốc thử nhận biết tinh bột", a: "Dung dịch Iodine I₂ (xuất hiện màu xanh tím đặc trưng)", note: "Mất màu khi đun nóng, xuất hiện lại khi để nguội" },
      { q: "Thuốc thử nhận biết carboxylic acid đơn giản nhất", a: "Dung dịch NaHCO₃ hoặc quỳ tím", note: "Làm quỳ hoá đỏ và sủi bọt khí CO₂ với muối hydrocarbonate" },
      { q: "Chất làm mất màu dung dịch thuốc tím KMnO₄ khi đun nóng nhưng không mất màu ở t° thường", a: "Toluene (C₆H₅CH₃)", note: "Dùng để phân biệt toluene với benzene và alkene" },
      { q: "Dãy so sánh tính acid: HCl, HCOOH, CH₃COOH, C₆H₅OH, C₂H₅OH", a: "HCl > HCOOH > CH₃COOH > C₆H₅OH > C₂H₅OH", note: "Acid vô cơ > acid hữu cơ mạch ngắn > phenol > alcohol" },
      { q: "Dãy so sánh nhiệt độ sôi: C₂H₅COOH, C₃H₇OH, CH₃COOCH₃, C₄H₁₀", a: "C₂H₅COOH > C₃H₇OH > CH₃COOCH₃ > C₄H₁₀", note: "Acid > alcohol > ester > alkane cùng số carbon" }
    ]
  };

  var DEFAULT_GUIDED_STAGES = {
    g12c3: [
      {
        title: "Bản chất Amine & Khử mùi tanh của cá",
        hook: "Mùi tanh khó chịu của cá mè chủ yếu do trimethylamine (CH₃)₃N gây ra. Khi nấu canh chua cá, người ta dùng me, cà chua hoặc vắt chanh (chứa acid) để biến amine mùi tanh thành muối ammonium không bay hơi, giúp món cá thơm ngon tuyệt hảo!",
        core: "Amine sinh ra khi thay H của NH₃ bằng gốc hydrocarbon. Vì N vẫn còn cặp electron tự do nên amine nhận proton H⁺ -> thể hiện tính base. Bậc amine = số gốc gắn vào N (bậc 1: R-NH₂, bậc 2: R-NH-R', bậc 3: R-N(R')-R'').",
        trap: "BẪY TỬ HUYỆT: Nhầm lẫn giữa bậc amine và bậc alcohol! Chất (CH₃)₃C-NH₂ là amine bậc 1 (chỉ có 1 gốc gắn vào N), trong khi (CH₃)₃C-OH là alcohol bậc 3!",
        check: {
          q: "Amine nào sau đây thuộc loại amine bậc hai?",
          opts: "A=CH₃-CH₂-NH₂ (ethylamine);B=CH₃-NH-CH₃ (dimethylamine);C=(CH₃)₃N (trimethylamine);D=(CH₃)₃C-NH₂ (tert-butylamine)",
          a: "B",
          exp: "Chính xác! CH₃-NH-CH₃ có 2 gốc methyl gắn trực tiếp vào nguyên tử N nên là amine bậc 2.",
          hint: "Bậc amine = số gốc hydrocarbon liên kết trực tiếp với nguyên tử N."
        }
      },
      {
        title: "So sánh lực base & Phản ứng chỉ thị màu",
        hook: "Tại sao nước lau kính amoniac và dung dịch methylamine làm xanh quỳ tím, trong khi aniline (dầu bôi trơn nhuộm vải) lại hoàn toàn 'trơ' trước quỳ tím?",
        core: "Gốc alkyl đẩy e -> tăng mật độ e trên N -> lực base tăng (CH₃NH₂ > NH₃). Ngược lại, vòng benzene hút e mạnh do liên hợp pi -> giảm mật độ e trên N -> lực base giảm thảm hại (Aniline < NH₃ hàng nghìn lần).",
        trap: "Bẫy trắc nghiệm: 'Mọi amine đều làm xanh quỳ tím' -> SAI! Aniline không làm đổi màu quỳ tím và phenolphthalein.",
        check: {
          q: "Dãy nào sau đây sắp xếp theo chiều lực base tăng dần?",
          opts: "A=Aniline < NH₃ < Methylamine;B=Methylamine < NH₃ < Aniline;C=NH₃ < Aniline < Methylamine;D=Aniline < Methylamine < NH₃",
          a: "A",
          exp: "Tuyệt vời! Gốc phenyl hút electron làm giảm lực base, gốc alkyl đẩy electron làm tăng lực base: Aniline < NH₃ < Methylamine.",
          hint: "Gốc đẩy electron (alkyl) làm tăng lực base, gốc hút electron (vòng benzene) làm giảm mạnh lực base."
        }
      },
      {
        title: "Phản ứng thế Aniline & Nhận biết kết tủa trắng",
        hook: "Tương tự Phenol, Aniline tác dụng với nước bromine ngay ở điều kiện thường tạo kết tủa trắng xoá mà không cần bất kỳ xúc tác sắt hay đun nóng nào!",
        core: "Nhóm -NH₂ hoạt hoá nhân thơm cực mạnh ở vị trí ortho và para: C₆H₅NH₂ + 3Br₂ → C₆H₂Br₃NH₂↓ (2,4,6-tribromoaniline trắng) + 3HBr.",
        trap: "Aniline ít tan trong nước (lắng xuống), nhưng khi nhỏ HCl vào thì tan trong veo do tạo muối C₆H₅NH₃Cl. Nhỏ tiếp NaOH vào lại đục trở lại vì aniline được tái tạo!",
        check: {
          q: "Để phân biệt 2 chất lỏng không màu benzene và aniline, hoá chất tốt nhất là:",
          opts: "A=Dung dịch NaOH;B=Nước bromine;C=Quỳ tím;D=Dung dịch AgNO₃",
          a: "B",
          exp: "Chính xác! Nước bromine tạo kết tủa trắng 2,4,6-tribromoaniline với aniline, còn benzene không phản ứng ở điều kiện thường.",
          hint: "Nhóm -NH₂ hoạt hoá nhân thơm cực mạnh ở vị trí ortho và para, tạo kết tủa trắng với nước bromine."
        }
      }
    ],
    g11c1: [
      {
        title: "1. Trực giác liên kết pi & Tính không no",
        hook: "Hydrocarbon no (alkane) như những người đã no bụng, chỉ có liên kết đơn bền vững. Còn alkene và alkyne giống như chiếc bẫy mở, chứa liên kết π kém bền luôn thèm muốn phản ứng cộng để trở về trạng thái no.",
        core: "Công thức chung: Alkene CₙH₂ₙ (n≥2), Alkyne CₙH₂ₙ₋₂ (n≥2). Phản ứng đặc trưng nhất là phản ứng CỘNG (cộng H₂, cộng halogen Br₂, cộng HX, cộng H₂O).",
        trap: "Cẩn thận: Alkyne có 2 liên kết π, có thể cộng theo 2 nấc tỉ lệ 1:1 hoặc 1:2 tuỳ thuộc lượng chất và xúc tác (Lindlar tạo anken, Ni tạo ankan).",
        check: {
          q: "Chất nào sau đây làm mất màu dung dịch nước bromine ở nhiệt độ thường?",
          opts: "A=Propane (C₃H₈);B=Ethylene (C₂H₄);C=Methane (CH₄);D=Hexane (C₆H₁₄)",
          a: "B",
          hint: "Hãy tìm chất có chứa liên kết đôi hoặc liên kết ba kém bền (hydrocarbon không no).",
          exp: "Ethylene có liên kết đôi C=C nên lập tức cộng Br₂ làm mất màu nâu đỏ. Các chất còn lại chỉ chứa liên kết đơn nên không phản ứng."
        }
      },
      {
        title: "2. Quy tắc Markovnikov — 'Giàu càng thêm giàu'",
        hook: "Tưởng tượng một bàn tiệc: người nào đã có nhiều quả bóng thì sẽ được tặng thêm bóng. Trong hóa học hữu cơ, nguyên tử hydrogen (H) ưu tiên đi vào carbon có nhiều H hơn.",
        core: "Khi cộng HX hoặc H₂O vào alkene bất đối xứng: H gắn vào carbon mang nối đôi có NHIỀU H hơn (cho sản phẩm chính), còn X (hoặc OH) gắn vào carbon có ÍT H hơn.",
        trap: "Bẫy đề thi: Nếu alkene đối xứng (như but-2-ene CH₃-CH=CH-CH₃), phản ứng cộng chỉ cho 1 sản phẩm duy nhất, không phân biệt sản phẩm chính/phụ.",
        check: {
          q: "Cho propene (CH₂=CH-CH₃) tác dụng với HCl, sản phẩm chính thu được là:",
          opts: "A=1-chloropropane (CH₃-CH₂-CH₂Cl);B=2-chloropropane (CH₃-CHCl-CH₃);C=1,2-dichloropropane;D=2,2-dichloropropane",
          a: "B",
          hint: "Carbon CH₂ có 2H, carbon CH chỉ có 1H. H của HCl sẽ đi vào đâu để tuân theo Markovnikov?",
          exp: "H gắn vào CH₂ (nhiều H hơn) thành CH₃, Cl gắn vào CH (ít H hơn) thành CHCl → 2-chloropropane là sản phẩm chính."
        }
      },
      {
        title: "3. Nhận biết Alk-1-yne đầu mạch",
        hook: "Chỉ các alkyne có liên kết ba nằm ở ĐẦU MẠCH (chứa nguyên tử H linh động gắn trực tiếp vào C≡C) mới có đặc quyền thay thế H bằng nguyên tử bạc Ag.",
        core: "Alk-1-yne + AgNO₃/NH₃ → Kết tủa vàng nhạt RC≡CAg↓. Phản ứng này dùng để phân biệt alk-1-yne với các alkyne giữa mạch (như but-2-yne) và alkene.",
        trap: "Rất nhiều bạn nhầm đây là phản ứng tráng bạc. Không phải! Đây là phản ứng THẾ ion kim loại Ag⁺ vào H đầu mạch, tạo kết tủa vàng chứ không tạo gương bạc Ag sáng bóng.",
        check: {
          q: "Chất nào sau đây tạo kết tủa vàng khi tác dụng với dung dịch AgNO₃ trong NH₃?",
          opts: "A=But-2-yne (CH₃-C≡C-CH₃);B=Ethylene (CH₂=CH₂);C=But-1-yne (CH≡C-CH₂-CH₃);D=Propane (C₃H₈)",
          a: "C",
          hint: "Tìm chất có liên kết ba ở vị trí số 1 (đầu mạch C≡CH).",
          exp: "But-1-yne có nhóm C≡CH ở đầu mạch nên nguyên tử H linh động bị thay thế bởi ion Ag⁺ tạo kết tủa vàng nhạt."
        }
      }
    ],
    g12c1: [
      {
        title: "1. Bản chất Este & Hương thơm hoa quả",
        hook: "Mùi chuối chín (isoamyl acetate), mùi dứa (ethyl butyrate), mùi hoa nhài (benzyl acetate)... tất cả hương vị ngọt ngào của tự nhiên đều bắt nguồn từ cấu trúc phân tử Este.",
        core: "Este được tạo thành khi thay nhóm -OH của acid carboxylic bằng nhóm -OR' của alcohol. Công thức no đơn chức mạch hở: CₙH₂ₙO₂ (n≥2). Phản ứng este hoá: RCOOH + R'OH ⇌ RCOOR' + H₂O (H₂SO₄ đặc, đun nóng).",
        trap: "Este có phân tử khối bằng acid carboxylic tương ứng nhưng nhiệt độ sôi THẤP HƠN NHIỀU vì este không có liên kết hydrogen liên phân tử.",
        check: {
          q: "Hợp chất nào sau đây là este no, đơn chức, mạch hở?",
          opts: "A=CH₃COOH;B=HCOOCH₃;C=CH₂=CH-COOCH₃;D=C₂H₅OH",
          a: "B",
          hint: "Este có dạng R-COO-R' và công thức chung CₙH₂ₙO₂ với n ≥ 2.",
          exp: "HCOOCH₃ (methyl formate) là este no đơn chức mạch hở với 2 nguyên tử carbon (C₂H₄O₂)."
        }
      },
      {
        title: "2. Thuỷ phân Este: Axit vs Kiềm (Xà phòng hoá)",
        hook: "Thuỷ phân trong axit là con đường hai chiều (thuận nghịch), còn thuỷ phân trong kiềm (NaOH/KOH) là con đường một chiều không quay đầu.",
        core: "Trong acid: RCOOR' + H₂O ⇌ RCOOH + R'OH (xúc tác H⁺, t°).\nTrong kiềm: RCOOR' + NaOH → RCOONa + R'OH (phản ứng một chiều, gọi là phản ứng xà phòng hoá).",
        trap: "BẪY KINH ĐIỂN: Este của phenol (RCOOC₆H₅) khi tác dụng NaOH phản ứng theo tỉ lệ 1:2 tạo 2 MUỐI và H₂O, TUYỆT ĐỐI KHÔNG tạo alcohol!",
        check: {
          q: "Thủy phân phenyl acetate (CH₃COOC₆H₅) trong dung dịch NaOH dư, đun nóng thu được sản phẩm gồm:",
          opts: "A=CH₃COONa và C₆H₅OH;B=CH₃COONa, C₆H₅ONa và H₂O;C=CH₃COOH và C₆H₅ONa;D=CH₃COONa và C₆H₅CH₂OH",
          a: "B",
          hint: "Gốc C₆H₅ gắn trực tiếp vào oxy là este của phenol. Phenol sinh ra có tác dụng tiếp với NaOH không?",
          exp: "CH₃COOC₆H₅ + 2NaOH → CH₃COONa + C₆H₅ONa + H₂O. Vì phenol sinh ra có tính axit nên lập tức phản ứng tiếp với NaOH tạo muối natri phenolate và nước."
        }
      },
      {
        title: "3. Chất béo & Cơ chế tẩy rửa xà phòng",
        hook: "Xà phòng như những con thuyền hai đầu: chiếc đuôi hydrocarbon ghét nước cắm chặt vào vết dầu mỡ, còn chiếc đầu ion yêu nước bám vào dòng nước, lôi giật vết bẩn ra khỏi quần áo.",
        core: "Chất béo là triester của glycerol với các acid béo mạch dài (stearic C₁₇H₃₅-, palmitic C₁₅H₃₁-, oleic C₁₇H₃₃-). Thuỷ phân 1 mol chất béo luôn luôn thu được 1 mol glycerol và 3 mol muối acid béo (xà phòng).",
        trap: "Chất béo lỏng (dầu thực vật) chứa gốc acid không no (như triolein), có thể hydro hóa thành chất béo rắn (bơ nhân tạo).",
        check: {
          q: "Đun nóng triolein trong dung dịch NaOH vừa đủ, thu được muối sodium oleate và chất nào sau đây?",
          opts: "A=Ethylene glycol;B=Methanol;C=Glycerol;D=Ethanol",
          a: "C",
          hint: "Chất béo là triester của alcohol đa chức nào có 3 nhóm -OH?",
          exp: "Mọi phản ứng xà phòng hóa chất béo đều giải phóng glycerol C₃H₅(OH)₃."
        }
      }
    ],
    g12c2: [
      {
        title: "1. Glucose & Fructose — Monosaccharide kì diệu",
        hook: "Đường nho (glucose) chảy trong huyết quản cung cấp năng lượng tức thì cho não bộ; đường mật ong (fructose) ngọt thanh sắc sảo. Cả hai đều có cùng công thức C₆H₁₂O₆ nhưng khác nhau ở nhóm chức.",
        core: "Glucose có nhóm -CHO ở đầu mạch (aldehyde), Fructose có nhóm C=O (ketone). Cả hai đều có nhiều nhóm -OH kề nhau nên đều hoà tan Cu(OH)₂ ở nhiệt độ thường tạo phức màu xanh lam thẫm.",
        trap: "Mặc dù Fructose là ketone, nhưng trong môi trường KIỀM (như thuốc thử Tollens AgNO₃/NH₃), fructose chuyển hoá thuận nghịch thành glucose nên FRUCTOSE VẪN TRÁNG BẠC!",
        check: {
          q: "Để phân biệt dung dịch glucose và dung dịch fructose bằng phương pháp hoá học, dùng thuốc thử nào sau đây?",
          opts: "A=Dung dịch AgNO₃ trong NH₃;B=Cu(OH)₂ ở nhiệt độ thường;C=Dung dịch nước bromine;D=Kim loại Na",
          a: "C",
          hint: "Trong môi trường kiềm cả hai đều giống nhau. Thuốc thử nào hoạt động trong môi trường trung tính hoặc acid nhẹ?",
          exp: "Nước bromine oxi hoá glucose làm mất màu nâu đỏ, trong khi fructose không phản ứng với nước bromine (môi trường không kiềm)."
        }
      },
      {
        title: "2. Saccharose vs Maltose — Disaccharide",
        hook: "Đường mía bạn ăn hàng ngày là Saccharose. Khi nấu mạch nha từ mầm lúa ta có Maltose. Hai phân tử đường đôi được ghép bởi 2 mắt xích đơn thông qua cầu nối oxy.",
        core: "Saccharose = α-glucose + β-fructose (không còn nhóm -CHO tự do → KHÔNG tráng bạc). Maltose = α-glucose + α-glucose (còn nhóm -CHO tự do → CÓ tráng bạc). Cả hai đều thuỷ phân tạo monosaccharide.",
        trap: "Saccharose không tráng bạc, nhưng nếu đun nóng với acid (thuỷ phân) rồi trung hoà kiềm, dung dịch sau phản ứng lại TRÁNG BẠC RỰC RỠ vì sinh ra glucose và fructose.",
        check: {
          q: "Thủy phân hoàn toàn 1 mol saccharose trong môi trường acid thu được sản phẩm gồm:",
          opts: "A=2 mol glucose;B=2 mol fructose;C=1 mol glucose và 1 mol fructose;D=1 mol maltose",
          a: "C",
          hint: "Saccharose được cấu tạo từ một gốc glucose liên kết với một gốc fructose.",
          exp: "C₁₂H₂₂O₁₁ + H₂O → C₆H₁₂O₆ (glucose) + C₆H₁₂O₆ (fructose)."
        }
      }
    ]
  };

  /* ---------- GUIDED TESTING (KIỂM TRA CÓ HƯỚNG DẪN) REPOSITORY ---------- */
  var DEFAULT_COACH_TESTS = [
    {
      ch: "g12c1",
      q: "Đun sôi hỗn hợp gồm ethyl alcohol và acetic acid có acid sulfuric đặc làm xúc tác, sau phản ứng thu được chất hữu cơ X có mùi thơm đặc trưng. Công thức của X là",
      o: "A=HCOOC₂H₅;B=CH₃COOC₂H₅;C=C₂H₅COOCH₃;D=CH₃COOH",
      a: "B",
      h1: "Phản ứng ester hoá: Axit axetic (CH₃COOH) phản ứng với rượu etylic (C₂H₅OH).",
      h2: "Nhóm OH tách ra từ acid (CH₃CO-), H tách ra từ alcohol (-OC₂H₅) ghép lại thành ester.",
      h3: "Bẫy phương án: Đáp án A là ethyl formate (từ HCOOH), C là methyl propionate (gốc axit 3C). Cần đọc kĩ acid gốc.",
      exp: "CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ (ethyl acetate) + H₂O. Ethyl acetate là este có mùi thơm quả chín."
    },
    {
      ch: "g12c1",
      q: "Cho phenyl acetate (CH₃COOC₆H₅) tác dụng với lượng dư dung dịch NaOH, đun nóng. Sau khi phản ứng xảy ra hoàn toàn, số muối thu được là",
      o: "A=1;B=2;C=3;D=4",
      a: "B",
      h1: "Hãy nhận diện gốc C₆H₅ gắn trực tiếp vào nguyên tử oxy của nhóm ester.",
      h2: "Este của phenol tác dụng NaOH theo tỉ lệ mol 1:2 tạo ra 2 muối: muối của acid carboxylic và muối natri phenolate.",
      h3: "Bẫy phương án: Nhiều bạn chỉ nghĩ tạo ra muối CH₃COONa và alcohol C₆H₅OH (1 muối). Nhưng C₆H₅OH là phenol, có tính axit nên lập tức tác dụng tiếp với NaOH dư tạo thêm muối thứ hai C₆H₅ONa!",
      exp: "CH₃COOC₆H₅ + 2NaOH → CH₃COONa + C₆H₅ONa + H₂O. Thu được đúng 2 muối."
    },
    {
      ch: "g11c4",
      q: "Chất nào sau đây tác dụng với Cu(OH)₂ trong dung dịch NaOH ở nhiệt độ thường tạo thành dung dịch màu xanh lam đặc trưng?",
      o: "A=Ethanol;B=Propan-1-ol;C=Glycerol;D=Dimethyl ether",
      a: "C",
      h1: "Phản ứng tạo phức màu xanh lam đặc trưng là dấu hiệu nhận biết của polyalcohol (ancol đa chức).",
      h2: "Điều kiện cần và đủ: Phân tử phải có ÍT NHẤT HAI NHÓM -OH NẰM KỀ NHAU (vicinal diol).",
      h3: "Bẫy phương án: Ethanol và Propan-1-ol chỉ có 1 nhóm -OH đơn chức nên không thể tạo phức vòng chelate xanh lam.",
      exp: "Glycerol C₃H₅(OH)₃ có 3 nhóm -OH kề nhau nên dễ dàng hoà tan Cu(OH)₂ ở nhiệt độ thường tạo phức đồng xanh lam đậm."
    },
    {
      ch: "g11c1",
      q: "Khi cho but-1-yne tác dụng với lượng dư dung dịch AgNO₃ trong NH₃, hiện tượng quan sát được là",
      o: "A=Tạo kết tủa màu trắng xám bám vào thành ống nghiệm;B=Xuất hiện kết tủa màu vàng nhạt;C=Dung dịch mất màu và sủi bọt khí không màu;D=Không có hiện tượng gì xảy ra",
      a: "B",
      h1: "But-1-yne có liên kết ba nằm ở đầu mạch (C≡CH).",
      h2: "Alk-1-yne tác dụng với AgNO₃/NH₃ thế nguyên tử H đầu mạch bằng ion Ag⁺.",
      h3: "Bẫy phương án: Đừng nhầm với hiện tượng tráng bạc của aldehyde (tạo gương bạc trắng xám). Phản ứng của alk-1-yne sinh ra kết tủa muối màu VÀNG NHẠT (C₂H₅-C≡CAg).",
      exp: "But-1-yne là alk-1-yne, phản ứng tạo kết tủa vàng nhạt C₂H₅-C≡CAg."
    },
    {
      ch: "g12c2",
      q: "Cho các chất: glucose, saccharose, fructose, tinh bột, cellulose. Số chất trong dãy có khả năng tham gia phản ứng tráng bạc là",
      o: "A=1;B=2;C=3;D=4",
      a: "B",
      h1: "Chất có phản ứng tráng bạc phải có nhóm aldehyde (-CHO) hoặc có khả năng chuyển hoá thành dạng có nhóm -CHO trong môi trường kiềm.",
      h2: "Glucose có nhóm -CHO mạch hở; Fructose chuyển hoá thành glucose trong kiềm. Saccharose, tinh bột, cellulose không có nhóm -CHO tự do.",
      h3: "Bẫy phương án: Nhiều bạn quên mất Fructose. Dù fructose là ketone nhưng môi trường AgNO₃/NH₃ có tính base, biến fructose thành glucose nên vẫn tráng bạc!",
      exp: "2 chất là Glucose và Fructose."
    }
  ];

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
    coachTest: { ch: "all", i: 0, picked: null, hintsOpened: {}, answers: [], done: false },
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
      showMiniToast("✏️ BẬT chế độ sửa: Nhấp thẳng vào chữ để gõ sửa");
    } else {
      document.body.classList.remove("edit-mode-active");
      showMiniToast("✕ Đã TẮT chế độ sửa");
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
    showMiniToast(next === "dark" ? "🌙 Đã bật chế độ Tối (Dark Mode)" : "☀️ Đã bật chế độ Sáng (Light Mode)");
  }

  /* ---------- RENDER SHELL ---------- */
  var headerEl;
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
            (state.theme === "dark" ? '☀️ <small>Sáng</small>' : '🌙 <small>Tối</small>') +
          '</button>' +
          editToggleBtn +
          '<span class="stat pill cloud-pill ' + cloudSyncStatus + '" id="cloudSyncStatus" data-act="cloudSyncNow" title="Cơ sở dữ liệu Vercel cá nhân (Nhấp để đồng bộ ngay)">☁️ <small id="cloudSyncText">' + cloudSyncLabel() + '</small></span>' +
          '<span class="stat pill" title="Điểm luyện tập">' + ico("flame") + ' <b data-xp>' + s.xp + '</b> <i>XP</i></span>' +
          '<span class="stat pill" title="Số ngày luyện liên tiếp">' + ico("cal") + ' <b data-streak>' + s.streak.days + '</b> <i>ngày</i></span>' +
        "</div>" +
      "</div>" +
      '<div class="hd-row mid">' +
        '<div class="grade-group">' + gradeChips + "</div>" +
        '<div class="mode-group">' + modeTabs + "</div>" +
      "</div>";
    headerEl.classList.add("has");
  }

  /* ---------- EDIT TOOLBAR & PROMPTS ---------- */
  function renderEditPromptBar(sectionName) {
    if (state.editMode) return "";
    return '<div class="edit-prompt-bar">' +
      '<div class="ep-left">' +
        '<span class="ep-icon">💡</span>' +
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
      showMiniToast("✓ Đã lưu thay đổi trực tiếp");
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

    var editFeynmanBtn = state.editMode ? '<button class="btn ghost tiny edit-btn" data-act="editFeynman" data-ch="' + id + '">✏️ Sửa giải thích</button>' : '';
    var feyn = '<div class="feynman" style="--cc:' + meta.color + '">' +
      '<div style="display:flex;justify-content:space-between;align-items:center"><b>' + ico("info") + " Giải thích ngắn gọn kiểu Feynman:</b>" + editFeynmanBtn + "</div>" +
      '<p class="feynman-p" ' + (state.editMode ? 'data-inline-edit="ch-feynman" data-ch="' + id + '" contenteditable="true" spellcheck="false" title="Nhấp vào đây để sửa trực tiếp lời giải thích"' : '') + '>' + fmt(ch.feynman || "Chưa có lời giải thích ngắn gọn.") + '</p>' +
      "</div>";

    var editChPrompt = renderEditPromptBar("thẻ lý thuyết hoặc bài tập của chương");
    var addNoteBtn = state.editMode ? '<button class="add-block-btn" data-act="addNote" data-ch="' + id + '">➕ Thêm thẻ lý thuyết mới vào chương này</button>' : '';

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

    var addExBtn = state.editMode ? '<button class="add-block-btn" data-act="addExercise" data-ch="' + id + '">➕ Thêm bài tập tự luyện mới</button>' : '';

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
      { id: "flash", l: "Thẻ nhớ tối giản", i: "cards" },
      { id: "bank", l: "Ngân hàng câu hỏi", i: "check" },
      { id: "tests", l: "Bộ đề thi thử", i: "clock" }
    ].map(function (t) {
      return '<button class="stab ' + (state.tab === t.id ? "on" : "") + '" data-act="tab" data-t="' + t.id + '">' + ico(t.i) + t.l + "</button>";
    }).join("");

    var body = "";
    if (state.tab === "flash") body = flashView();
    else if (state.tab === "bank") body = bankView();
    else body = testsView();

    var pName = (state.tab === "flash" ? "thẻ nhớ tối giản" : state.tab === "bank" ? "câu hỏi trắc nghiệm" : "bộ đề thi");
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

  function flashDueCount() {
    var s = profile();
    var now = Date.now();
    var n = 0;
    Object.keys(s.deck).forEach(function (k) { if (s.deck[k].due <= now) n++; });
    return n;
  }

  function flashView() {
    var chs = chaptersForGrade(state.grade).filter(function (c) { return c.id !== "g11cq"; });
    var chSel = chapterDropdown("flash-ch", (state.flash && state.flash.sel) || "all", chs, "Toàn bộ chương");
    var due = flashDueCount();
    var addCardBtn = state.editMode ? '<button class="add-block-btn" data-act="addFlashcard" data-ch="' + ((state.flash && state.flash.sel) || "g12c1") + '">➕ Thêm thẻ nhớ lý thuyết mới</button>' : '';

    return '<div class="flash-setup">' +
      '<div class="fs-card intro">' +
        '<h3>' + ico("cards") + " Thẻ nhớ tối giản — Chỉ LÝ THUYẾT cốt lõi</h3>" +
        "<p>Hệ thống thẻ nhớ đã được <b>tinh gọn tối đa</b>: loại bỏ mọi bài tập tính toán, chứng minh rườm rà hay bảng biểu phức tạp. " +
        "Mặt trước hiển thị <b>tên chất / công thức / phản ứng</b>. Khi lật, mặt sau <b>chỉ hiện đúng kết quả cốt lõi</b> (Ví dụ: <i>CTPT methyl acetate</i> → <b>CH₃COOCH₃</b>).</p>" +
        "<p class='muted small'>Áp dụng chu kỳ lặp lại ngắt quãng <b>1 / 3 / 7 / 15 / 30 ngày</b> để chuyển kiến thức vào trí nhớ dài hạn.</p>" +
        addCardBtn +
      "</div>" +
      '<div class="fs-card control">' +
        "<label>Chọn phạm vi chương</label>" + chSel +
        '<button class="btn primary" style="width:100%;margin-top:16px" data-act="flashStart">Bắt đầu phiên lật thẻ →</button>' +
        (due > 0 ? '<p class="due-note">' + ico("clock") + " Có <b>" + due + "</b> thẻ đến hạn cần ôn lại hôm nay.</p>" : "") +
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

  function startFlashSession(sel) {
    var items = buildDeck(state.grade, sel || "all");
    if (!items.length) { alert("Không có thẻ nào trong chương này."); return; }
    shuffle(items);
    state.flash = { items: items, i: 0, good: 0, again: 0, flipped: false, sel: sel || "all" };
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

  function flashBack(item) {
    var theoryBtn = item.ch ? '<div style="margin-top:14px;text-align:center"><button class="btn ghost tiny link-theory-btn" data-act="jumpToTheory" data-ch="' + item.ch + '">📖 Xem lý thuyết chương này →</button></div>' : '';
    return '<div class="minimal-flash-back">' +
      '<span class="minimal-flash-badge">Đáp án cốt lõi</span>' +
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
    var prog = Math.round((f.i / f.items.length) * 100);

    var editCardBar = "";
    if (state.editMode && cur) {
      editCardBar = '<div class="flash-edit-bar">' +
        '<span class="edit-badge">Thẻ nhớ #' + (f.i + 1) + '</span>' +
        '<div>' +
          '<button class="btn ghost tiny edit-btn" data-act="editCurFlashcard">✏️ Sửa thẻ</button> ' +
          '<button class="btn warn tiny del-btn" data-act="deleteCurFlashcard">🗑️ Xoá thẻ</button>' +
        '</div>' +
      '</div>';
    }

    var body = '<div class="flash-session">' +
      '<div class="fs-top">' +
        '<span class="fs-prog">Thẻ ' + Math.min(f.i + 1, f.items.length) + " / " + f.items.length + ' · <span style="color:var(--ok)">✓ ' + f.good + '</span> · <span style="color:var(--warn)">↻ ' + f.again + "</span></span>" +
        '<span class="fs-bar"><i style="width:' + prog + '%"></i></span>' +
      "</div>" + editCardBar;

    if (!done) {
      body +=
      '<div class="flash-card ' + (f.flipped ? "flipped" : "") + '" data-act="flip">' +
        '<div class="flash-inner">' +
          '<div class="flash-face front">' + flashFrontHTML(cur) + '<div class="hint">Bấm hoặc gõ Space để lật</div></div>' +
          '<div class="flash-face back minimal-back">' + flashBack(cur) + "<div class='hint'>Gõ phím 1 (Ôn lại) hoặc 2 (Đã nhớ)</div></div>" +
        "</div>" +
      "</div>" +
      '<div class="fs-actions">' +
        '<button class="btn ghost" data-act="flashAgain">↻ Cần ôn lại (1)</button>' +
        '<button class="btn good" data-act="flashGood">✓ Đã nhớ (2)</button>' +
      "</div>";
    }
    body +=
      '<div class="fs-fin' + (done ? " show" : "") + '">' +
        '<h3>Phiên ôn tập kết thúc!</h3>' +
        '<p>Đã nhớ: <b>' + f.good + "</b> · Cần ôn lại: <b>" + f.again + "</b></p>" +
        '<div><button class="btn primary" data-act="flashStart">Làm lại phiên này</button> ' +
        '<button class="btn ghost" data-act="flashPrev">Trở về</button></div>' +
      "</div>" +
    "</div>";
    return body;
  }

  var FLASH_INTERVALS = [1, 3, 7, 15, 30];
  function markFlash(good) {
    var f = state.flash;
    if (!f || !f.items) return;
    var it = f.items[f.i];
    if (!it) return;

    function applyMark() {
      var s = profile();
      var rec = s.deck[it.key] || { lvl: 0, due: 0 };
      if (good) {
        f.good++;
        rec.lvl = Math.min(rec.lvl + 1, 5);
        rec.due = Date.now() + FLASH_INTERVALS[rec.lvl - 1] * 24 * 3600 * 1000;
        addXP(s, it.ch, 10);
      } else {
        f.again++;
        rec.lvl = 0;
        rec.due = Date.now() + 5 * 60 * 1000;
        s.xp += 1; save(s);
      }
      s.deck[it.key] = rec;
      save(s);
      f.flipped = false;
      f.i++;
      if (f.i >= f.items.length) {
        activity();
        renderPracticeOnly();
        updateHeaderStats(good);
        return;
      }
      eventBusChanged();
      updateHeaderStats(good);
    }

    var fc = $(".flash-card");
    if (hasGSAP && !prefersReduced && fc) {
      var targetX = good ? 160 : -160;
      var targetRot = good ? 9 : -9;
      gsap.to(fc, {
        x: targetX,
        rotation: targetRot,
        opacity: 0,
        scale: 0.94,
        duration: 0.24,
        ease: "power2.in",
        onComplete: function () {
          gsap.set(fc, { x: 0, rotation: 0, opacity: 1, scale: 1 });
          applyMark();
          var newFc = $(".flash-card");
          if (newFc) {
            gsap.fromTo(newFc,
              { x: -targetX * 0.45, rotation: -targetRot * 0.45, opacity: 0, scale: 0.94 },
              { x: 0, rotation: 0, opacity: 1, scale: 1, duration: 0.34, ease: "back.out(1.25)", clearProps: "all" }
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
    var addBtn = state.editMode ? '<button class="add-block-btn" data-act="addBankQ">➕ Thêm câu hỏi mới vào ngân hàng</button>' : '';

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
    var m = { m: [ico("choose"), "Trắc nghiệm"], tf: [ico("scale"), "Đúng / Sai"], n: [ico("type"), "Điền số"] }[k] || [k, k];
    return '<span class="q-kind">' + m[0] + " " + m[1] + "</span>";
  }
  function bankQuestionHTML(bs, it) {
    var idx = bs.i, total = bs.items.length;
    var opts = parseOpts(it.o);
    var editBtns = state.editMode ? '<div class="edit-item-btns" style="margin-left:auto">' +
      '<button class="btn ghost tiny edit-btn" data-act="editBankQ" data-i="' + idx + '">✏️ Sửa câu này</button>' +
      '<button class="btn warn tiny del-btn" data-act="deleteBankQ" data-i="' + idx + '">🗑️ Xoá câu này</button>' +
    '</div>' : '';

    var head =
      '<div class="q-top">' +
        '<span class="q-count">Câu ' + (idx + 1) + " / " + total + "</span>" +
        editBtns +
        '<span class="q-prog"><i style="width:' + Math.round((idx / total) * 100) + '%"></i></span>' +
      "</div>" + bankKindBadge(it.k);
    var body = "";
    if (it.k === "m") {
      body = '<div class="mcq-opts">' + opts.map(function (o) {
        return '<button class="mcq-opt" data-act="bankPick" data-p="' + esc(o.k) + '"><b>' + esc(o.k) + ".</b> " + fmt(o.t) + "</button>";
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
    return '<div class="bank-q">' + head +
      "<p class='q-text'>" + fmt(it.q) + "</p>" + body +
      '<div class="q-feedback" id="qFeedback"></div>' +
    "</div>";
  }
  function bankPick(pick) {
    var bs = state.bank;
    if (bs.answered) return; // Prevent spam clicking XP!
    bs.answered = true;

    var it = bs.items[bs.i];
    var fb = $("#qFeedback");
    var correct = false;
    if (it.k === "m" || it.k === "tf") {
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

    if (it.k === "m" || it.k === "tf") {
      $(".mcq-opt, .tf-opt").forEach(function(btn) {
        var p = btn.getAttribute("data-p");
        if (p === String(it.a)) {
          btn.classList.add("reveal-correct");
          btn.insertAdjacentHTML("beforeend", ' <span class="opt-badge-correct">✓ Đáp án đúng</span>');
        }
        if (p === String(pick)) {
          btn.classList.add("picked");
          btn.classList.add(correct ? "good" : "warn");
          if (!correct) {
            btn.insertAdjacentHTML("beforeend", ' <span class="opt-badge-wrong">✗ Lựa chọn của bạn</span>');
          }
        }
      });
    }

    var opts = parseOpts(it.o);
    var pickedObj = opts.find(function(o){ return o.k === pick; }) || { t: pick };
    var correctObj = opts.find(function(o){ return o.k === it.a; }) || { t: it.a };

    var msg = correct
      ? '<div class="fb ok">' +
          '<div class="fb-header"><span class="fb-badge ok">✓ Chính xác!</span> <b>(+10 XP)</b></div>' +
          (it.e ? '<div class="fb-section-box exp"><div class="fb-sec-title">💡 <b>Giải thích chi tiết:</b></div><div class="fb-sec-desc">' + fmt(it.e) + '</div></div>' : '') +
        '</div>'
      : '<div class="fb bad">' +
          '<div class="fb-header"><span class="fb-badge bad">✗ Chưa chính xác</span> <b>Phân tích lỗi sai:</b></div>' +
          '<div class="fb-comparison">' +
            '<div class="fb-comp-row correct"><span class="fb-comp-label">✓ Đáp án đúng:</span><span class="fb-comp-val"><b>' + esc(it.a) + (it.k === "m" ? '. ' + fmt(correctObj.t) : '') + '</b></span></div>' +
            '<div class="fb-comp-row wrong"><span class="fb-comp-label">✗ Bạn đã chọn:</span><span class="fb-comp-val"><b>' + esc(pick) + (it.k === "m" ? '. ' + fmt(pickedObj.t) : '') + '</b></span></div>' +
          '</div>' +
          (it.e ? '<div class="fb-section-box exp"><div class="fb-sec-title">💡 <b>Phân tích & Lỗi sai cần tránh:</b></div><div class="fb-sec-desc">' + fmt(it.e) + '</div></div>' : '') +
        '</div>';

    fb.innerHTML = msg;
    fb.classList.add("show");
    var nextBar = '<div class="q-next"><button class="btn primary" data-act="bankNext">Câu tiếp theo →</button></div>';
    if (bs.i + 1 >= bs.items.length) nextBar = '<div class="q-next"><button class="btn primary" data-act="bankFinish">Xem kết quả</button></div>';
    fb.insertAdjacentHTML("beforeend", nextBar);
    activity();
    updateHeaderStats(correct);
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
    var v = num(val);
    if (v === null) return false;
    var t = num(it.a);
    if (t === null) return false;
    if (it.tol && it.tol !== "" && num(it.tol) !== null) {
      if (Math.abs(v - t) <= num(it.tol) + 1e-9) return true;
    }
    if (it.ac) {
      var accepts = String(it.ac).split("|");
      for (var i = 0; i < accepts.length; i++) { var av = num(accepts[i]); if (av !== null && Math.abs(v - av) < 1e-6) return true; }
    }
    return Math.abs(v - t) < 1e-6;
  }

  /* ---------- TESTS (BỘ ĐỀ THI) ---------- */
  function testsView() {
    var tests = (DATA.tests || []).filter(function (t) { return state.grade === "all" || t.grade === state.grade; });
    var s = profile();
    var addTestBtn = state.editMode ? '<button class="add-block-btn" data-act="addTest">➕ Tạo bộ đề thi mới</button>' : '';

    var cards = tests.map(function (t) {
      var best = s.tests[t.id];
      var editBtns = state.editMode ? '<div class="edit-item-btns" style="margin-top:8px">' +
        '<button class="btn ghost tiny edit-btn" data-act="editTest" data-id="' + t.id + '">✏️ Sửa đề</button>' +
        '<button class="btn warn tiny del-btn" data-act="deleteTest" data-id="' + t.id + '">🗑️ Xoá đề</button>' +
      '</div>' : '';

      return '<div class="test-card">' +
        '<div class="tc-left"><span class="tc-icon">' + ico("clock") + "</span>" +
          "<div><h3>" + esc(t.title) + "</h3>" +
          '<p class="muted small">' + (t.qs ? t.qs.length : 0) + " câu · gợi ý " + t.timeMin + " phút · tự động chấm</p>" +
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
      '<button class="btn ghost tiny edit-btn" data-act="editTestQ" data-i="' + T.i + '">✏️ Sửa câu này</button>' +
      '<button class="btn warn tiny del-btn" data-act="deleteTestQ" data-i="' + T.i + '">🗑️ Xoá câu này</button>' +
      '<button class="btn primary tiny add-btn" data-act="addTestQ">➕ Thêm câu</button>' +
    '</div>' : '';

    var head = '<div class="q-top"><span class="q-count">' + esc(T.t.title) + " · Câu " + (T.i + 1) + " / " + T.t.qs.length + "</span>" +
      editQBtns +
      '<span class="timer ' + (left < 60 ? "late" : "") + '">' + ico("clock") + " <b>" + mm + ":" + ss + "</b></span></div>" + bankKindBadge(it.k);
    var body = "";
    if (it.k === "m") {
      body = '<div class="mcq-opts">' + opts.map(function (o) {
        return '<button class="mcq-opt' + (ans === o.k ? " picked" : "") + '" data-act="testPick" data-p="' + esc(o.k) + '"><b>' + esc(o.k) + ".</b> " + fmt(o.t) + "</button>";
      }).join("") + "</div>";
    } else if (it.k === "tf") {
      body = '<div class="tf-opts">' +
        ['true', 'false'].map(function (p, i) {
          return '<button class="tf-opt' + (ans === p ? " picked" : "") + '" data-act="testPick" data-p="' + p + '">' + (i ? ico("no") + " Sai" : ico("ok") + " Đúng") + "</button>";
        }).join("") + "</div>";
    } else {
      var v = ans || "";
      body = '<div class="num-row">' +
        '<input class="num-in" data-act="testNum" value="' + esc(v) + '" placeholder="Gõ đáp án…" autocomplete="off">' +
        (it.u ? '<span class="num-unit">' + esc(it.u) + "</span>" : "") +
        '<button class="btn primary" data-act="testPick" data-p="save">Lưu</button></div>';
    }
    return '<div class="test-q">' + head +
      "<p class='q-text'>" + fmt(it.q) + "</p>" + body +
      '<div class="q-nav">' +
        (T.i > 0 ? '<button class="btn ghost" data-act="testPrev">← Trước</button>' : '<span></span>') +
        (T.i + 1 < T.t.qs.length
          ? '<button class="btn primary" data-act="testNext">Sau →</button>'
          : '<button class="btn good" data-act="testSubmit">Nộp bài</button>') +
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
    var correct = 0;
    var details = [];
    T.t.qs.forEach(function (it, i) {
      var ans = T.answers[i];
      var ok;
      if (it.k === "n") ok = checkNum(ans, it);
      else ok = (String(ans) === String(it.a));
      if (ok) correct++;
      details.push({ it: it, ans: ans, ok: ok });
    });
    var score = total ? Math.round((correct / total) * 100) / 10 : 0;
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
      if (!d.ok) {
        if (d.it.k === "m") yourAns = "Bạn chọn: " + (d.ans || "—") + "<br>Đáp án đúng: " + esc(d.it.a) + ". " + fmt(optionText(d.it, d.it.a));
        else if (d.it.k === "tf") yourAns = "Bạn chọn: " + (d.ans === "true" ? "Đúng" : d.ans === "false" ? "Sai" : "—") + "<br>Đáp án: " + (d.it.a === "true" ? "Đúng" : "Sai");
        else yourAns = "Bạn gõ: " + esc(d.ans || "—") + "<br>Đáp án đúng: " + fmt(d.it.a) + (d.it.u ? " " + esc(d.it.u) : "");
      }
      var openAttr = d.ok ? "" : " open";
      return "<details class='rst-row'" + openAttr + ">" +
        "<summary>" + badge + " Câu " + (i + 1) + " — " + (d.ok ? "đúng" : "sai") + "</summary>" +
        "<p class='small'>" + fmt(d.it.q) + "</p>" +
        (yourAns ? "<p class='small'>" + yourAns + "</p>" : "") +
        (d.it.e ? "<p class='small exp'>" + fmt(d.it.e) + "</p>" : "") +
        ((d.it.ch || T.t.ch) ? "<div style='margin-top:8px'><button class='btn ghost tiny' data-act='jumpToTheory' data-ch='" + (d.it.ch || T.t.ch) + "'>📖 Xem trong lý thuyết →</button></div>" : "") +
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
    var addStageBtn = state.editMode ? '<button class="btn primary small add-btn" data-act="addGuidedStage" data-ch="' + curChId + '">➕ Thêm chặng học mới</button>' : '';

    var stepperHtml = stages.map(function (st, idx) {
      var cls = "stage-step";
      if (idx === curIdx) cls += " active";
      return '<button class="' + cls + '" data-act="guidedJump" data-i="' + idx + '">' +
        '<span class="stage-num">Chặng ' + (idx + 1) + '</span>' +
        '<span class="stage-name">' + esc(st.title) + '</span>' +
      '</button>';
    }).join("");

    var editStageBtns = state.editMode ? '<div class="edit-item-btns">' +
      '<button class="btn ghost tiny edit-btn" data-act="editGuidedStage" data-ch="' + curChId + '" data-i="' + curIdx + '">✏️ Sửa chặng</button>' +
      '<button class="btn warn tiny del-btn" data-act="deleteGuidedStage" data-ch="' + curChId + '" data-i="' + curIdx + '">🗑️ Xoá chặng</button>' +
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
          badge = ' <span class="opt-badge-correct">✓ Đáp án đúng</span>';
        }
        if (pickedOpt === o.k) {
          cls += " picked " + (o.k === check.a ? "correct" : "wrong");
          if (o.k !== check.a) {
            badge = ' <span class="opt-badge-wrong">✗ Lựa chọn của bạn</span>';
          }
        }
      }
      return '<button class="' + cls + '" data-act="guidedPick" data-k="' + esc(o.k) + '" ' + (isChecked ? 'disabled' : '') + '>' +
        '<b>' + esc(o.k) + '.</b> ' + fmt(o.t) + badge +
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
        '<div class="guided-section">' +
          '<div class="guided-sec-title core">' + ico("flask") + ' 2. Bản chất & Cơ chế cốt lõi</div>' +
          '<div class="guided-box core-box" ' + (state.editMode ? 'data-inline-edit="guided-core" data-ch="' + curChId + '" data-idx="' + curIdx + '" contenteditable="true" spellcheck="false" title="Nhấp trực tiếp để sửa bản chất cốt lõi"' : '') + '>' + fmt(curStage.core) + '</div>' +
        '</div>' +
        '<div class="guided-section">' +
          '<div class="guided-sec-title trap">' + ico("alert") + ' 3. Điểm bẫy thi cử cần khắc cốt ghi tâm</div>' +
          '<div class="guided-box trap-box" ' + (state.editMode ? 'data-inline-edit="guided-trap" data-ch="' + curChId + '" data-idx="' + curIdx + '" contenteditable="true" spellcheck="false" title="Nhấp trực tiếp để sửa điểm bẫy"' : '') + '>' + fmt(curStage.trap) + '</div>' +
        '</div>' +
        '<div class="guided-section">' +
          '<div class="guided-sec-title check">' + ico("target") + ' 4. Thử thách kiểm tra làm chủ</div>' +
          '<div class="checkpoint-box">' +
            '<div class="checkpoint-q">' + fmt(check.q) + '</div>' +
            '<div class="checkpoint-opts">' + checkOptsHtml + '</div>' +
            feedbackHtml +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function buildGuidedFeedback(curStage, check, checkOpts, pickedOpt, isCorrect) {
    var pickedObj = checkOpts.find(function (o) { return o.k === pickedOpt; }) || { t: pickedOpt };
    var correctObj = checkOpts.find(function (o) { return o.k === check.a; }) || { t: check.a };

    if (isCorrect) {
      return '<div class="checkpoint-feedback ok">' +
        '<div class="fb-header"><span class="fb-badge ok">✓ Chính xác!</span> <b>Bạn đã hiểu đúng bản chất câu hỏi. (+25 XP)</b></div>' +
        '<div class="fb-section-box exp">' +
          '<div class="fb-sec-title">💡 <b>Bản chất cốt lõi & Cơ chế đúng:</b></div>' +
          '<div class="fb-sec-desc">' + fmt(check.exp) + '</div>' +
        '</div>' +
        '<div class="fb-action"><button class="btn primary small" data-act="guidedNextStage">Chặng tiếp theo →</button></div>' +
      '</div>';
    } else {
      return '<div class="checkpoint-feedback bad">' +
        '<div class="fb-header"><span class="fb-badge bad">✗ Chưa chính xác</span> <b>Phân tích lỗi sai & Chẩn đoán tư duy:</b></div>' +
        '<div class="fb-comparison">' +
          '<div class="fb-comp-row correct">' +
            '<span class="fb-comp-label">✓ Đáp án đúng:</span>' +
            '<span class="fb-comp-val"><b>' + esc(check.a) + '.</b> ' + fmt(correctObj.t) + '</span>' +
          '</div>' +
          '<div class="fb-comp-row wrong">' +
            '<span class="fb-comp-label">✗ Bạn đã chọn:</span>' +
            '<span class="fb-comp-val"><b>' + esc(pickedOpt) + '.</b> ' + fmt(pickedObj.t) + '</span>' +
          '</div>' +
        '</div>' +
        (curStage.trap ? '<div class="fb-section-box flaw">' +
          '<div class="fb-sec-title">⚠️ <b>Chỉ ra lỗi sai & Bẫy phương án ' + esc(pickedOpt) + ':</b></div>' +
          '<div class="fb-sec-desc">' + fmt(curStage.trap) + '</div>' +
        '</div>' : '') +
        (check.hint ? '<div class="fb-section-box hint">' +
          '<div class="fb-sec-title">🔍 <b>Gợi ý tư duy đúng hướng:</b></div>' +
          '<div class="fb-sec-desc">' + fmt(check.hint) + '</div>' +
        '</div>' : '') +
        '<div class="fb-section-box exp">' +
          '<div class="fb-sec-title">💡 <b>Bản chất khoa học & Giải thích:</b></div>' +
          '<div class="fb-sec-desc">' + fmt(check.exp) + '</div>' +
        '</div>' +
        '<div class="fb-action"><button class="btn primary small" data-act="guidedNextStage">Chặng tiếp theo →</button></div>' +
      '</div>';
    }
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
      var check = curStage.check || {
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
          badge = ' <span class="opt-badge-correct">✓ Đáp án đúng</span>';
        }
        if (k === o.k) {
          cls += " picked " + (o.k === check.a ? "correct" : "wrong");
          if (o.k !== check.a) {
            badge = ' <span class="opt-badge-wrong">✗ Lựa chọn của bạn</span>';
          }
        }
        return '<button class="' + cls + '" data-act="guidedPick" data-k="' + esc(o.k) + '" disabled>' +
          '<b>' + esc(o.k) + '.</b> ' + fmt(o.t) + badge +
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

  function guidedNextStage() {
    var curCh = state.guided.ch;
    var ch = DATA[curCh];
    var stages = (ch && ch.guidedStages) || DEFAULT_GUIDED_STAGES[curCh] || DEFAULT_GUIDED_STAGES.g12c1;
    if (state.guided.stageIdx + 1 < stages.length) {
      state.guided.stageIdx++;
      state.guided.checked = false;
      state.guided.pickedOpt = null;
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

  /* ═══════════ VIEW: KIỂM TRA CÓ HƯỚNG DẪN (COACH TESTING) ═══════════ */
  function renderCoachTest() {
    var questions = DEFAULT_COACH_TESTS;
    if (state.coachTest.done) {
      var correctN = state.coachTest.answers.filter(function (a) { return a.ok; }).length;
      return '<div class="coach-test-card" style="text-align:center">' +
        '<h2>' + ico("target") + ' Hoàn thành bài kiểm tra có hướng dẫn!</h2>' +
        '<p style="font-size:1.15rem">Bạn đã trả lời đúng <b>' + correctN + '</b> / ' + questions.length + ' câu hỏi.</p>' +
        '<button class="btn primary" data-act="restartCoachTest">Làm lại bài kiểm tra</button>' +
      '</div>';
    }

    var idx = state.coachTest.i;
    var cur = questions[idx];
    var opts = parseOpts(cur.o);
    var picked = state.coachTest.picked;
    var isSubmitted = picked != null;
    var isCorrect = isSubmitted && picked === cur.a;

    var hints = state.coachTest.hintsOpened || {};
    var h1Open = !!hints[idx + ":1"];
    var h2Open = !!hints[idx + ":2"];
    var h3Open = !!hints[idx + ":3"];

    var optsHtml = opts.map(function (o) {
      var cls = "mcq-opt";
      if (picked === o.k) {
        cls += isCorrect ? " picked" : " picked";
        if (isSubmitted) cls += (o.k === cur.a ? " good" : " warn");
      }
      return '<button class="' + cls + '" data-act="coachTestPick" data-p="' + esc(o.k) + '" ' + (isSubmitted ? 'disabled' : '') + '>' +
        '<b>' + esc(o.k) + '.</b> ' + fmt(o.t) +
      '</button>';
    }).join("");

    var diagnosticHtml = "";
    if (isSubmitted) {
      diagnosticHtml = '<div class="diagnostic-feedback">' +
        '<h4>' + (isCorrect ? '✓ Đáp án chính xác!' : '✗ Chưa đúng — Phân tích chẩn đoán sai lầm:') + '</h4>' +
        '<p>' + fmt(cur.exp) + '</p>' +
        '<div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn primary small" data-act="coachTestNext">Câu tiếp theo →</button>' +
        (cur.ch ? '<button class="btn ghost small" data-act="jumpToTheory" data-ch="' + cur.ch + '">📖 Xem lại lý thuyết chương này →</button>' : '') + '</div>' +
      '</div>';
    }

    return renderEditPromptBar("câu hỏi kiểm tra có hướng dẫn") + '<div class="coach-test-card">' +
      '<div class="coach-banner">' +
        '<span class="q-count">Câu hỏi chẩn đoán ' + (idx + 1) + ' / ' + questions.length + '</span>' +
        '<span class="edit-badge">CÓ GIẢNG VIÊN ĐỒNG HÀNH</span>' +
      '</div>' +
      '<p class="q-text">' + fmt(cur.q) + '</p>' +
      '<div class="mcq-opts">' + optsHtml + '</div>' +
      diagnosticHtml +
      '<div class="coach-hints-box">' +
        '<div style="font-size:.82rem;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:8px">Hệ thống trợ lý gợi ý bậc thang (Bấm để xem nếu chưa rõ hướng đi):</div>' +
        '<div class="coach-hints-accordion">' +
          '<div class="coach-hint-item">' +
            '<button class="coach-hint-btn" data-act="toggleHint" data-h="1">' +
              '<span>💡 Gợi ý cấp 1: Định hướng tư duy</span>' +
              '<span class="hint-tag l1">' + (h1Open ? 'Ẩn' : 'Mở xem') + '</span>' +
            '</button>' +
            (h1Open ? '<div class="coach-hint-content">' + fmt(cur.h1) + '</div>' : '') +
          '</div>' +
          '<div class="coach-hint-item">' +
            '<button class="coach-hint-btn" data-act="toggleHint" data-h="2">' +
              '<span>🔍 Gợi ý cấp 2: Phương pháp & Công thức áp dụng</span>' +
              '<span class="hint-tag l2">' + (h2Open ? 'Ẩn' : 'Mở xem') + '</span>' +
            '</button>' +
            (h2Open ? '<div class="coach-hint-content">' + fmt(cur.h2) + '</div>' : '') +
          '</div>' +
          '<div class="coach-hint-item">' +
            '<button class="coach-hint-btn" data-act="toggleHint" data-h="3">' +
              '<span>🛡️ Gợi ý cấp 3: Vạch trần bẫy phương án nhiễu</span>' +
              '<span class="hint-tag l3">' + (h3Open ? 'Ẩn' : 'Mở xem') + '</span>' +
            '</button>' +
            (h3Open ? '<div class="coach-hint-content">' + fmt(cur.h3) + '</div>' : '') +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function coachTestPick(p) {
    if (state.coachTest.picked != null) return;
    state.coachTest.picked = p;
    var cur = DEFAULT_COACH_TESTS[state.coachTest.i];
    var ok = p === cur.a;
    state.coachTest.answers.push({ q: cur, picked: p, ok: ok });
    if (ok) addXP(profile(), cur.ch, 15);

    // In-place update: zero scroll movement on answer pick
    var card = $(".coach-test-card");
    if (card) {
      var opts = parseOpts(cur.o);
      var pickedObj = opts.find(function(o){ return o.k === p; }) || { t: p };
      var correctObj = opts.find(function(o){ return o.k === cur.a; }) || { t: cur.a };

      var optsHtml = opts.map(function (o) {
        var cls = "mcq-opt";
        var badge = "";
        if (o.k === cur.a) {
          cls += " reveal-correct";
          badge = ' <span class="opt-badge-correct">✓ Đáp án đúng</span>';
        }
        if (p === o.k) {
          cls += " picked " + (o.k === cur.a ? " good" : " warn");
          if (o.k !== cur.a) {
            badge = ' <span class="opt-badge-wrong">✗ Lựa chọn của bạn</span>';
          }
        }
        return '<button class="' + cls + '" data-act="coachTestPick" data-p="' + esc(o.k) + '" disabled>' +
          '<b>' + esc(o.k) + '.</b> ' + fmt(o.t) + badge +
        '</button>';
      }).join("");

      var optsContainer = $(".mcq-opts", card);
      if (optsContainer) optsContainer.innerHTML = optsHtml;

      var diagContainer = $(".diagnostic-feedback", card);
      var diagHtml = ok
        ? '<div class="diagnostic-feedback ok-diag">' +
            '<div class="fb-header"><span class="fb-badge ok">✓ Chính xác!</span> <b>Bạn đã nắm chắc kiến thức (+15 XP)</b></div>' +
            '<div class="fb-section-box exp">' +
              '<div class="fb-sec-title">💡 <b>Bản chất cốt lõi & Giải thích:</b></div>' +
              '<div class="fb-sec-desc">' + fmt(cur.exp) + '</div>' +
            '</div>' +
            '<div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap">' +
              '<button class="btn primary small" data-act="coachTestNext">Câu tiếp theo →</button>' +
              (cur.ch ? '<button class="btn ghost small" data-act="jumpToTheory" data-ch="' + cur.ch + '">📖 Xem lại lý thuyết chương này →</button>' : '') +
            '</div>' +
          '</div>'
        : '<div class="diagnostic-feedback bad-diag">' +
            '<div class="fb-header"><span class="fb-badge bad">✗ Chưa chính xác</span> <b>Phân tích lỗi sai & Chẩn đoán bẫy:</b></div>' +
            '<div class="fb-comparison">' +
              '<div class="fb-comp-row correct">' +
                '<span class="fb-comp-label">✓ Đáp án đúng:</span>' +
                '<span class="fb-comp-val"><b>' + esc(cur.a) + '.</b> ' + fmt(correctObj.t) + '</span>' +
              '</div>' +
              '<div class="fb-comp-row wrong">' +
                '<span class="fb-comp-label">✗ Bạn đã chọn:</span>' +
                '<span class="fb-comp-val"><b>' + esc(p) + '.</b> ' + fmt(pickedObj.t) + '</span>' +
              '</div>' +
            '</div>' +
            (cur.h3 ? '<div class="fb-section-box flaw">' +
              '<div class="fb-sec-title">⚠️ <b>Chỉ ra lỗi sai & Bẫy phương án ' + esc(p) + ':</b></div>' +
              '<div class="fb-sec-desc">' + fmt(cur.h3) + '</div>' +
            '</div>' : '') +
            '<div class="fb-section-box exp">' +
              '<div class="fb-sec-title">💡 <b>Bản chất khoa học & Giải thích:</b></div>' +
              '<div class="fb-sec-desc">' + fmt(cur.exp) + '</div>' +
            '</div>' +
            '<div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap">' +
              '<button class="btn primary small" data-act="coachTestNext">Câu tiếp theo →</button>' +
              (cur.ch ? '<button class="btn ghost small" data-act="jumpToTheory" data-ch="' + cur.ch + '">📖 Xem lại lý thuyết chương này →</button>' : '') +
            '</div>' +
          '</div>';

      if (diagContainer) {
        diagContainer.outerHTML = diagHtml;
      } else if (optsContainer) {
        optsContainer.insertAdjacentHTML("afterend", diagHtml);
      }

      var pickedBtn = $('[data-act="coachTestPick"][data-p="' + p + '"]', card);
      if (pickedBtn && hasGSAP && !prefersReduced) {
        gsap.fromTo(pickedBtn, { scale: 0.98 }, { scale: 1, duration: 0.2, ease: "power2.out", clearProps: "transform" });
        gsap.fromTo($(".diagnostic-feedback", card), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" });
      }
      updateHeaderStats(ok);
    } else {
      render();
    }
  }

  function coachTestNext() {
    if (state.coachTest.i + 1 < DEFAULT_COACH_TESTS.length) {
      state.coachTest.i++;
      state.coachTest.picked = null;
      state.coachTest.hintsOpened = {};
      render(false);
      var card = $(".coach-test-card");
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      state.coachTest.done = true;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function toggleHint(h) {
    var key = state.coachTest.i + ":" + h;
    state.coachTest.hintsOpened = state.coachTest.hintsOpened || {};
    state.coachTest.hintsOpened[key] = !state.coachTest.hintsOpened[key];
    var isOpen = state.coachTest.hintsOpened[key];

    // In-place accordion toggle without page re-render
    var btn = $('[data-act="toggleHint"][data-h="' + h + '"]');
    if (btn) {
      var item = btn.closest(".coach-hint-item");
      var tag = $(".hint-tag", btn);
      if (tag) tag.textContent = isOpen ? "Ẩn" : "Mở xem";
      var contentEl = $(".coach-hint-content", item);
      if (isOpen) {
        if (!contentEl) {
          var cur = DEFAULT_COACH_TESTS[state.coachTest.i];
          var hintText = h === "1" ? cur.h1 : h === "2" ? cur.h2 : cur.h3;
          item.insertAdjacentHTML("beforeend", '<div class="coach-hint-content">' + fmt(hintText) + '</div>');
        }
      } else {
        if (contentEl) contentEl.remove();
      }
    } else {
      render();
    }
  }

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
        { id: "graph", l: "Bản đồ tri thức", i: "graph" }
      ].map(function (t) {
        return '<button class="stab ' + (state.lib === t.id ? "on" : "") + '" data-act="libTab" data-t="' + t.id + '">' + ico(t.i) + t.l + "</button>";
      }).join("") + "</div>" + renderLibraryBody();
      if (state.lib === "graph") initGraph();
    } else { render(); }
  }
  function renderLibraryBody() {
    if (state.lib === "notes") return renderLibNotes();
    if (state.lib === "graph") return renderLibGraph();
    return renderLibFav();
  }
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
    if (state.tab === "flash") {
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
      case "flashAgain": markFlash(false); break;
      case "flashGood": markFlash(true); break;
      case "flashPrev": state.flash = null; render(); break;

      /* Bank Quiz */
      case "bankStart":
        var selCh = $(".sel[data-act='bank-ch']");
        var selKind = $(".sel[data-act='bank-kind']");
        startBank(selCh ? selCh.value : "all", selKind ? selKind.value : "all");
        break;
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
      case "guidedPick": guidedPick(el.getAttribute("data-k")); break;
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

      /* Coach Testing */
      case "coachTestPick": coachTestPick(el.getAttribute("data-p")); break;
      case "coachTestNext": coachTestNext(); break;
      case "toggleHint": toggleHint(el.getAttribute("data-h")); break;
      case "restartCoachTest":
        state.coachTest = { ch: "all", i: 0, picked: null, hintsOpened: {}, answers: [], done: false };
        render(); break;

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
    }
  });

  /* ---------- KEYBOARD SHORTCUTS ---------- */
  document.addEventListener("keydown", function (ev) {
    if (state.modal) {
      if (ev.key === "Escape") closeModal();
      return;
    }
    if (state.tab === "flash" && state.flash && state.flash.items && state.flash.items.length) {
      if (ev.code === "Space") {
        ev.preventDefault();
        state.flash.flipped = !state.flash.flipped;
        var fc = $(".flash-card");
        if (fc) fc.classList.toggle("flipped", state.flash.flipped);
      } else if (ev.code === "Digit1") {
        markFlash(false);
      } else if (ev.code === "Digit2") {
        markFlash(true);
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