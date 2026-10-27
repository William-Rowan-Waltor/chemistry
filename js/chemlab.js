/* ═══════════════════════════════════════════════════════════════════
   CHEMLAB ENGINE & INTERACTIVE VIRTUAL LABORATORY (V3 - QUANTITATIVE ENGINE)
   Features:
   - Dynamic Stoichiometry & Multi-Branching Chemical Engine (Deficit, Equivalence, Excess, Charring, Side Products)
   - Real-time Dosage Tracking & Stoichiometric Status Banner
   - Alternative Substrate Switcher (Glucose vs Fructose, Albumin vs Dipeptide)
   - Interactive 3D WebGL Molecular Viewer with Full Manual Control (Mouse Drag, Wheel Zoom, Touch Gestures & HUD Toolbar)
   - High-Fidelity 2D Structural Formula (SmilesDrawer Vector SVG + Clean ACS Retina Blueprint, Zero Watermark Grids)
   - Real-time Fluid Liquid Wave & Meniscus Tweening with GSAP
   - Organic Dropper Pipette & Impact Splash Animation
   ═══════════════════════════════════════════════════════════════════ */

(function (root) {
  'use strict';

  // Precision Vector SVG Icons for Chemistry Lab
  var CHEMICONS = {
    flask: '<path d="M10 2v4.5L4.5 18a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 6.5V2M8.5 2h7M7 14h10"/>',
    tube: '<path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5V2M8.5 2h7M9.5 12h5"/>',
    pipette: '<path d="M18 2.5a2.12 2.12 0 0 1 3 3L13 13.5l-4 1 1-4L18 2.5zM2 22l3-3M6.5 17.5l2 2"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    snow: '<path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14M12 6l-2-2m4 0-2 2M12 18l-2 2m4 0-2-2M6 12l-2-2m0 4 2-2M18 12l2-2m0 4-2-2"/>',
    refresh: '<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16M16 16h5v5"/>',
    trash: '<path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    atom: '<circle cx="12" cy="12" r="2.5"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(30 12 12)" fill="none"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(90 12 12)" fill="none"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(150 12 12)" fill="none"/>',
    drop: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-6-1.5-1.6-3.2-3.4-4-5-.8 1.6-2.5 3.4-4 5-2 2.1-3 4-3 6a7 7 0 0 0 7 7z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    grip: '<circle cx="8" cy="6" r="1.5"/><circle cx="16" cy="6" r="1.5"/><circle cx="8" cy="12" r="1.5"/><circle cx="16" cy="12" r="1.5"/><circle cx="8" cy="18" r="1.5"/><circle cx="16" cy="18" r="1.5"/>',
    temp: '<path d="M14 4a2 2 0 0 0-4 0v9.17a4 4 0 1 0 4 0V4z"/><circle cx="12" cy="17" r="1.5"/>',
    play: '<polygon points="6 4 20 12 6 20 6 4"/>',
    pause: '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>',
    zoomIn: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>',
    zoomOut: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/><line x1="8" y1="11" x2="14" y2="11"/>',
    center: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/><line x1="12" y1="3" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="21"/><line x1="3" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="21" y2="12"/>',
    layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    tag: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>',
    beaker: '<path d="M4.5 3h15M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3M6 14h12"/>'
  };

  function cIco(n) {
    var svg = CHEMICONS[n] || (root.ICONS && root.ICONS[n]) || CHEMICONS.info;
    return '<svg class="ico chemlab-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + svg + '</svg>';
  }

  // Embedded Offline 3D Conformation Geometry (XYZ format) for 100% Reliable Offline Loading
  var MOL_3D_DATA = {
    ethyl_acetate: "14\nEthyl acetate\nC -1.84 0.22 0.00\nC -0.54 -0.54 0.00\nO -0.45 -1.74 0.00\nO 0.53 0.27 0.00\nC 1.84 -0.38 0.00\nC 2.91 0.70 0.00\nH -1.86 0.86 0.88\nH -1.86 0.86 -0.88\nH -2.67 -0.48 0.00\nH 1.87 -1.02 0.88\nH 1.87 -1.02 -0.88\nH 3.89 0.23 0.00\nH 2.85 1.32 0.88\nH 2.85 1.32 -0.88",
    aniline: "14\nAniline\nC -0.00 1.40 0.00\nC 1.21 0.70 0.00\nC 1.21 -0.70 0.00\nC -0.00 -1.40 0.00\nC -1.21 -0.70 0.00\nC -1.21 0.70 0.00\nN -0.00 2.80 0.00\nH 2.15 1.24 0.00\nH 2.15 -1.24 0.00\nH -0.00 -2.48 0.00\nH -2.15 -1.24 0.00\nH -2.15 1.24 0.00\nH 0.84 3.34 0.00\nH -0.84 3.34 0.00",
    glucose: "24\nbeta-D-glucose\nC 1.17 0.41 -0.21\nC 0.00 1.35 0.06\nC -1.31 0.64 -0.28\nC -1.26 -0.70 0.46\nC -0.03 -1.50 -0.01\nO 1.16 -0.73 0.25\nO 2.34 1.02 0.20\nO -0.02 2.52 -0.72\nO -2.39 1.42 0.13\nO -1.23 -0.56 1.87\nC -0.03 -2.87 0.64\nO 1.09 -3.61 0.16\nH 1.22 0.24 -1.28\nH -0.04 1.58 1.13\nH -1.33 0.46 -1.35\nH -2.15 -1.24 0.18\nH -0.07 -1.64 -1.09\nH 3.08 0.44 0.03\nH 0.79 2.97 -0.52\nH -2.42 1.44 1.09\nH -2.02 -0.15 2.16\nH -0.05 -2.76 1.73\nH -0.92 -3.42 0.34\nH 1.05 -4.47 0.55",
    fructose: "24\nD-fructopyranose\nC 1.25 0.35 -0.15\nC 0.05 1.28 0.12\nC -1.22 0.55 -0.25\nC -1.18 -0.78 0.45\nC 0.02 -1.48 -0.05\nO 1.20 -0.68 0.22\nC 2.45 0.98 0.42\nO 3.58 0.15 0.18\nO 0.08 2.48 -0.62\nO -2.32 1.35 0.18\nO -1.15 -0.65 1.86\nO 0.05 -2.75 0.55\nH 0.02 1.52 1.18\nH -1.25 0.38 -1.32\nH -2.05 -1.35 0.15\nH 0.00 -1.62 -1.12\nH 2.38 1.15 1.48\nH 2.52 1.95 -0.08\nH 4.35 0.60 0.45\nH 0.88 2.95 -0.42\nH -2.35 1.38 1.14\nH -1.95 -0.22 2.15\nH 0.92 -3.12 0.42\nH -0.02 -2.68 1.51",
    dipeptide: "20\nGlycyl-alanine\nN -3.20 0.80 0.00\nC -2.00 0.00 0.00\nC -0.70 0.80 0.00\nO -0.70 2.03 0.00\nN 0.45 0.10 0.00\nC 1.75 0.80 0.00\nC 1.80 1.85 1.10\nC 2.95 -0.15 0.00\nO 2.90 -1.36 0.00\nO 4.08 0.45 0.00\nH -3.15 1.81 0.00\nH -4.08 0.45 0.00\nH -2.00 -0.63 0.88\nH -2.00 -0.63 -0.88\nH 0.45 -0.91 0.00\nH 1.75 1.35 -0.93\nH 1.80 1.35 2.07\nH 0.93 2.51 1.05\nH 2.72 2.43 1.05\nH 4.82 -0.18 0.00",
    amylose: "23\nMaltose unit\nC -2.40 0.50 0.00\nC -1.20 1.40 0.00\nC 0.00 0.50 0.00\nO 1.15 1.30 0.00\nC 2.35 0.50 0.00\nC 3.55 1.40 0.00\nC 4.75 0.50 0.00\nO 4.75 -0.70 0.00\nC 3.55 -1.40 0.00\nC 2.35 -0.70 0.00\nO -0.00 -0.70 0.00\nC -1.20 -1.40 0.00\nC -2.40 -0.70 0.00\nO -3.55 1.30 0.00\nO -1.20 2.60 0.00\nO -1.20 -2.60 0.00\nO -3.55 -1.30 0.00\nO 3.55 2.60 0.00\nO 5.90 1.30 0.00\nO 3.55 -2.60 0.00\nC 2.35 -0.70 -1.40\nO 2.35 -1.90 -2.10\nH 0.00 0.50 1.08"
  };

  var ChemLab = {
    activeStates: {},

    scenarios: {
      // ═══════════════════════════════════════════════════════════════════
      // 1. CHƯƠNG 1 - CHẶNG 3: ĐIỀU CHẾ ETHYL ACETATE & TÁCH LỚP ESTE
      // ═══════════════════════════════════════════════════════════════════
      "g12c1_2": {
        id: "ethyl_acetate_prep",
        title: "Phòng thí nghiệm ảo: Điều chế Ethyl Acetate & Tách lớp este",
        subtitle: "Thao tác: Nhỏ H₂SO₄ đặc (xúc tác) → Đun cách thuỷ ở 68°C → Rót vào NaCl bão hoà để quan sát lớp este tách ra.",
        substrate: {
          key: "ethyl_acetate",
          name: "Hỗn hợp: C₂H₅OH (2 mL) + CH₃COOH (2 mL)",
          smiles: "CCOC(=O)C",
          cid: 8857,
          formula: "CH₃COOC₂H₅ (M = 88)",
          desc: "Hỗn hợp ban đầu gồm ethanol và acetic acid băng, là chất lỏng không màu, đồng nhất một pha."
        },
        initial: {
          volume: 32,
          color: "rgba(224, 242, 254, 0.45)",
          temp: 25,
          clarity: "clear",
          separated: false,
          layerTopColor: "rgba(250, 204, 21, 0.85)",
          precipitate: false,
          bubbles: false,
          mirror: false,
          charred: false,
          heated: false,
          reagents: { h2so4: 0, nacl_sat: 0, water: 0 }
        },
        reagents: [
          { id: "h2so4", name: "H₂SO₄ đặc (xúc tác)", color: "#eab308", dropColor: "#facc15", desc: "Xúc tác tạo H⁺ & hút nước (1-3 giọt tối ưu; ≥6 giọt gây cháy than hóa!)" },
          { id: "nacl_sat", name: "Dung dịch NaCl bão hoà", color: "#38bdf8", dropColor: "#38bdf8", desc: "Tăng tỉ trọng & giảm độ tan este (hiệu ứng salting-out)" },
          { id: "water", name: "Nước cất (H₂O)", color: "#0284c7", dropColor: "#0ea5e9", desc: "Thử đối chứng (este tan 1 phần trong nước thường ~8g/100mL)" }
        ],
        actions: [
          { id: "heat", name: "Đun cách thuỷ (68°C)", icon: "flame" },
          { id: "shake", name: "Lắc nhẹ ống nghiệm", icon: "refresh" },
          { id: "reset", name: "Làm mới ống nghiệm", icon: "trash" }
        ],
        calcStoich: function (st) {
          var h2 = st.reagents.h2so4 || 0;
          var nacl = st.reagents.nacl_sat || 0;
          if (st.charred || h2 >= 6) {
            return {
              pillCls: "charred",
              pillText: "DƯ H₂SO₄ (" + h2 + " giọt): HÓA THAN & KHÍ SO₂",
              desc: "H₂SO₄ đặc dư quá nhiều có tính háo nước & oxi hóa mạnh, làm cháy cồn thành carbon đen, sinh khí SO₂ mùi hắc, phá hủy phản ứng este hóa!"
            };
          }
          if (h2 === 0) {
            return {
              pillCls: "deficit",
              pillText: "THIẾU XÚC TÁC (0 giọt H₂SO₄)",
              desc: "Chưa có ion H⁺ xúc tác. Phản ứng este hóa hầu như không xảy ra ở nhiệt độ này."
            };
          }
          if (h2 >= 1 && h2 <= 3) {
            return {
              pillCls: "balanced",
              pillText: "TỈ LỆ TỐI ƯU (" + h2 + " giọt H₂SO₄ đặc)",
              desc: st.heated 
                ? (nacl > 0 ? "Este đã tạo thành & tách lớp váng dầu hoàn hảo nhờ dung dịch NaCl bão hòa!" : "Đã đun cách thủy tạo este. Nhỏ thêm dung dịch NaCl bão hòa để tách lớp.")
                : "Đã có đủ xúc tác acid. Hãy bấm nút 'Đun cách thuỷ (68°C)' để thực hiện este hóa."
            };
          }
          return {
            pillCls: "excess",
            pillText: "CẢNH BÁO DƯ ACID (" + h2 + " giọt H₂SO₄)",
            desc: "Nồng độ acid đặc bắt đầu cao (nhiệt độ tăng). Cần cẩn thận tránh đun quá lửa gây than hóa cồn."
          };
        },
        processAction: function (state, actionId) {
          if (actionId === "reset") return null;
          var log = null;
          var h2 = state.reagents.h2so4 || 0;
          if (actionId === "heat") {
            if (h2 === 0) {
              log = {
                warn: true,
                title: "Chưa có xúc tác H₂SO₄ đặc!",
                text: "Phản ứng este hoá không có xúc tác acid vô cơ đặc xảy ra vô cùng chậm chạp, hiệu suất sau nhiều giờ vẫn không đáng kể.",
                rxn: "CH₃COOH + C₂H₅OH ⇌ (quá chậm nếu thiếu H⁺ xúc tác)"
              };
            } else if (h2 >= 6) {
              state.temp = 85;
              state.charred = true;
              state.bubbles = true;
              state.color = "rgba(45, 25, 16, 0.95)";
              log = {
                warn: true,
                title: "PHẢN ỨNG PHỤ NGUY HIỂM: HÓA THAN & KHÍ SO₂ ĐỘC!",
                text: "Khi đun hỗn hợp có dư thừa H₂SO₄ đặc (" + h2 + " giọt), acid đặc háo nước mãnh liệt oxi hóa than hóa ethanol thành carbon muội đen và sinh khí SO₂ có mùi hắc nghẹt thở! Este bị phá hủy, hiệu suất sụt giảm nghiêm trọng!",
                rxn: "C₂H₅OH + 2H₂SO₄ đặc → 2C (muội than đen) + 2SO₂↑ (mùi hắc) + 5H₂O"
              };
            } else {
              state.temp = 68;
              state.heated = true;
              state.bubbles = true;
              state.color = "rgba(254, 240, 138, 0.65)";
              log = {
                success: true,
                title: "Đun cách thuỷ ở 68°C thành công!",
                text: "Hỗn hợp sôi lăn tăn êm dịu ở 68°C. Cân bằng este hóa chuyển dịch sang phải, este ethyl acetate tạo thành cùng với nước. Hơi cồn và este bay lên ống thuỷ tinh ngưng tụ hồi lưu lại ống nghiệm.",
                rxn: "CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ (ethyl acetate) + H₂O (H₂SO₄ đặc, 68°C)"
              };
            }
          } else if (actionId === "shake") {
            log = { info: true, title: "Lắc đều ống nghiệm", text: "Trộn đều các chất phản ứng để tiếp xúc tối đa.", rxn: null };
          }
          return log;
        },
        processReagent: function (state, reagentId) {
          var log = null;
          state.volume = Math.min(state.volume + 7, 85);
          state.reagents[reagentId] = (state.reagents[reagentId] || 0) + 1;
          var count = state.reagents[reagentId];

          if (reagentId === "h2so4") {
            if (count >= 6) {
              state.charred = true;
              state.color = "rgba(67, 40, 24, 0.9)";
              state.temp = 48;
              log = {
                warn: true,
                title: "DƯ THỪA H₂SO₄ ĐẶC QUÁ MỨC (" + count + " giọt)!",
                text: "Ống nghiệm nóng ran (48°C) và bắt đầu ngả sang màu nâu đen! H₂SO₄ đặc dư thừa hút nước mãnh liệt và đốt cháy cồn thành carbon. Nếu bấm đun, hỗn hợp sẽ bốc khói đen SO₂ độc hại!",
                rxn: "C₂H₅OH xrightarrow{H₂SO₄ đặc dư} muội than C + H₂O + SO₂↑"
              };
            } else if (count >= 4) {
              state.color = "rgba(254, 240, 138, 0.6)";
              state.temp = 38;
              log = {
                warn: true,
                title: "Bắt đầu dư H₂SO₄ đặc (" + count + " giọt)",
                text: "Nhiệt độ dung dịch tăng lên 38°C do H₂SO₄ tỏa nhiệt hydrat hóa mạnh. Khuyến cáo chỉ cần 1-3 giọt xúc tác là đủ, cho quá nhiều sẽ gây phản ứng phụ than hóa khi đun!",
                rxn: "Cảnh báo: Dư acid đặc làm tăng nguy cơ phân hủy sản phẩm hữu cơ."
              };
            } else {
              state.color = "rgba(254, 240, 138, 0.45)";
              state.temp = 32;
              log = {
                success: true,
                title: "Thêm giọt H₂SO₄ đặc thứ " + count + " (Xúc tác lý tưởng)",
                text: "Ống nghiệm ấm nhẹ lên. Acid H₂SO₄ đặc đóng vai trò kép tối quan trọng: (1) Cung cấp ion H⁺ làm xúc tác tăng tốc độ phản ứng; (2) Hút nước làm chuyển dịch cân bằng sang phía tạo este theo Le Chatelier!",
                rxn: "H₂SO₄ đặc: Xúc tác H⁺ + Hút nước giữ cân bằng este hóa theo chiều thuận."
              };
            }
          } else if (reagentId === "nacl_sat") {
            if (!state.heated) {
              log = {
                warn: true,
                title: "CHƯA ĐUN TẠO ESTE!",
                text: "Bạn vừa nhỏ dung dịch NaCl bão hòa nhưng CHƯA đun cách thủy hỗn hợp! Vì este chưa hình thành, cồn và acetic acid đều tan vô hạn trong dung dịch muối loãng nên không có hiện tượng tách lớp, chất lỏng vẫn đồng nhất!",
                rxn: "Bẫy thực nghiệm: Phải đun cách thủy trước để tạo este rồi mới rót NaCl bão hòa!"
              };
            } else if (state.charred) {
              state.separated = true;
              state.layerTopColor = "rgba(120, 80, 40, 0.75)";
              log = {
                warn: true,
                title: "Este tách lớp nhưng bị vẩn muội than đen!",
                text: "Este vẫn nổi lên do nhẹ hơn nước muối bão hòa (d ≈ 0.9 g/mL < 1.2 g/mL), nhưng lớp este bị lẫn cặn than đen và có mùi khét lẫn mùi este chuối chín do phản ứng than hóa trước đó!",
                rxn: "Este nổi mang theo tạp chất muội carbon do thừa H₂SO₄ đặc."
              };
            } else {
              state.separated = true;
              state.layerTopColor = "rgba(250, 204, 21, 0.88)";
              log = {
                success: true,
                title: "TÁCH LỚP HOÀN HẢO: Váng este óng vàng nổi lên trên!",
                text: "Do dung dịch NaCl bão hòa có tỉ trọng lớn (d ≈ 1.2 g/mL) và este ethyl acetate hầu như không tan trong nước muối (hiệu ứng salting-out), este tách thành một lớp dầu màu vàng nhạt nổi rõ rệt bên trên bề mặt, tỏa mùi thơm chuối chín táo chín ngào ngạt!",
                rxn: "Este nhẹ hơn nước muối (d ≈ 0.9 < 1.2) và không tan trong NaCl bão hoà → Phân tách 2 pha sắc nét!"
              };
            }
          } else if (reagentId === "water") {
            if (state.heated) {
              log = {
                warn: true,
                title: "Thêm nước cất: Este tách lớp kém rõ rệt",
                text: "Ethyl acetate tan một phần trong nước cất thường (~8.3g/100mL ở 20°C). Do đó lớp este tách ra rất mỏng và ranh giới phân lớp mờ nhạt, hao hụt este nhiều hơn hẳn so với khi dùng dung dịch NaCl bão hòa!",
                rxn: "Bài học thi cử: Bắt buộc dùng NaCl bão hòa (salting-out) để thu hồi tối đa lượng este!"
              };
            } else {
              log = { info: true, title: "Đã thêm nước cất", text: "Hỗn hợp bị pha loãng, chưa có este.", rxn: null };
            }
          }
          return log;
        }
      },

      // ═══════════════════════════════════════════════════════════════════
      // 2. CHƯƠNG 2 - CHẶNG 2: PHẢN ỨNG TRÁNG GƯƠNG & PHÂN BIỆT GLUCOSE / FRUCTOSE
      // ═══════════════════════════════════════════════════════════════════
      "g12c2_1": {
        id: "glucose_tollens_lab",
        title: "Phòng thí nghiệm ảo: Phản ứng Tráng gương của Glucose & Phân biệt Fructose",
        subtitle: "Thao tác: Thử với Cu(OH)₂ (nhiệt thường tạo phức, đun nóng ra Cu₂O, quá nhiệt ra CuO) · Thử Br₂ phân biệt Fructose · Tráng bạc Tollens.",
        substrateOptions: [
          {
            key: "glucose",
            label: "Dung dịch Glucose (Aldohexose)",
            name: "Glucose (C₆H₁₂O₆) 5%",
            smiles: "OC[C@@H]1OC(O)[C@H](O)[C@@H](O)[C@@H]1O",
            cid: 5793,
            formula: "CH₂OH-[CHOH]₄-CHO (M = 180)",
            desc: "Dung dịch đường nho không màu, có 5 nhóm -OH kề nhau và 1 nhóm aldehyde -CHO."
          },
          {
            key: "fructose",
            label: "Dung dịch Fructose (Ketohexose)",
            name: "Fructose (C₆H₁₂O₆) 5%",
            smiles: "OCC(=O)[C@@H](O)[C@H](O)[C@@H](O)CO",
            cid: 5984,
            formula: "CH₂OH-[CHOH]₃-CO-CH₂OH (M = 180)",
            desc: "Dung dịch đường mật ong không màu, có nhóm ketone -CO- và 5 nhóm -OH kề nhau."
          }
        ],
        substrate: {
          key: "glucose",
          name: "Dung dịch Glucose (C₆H₁₂O₆) 5%",
          smiles: "OC[C@@H]1OC(O)[C@H](O)[C@@H](O)[C@@H]1O",
          cid: 5793,
          formula: "CH₂OH-[CHOH]₄-CHO (M = 180)",
          desc: "Dung dịch đường nho không màu, có 5 nhóm -OH kề nhau và 1 nhóm aldehyde -CHO."
        },
        initial: {
          volume: 30,
          color: "rgba(240, 249, 255, 0.45)",
          temp: 25,
          clarity: "clear",
          precipitate: false,
          bubbles: false,
          mirror: false,
          heated: false,
          overheated: false,
          reagents: { tollens: 0, br2: 0, cuoh2: 0 }
        },
        reagents: [
          { id: "tollens", name: "Thuốc thử Tollens [Ag(NH₃)₂]OH", color: "#94a3b8", dropColor: "#cbd5e1", desc: "Phức bạc ammoniacal (tráng gương khi đun nóng nhẹ)" },
          { id: "cuoh2", name: "Cu(OH)₂ trong kiềm", color: "#0284c7", dropColor: "#0284c7", desc: "Phức xanh lam ở 25°C → Đun nóng: Cu₂O đỏ gạch → Quá nhiệt: CuO đen!" },
          { id: "br2", name: "Nước Bromine (Br₂)", color: "#ea580c", dropColor: "#ea580c", desc: "Dung dịch màu vàng nâu (thuốc thử duy nhất phân biệt Glucose vs Fructose)" }
        ],
        actions: [
          { id: "heat", name: "Đun nóng nhẹ (65°C)", icon: "flame" },
          { id: "overheat", name: "Đun sôi mạnh / Quá nhiệt (95°C)", icon: "temp" },
          { id: "shake", name: "Lắc đều ống nghiệm", icon: "refresh" },
          { id: "reset", name: "Làm mới ống nghiệm", icon: "trash" }
        ],
        calcStoich: function (st, sc) {
          var cu = st.reagents.cuoh2 || 0;
          var br = st.reagents.br2 || 0;
          var tol = st.reagents.tollens || 0;
          var isFruc = sc.substrate && sc.substrate.key === "fructose";

          if (st.overheated) {
            return {
              pillCls: "charred",
              pillText: "QUÁ NHIỆT (95°C): PHÂN HỦY THÀNH CuO ĐEN",
              desc: "Cu(OH)₂ dư bị nhiệt phân hủy thành CuO màu đen sì: Cu(OH)₂ → CuO↓ + H₂O. Đây là lỗi thực hành đun quá lửa trên ngọn đèn cồn!"
            };
          }
          if (br > 0) {
            if (isFruc) {
              return {
                pillCls: "excess",
                pillText: "FRUCTOSE + Br₂: KHÔNG PHẢN ỨNG",
                desc: "Fructose không có nhóm aldehyde, trong môi trường nước brom (axit/trung tính) không thể đồng phân hóa thành glucose nên nước brom KHÔNG bị mất màu!"
              };
            }
            if (br <= 2) {
              return {
                pillCls: "balanced",
                pillText: "GLUCOSE DƯ (MẤT MÀU BROM HOÀN TOÀN)",
                desc: "Lượng glucose đủ lớn để khử sạch Br₂ thành ion Br⁻ không màu: R-CHO + Br₂ + H₂O → R-COOH + 2HBr."
              };
            }
            return {
              pillCls: "excess",
              pillText: "DƯ BROMINE (" + br + " giọt Br₂)",
              desc: "Glucose đã bị oxi hóa hết thành acid gluconic. Lượng Br₂ dư thừa làm dung dịch giữ lại sắc vàng cam nhạt!"
            };
          }
          if (cu > 0) {
            if (st.heated) {
              return {
                pillCls: "balanced",
                pillText: "ĐÃ ĐUN: KẾT TỦA Cu₂O ĐỎ GẠCH",
                desc: "Nhóm aldehyde của carbohydrate đã khử Cu²⁺ thành Cu⁺ tạo đồng(I) oxide Cu₂O màu đỏ gạch rực rỡ."
              };
            }
            return {
              pillCls: cu <= 3 ? "balanced" : "excess",
              pillText: cu <= 3 ? "NHIỆT THƯỜNG: PHỨC ĐỒNG XANH LAM THẪM" : "DƯ Cu(OH)₂ (" + cu + " giọt)",
              desc: "Các nhóm -OH kề nhau hòa tan Cu(OH)₂ tạo dung dịch phức đồng xanh lam thẫm đặc trưng của polyalcohol."
            };
          }
          if (tol > 0) {
            return {
              pillCls: st.heated ? "balanced" : "deficit",
              pillText: st.heated ? "TRÁNG GƯƠNG BẠC SÁNG BÓNG" : "ĐÃ THÊM TOLLENS (CHƯA ĐUN)",
              desc: st.heated ? "Bạc kim loại Ag bám chặt vào thành ống sáng lấp lánh như gương." : "Cần đun nóng nhẹ để kích hoạt phản ứng khử ion [Ag(NH₃)₂]⁺ thành Ag kim loại."
            };
          }
          return {
            pillCls: "deficit",
            pillText: "ỐNG NGHIỆM BAN ĐẦU",
            desc: "Hãy chọn hóa chất thử: Cu(OH)₂ để xem phức xanh và kết tủa đỏ gạch, hoặc Br₂ để thử độ nhạy phân biệt."
          };
        },
        processAction: function (state, actionId, sc) {
          if (actionId === "reset") return null;
          var log = null;
          var isFruc = sc.substrate && sc.substrate.key === "fructose";

          if (actionId === "heat") {
            state.temp = 65;
            state.heated = true;
            if (state.reagents.tollens > 0) {
              state.mirror = true;
              state.color = "rgba(148, 163, 184, 0.4)";
              log = {
                success: true,
                title: "HIỆN TƯỢNG TRÁNG GƯƠNG NGOẠN MỤC!",
                text: "Dưới tác dụng nhiệt, nhóm carbonyl khử ion phức [Ag(NH₃)₂]⁺ thành kim loại Bạc (Ag). Bạc kim loại kết tủa bám dính cực kỳ mịn màng tạo thành một chiếc gương soi sáng bóng như kim loại trên thành ống nghiệm!" + (isFruc ? " (Lưu ý: Fructose tráng gương được do môi trường kiềm NH₃ đồng phân hóa fructose thành glucose)." : ""),
                rxn: "CH₂OH[CHOH]₄CHO + 2[Ag(NH₃)₂]OH → CH₂OH[CHOH]₄COONH₄ + 2Ag↓ (gương bạc) + 3NH₃ + H₂O"
              };
            } else if (state.reagents.cuoh2 > 0) {
              state.precipitate = { color: "#dc2626", name: "Cu₂O đỏ gạch" };
              state.color = "rgba(239, 68, 68, 0.35)";
              log = {
                success: true,
                title: "Xuất hiện kết tủa đỏ gạch Cu₂O rực rỡ!",
                text: "Khi đun nóng với Cu(OH)₂ trong kiềm, nhóm carbonyl bị oxi hóa tạo kết tủa đồng(I) oxide Cu₂O màu đỏ gạch bám dưới đáy ống nghiệm.",
                rxn: "C₆H₁₂O₆ + 2Cu(OH)₂ + NaOH → Muối carboxylate + Cu₂O↓ (đỏ gạch) + 3H₂O"
              };
            } else {
              log = { info: true, title: "Đã đun nóng 65°C", text: "Chưa có thuốc thử Tollens hoặc Cu(OH)₂ để xảy ra phản ứng oxi hóa.", rxn: null };
            }
          } else if (actionId === "overheat") {
            state.temp = 95;
            state.overheated = true;
            if (state.reagents.cuoh2 > 0) {
              state.precipitate = { color: "#18181b", name: "CuO màu đen" };
              state.color = "rgba(63, 63, 70, 0.75)";
              log = {
                warn: true,
                title: "HIỆN TƯỢNG QUÁ NHIỆT: KẾT TỦA CHUYỂN SANG MÀU ĐEN (CuO)!",
                text: "Ở 95°C khi đun sôi mạnh, kết tủa Cu(OH)₂ dư bị nhiệt phân hủy trực tiếp thành đồng(II) oxide CuO màu đen sì ở đáy ống nghiệm! Đây là bẫy thực hành kinh điển trong phòng thí nghiệm khi học sinh đun quá lửa hoặc để quên ống nghiệm trên ngọn lửa đèn cồn!",
                rxn: "Cu(OH)₂ (dư) xrightarrow{95°C} CuO↓ (màu đen) + H₂O"
              };
            } else {
              log = { info: true, title: "Đun sôi 95°C", text: "Nhiệt độ dung dịch tăng cao.", rxn: null };
            }
          } else if (actionId === "shake") {
            log = { info: true, title: "Lắc nhẹ", text: "Trộn đều dung dịch trong ống nghiệm.", rxn: null };
          }
          return log;
        },
        processReagent: function (state, reagentId, sc) {
          var log = null;
          state.volume = Math.min(state.volume + 7, 85);
          state.reagents[reagentId] = (state.reagents[reagentId] || 0) + 1;
          var count = state.reagents[reagentId];
          var isFruc = sc.substrate && sc.substrate.key === "fructose";

          if (reagentId === "tollens") {
            state.color = "rgba(203, 213, 225, 0.55)";
            log = {
              info: true,
              title: "Đã thêm thuốc thử Tollens [Ag(NH₃)₂]OH (" + count + " giọt)",
              text: "Ở nhiệt độ phòng, phản ứng diễn ra rất chậm. Hãy bấm nút 'Đun nóng nhẹ (65°C)' để kích hoạt phản ứng tráng gương bạc!",
              rxn: "Nhiệt độ thường: Dung dịch vẫn trong suốt không màu."
            };
          } else if (reagentId === "br2") {
            if (isFruc) {
              // Fructose does NOT decolorize Bromine water!
              state.color = "rgba(234, 88, 12, 0.65)";
              log = {
                warn: true,
                title: "FRUCTOSE KHÔNG LÀM MẤT MÀU NƯỚC BROMINE!",
                text: "Dung dịch giữ nguyên màu vàng cam của nước Br₂! Lý do cốt lõi: Fructose là ketone, không có nhóm aldehyde. Nước bromine có môi trường trung tính hoặc acid nhẹ nên KHÔNG thể đồng phân hóa fructose thành glucose (fructose chỉ chuyển thành glucose trong môi trường kiềm!). Đây là phản ứng duy nhất phân biệt Glucose và Fructose!",
                rxn: "Fructose + Br₂ + H₂O → KHÔNG PHẢN ỨNG (Giữ nguyên màu vàng nâu)"
              };
            } else {
              // Glucose DOES decolorize Bromine water
              if (count <= 2) {
                state.color = "rgba(240, 253, 250, 0.35)";
                log = {
                  success: true,
                  title: "NƯỚC BROMINE BỊ MẤT MÀU HOÀN TOÀN!",
                  text: "Màu vàng nâu của nước Br₂ lập tức biến mất! Nhóm aldehyde (-CHO) của glucose bị oxi hóa thành acid gluconic, khử Br₂ thành ion Br⁻ không màu. Đây là thuốc thử quyết định để phân biệt Glucose với Fructose!",
                  rxn: "CH₂OH[CHOH]₄CHO + Br₂ + H₂O → CH₂OH[CHOH]₄COOH (gluconic acid) + 2HBr"
                };
              } else {
                state.color = "rgba(251, 146, 60, 0.5)";
                log = {
                  warn: true,
                  title: "DƯ THỪA BROMINE (" + count + " giọt): DUNG DỊCH CÒN MÀU VÀNG CAM NHẠT",
                  text: "Lượng glucose ban đầu đã bị oxi hóa hết thành gluconic acid. Vì bạn nhỏ quá nhiều nước brom (" + count + " giọt), lượng Br₂ dư thừa làm dung dịch giữ lại màu vàng nâu nhạt chứ không mất màu trong suốt hoàn toàn!",
                  rxn: "Br₂ dư sau phản ứng: Nước brom thừa duy trì màu vàng nhạt."
                };
              }
            }
          } else if (reagentId === "cuoh2") {
            state.color = "rgba(14, 165, 233, 0.85)";
            log = {
              success: true,
              title: "Tạo dung dịch phức đồng màu xanh lam thẫm (" + count + " giọt Cu(OH)₂)!",
              text: "Ở nhiệt độ thường, do có 5 nhóm -OH liền kề nhau, carbohydrate hòa tan kết tủa Cu(OH)₂ tạo phức đồng màu xanh lam thẫm đặc trưng của polyalcohol. Hãy bấm 'Đun nóng nhẹ' để tạo kết tủa Cu₂O đỏ gạch!",
              rxn: "2C₆H₁₂O₆ + Cu(OH)₂ → [C₆H₁₁O₆]₂Cu (dung dịch xanh lam thẫm) + 2H₂O"
            };
          }
          return log;
        }
      },

      // ═══════════════════════════════════════════════════════════════════
      // 3. CHƯƠNG 2 - CHẶNG 4: HỒ TINH BỘT + IODINE (NHIỆT ĐỘ & CUỘN XOẮN)
      // ═══════════════════════════════════════════════════════════════════
      "g12c2_3": {
        id: "starch_iodine_lab",
        title: "Phòng thí nghiệm ảo: Phản ứng màu Hồ tinh bột + Iodine (Đun nóng & Để nguội)",
        subtitle: "Thao tác: Nhỏ dung dịch Iodine (I₂) → Xuất hiện màu xanh tím → Bấm đun nóng để màu biến mất → Để nguội màu hiện lại!",
        substrate: {
          key: "amylose",
          name: "Dung dịch Hồ tinh bột",
          smiles: "OC[C@H]1O[C@H](O[C@H]2[C@H](O)[C@@H](O)[C@H](O[C@H]3[C@H](O)[C@@H](O)[C@H](O)O3)O[C@@H]2CO)[C@H](O)[C@@H](O)[C@@H]1O",
          cid: 24836924,
          formula: "(C₆H₁₀O₅)ₙ (Amylose xoắn + Amylopectin)",
          desc: "Hồ tinh bột lỏng trong suốt hơi đục nhẹ, cấu trúc amylose dạng lò xo xoắn ốc rỗng bên trong."
        },
        initial: {
          volume: 35,
          color: "rgba(241, 245, 249, 0.4)",
          temp: 25,
          clarity: "slightly-turbid",
          heated: false,
          reagents: { iodine: 0, water: 0 }
        },
        reagents: [
          { id: "iodine", name: "Dung dịch Iodine (I₂)", color: "#78350f", dropColor: "#9a3412", desc: "Dung dịch iot màu vàng nâu nhạt" },
          { id: "water", name: "Nước cất (pha loãng)", color: "#0284c7", dropColor: "#38bdf8", desc: "Nước tinh khiết làm loãng dung dịch" }
        ],
        actions: [
          { id: "heat", name: "Đun nóng ống nghiệm (80°C)", icon: "flame" },
          { id: "cool", name: "Để nguội ống nghiệm (25°C)", icon: "snow" },
          { id: "reset", name: "Làm mới ống nghiệm", icon: "trash" }
        ],
        calcStoich: function (st) {
          var iod = st.reagents.iodine || 0;
          if (iod === 0) {
            return {
              pillCls: "deficit",
              pillText: "CHƯA CÓ IODINE",
              desc: "Nhỏ dung dịch I₂ vào để quan sát phân tử I₂ chui vào lòng ống xoắn amylose."
            };
          }
          if (st.heated) {
            return {
              pillCls: "excess",
              pillText: "NHIỆT ĐỘ CAO (80°C): AMYLOSE DUỖI THẲNG",
              desc: "Dao động nhiệt phá vỡ cấu trúc xoắn, giải phóng I₂ làm dung dịch MẤT MÀU XANH TÍM!"
            };
          }
          return {
            pillCls: "balanced",
            pillText: "MÀU XANH TÍM ĐẶC TRƯNG (" + iod + " giọt I₂)",
            desc: "Amylose cuộn xoắn giữ chặt phân tử I₂ trong lòng ống xoắn ốc, tạo hợp chất bọc màu xanh tím."
          };
        },
        processAction: function (state, actionId) {
          if (actionId === "reset") return null;
          var log = null;
          var iod = state.reagents.iodine || 0;
          if (actionId === "heat") {
            state.temp = 80;
            state.heated = true;
            if (iod > 0) {
              state.color = "rgba(241, 245, 249, 0.4)";
              log = {
                success: true,
                title: "MÀU XANH TÍM BIẾN MẤT HOÀN TOÀN!",
                text: "Khi đun nóng đến 80°C, dao động nhiệt làm cấu trúc xoắn ốc của amylose bị duỗi thẳng ra. Các phân tử Iodine (I₂) bị giải phóng ra khỏi lòng ống xoắn, làm dung dịch mất màu xanh tím trở lại trong suốt!",
                rxn: "Nhiệt độ cao (80°C): Amylose duỗi thẳng → Iodine bị phóng thích → Mất màu xanh tím."
              };
            } else {
              log = { info: true, title: "Đã đun nóng 80°C", text: "Chưa có Iodine trong dung dịch.", rxn: null };
            }
          } else if (actionId === "cool") {
            state.temp = 25;
            state.heated = false;
            if (iod > 0) {
              state.color = "rgba(30, 27, 75, 0.88)";
              log = {
                success: true,
                title: "MÀU XANH TÍM TÁI SINH TRỞ LẠI KỲ DIỆU!",
                text: "Khi để nguội về 25°C, các phân tử amylose tự động co cuộn xoắn ốc trở lại và tái hấp phụ các phân tử I₂ vào lòng ống xoắn, làm màu xanh tím đậm đặc trưng lập tức phục hồi nguyên vẹn!",
                rxn: "Để nguội (25°C): Amylose cuộn xoắn lại → Bắt giữ I₂ → Tái sinh màu xanh tím."
              };
            } else {
              log = { info: true, title: "Để nguội về 25°C", text: "Nhiệt độ đã trở về bình thường.", rxn: null };
            }
          }
          return log;
        },
        processReagent: function (state, reagentId) {
          var log = null;
          state.volume = Math.min(state.volume + 7, 85);
          state.reagents[reagentId] = (state.reagents[reagentId] || 0) + 1;
          if (reagentId === "iodine") {
            if (state.heated) {
              state.color = "rgba(241, 245, 249, 0.4)";
              log = {
                warn: true,
                title: "Đang nóng: Không xuất hiện màu xanh tím!",
                text: "Vì nhiệt độ đang ở 80°C, amylose bị duỗi thẳng nên không giữ được I₂. Hãy bấm 'Để nguội' để thấy màu xanh tím xuất hiện!",
                rxn: null
              };
            } else {
              state.color = "rgba(30, 27, 75, 0.88)";
              log = {
                success: true,
                title: "DUNG DỊCH HÓA MÀU XANH TÍM ĐẬM ĐẶC TRƯNG!",
                text: "Các phân tử Iodine (I₂) lọt vào và bị hấp phụ chặt chẽ bên trong lòng ống xoắn ốc của phân tử amylose, tạo hợp chất bọc có màu xanh tím đặc trưng nhận biết tinh bột.",
                rxn: "Amylose (xoắn) + I₂ → Hợp chất bọc màu xanh tím (đặc trưng nhận biết tinh bột)."
              };
            }
          } else if (reagentId === "water") {
            log = { info: true, title: "Thêm nước cất", text: "Pha loãng dung dịch.", rxn: null };
          }
          return log;
        }
      },

      // ═══════════════════════════════════════════════════════════════════
      // 4. CHƯƠNG 3 - CHẶNG 3: ANILINE (CHU TRÌNH ĐỤC - TRONG - ĐỤC & TÍNH TOÁN STOICHIOMETRY)
      // ═══════════════════════════════════════════════════════════════════
      "g12c3_2": {
        id: "aniline_bromine_lab",
        title: "Phòng thí nghiệm ảo: Chu trình Đục – Trong – Đục & Phản ứng thế Aniline",
        subtitle: "Thao tác: Theo dõi cân bằng mol: Nhỏ HCl (thiếu vẫn đục, vừa đủ trong veo) → Nhỏ NaOH (trung hòa hết axit dư mới đục lại) → Nước Brom (bão tuyết trắng).",
        substrate: {
          key: "aniline",
          name: "Aniline (C₆H₅NH₂) trong nước [2.0 đương lượng]",
          smiles: "c1ccccc1N",
          cid: 6115,
          formula: "C₆H₅NH₂ (M = 93)",
          desc: "Chất lỏng sánh như dầu, rất ít tan trong nước lạnh, tạo dung dịch vẩn đục lợn cợn tách lớp."
        },
        initial: {
          volume: 28,
          color: "rgba(226, 232, 240, 0.82)",
          temp: 25,
          clarity: "turbid",
          isSalt: false,
          precipitate: false,
          bubbles: false,
          reagents: { hcl: 0, naoh: 0, br2: 0 }
        },
        reagents: [
          { id: "hcl", name: "Dung dịch HCl 1M (mỗi giọt = 1 eq H⁺)", color: "#38bdf8", dropColor: "#38bdf8", desc: "Acid mạnh trung hòa tính base (cần đúng 2 giọt để vừa đủ tan hết)" },
          { id: "naoh", name: "Dung dịch NaOH 1M (mỗi giọt = 1 eq OH⁻)", color: "#c084fc", dropColor: "#c084fc", desc: "Base mạnh trung hòa HCl dư trước, sau đó mới đẩy Aniline vẩn đục trở lại" },
          { id: "br2", name: "Nước Bromine (Br₂)", color: "#ea580c", dropColor: "#ea580c", desc: "Thử phản ứng thế nhân thơm (bão tuyết kết tủa trắng ở môi trường base)" }
        ],
        actions: [
          { id: "shake", name: "Lắc đều ống nghiệm", icon: "refresh" },
          { id: "reset", name: "Làm mới ống nghiệm", icon: "trash" }
        ],
        calcStoich: function (st) {
          var hcl = st.reagents.hcl || 0;
          var naoh = st.reagents.naoh || 0;
          var netAcid = hcl - naoh;

          if (netAcid <= 0) {
            if (naoh > hcl) {
              return {
                pillCls: "excess",
                pillText: "DƯ KIỀM (" + (naoh - hcl) + " eq NaOH): VẪN ĐỤC",
                desc: "Aniline là base yếu không lưỡng tính, KHÔNG TAN TRONG KIỀM DƯ! Dung dịch tiếp tục vẩn đục tách váng dầu."
              };
            }
            return {
              pillCls: "deficit",
              pillText: "ANILINE TỰ DO (2 eq): VẨN ĐỤC",
              desc: "Aniline ở dạng bazơ tự do C₆H₅NH₂, ít tan trong nước làm dung dịch vẩn đục lợn cợn."
            };
          }
          if (netAcid === 1) {
            return {
              pillCls: "deficit",
              pillText: "THIẾU ACID (1 eq HCl / 2 eq Aniline): VẪN ĐỤC",
              desc: "Mới chỉ có 50% aniline tạo muối tan. Phần aniline tự do còn lại vẫn không tan làm ống nghiệm TIẾP TỤC ĐỤC!"
            };
          }
          if (netAcid === 2) {
            return {
              pillCls: "balanced",
              pillText: "VỪA ĐỦ TƯƠNG ĐƯƠNG (2 eq HCl = 2 eq Aniline): TRONG SUỐT VEO",
              desc: "100% Aniline đã chuyển thành muối phenylammonium chloride [C₆H₅NH₃]⁺Cl⁻ tan hoàn toàn trong nước!"
            };
          }
          return {
            pillCls: "excess",
            pillText: "DƯ AXIT (" + (netAcid - 2) + " eq HCl DƯ): TRONG SUỐT",
            desc: "Dung dịch hoàn toàn trong suốt nhưng đang có dư acid HCl tự do. Nếu nhỏ NaOH vào, NaOH sẽ trung hòa acid dư trước!"
          };
        },
        processAction: function (state, actionId) {
          if (actionId === "reset") return null;
          return { info: true, title: "Lắc đều", text: "Trộn đều các chất trong ống nghiệm.", rxn: null };
        },
        processReagent: function (state, reagentId) {
          var log = null;
          state.volume = Math.min(state.volume + 7, 85);
          state.reagents[reagentId] = (state.reagents[reagentId] || 0) + 1;

          var hcl = state.reagents.hcl || 0;
          var naoh = state.reagents.naoh || 0;
          var netAcid = hcl - naoh;

          if (reagentId === "hcl") {
            if (netAcid < 2) {
              // Not enough acid to dissolve all 2 eq aniline
              state.clarity = "turbid";
              state.color = "rgba(226, 232, 240, 0.75)";
              log = {
                warn: true,
                title: "THIẾU ACID: DUNG DỊCH VẪN VẨN ĐỤC!",
                text: "Bạn mới nhỏ " + hcl + " giọt HCl trong khi có 2 phần Aniline. Chỉ một phần aniline chuyển thành muối tan, lượng aniline tự do còn dư vẫn không tan khiến dung dịch TIẾP TỤC VẨN ĐỤC! Hãy nhỏ thêm 1 giọt HCl nữa để vừa đủ tan hết!",
                rxn: "C₆H₅NH₂ (dư) + HCl (thiếu) → Một phần muối tan + Aniline không tan vẫn đục."
              };
            } else if (netAcid === 2) {
              // Exactly equivalent
              state.isSalt = true;
              state.clarity = "clear";
              state.color = "rgba(240, 249, 255, 0.35)";
              log = {
                success: true,
                title: "VỪA ĐỦ TƯƠNG ĐƯƠNG: DUNG DỊCH TRONG SUỐT VEO!",
                text: "Lượng HCl vừa đúng 2 đương lượng trung hòa toàn bộ 2 đương lượng aniline tạo thành muối phenylammonium chloride [C₆H₅NH₃]⁺Cl⁻ tan hoàn toàn trong nước, làm ống nghiệm trong suốt veo không còn một hạt đục nào!",
                rxn: "C₆H₅NH₂ + HCl → C₆H₅NH₃Cl (muối tan hoàn toàn trong nước)"
              };
            } else {
              // Excess acid
              state.isSalt = true;
              state.clarity = "clear";
              state.color = "rgba(240, 249, 255, 0.35)";
              log = {
                info: true,
                title: "DƯ ACID HCL (" + (netAcid - 2) + " eq dư): DUNG DỊCH VẪN TRONG SUỐT",
                text: "Dung dịch vẫn trong suốt veo nhưng hiện tại đang có dư " + (netAcid - 2) + " đương lượng ion H⁺ tự do. Bẫy thực hành: Nếu sau này nhỏ NaOH vào, NaOH phải trung hòa hết axit dư này trước!",
                rxn: "Muối C₆H₅NH₃Cl tan + HCl dư tự do."
              };
            }
          } else if (reagentId === "naoh") {
            if (netAcid > 2) {
              // There is still excess HCl remaining!
              state.clarity = "clear";
              state.color = "rgba(240, 249, 255, 0.35)";
              log = {
                warn: true,
                title: "BẪY THỰC HÀNH: NaOH TRUNG HÒA AXIT DƯ, DUNG DỊCH VẪN TRONG SUỐT!",
                text: "Học sinh thường nghĩ cứ nhỏ NaOH vào là dung dịch đục lại ngay! SAI LẦM: Do trước đó có dư HCl, NaOH vừa thêm vào chỉ ưu tiên phản ứng trung hòa acid HCl dư tự do: HCl + NaOH → NaCl + H₂O. Muối C₆H₅NH₃Cl chưa bị đụng đến nên DUNG DỊCH VẪN HOÀN TOÀN TRONG SUỐT!",
                rxn: "HCl (dư) + NaOH → NaCl + H₂O (Dung dịch chưa thể đục vì chưa chạm đến muối aniline!)"
              };
            } else if (netAcid === 2) {
              state.clarity = "clear";
              state.color = "rgba(240, 249, 255, 0.35)";
              log = {
                info: true,
                title: "Vừa trung hòa hết lượng HCl dư!",
                text: "Dung dịch vừa chạm đúng điểm tương đương của muối C₆H₅NH₃Cl. Giọt NaOH tiếp theo sẽ bắt đầu đẩy Aniline vẩn đục trở lại!",
                rxn: "Axit dư đã hết hoàn toàn."
              };
            } else if (netAcid < 2 && netAcid >= 0) {
              // Displacing free aniline -> turbid!
              state.isSalt = false;
              state.clarity = "turbid";
              state.color = "rgba(226, 232, 240, 0.85)";
              log = {
                success: true,
                title: "DUNG DỊCH VẨN ĐỤC TRỞ LẠI!",
                text: "Base mạnh NaOH đẩy aniline yếu hơn ra khỏi muối: C₆H₅NH₃Cl + NaOH → C₆H₅NH₂↓ + NaCl + H₂O. Aniline tái sinh không tan trong nước làm dung dịch vẩn đục trắng như sữa trở lại!",
                rxn: "C₆H₅NH₃Cl + NaOH → C₆H₅NH₂↓ (tái tạo, vẩn đục) + NaCl + H₂O"
              };
            } else {
              // Excess NaOH
              state.isSalt = false;
              state.clarity = "turbid";
              state.color = "rgba(226, 232, 240, 0.9)";
              log = {
                warn: true,
                title: "DƯ THỪA NaOH: ANILINE VẪN ĐỤC, KHÔNG TAN!",
                text: "Aniline có tính base yếu, KHÔNG PHẢI CHẤT LƯỠNG TÍNH như amino acid hay Al(OH)₃, do đó aniline hoàn toàn KHÔNG TAN trong dung dịch kiềm dư! Dung dịch tiếp tục vẩn đục và dần tách váng dầu lơ lửng.",
                rxn: "Aniline không phản ứng với NaOH dư → Duy trì vẩn đục tách lớp."
              };
            }
          } else if (reagentId === "br2") {
            if (netAcid >= 2) {
              // Protonated form -NH3+ deactivates ring!
              state.color = "rgba(251, 146, 60, 0.55)";
              log = {
                warn: true,
                title: "MÔI TRƯỜNG ACID: NHÓM -NH₃⁺ HÚT ELECTRON TRƠ HÓA NHÂN THƠM!",
                text: "Trong môi trường acid mạnh (khi aniline ở dạng muối [C₆H₅NH₃]⁺Cl⁻), nhóm -NH₃⁺ mang điện tích dương hút electron cực mạnh làm giảm mật độ điện tử của vòng benzen, khiến phản ứng thế với Br₂ bị cản trở mạnh mẽ, không tạo được cơn bão tuyết kết tủa trắng như ở aniline tự do!",
                rxn: "C₆H₅NH₃⁺: Vòng thơm bị trơ hóa do hiệu ứng -I của ion ammonium."
              };
            } else {
              // Free aniline -> rapid precipitation!
              state.color = "rgba(248, 250, 252, 0.55)";
              state.precipitate = { color: "#ffffff", name: "2,4,6-tribromoaniline" };
              log = {
                success: true,
                title: "CƠN BÃO TUYẾT: KẾT TỦA TRẮNG XUẤT HIỆN DÀY ĐẶC!",
                text: "Nhóm amino (-NH₂) tự do có cặp electron chưa chia đẩy mạnh vào hệ liên hợp vòng thơm, hoạt hóa nhân benzen cực mạnh ở các vị trí ortho và para. Ngay ở nhiệt độ thường, aniline thế đồng thời 3 nguyên tử Bromine tạo kết tủa trắng xoá 2,4,6-tribromoaniline rơi xuống đáy ống nghiệm!",
                rxn: "C₆H₅NH₂ + 3Br₂ → C₆H₂Br₃NH₂↓ (kết tủa trắng xoá) + 3HBr"
              };
            }
          }
          return log;
        }
      },

      // ═══════════════════════════════════════════════════════════════════
      // 5. CHƯƠNG 3 - CHẶNG 5: PHẢN ỨNG MÀU BIURET & ĐÔNG TỤ PROTEIN
      // ═══════════════════════════════════════════════════════════════════
      "g12c3_4": {
        id: "biuret_protein_lab",
        title: "Phòng thí nghiệm ảo: Phản ứng màu Biuret & Đông tụ Protein",
        subtitle: "Thao tác: Thử nghiệm so sánh Albumin (Protein) vs Gly-Ala (Dipeptide) · Nhỏ NaOH tạo kiềm → 1-2 giọt CuSO₄ (tím biuret) · Dư CuSO₄ (xỉn màu) · Đun sôi đông tụ.",
        substrateOptions: [
          {
            key: "albumin",
            label: "Lòng trắng trứng (Albumin - Protein)",
            name: "Dung dịch Lòng trắng trứng (Albumin)",
            smiles: "NCC(=O)NCC(=O)NCC(=O)O",
            cid: 6093,
            formula: "Polypeptide Protein (M > 10.000)",
            desc: "Dung dịch protein keo lỏng trong suốt, gồm chuỗi dài hàng trăm gốc α-amino acid liên kết peptide."
          },
          {
            key: "dipeptide",
            label: "Dipeptide (Gly-Ala - Âm tính Biuret)",
            name: "Dung dịch Glycyl-alanine (Dipeptide)",
            smiles: "NCC(=O)NC(C)C(=O)O",
            cid: 6093,
            formula: "H₂N-CH₂-CO-NH-CH(CH₃)-COOH (M = 146)",
            desc: "Dipeptide gồm 2 gốc amino acid, CHỈ CÓ DUY NHẤT 1 LIÊN KẾT PEPTIDE (-CO-NH-)."
          }
        ],
        substrate: {
          key: "albumin",
          name: "Dung dịch Lòng trắng trứng (Albumin)",
          smiles: "NCC(=O)NCC(=O)NCC(=O)O",
          cid: 6093,
          formula: "Polypeptide Protein (M > 10.000)",
          desc: "Dung dịch protein keo lỏng trong suốt, gồm chuỗi dài hàng trăm gốc α-amino acid liên kết peptide."
        },
        initial: {
          volume: 30,
          color: "rgba(240, 249, 255, 0.4)",
          temp: 25,
          clarity: "clear",
          precipitate: false,
          bubbles: false,
          coagulated: false,
          reagents: { naoh: 0, cuso4: 0 }
        },
        reagents: [
          { id: "naoh", name: "Dung dịch NaOH 30%", color: "#c084fc", dropColor: "#c084fc", desc: "Môi trường kiềm đậm đặc bắt buộc cho tạo phức chelate" },
          { id: "cuso4", name: "Dung dịch CuSO₄ 2%", color: "#0284c7", dropColor: "#0284c7", desc: "Cung cấp ion Cu²⁺ (chuẩn 1-2 giọt; ≥4 giọt bị tủa xanh lấn át)" }
        ],
        actions: [
          { id: "heat", name: "Đun sôi ống nghiệm (100°C)", icon: "flame" },
          { id: "shake", name: "Lắc đều", icon: "refresh" },
          { id: "reset", name: "Làm mới ống nghiệm", icon: "trash" }
        ],
        calcStoich: function (st, sc) {
          var na = st.reagents.naoh || 0;
          var cu = st.reagents.cuso4 || 0;
          var isDi = sc.substrate && sc.substrate.key === "dipeptide";

          if (st.coagulated) {
            return {
              pillCls: "charred",
              pillText: "ĐÔNG TỤ NHIỆT (100°C): VÓN CỤC TRẮNG ĐỤC",
              desc: "Nhiệt độ sôi làm protein mất cấu trúc bậc 2, 3, 4, đông tụ tạo mảng riêu trắng đục không thể tan lại."
            };
          }
          if (isDi) {
            if (cu > 0 && na > 0) {
              return {
                pillCls: "excess",
                pillText: "DIPEPTIDE: ÂM TÍNH BIURET (KHÔNG CÓ MÀU TÍM)",
                desc: "Dipeptide chỉ có 1 liên kết peptide, không đủ điều kiện tối thiểu (cần ≥2 liên kết peptide) để tạo phức màu tím biuret!"
              };
            }
            return {
              pillCls: "deficit",
              pillText: "THỬ NGHIỆM DIPEPTIDE",
              desc: "Thêm NaOH và CuSO₄ để chứng minh dipeptide không cho phản ứng màu Biuret."
            };
          }
          if (cu >= 4) {
            return {
              pillCls: "excess",
              pillText: "LỖI KINH ĐIỂN: DƯ CuSO₄ (" + cu + " giọt)",
              desc: "Lượng Cu²⁺ dư thừa tạo quá nhiều kết tủa Cu(OH)₂ màu xanh lam, lấn át và làm xỉn màu tím biuret!"
            };
          }
          if (cu >= 1 && na > 0) {
            return {
              pillCls: "balanced",
              pillText: "MÀU TÍM BIURET RỰC RỠ (" + cu + " giọt CuSO₄)",
              desc: "Phức chelate giữa Cu²⁺ và các liên kết peptide (-CO-NH-) trong môi trường kiềm cho màu tím biuret hoàn hảo."
            };
          }
          return {
            pillCls: "deficit",
            pillText: "CHƯA ĐỦ THUỐC THỬ",
            desc: "Quy trình chuẩn: Nhỏ 1 mL NaOH 30% trước, sau đó nhỏ 1-2 giọt CuSO₄ 2%."
          };
        },
        processAction: function (state, actionId, sc) {
          if (actionId === "reset") return null;
          var log = null;
          var isDi = sc.substrate && sc.substrate.key === "dipeptide";

          if (actionId === "heat") {
            state.temp = 100;
            if (isDi) {
              state.color = "rgba(240, 249, 255, 0.4)";
              log = {
                info: true,
                title: "Dipeptide không bị đông tụ nhiệt!",
                text: "Dipeptide có khối lượng phân tử nhỏ, không có cấu trúc không gian bậc 3, 4 phức tạp như protein nên không bị hiện tượng đông tụ nhiệt như albumin!",
                rxn: "Dipeptide bền nhiệt, không vón cục."
              };
            } else {
              state.coagulated = true;
              state.color = "rgba(241, 245, 249, 0.94)";
              log = {
                success: true,
                title: "HIỆN TƯỢNG ĐÔNG TỤ PROTEIN (HIỆN TƯỢNG RIÊU CUA / NẤU TRỨNG)!",
                text: "Ở 100°C, nhiệt độ cao phá vỡ các liên kết hydrogen và cầu nối disulfide duy trì cấu trúc không gian bậc 2, 3, 4 của albumin. Các chuỗi polypeptide bung ra, vón kết tụ lại với nhau tạo thành các mảng đông đặc màu trắng đục không thể tan lại trong nước!",
                rxn: "Nhiệt độ cao (100°C): Protein hình cầu tan → Biến tính → Đông tụ không thuận nghịch."
              };
            }
          } else if (actionId === "shake") {
            log = { info: true, title: "Lắc đều", text: "Trộn đều thuốc thử trong ống nghiệm.", rxn: null };
          }
          return log;
        },
        processReagent: function (state, reagentId, sc) {
          var log = null;
          state.volume = Math.min(state.volume + 7, 85);
          state.reagents[reagentId] = (state.reagents[reagentId] || 0) + 1;
          var na = state.reagents.naoh || 0;
          var cu = state.reagents.cuso4 || 0;
          var isDi = sc.substrate && sc.substrate.key === "dipeptide";

          if (reagentId === "naoh") {
            log = {
              info: true,
              title: "Đã thêm NaOH tạo môi trường kiềm đậm đặc (" + na + " giọt)",
              text: "Phản ứng màu Biuret bắt buộc phải xảy ra trong môi trường kiềm mạnh để deproton hóa liên kết peptide.",
              rxn: null
            };
          } else if (reagentId === "cuso4") {
            if (na === 0) {
              state.color = "rgba(2, 132, 199, 0.4)";
              log = {
                warn: true,
                title: "CHƯA CÓ KIỀM NaOH!",
                text: "Bạn vừa nhỏ CuSO₄ nhưng chưa có môi trường kiềm. Phản ứng màu Biuret bắt buộc phải có NaOH trước để tạo phức!",
                rxn: "Cần NaOH để phản ứng tạo phức xảy ra."
              };
            } else if (isDi) {
              // Dipeptide fails Biuret!
              state.color = "rgba(56, 189, 248, 0.55)";
              state.precipitate = { color: "#38bdf8", name: "Cu(OH)₂ xanh lam" };
              log = {
                warn: true,
                title: "TỬ HUYỆT THI CỬ: DIPEPTIDE ÂM TÍNH VỚI PHẢN ỨNG BIURET!",
                text: "Dung dịch chỉ có kết tủa xanh lam nhạt của Cu(OH)₂, HOÀN TOÀN KHÔNG CÓ MÀU TÍM BIURET! Lý do: Dipeptide (Gly-Ala) chỉ có DUY NHẤT 1 LIÊN KẾT PEPTIDE (-CO-NH-). Trong khi điều kiện tiên quyết để tạo phức chelate màu tím biuret là phân tử phải có TỐI THIỂU 2 LIÊN KẾT PEPTIDE (tức từ tripeptide trở lên hoặc protein)!",
                rxn: "Dipeptide (1 liên kết peptide) + Cu(OH)₂ → KHÔNG TẠO PHỨC TÍM BIURET"
              };
            } else {
              // Protein Albumin
              if (cu >= 4) {
                // Excess CuSO4 ruins the purple color
                state.color = "rgba(107, 70, 193, 0.8)";
                state.precipitate = { color: "#38bdf8", name: "Cu(OH)₂ dư lơ lửng" };
                log = {
                  warn: true,
                  title: "LỖI THỰC HÀNH KINH ĐIỂN: DƯ THỪA CuSO₄ (" + cu + " giọt)!",
                  text: "Lượng ion Cu²⁺ cho vào quá nhiều (" + cu + " giọt) phản ứng với NaOH tạo ra một lượng lớn kết tủa Cu(OH)₂ màu xanh lam lơ lửng, làm xỉn và lấn át màu tím biuret! Dung dịch chuyển sang màu tím xanh bùn đục. Quy tắc phòng thí nghiệm: Chỉ được nhỏ từ 1 đến 2 giọt dung dịch CuSO₄ 2% thật loãng!",
                  rxn: "Cu²⁺ (dư) + 2OH⁻ → Cu(OH)₂↓ (xanh lam) làm lu mờ màu tím biuret."
                };
              } else {
                state.color = "rgba(147, 51, 234, 0.88)";
                log = {
                  success: true,
                  title: "XUẤT HIỆN MÀU TÍM BIURET RỰC RỠ ĐẶC TRƯNG (" + cu + " giọt CuSO₄)!",
                  text: "Trong môi trường kiềm, hai hay nhiều liên kết peptide (-CO-NH-) của phân tử protein phối trí tạo phức chelate với ion Cu²⁺, tạo nên màu tím biuret vô cùng rực rỡ và đặc trưng!",
                  rxn: "Protein + Cu(OH)₂ (trong kiềm) → Phức chất màu tím đặc trưng (Phản ứng Biuret)."
                };
              }
            }
          }
          return log;
        }
      }
    },

    hasLab: function (chId, stageIdx) {
      return !!this.scenarios[chId + "_" + stageIdx];
    },

    getLab: function (chId, stageIdx) {
      return this.scenarios[chId + "_" + stageIdx];
    },

    getOrCreateState: function (chId, stageIdx) {
      var key = chId + "_" + stageIdx;
      if (!this.activeStates[key]) {
        var sc = this.getLab(chId, stageIdx);
        if (sc) {
          this.activeStates[key] = JSON.parse(JSON.stringify(sc.initial));
          this.activeStates[key].log = {
            info: true,
            title: "Ống nghiệm sẵn sàng",
            text: sc.substrate.desc,
            rxn: null
          };
        }
      }
      return this.activeStates[key];
    },

    resetLab: function (chId, stageIdx) {
      var key = chId + "_" + stageIdx;
      delete this.activeStates[key];
      return this.getOrCreateState(chId, stageIdx);
    },

    switchSubstrate: function (chId, stageIdx, subKey) {
      var sc = this.getLab(chId, stageIdx);
      if (!sc || !sc.substrateOptions) return;
      var opt = sc.substrateOptions.find(function (o) { return o.key === subKey; });
      if (!opt) return;

      sc.substrate = JSON.parse(JSON.stringify(opt));
      this.resetLab(chId, stageIdx);

      var card = document.getElementById("chemlab-" + chId + "-" + stageIdx);
      if (card) {
        var temp = document.createElement("div");
        temp.innerHTML = this.renderWidget(chId, stageIdx);
        card.replaceWith(temp.firstElementChild);
      }
    },

    // Render Full Interactive Virtual Laboratory Widget
    renderWidget: function (chId, stageIdx) {
      var sc = this.getLab(chId, stageIdx);
      if (!sc) return "";
      var st = this.getOrCreateState(chId, stageIdx);

      // Reagent Cards with live dosage badges
      var reagentCards = sc.reagents.map(function (r) {
        var count = (st.reagents && st.reagents[r.id]) || 0;
        var badgeCls = count > 0 ? " active" : "";
        return '<div class="chemlab-reagent-card" draggable="true" data-chemlab-act="dragReagent" data-ch="' + chId + '" data-idx="' + stageIdx + '" data-rid="' + r.id + '" style="--rg-color:' + r.color + '">' +
          '<div class="rg-card-head">' +
            '<span class="rg-grip" title="Kéo thả trực tiếp vào ống nghiệm">' + cIco("grip") + '</span>' +
            '<span class="rg-bottle-badge" style="background:' + r.color + '">' + cIco("pipette") + '</span>' +
            '<b class="rg-name">' + r.name + '</b>' +
            '<span class="rg-dosage-badge' + badgeCls + '" id="dose-' + chId + '-' + stageIdx + '-' + r.id + '">' + count + ' giọt</span>' +
          '</div>' +
          '<div class="rg-desc">' + r.desc + '</div>' +
          '<div class="rg-card-foot">' +
            '<button class="chemlab-add-btn" data-chemlab-act="reagent" data-ch="' + chId + '" data-idx="' + stageIdx + '" data-rid="' + r.id + '">' +
              cIco("drop") + ' Nhỏ giọt (+1)' +
            '</button>' +
          '</div>' +
        '</div>';
      }).join("");

      // Experiment Actions
      var actionBtns = sc.actions.map(function (a) {
        return '<button class="btn ghost small chemlab-tool-btn" data-chemlab-act="tool" data-ch="' + chId + '" data-idx="' + stageIdx + '" data-aid="' + a.id + '">' +
          cIco(a.icon) + ' ' + a.name +
        '</button>';
      }).join("");

      // Substrate Switcher Pills (e.g. Glucose vs Fructose, Albumin vs Dipeptide)
      var subSwitchHtml = "";
      if (sc.substrateOptions && sc.substrateOptions.length > 1) {
        subSwitchHtml = '<div class="chemlab-substrate-switch">' +
          sc.substrateOptions.map(function (opt) {
            var active = (sc.substrate && sc.substrate.key === opt.key) ? ' active' : '';
            return '<button class="sub-switch-btn' + active + '" data-chemlab-switch="' + opt.key + '" data-ch="' + chId + '" data-idx="' + stageIdx + '">' +
              cIco("beaker") + ' ' + opt.label +
            '</button>';
          }).join("") +
        '</div>';
      }

      var liquidHeight = st.volume + "%";
      var separatedDisplay = st.separated ? 'block' : 'none';
      var precipitateDisplay = st.precipitate ? 'block' : 'none';
      var precipitateBg = st.precipitate ? (st.precipitate.color || '#fff') : '#fff';
      var mirrorClass = st.mirror ? ' mirror-on' : '';

      var logObj = st.log || { info: true, title: "Sẵn sàng", text: sc.subtitle };
      var logCls = logObj.success ? "success" : (logObj.warn ? "warn" : "info");
      var logIcon = logObj.success ? cIco("check") : (logObj.warn ? cIco("alert") : cIco("bulb"));

      var stoichData = sc.calcStoich ? sc.calcStoich(st, sc) : { pillCls: "balanced", pillText: "Sẵn sàng", desc: sc.substrate.desc };

      return '<div class="chemlab-card" id="chemlab-' + chId + '-' + stageIdx + '">' +
        '<div class="chemlab-header">' +
          '<div class="chemlab-title-group">' +
            '<div class="chemlab-badge">' + cIco("flask") + ' PHÒNG THÍ NGHIỆM ẢO TƯƠNG TÁC (ĐỘNG HỌC & STOICHIOMETRY)</div>' +
            '<h4 class="chemlab-title">' + sc.title + '</h4>' +
            '<p class="chemlab-sub">' + sc.subtitle + '</p>' +
            subSwitchHtml +
          '</div>' +
          '<div class="chemlab-mol-btns">' +
            '<button class="btn ghost small mol-btn" data-chemlab-mol="2d" data-ch="' + chId + '" data-idx="' + stageIdx + '" title="Xem công thức cấu tạo 2D (Vector SVG)">' +
              cIco("eye") + ' Cấu tạo 2D (Vector)' +
            '</button>' +
            '<button class="btn ghost small mol-btn" data-chemlab-mol="3d" data-ch="' + chId + '" data-idx="' + stageIdx + '" title="Xoay tương tác mô hình 3D (Chuột kéo & Phóng to)">' +
              cIco("atom") + ' Xoay 3D (3Dmol)' +
            '</button>' +
          '</div>' +
        '</div>' +

        '<div class="chemlab-workbench">' +
          // Left: Test Tube Lab Stage with Dropzone
          '<div class="chemlab-stage" id="tube-stage-' + chId + '-' + stageIdx + '" data-chemlab-dropzone="tube" data-ch="' + chId + '" data-idx="' + stageIdx + '">' +
            '<div class="test-tube-assembly">' +
              // Dropper Pipette Tool
              '<div class="tube-dropper-pipette" id="pipette-' + chId + '-' + stageIdx + '">' +
                '<div class="pipette-bulb"></div>' +
                '<div class="pipette-tube"><div class="pipette-fluid" id="pip-fluid-' + chId + '-' + stageIdx + '"></div></div>' +
                '<div class="pipette-tip"></div>' +
                '<div class="pipette-drop" id="pip-drop-' + chId + '-' + stageIdx + '"></div>' +
              '</div>' +

              // Splash Ripple Ring
              '<div class="tube-splash-ring" id="splash-' + chId + '-' + stageIdx + '"></div>' +

              // Glass Test Tube
              '<div class="test-tube-glass' + mirrorClass + '" id="tube-' + chId + '-' + stageIdx + '">' +
                '<div class="glass-reflection"></div>' +
                '<div class="glass-sheen"></div>' +
                '<div class="tube-graduations"><span>15mL</span><span>10mL</span><span>5mL</span></div>' +

                // Dynamic Liquid Body
                '<div class="tube-liquid" id="liquid-' + chId + '-' + stageIdx + '" style="height:' + liquidHeight + ';background-color:' + st.color + '">' +
                  // SVG Sloshing Wave Surface Meniscus
                  '<div class="liquid-wave-wrap">' +
                    '<svg class="liquid-wave-svg" viewBox="0 0 120 20" preserveAspectRatio="none">' +
                      '<path class="wave-path wave-back" d="M0 10 Q 30 4, 60 10 T 120 10 V 20 H 0 Z"></path>' +
                      '<path class="wave-path wave-front" d="M0 10 Q 30 16, 60 10 T 120 10 V 20 H 0 Z"></path>' +
                    '</svg>' +
                  '</div>' +

                  // Separated Top Layer (Este nổi)
                  '<div class="tube-layer-top" id="layer-top-' + chId + '-' + stageIdx + '" style="display:' + separatedDisplay + ';background-color:' + st.layerTopColor + '">' +
                    '<span class="layer-tag">Váng este nổi</span>' +
                  '</div>' +

                  // Precipitate Sediment
                  '<div class="tube-precipitate" id="precip-' + chId + '-' + stageIdx + '" style="display:' + precipitateDisplay + ';background-color:' + precipitateBg + '"></div>' +

                  // Dynamic Particles Layer
                  '<div class="tube-particle-layer" id="particles-' + chId + '-' + stageIdx + '"></div>' +
                '</div>' +
              '</div>' +

              // Base Holder
              '<div class="tube-stand-base"></div>' +
            '</div>' +

            // Status Bar
            '<div class="tube-status-bar">' +
              '<span class="status-pill temp" id="pill-temp-' + chId + '-' + stageIdx + '">' + cIco("temp") + ' ' + st.temp + '°C</span>' +
              '<span class="status-pill vol" id="pill-vol-' + chId + '-' + stageIdx + '">' + cIco("tube") + ' ' + (st.volume * 0.2).toFixed(1) + ' mL</span>' +
            '</div>' +

            // Stoichiometric Ratio Banner
            '<div class="tube-stoich-banner" id="stoich-banner-' + chId + '-' + stageIdx + '">' +
              '<div class="stoich-ratio-row">' +
                '<span class="stoich-pill ' + stoichData.pillCls + '" id="stoich-pill-' + chId + '-' + stageIdx + '">' + stoichData.pillText + '</span>' +
              '</div>' +
              '<div class="stoich-desc-text" id="stoich-desc-' + chId + '-' + stageIdx + '">' + stoichData.desc + '</div>' +
            '</div>' +

            '<div class="tube-drop-hint">' + cIco("pipette") + ' Nhỏ từng giọt hoặc kéo lọ hoá chất thả vào ống</div>' +
          '</div>' +

          // Right: Reagents Shelf & Tools
          '<div class="chemlab-controls">' +
            '<div class="ctrl-sec-title">HÓA CHẤT & THUỐC THỬ (NHỎ TỪNG GIỌT ĐỂ THỬ CÁC TỈ LỆ MOL)</div>' +
            '<div class="chemlab-reagents-shelf">' + reagentCards + '</div>' +
            '<div class="ctrl-sec-title" style="margin-top:14px">THAO TÁC THÍ NGHIỆM</div>' +
            '<div class="chemlab-tools-row">' + actionBtns + '</div>' +
          '</div>' +
        '</div>' +

        // Observation & Chemistry Log
        '<div class="chemlab-log-box ' + logCls + '" id="log-' + chId + '-' + stageIdx + '">' +
          '<div class="log-head">' + logIcon + ' <b>' + logObj.title + '</b></div>' +
          '<div class="log-body">' + logObj.text + '</div>' +
          (logObj.rxn ? '<div class="log-rxn"><b>Phương trình & Cơ chế:</b> <code>' + logObj.rxn + '</code></div>' : '') +
        '</div>' +
      '</div>';
    },

    // In-Place Smooth Fluid Reaction Execution with GSAP & Real-time Stoichiometry Update
    triggerReagent: function (chId, stageIdx, reagentId) {
      var sc = this.getLab(chId, stageIdx);
      if (!sc) return;
      var st = this.getOrCreateState(chId, stageIdx);
      var rObj = sc.reagents.find(function (r) { return r.id === reagentId; });
      if (!rObj) return;

      var pipEl = document.getElementById("pipette-" + chId + "-" + stageIdx);
      var dropEl = document.getElementById("pip-drop-" + chId + "-" + stageIdx);
      var fluidEl = document.getElementById("pip-fluid-" + chId + "-" + stageIdx);
      var splashEl = document.getElementById("splash-" + chId + "-" + stageIdx);
      var tubeEl = document.getElementById("tube-" + chId + "-" + stageIdx);
      var liquidEl = document.getElementById("liquid-" + chId + "-" + stageIdx);
      var topLayerEl = document.getElementById("layer-top-" + chId + "-" + stageIdx);
      var precipEl = document.getElementById("precip-" + chId + "-" + stageIdx);
      var particlesEl = document.getElementById("particles-" + chId + "-" + stageIdx);
      var logEl = document.getElementById("log-" + chId + "-" + stageIdx);
      var pillVol = document.getElementById("pill-vol-" + chId + "-" + stageIdx);
      var pillTemp = document.getElementById("pill-temp-" + chId + "-" + stageIdx);
      var doseEl = document.getElementById("dose-" + chId + "-" + stageIdx + "-" + reagentId);
      var stoichPill = document.getElementById("stoich-pill-" + chId + "-" + stageIdx);
      var stoichDesc = document.getElementById("stoich-desc-" + chId + "-" + stageIdx);

      // Execute scenario logic to calculate next state
      var log = sc.processReagent(st, reagentId, sc);
      st.log = log;

      // Update dosage count badge in real-time
      if (doseEl) {
        var count = (st.reagents && st.reagents[reagentId]) || 0;
        doseEl.textContent = count + " giọt";
        doseEl.classList.add("active");
      }

      // Update Stoichiometric Status Banner
      if (sc.calcStoich && stoichPill && stoichDesc) {
        var sData = sc.calcStoich(st, sc);
        stoichPill.className = "stoich-pill " + sData.pillCls;
        stoichPill.textContent = sData.pillText;
        stoichDesc.textContent = sData.desc;
      }

      var dropColor = rObj.dropColor || rObj.color;
      var newHeight = st.volume + "%";
      var newBg = st.color;

      // GSAP Liquid Dropping Animation
      if (window.gsap && pipEl && dropEl && liquidEl) {
        if (fluidEl) fluidEl.style.backgroundColor = dropColor;
        dropEl.style.backgroundColor = dropColor;

        var tl = gsap.timeline();

        // 1. Pipette glides in over the tube opening
        tl.to(pipEl, { opacity: 1, y: 18, duration: 0.22, ease: "power2.out" })
          // 2. Squeeze drop out
          .fromTo(dropEl, { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.18, ease: "back.out(2)" })
          // 3. Droplet accelerates downward into the tube
          .to(dropEl, { y: 62, duration: 0.3, ease: "power2.in" })
          // 4. Splash impact
          .add(function () {
            dropEl.style.opacity = "0";
            dropEl.style.transform = "none";

            // Splash ring ripple
            if (splashEl) {
              splashEl.style.borderColor = dropColor;
              gsap.fromTo(splashEl, { scale: 0.4, opacity: 0.9 }, { scale: 2.2, opacity: 0, duration: 0.32, ease: "power1.out" });
            }

            // Tube elastic wobble & wave slosh rebound
            if (tubeEl) {
              gsap.fromTo(tubeEl, { scaleY: 0.97, scaleX: 1.03 }, { scaleY: 1, scaleX: 1, duration: 0.4, ease: "elastic.out(1.2, 0.3)" });
            }
            var waveWrap = liquidEl.querySelector(".liquid-wave-wrap");
            if (waveWrap && window.gsap) {
              gsap.timeline()
                .fromTo(waveWrap, { scaleY: 2.3, y: 3, rotation: -5 }, { scaleY: 1, y: 0, rotation: 0, duration: 0.85, ease: "elastic.out(1.3, 0.28)" });
            }

            // Liquid level rising smoothly
            gsap.to(liquidEl, { height: newHeight, duration: 0.85, ease: "power2.out" });

            // Liquid color morphing smoothly
            gsap.to(liquidEl, { backgroundColor: newBg, duration: 1.1, ease: "sine.inOut" });

            // If separated ester layer
            if (st.separated && topLayerEl) {
              topLayerEl.style.display = "block";
              if (st.layerTopColor) topLayerEl.style.backgroundColor = st.layerTopColor;
              gsap.fromTo(topLayerEl, { height: "0%", opacity: 0 }, { height: "30%", opacity: 1, duration: 0.9, ease: "power2.out" });
            }

            // If precipitate: spawn falling crystal flakes
            if (st.precipitate && particlesEl) {
              precipEl.style.display = "block";
              precipEl.style.backgroundColor = st.precipitate.color || "#ffffff";
              precipEl.title = st.precipitate.name || "Kết tủa";

              // Spawn 12 snowflake particles falling inside liquid
              for (var i = 0; i < 12; i++) {
                var flake = document.createElement("div");
                flake.className = "precip-flake";
                flake.style.left = (15 + Math.random() * 70) + "%";
                flake.style.backgroundColor = st.precipitate.color || "#ffffff";
                particlesEl.appendChild(flake);

                gsap.fromTo(flake, 
                  { y: 10, x: 0, opacity: 0.9 },
                  { 
                    y: 85, 
                    x: (Math.random() - 0.5) * 16, 
                    duration: 0.9 + Math.random() * 0.7, 
                    delay: Math.random() * 0.4,
                    ease: "power1.inOut",
                    onComplete: (function (el) { return function () { el.remove(); }; })(flake)
                  }
                );
              }
            }
          })
          // 5. Pipette withdraws
          .to(pipEl, { opacity: 0, y: -10, duration: 0.22, delay: 0.1 });
      } else {
        if (liquidEl) {
          liquidEl.style.height = newHeight;
          liquidEl.style.backgroundColor = newBg;
        }
      }

      // Update status badges
      if (pillVol) pillVol.innerHTML = cIco("tube") + ' ' + (st.volume * 0.2).toFixed(1) + ' mL';
      if (pillTemp) pillTemp.innerHTML = cIco("temp") + ' ' + st.temp + '°C';

      // Update observation log with in-place animation
      if (logEl && log) {
        var logCls = log.success ? "success" : (log.warn ? "warn" : "info");
        var logIcon = log.success ? cIco("check") : (log.warn ? cIco("alert") : cIco("bulb"));
        logEl.className = "chemlab-log-box " + logCls;
        logEl.innerHTML = '<div class="log-head">' + logIcon + ' <b>' + log.title + '</b></div>' +
          '<div class="log-body">' + log.text + '</div>' +
          (log.rxn ? '<div class="log-rxn"><b>Phương trình & Cơ chế:</b> <code>' + log.rxn + '</code></div>' : '');

        if (window.gsap) {
          gsap.fromTo(logEl, { opacity: 0.4, y: 6 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" });
        }
      }
    },

    // In-Place Smooth Tool Execution (Heat, Overheat, Shake, Reset)
    triggerTool: function (chId, stageIdx, actionId) {
      var sc = this.getLab(chId, stageIdx);
      if (!sc) return;

      if (actionId === "reset") {
        this.resetLab(chId, stageIdx);
        var card = document.getElementById("chemlab-" + chId + "-" + stageIdx);
        if (card) {
          var temp = document.createElement("div");
          temp.innerHTML = this.renderWidget(chId, stageIdx);
          card.replaceWith(temp.firstElementChild);
        }
        return;
      }

      var st = this.getOrCreateState(chId, stageIdx);
      var log = sc.processAction(st, actionId, sc);
      if (log) st.log = log;

      var tubeEl = document.getElementById("tube-" + chId + "-" + stageIdx);
      var liquidEl = document.getElementById("liquid-" + chId + "-" + stageIdx);
      var logEl = document.getElementById("log-" + chId + "-" + stageIdx);
      var pillTemp = document.getElementById("pill-temp-" + chId + "-" + stageIdx);
      var precipEl = document.getElementById("precip-" + chId + "-" + stageIdx);
      var stoichPill = document.getElementById("stoich-pill-" + chId + "-" + stageIdx);
      var stoichDesc = document.getElementById("stoich-desc-" + chId + "-" + stageIdx);

      // Update Stoichiometric Status Banner
      if (sc.calcStoich && stoichPill && stoichDesc) {
        var sData = sc.calcStoich(st, sc);
        stoichPill.className = "stoich-pill " + sData.pillCls;
        stoichPill.textContent = sData.pillText;
        stoichDesc.textContent = sData.desc;
      }

      // Tool Animations
      if (window.gsap && tubeEl) {
        if (actionId === "shake") {
          gsap.timeline()
            .to(tubeEl, { rotation: 12, duration: 0.1, ease: "power1.inOut" })
            .to(tubeEl, { rotation: -12, duration: 0.12, ease: "power1.inOut" })
            .to(tubeEl, { rotation: 8, duration: 0.12, ease: "power1.inOut" })
            .to(tubeEl, { rotation: -6, duration: 0.14, ease: "power1.inOut" })
            .to(tubeEl, { rotation: 0, duration: 0.45, ease: "elastic.out(1.2, 0.25)" });

          var waveWrap = tubeEl.querySelector(".liquid-wave-wrap");
          if (waveWrap) {
            gsap.timeline()
              .to(waveWrap, { scaleY: 2.8, rotation: -16, duration: 0.1 })
              .to(waveWrap, { scaleY: 2.8, rotation: 16, duration: 0.12 })
              .to(waveWrap, { scaleY: 1.8, rotation: -10, duration: 0.14 })
              .to(waveWrap, { scaleY: 1, rotation: 0, duration: 0.6, ease: "elastic.out(1.1, 0.25)" });
          }
        } else if (actionId === "heat" || actionId === "overheat") {
          var glowColor = actionId === "overheat" ? "rgba(185, 28, 28, 0.95)" : "rgba(239, 68, 68, 0.85)";
          gsap.fromTo(tubeEl, 
            { filter: "drop-shadow(0 0 20px " + glowColor + ")" }, 
            { filter: "drop-shadow(0 0 0 rgba(0,0,0,0))", duration: 1.5, ease: "power2.out" }
          );

          if (st.mirror) {
            tubeEl.classList.add("mirror-on");
            gsap.fromTo(tubeEl, { filter: "brightness(1.5)" }, { filter: "brightness(1)", duration: 0.8 });
          }

          if (st.precipitate && precipEl) {
            precipEl.style.display = "block";
            precipEl.style.backgroundColor = st.precipitate.color || "#ffffff";
            precipEl.title = st.precipitate.name || "Kết tủa";
          }
        }
      }

      if (liquidEl) {
        if (window.gsap) {
          gsap.to(liquidEl, { backgroundColor: st.color, duration: 0.8 });
        } else {
          liquidEl.style.backgroundColor = st.color;
        }
      }

      if (pillTemp) {
        pillTemp.innerHTML = cIco("temp") + ' ' + st.temp + '°C';
        if (window.gsap) gsap.fromTo(pillTemp, { scale: 1.25 }, { scale: 1, duration: 0.3 });
      }

      if (logEl && log) {
        var logCls = log.success ? "success" : (log.warn ? "warn" : "info");
        var logIcon = log.success ? cIco("check") : (log.warn ? cIco("alert") : cIco("bulb"));
        logEl.className = "chemlab-log-box " + logCls;
        logEl.innerHTML = '<div class="log-head">' + logIcon + ' <b>' + log.title + '</b></div>' +
          '<div class="log-body">' + log.text + '</div>' +
          (log.rxn ? '<div class="log-rxn"><b>Phương trình & Cơ chế:</b> <code>' + log.rxn + '</code></div>' : '');

        if (window.gsap) {
          gsap.fromTo(logEl, { opacity: 0.4, y: 6 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" });
        }
      }
    },

    // Clean, Publication-Quality ACS 2D Canvas Fallback (Zero Watermark Grids, Crisp Retina 2x)
    renderFallback2D: function (sub, canvas) {
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      var w = 440;
      var h = 260;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.scale(dpr, dpr);

      // Clean Canvas Background (No grid watermarks!)
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);

      // Title & Formula
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(sub.name, w / 2, 28);

      ctx.fillStyle = "#0284c7";
      ctx.font = "600 13px monospace";
      ctx.fillText(sub.formula, w / 2, 48);

      // Clean, elegant ACS bonds
      ctx.lineWidth = 2.4;
      ctx.strokeStyle = "#1e293b";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      var key = sub.key || "";
      var smiles = sub.smiles || "";

      if (key === "ethyl_acetate" || smiles.includes("CCOC(=O)C")) {
        // Ethyl acetate: CH3 - C(=O) - O - CH2 - CH3
        var cx = w / 2 - 30, cy = h / 2 + 15;
        ctx.beginPath();
        ctx.moveTo(cx - 75, cy); ctx.lineTo(cx - 20, cy);
        ctx.lineTo(cx + 35, cy);
        ctx.lineTo(cx + 85, cy - 26);
        ctx.lineTo(cx + 135, cy);
        ctx.stroke();

        // C=O double bond
        ctx.beginPath();
        ctx.moveTo(cx - 24, cy); ctx.lineTo(cx - 24, cy - 48);
        ctx.moveTo(cx - 16, cy); ctx.lineTo(cx - 16, cy - 48);
        ctx.stroke();

        // Clean Labels
        ctx.fillStyle = "#dc2626";
        ctx.font = "bold 15px sans-serif";
        ctx.fillText("=O", cx - 20, cy - 54);
        ctx.fillText("O", cx + 35, cy + 5);

        ctx.fillStyle = "#0f172a";
        ctx.fillText("H₃C", cx - 92, cy + 5);
        ctx.fillText("CH₂", cx + 85, cy - 32);
        ctx.fillText("CH₃", cx + 152, cy + 5);

      } else if (key === "aniline" || smiles.includes("c1ccccc1N")) {
        // Aniline: Benzene ring + NH2
        var cx = w / 2, cy = h / 2 + 18, r = 42;
        ctx.beginPath();
        for (var a = 0; a < 6; a++) {
          var ang = (a * 60 - 90) * Math.PI / 180;
          var px = cx + r * Math.cos(ang), py = cy + r * Math.sin(ang);
          if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        // Aromatic Circle
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.58, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(30, 41, 59, 0.75)";
        ctx.stroke();

        // Bond to NH2
        ctx.beginPath();
        ctx.moveTo(cx, cy - r);
        ctx.lineTo(cx, cy - r - 32);
        ctx.stroke();

        ctx.fillStyle = "#2563eb";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText("NH₂", cx, cy - r - 38);

      } else if (key === "glucose" || smiles.includes("OC[C@@H]1OC")) {
        // Haworth projection of beta-D-glucopyranose
        var cx = w / 2, cy = h / 2 + 15;
        ctx.beginPath();
        ctx.moveTo(cx - 65, cy);
        ctx.lineTo(cx - 32, cy - 32);
        ctx.lineTo(cx + 32, cy - 32);
        ctx.lineTo(cx + 65, cy);
        ctx.lineTo(cx + 32, cy + 32);
        ctx.lineTo(cx - 32, cy + 32);
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(cx + 22, cy - 39, 20, 14);
        ctx.fillStyle = "#dc2626";
        ctx.font = "bold 14px sans-serif";
        ctx.fillText("O", cx + 32, cy - 28);

        ctx.fillStyle = "#dc2626";
        ctx.font = "bold 12px sans-serif";
        ctx.fillText("CH₂OH", cx - 42, cy - 44);
        ctx.fillText("OH", cx - 80, cy + 5);
        ctx.fillText("OH", cx - 32, cy + 48);
        ctx.fillText("OH", cx + 32, cy + 48);
        ctx.fillText("OH (hemiacetal)", cx + 80, cy + 5);

      } else {
        // Generic representation
        ctx.fillStyle = "#334155";
        ctx.font = "14px monospace";
        ctx.fillText("SMILES: " + sub.smiles, w / 2, h / 2 - 10);
        ctx.fillStyle = "#64748b";
        ctx.font = "12px sans-serif";
        ctx.fillText(sub.desc, w / 2, h / 2 + 20);
      }
    },

    // Show Molecule 2D / 3D Modal
    showMoleculeModal: function (chId, stageIdx, mode) {
      var sc = this.getLab(chId, stageIdx);
      if (!sc || !sc.substrate) return;
      var sub = sc.substrate;

      var oldModal = document.getElementById("chemlab-mol-modal");
      if (oldModal) oldModal.remove();

      var modal = document.createElement("div");
      modal.id = "chemlab-mol-modal";
      modal.className = "chemlab-modal-overlay";
      modal.innerHTML = '<div class="chemlab-modal-card" style="max-width:580px">' +
        '<div class="modal-header">' +
          '<div>' +
            '<h3 style="margin:0;font-size:1.15rem;display:flex;align-items:center;gap:8px">' +
              (mode === "3d" ? cIco("atom") + ' Mô hình phân tử 3D WebGL (Toàn quyền điều khiển)' : cIco("eye") + ' Cấu tạo phân tử 2D (Vector SVG sắc nét)') +
            '</h3>' +
            '<p class="muted small" style="margin:4px 0 0">Chất: <b>' + sub.name + '</b> · <code>' + sub.formula + '</code></p>' +
          '</div>' +
          '<button class="btn ghost tiny modal-close-btn" data-act="closeMolModal" title="Đóng cửa sổ">' + cIco("close") + '</button>' +
        '</div>' +
        '<div class="modal-body" style="padding-top:10px">' +
          (mode === "3d" 
            ? '<div style="position:relative;width:100%;height:360px;border-radius:14px;overflow:hidden;background:#0f172a">' +
                // 3D Control HUD Toolbar
                '<div class="mol-3d-hud">' +
                  '<div class="hud-btn-group">' +
                    '<button class="hud-btn" id="hud-spin-btn" title="Bật/Tắt xoay tự động">' + cIco("play") + ' <span>Xoay</span></button>' +
                    '<button class="hud-btn" id="hud-zoomin-btn" title="Phóng to (+)">' + cIco("zoomIn") + '</button>' +
                    '<button class="hud-btn" id="hud-zoomout-btn" title="Thu nhỏ (-)">' + cIco("zoomOut") + '</button>' +
                    '<button class="hud-btn" id="hud-center-btn" title="Căn giữa">' + cIco("center") + '</button>' +
                  '</div>' +
                  '<div class="hud-btn-group">' +
                    '<button class="hud-btn" id="hud-style-btn" title="Đổi kiểu hiển thị: Bi & Que / Khối đặc / Khung">' + cIco("layers") + ' <span id="hud-style-text">Bi-Que</span></button>' +
                  '</div>' +
                '</div>' +
                '<div id="mol-3d-viewer" style="width:100%;height:100%;cursor:grab"></div>' +
              '</div>' +
              '<p class="muted small" style="text-align:center;margin-top:8px">' +
                '<b>Thao tác:</b> Kéo chuột trái để xoay tự do 360° · Cuộn chuột để phóng to/thu nhỏ · Chạm vuốt trên di động' +
              '</p>'
            : '<div class="mol-2d-viewbox">' +
                '<div class="mol-2d-svg-container" id="mol-2d-svg-target">' +
                  '<canvas id="mol-2d-canvas"></canvas>' +
                '</div>' +
                '<div class="mol-pills-row">' +
                  '<span class="mol-pill-tag">' + cIco("tag") + ' Nhóm chức hoạt động</span>' +
                  '<span class="mol-pill-tag">' + cIco("atom") + ' ' + sub.formula + '</span>' +
                '</div>' +
              '</div>' +
              '<p class="muted small" style="text-align:center;margin-top:8px">Cấu trúc hóa học 2D hiển thị sắc nét chuẩn ấn phẩm khoa học</p>'
          ) +
        '</div>' +
      '</div>';

      document.body.appendChild(modal);

      // Render 2D Vector SVG / Canvas
      if (mode === "2d") {
        var svgTarget = document.getElementById("mol-2d-svg-target");
        var canvas = document.getElementById("mol-2d-canvas");
        var drawnSvg = false;

        if (svgTarget && root.SmilesDrawer && typeof root.SmilesDrawer.parse === "function") {
          try {
            var SvgDrawerClass = root.SmilesDrawer.SvgDrawer;
            if (SvgDrawerClass) {
              var svgDrawer = new SvgDrawerClass({ width: 440, height: 260, bondThickness: 1.8, fontSizeLarge: 14 });
              root.SmilesDrawer.parse(sub.smiles, function (tree) {
                var svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svgEl.setAttribute("viewBox", "0 0 440 260");
                svgEl.style.width = "100%";
                svgEl.style.height = "100%";
                svgDrawer.draw(tree, svgEl, "light", false);
                svgTarget.innerHTML = "";
                svgTarget.appendChild(svgEl);
                drawnSvg = true;
              }, function (err) {
                console.warn("SmilesDrawer SVG parse error:", err);
              });
            }
          } catch (e) {
            console.warn("SmilesDrawer SvgDrawer execution exception:", e);
          }
        }

        // If SVG drawing wasn't achieved, use our clean ACS Retina Canvas (zero grid watermark lines)
        if (!drawnSvg && canvas) {
          ChemLab.renderFallback2D(sub, canvas);
        }
      }

      // Render 3D with 3Dmol.js & Full Interactive Control
      if (mode === "3d") {
        var viewerEl = document.getElementById("mol-3d-viewer");
        if (root.$3Dmol && viewerEl) {
          try {
            var viewer = root.$3Dmol.createViewer(viewerEl, { backgroundColor: "0x0f172a" });
            var isSpinning = false;
            var currentStyleIndex = 0;
            var styleList = [
              { name: "Bi-Que", style: { stick: { radius: 0.16 }, sphere: { scale: 0.3 } } },
              { name: "Khối CPK", style: { sphere: { scale: 0.85 } } },
              { name: "Khung Que", style: { stick: { radius: 0.22 } } }
            ];

            function applyViewerStyle() {
              var s = styleList[currentStyleIndex];
              viewer.setStyle({}, s.style);
              viewer.render();
              var styleLabel = document.getElementById("hud-style-text");
              if (styleLabel) styleLabel.textContent = s.name;
            }

            function loadModelData(dataStr, format) {
              viewer.clear();
              viewer.addModel(dataStr, format);
              applyViewerStyle();
              viewer.zoomTo();
              viewer.render();
            }

            // Attempt PubChem Download with 1.2s fallback timeout to embedded offline XYZ data
            var modelLoaded = false;
            var subKey = sub.key || "ethyl_acetate";
            var offlineXyz = MOL_3D_DATA[subKey] || MOL_3D_DATA.ethyl_acetate;

            if (sub.cid && navigator.onLine) {
              var downloadTimer = setTimeout(function () {
                if (!modelLoaded && offlineXyz) {
                  loadModelData(offlineXyz, "xyz");
                  modelLoaded = true;
                }
              }, 1200);

              root.$3Dmol.download("cid:" + sub.cid, viewer, {}, function () {
                clearTimeout(downloadTimer);
                if (!modelLoaded) {
                  modelLoaded = true;
                  applyViewerStyle();
                  viewer.zoomTo();
                  viewer.render();
                }
              });
            } else {
              if (offlineXyz) {
                loadModelData(offlineXyz, "xyz");
                modelLoaded = true;
              }
            }

            // HUD Toolbar Events
            var spinBtn = document.getElementById("hud-spin-btn");
            var zoomInBtn = document.getElementById("hud-zoomin-btn");
            var zoomOutBtn = document.getElementById("hud-zoomout-btn");
            var centerBtn = document.getElementById("hud-center-btn");
            var styleBtn = document.getElementById("hud-style-btn");

            function setSpinState(active) {
              isSpinning = active;
              viewer.spin(active);
              if (spinBtn) {
                spinBtn.innerHTML = (active ? cIco("pause") : cIco("play")) + ' <span>' + (active ? 'Dừng' : 'Xoay') + '</span>';
                if (active) spinBtn.classList.add("active"); else spinBtn.classList.remove("active");
              }
            }

            if (spinBtn) {
              spinBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                setSpinState(!isSpinning);
              });
            }

            if (zoomInBtn) {
              zoomInBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                viewer.zoom(1.22);
                viewer.render();
              });
            }

            if (zoomOutBtn) {
              zoomOutBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                viewer.zoom(0.82);
                viewer.render();
              });
            }

            if (centerBtn) {
              centerBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                viewer.zoomTo();
                viewer.render();
              });
            }

            if (styleBtn) {
              styleBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                currentStyleIndex = (currentStyleIndex + 1) % styleList.length;
                applyViewerStyle();
              });
            }

            // Direct Tactile Mouse Interaction on Viewer Canvas (Pause Spin on touch/drag, Rotate freely)
            var isDragging = false;
            var startX = 0, startY = 0;

            viewerEl.addEventListener("mousedown", function (e) {
              isDragging = true;
              startX = e.clientX;
              startY = e.clientY;
              viewerEl.style.cursor = "grabbing";
              if (isSpinning) setSpinState(false);
            });

            window.addEventListener("mousemove", function (e) {
              if (!isDragging) return;
              var dx = e.clientX - startX;
              var dy = e.clientY - startY;
              startX = e.clientX;
              startY = e.clientY;

              viewer.rotate(dx * 0.75, [0, 1, 0]);
              viewer.rotate(dy * 0.75, [1, 0, 0]);
              viewer.render();
            });

            window.addEventListener("mouseup", function () {
              if (isDragging) {
                isDragging = false;
                viewerEl.style.cursor = "grab";
              }
            });

            // Mouse Wheel Zoom
            viewerEl.addEventListener("wheel", function (e) {
              e.preventDefault();
              var factor = e.deltaY < 0 ? 1.08 : 0.92;
              viewer.zoom(factor);
              viewer.render();
            }, { passive: false });

            // Mobile Touch Support
            var touchStartX = 0, touchStartY = 0;
            var initialPinchDist = 0;

            viewerEl.addEventListener("touchstart", function (e) {
              if (isSpinning) setSpinState(false);
              if (e.touches.length === 1) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
              } else if (e.touches.length === 2) {
                var tx1 = e.touches[0].clientX, ty1 = e.touches[0].clientY;
                var tx2 = e.touches[1].clientX, ty2 = e.touches[1].clientY;
                initialPinchDist = Math.hypot(tx2 - tx1, ty2 - ty1);
              }
            }, { passive: true });

            viewerEl.addEventListener("touchmove", function (e) {
              if (e.touches.length === 1) {
                var dx = e.touches[0].clientX - touchStartX;
                var dy = e.touches[0].clientY - touchStartY;
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                viewer.rotate(dx * 0.8, [0, 1, 0]);
                viewer.rotate(dy * 0.8, [1, 0, 0]);
                viewer.render();
              } else if (e.touches.length === 2 && initialPinchDist > 0) {
                var tx1 = e.touches[0].clientX, ty1 = e.touches[0].clientY;
                var tx2 = e.touches[1].clientX, ty2 = e.touches[1].clientY;
                var dist = Math.hypot(tx2 - tx1, ty2 - ty1);
                var pinchFactor = dist / initialPinchDist;
                initialPinchDist = dist;
                viewer.zoom(pinchFactor);
                viewer.render();
              }
            }, { passive: true });

          } catch (e) {
            console.error("3Dmol render error:", e);
          }
        }
      }
    }
  };

  // Delegated Global Event Listeners for ChemLab
  document.addEventListener("click", function (ev) {
    var target = ev.target;

    // Substrate switch button click
    var switchBtn = target.closest ? target.closest("[data-chemlab-switch]") : null;
    if (switchBtn) {
      ev.preventDefault();
      var subKey = switchBtn.getAttribute("data-chemlab-switch");
      var ch0 = switchBtn.getAttribute("data-ch");
      var idx0 = parseInt(switchBtn.getAttribute("data-idx"), 10);
      ChemLab.switchSubstrate(ch0, idx0, subKey);
      return;
    }

    // Reagent addition click
    var btn = target.closest ? target.closest("[data-chemlab-act]") : null;
    if (btn) {
      var act = btn.getAttribute("data-chemlab-act");
      var ch = btn.getAttribute("data-ch");
      var idx = parseInt(btn.getAttribute("data-idx"), 10);
      if (act === "reagent") {
        ev.preventDefault();
        var rid = btn.getAttribute("data-rid");
        ChemLab.triggerReagent(ch, idx, rid);
        return;
      } else if (act === "tool") {
        ev.preventDefault();
        var aid = btn.getAttribute("data-aid");
        ChemLab.triggerTool(ch, idx, aid);
        return;
      }
    }

    // Molecule Modal triggers
    var molBtn = target.closest ? target.closest("[data-chemlab-mol]") : null;
    if (molBtn) {
      ev.preventDefault();
      var mode = molBtn.getAttribute("data-chemlab-mol");
      var ch2 = molBtn.getAttribute("data-ch");
      var idx2 = parseInt(molBtn.getAttribute("data-idx"), 10);
      ChemLab.showMoleculeModal(ch2, idx2, mode);
      return;
    }

    // Close modal
    var closeBtn = target.closest ? target.closest("[data-act='closeMolModal']") : null;
    if (closeBtn || target.classList.contains("chemlab-modal-overlay")) {
      var modal = document.getElementById("chemlab-mol-modal");
      if (modal) modal.remove();
    }
  });

  // Drag & Drop Tactile Event Listeners
  document.addEventListener("dragstart", function (ev) {
    var card = ev.target.closest ? ev.target.closest(".chemlab-reagent-card") : null;
    if (card) {
      var ch = card.getAttribute("data-ch");
      var idx = card.getAttribute("data-idx");
      var rid = card.getAttribute("data-rid");
      ev.dataTransfer.setData("text/plain", JSON.stringify({ ch: ch, idx: idx, rid: rid }));
      card.classList.add("dragging");
    }
  });

  document.addEventListener("dragend", function (ev) {
    var card = ev.target.closest ? ev.target.closest(".chemlab-reagent-card") : null;
    if (card) card.classList.remove("dragging");
  });

  document.addEventListener("dragover", function (ev) {
    var stage = ev.target.closest ? ev.target.closest("[data-chemlab-dropzone='tube']") : null;
    if (stage) {
      ev.preventDefault();
      stage.classList.add("drag-over");
    }
  });

  document.addEventListener("dragleave", function (ev) {
    var stage = ev.target.closest ? ev.target.closest("[data-chemlab-dropzone='tube']") : null;
    if (stage) {
      stage.classList.remove("drag-over");
    }
  });

  document.addEventListener("drop", function (ev) {
    var stage = ev.target.closest ? ev.target.closest("[data-chemlab-dropzone='tube']") : null;
    if (stage) {
      ev.preventDefault();
      stage.classList.remove("drag-over");
      try {
        var data = JSON.parse(ev.dataTransfer.getData("text/plain"));
        if (data && data.ch && data.rid) {
          ChemLab.triggerReagent(data.ch, parseInt(data.idx, 10), data.rid);
        }
      } catch (err) {
        console.warn("Drop parse error:", err);
      }
    }
  });

  // Export
  root.ChemLab = ChemLab;
  root.cIco = cIco;
})(window);
