/* ═══════════════════════════════════════════════════════════════════
   CHEMLAB ENGINE & INTERACTIVE VIRTUAL LABORATORY (V2 - FLUID MOTION)
   Features:
   - Precision Vector SVG Icons (No default/raw emojis)
   - Real-time Fluid Liquid Wave & Meniscus Tweening with GSAP
   - Organic Dropper Pipette & Impact Splash Animation
   - Drag & Drop Reagents directly into Test Tube
   - In-place Animated DOM Updates (Zero jarring reloads)
   - Robust 2D Molecular Structure Visualizer (SmilesDrawer + Canvas Fallback)
   - Interactive 3D WebGL Molecular Rotation (3Dmol.js)
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
    temp: '<path d="M14 4a2 2 0 0 0-4 0v9.17a4 4 0 1 0 4 0V4z"/><circle cx="12" cy="17" r="1.5"/>'
  };

  function cIco(n) {
    var svg = CHEMICONS[n] || (root.ICONS && root.ICONS[n]) || CHEMICONS.info;
    return '<svg class="ico chemlab-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + svg + '</svg>';
  }

  var ChemLab = {
    activeStates: {},

    scenarios: {
      // 1. CHƯƠNG 1 - CHẶNG 3: ĐIỀU CHẾ ETHYL ACETATE & TÁCH LỚP
      "g12c1_2": {
        id: "ethyl_acetate_prep",
        title: "Phòng thí nghiệm ảo: Điều chế Ethyl Acetate & Tách lớp este",
        subtitle: "Thao tác: Nhỏ H₂SO₄ đặc → Đun cách thuỷ ở 68°C → Rót vào dung dịch NaCl bão hoà để quan sát lớp este tách ra.",
        substrate: {
          name: "Hỗn hợp: C₂H₅OH (2 mL) + CH₃COOH (2 mL)",
          smiles: "CCOC(=O)C",
          cid: 8857,
          formula: "CH₃COOC₂H₅ (M = 88)",
          desc: "Hỗn hợp ban đầu gồm ethanol và acetic acid băng, là chất lỏng không màu, đồng nhất."
        },
        initial: {
          volume: 32,
          color: "rgba(224, 242, 254, 0.45)",
          temp: 25,
          clarity: "clear",
          separated: false,
          layerTopColor: "rgba(250, 204, 21, 0.8)",
          precipitate: false,
          bubbles: false,
          mirror: false,
          h2so4Added: false,
          heated: false,
          naclAdded: false
        },
        reagents: [
          { id: "h2so4", name: "H₂SO₄ đặc (xúc tác)", color: "#eab308", dropColor: "#facc15", desc: "Xúc tác tăng tốc & hút nước chuyển dịch cân bằng" },
          { id: "nacl_sat", name: "Dung dịch NaCl bão hoà", color: "#38bdf8", dropColor: "#38bdf8", desc: "Tăng tỉ trọng & giảm độ tan este (salting-out)" },
          { id: "water", name: "Nước cất (H₂O)", color: "#0284c7", dropColor: "#0ea5e9", desc: "Thử đối chứng (este tan 1 phần trong nước)" }
        ],
        actions: [
          { id: "heat", name: "Đun cách thuỷ (68°C)", icon: "flame" },
          { id: "shake", name: "Lắc nhẹ ống nghiệm", icon: "refresh" },
          { id: "reset", name: "Làm mới ống nghiệm", icon: "trash" }
        ],
        processAction: function (state, actionId) {
          if (actionId === "reset") return null;
          var log = null;
          if (actionId === "heat") {
            if (!state.h2so4Added) {
              log = {
                warn: true,
                title: "Chưa có xúc tác H₂SO₄ đặc!",
                text: "Phản ứng este hoá không có xúc tác acid vô cơ đặc xảy ra vô cùng chậm chạp, hiệu suất không đáng kể.",
                rxn: "CH₃COOH + C₂H₅OH ⇌ (quá chậm nếu thiếu H⁺)"
              };
            } else {
              state.temp = 68;
              state.heated = true;
              state.bubbles = true;
              log = {
                success: true,
                title: "Đun cách thuỷ ở 68°C thành công!",
                text: "Hỗn hợp sôi lăn tăn êm dịu, este ethyl acetate được tạo thành cùng với nước. Hơi cồn và este bay lên ống thuỷ tinh ngưng tụ hồi lưu lại ống nghiệm.",
                rxn: "CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ (ethyl acetate) + H₂O (H₂SO₄ đặc, 68°C)"
              };
            }
          } else if (actionId === "shake") {
            log = { info: true, title: "Lắc đều ống nghiệm", text: "Các chất phản ứng tiếp xúc tối đa với nhau.", rxn: null };
          }
          return log;
        },
        processReagent: function (state, reagentId) {
          var log = null;
          state.volume = Math.min(state.volume + 8, 85);
          if (reagentId === "h2so4") {
            state.h2so4Added = true;
            state.color = "rgba(254, 240, 138, 0.55)";
            state.temp = 35;
            log = {
              success: true,
              title: "Đã thêm vài giọt H₂SO₄ đặc",
              text: "Ống nghiệm ấm nhẹ lên do H₂SO₄ đặc tỏa nhiệt khi hydrat hóa. Axit đóng vai trò xúc tác tạo ion H⁺ và hút nước.",
              rxn: "H₂SO₄ đặc: Xúc tác + Hút nước chuyển dịch cân bằng sang phải."
            };
          } else if (reagentId === "nacl_sat") {
            state.naclAdded = true;
            if (state.heated && state.h2so4Added) {
              state.separated = true;
              state.color = "rgba(224, 242, 254, 0.6)";
              log = {
                success: true,
                title: "HIỆN TƯỢNG KỲ DIỆU: Este tách lớp váng dầu nổi lên trên!",
                text: "Do dung dịch NaCl bão hòa có khối lượng riêng lớn và ethyl acetate hầu như không tan trong nước muối (hiệu ứng salting-out), este tách thành một lớp dầu màu vàng nhạt nổi rõ rệt lên trên bề mặt, tỏa mùi thơm chuối chín / táo thơm phức!",
                rxn: "Este nhẹ hơn nước (d ≈ 0.9 g/mL) và không tan trong NaCl bão hoà → Tách 2 lớp hoàn toàn."
              };
            } else {
              log = { info: true, title: "Đã thêm NaCl bão hòa", text: "Dung dịch chưa đun tạo este nên chưa quan sát thấy lớp este tách ra.", rxn: null };
            }
          } else if (reagentId === "water") {
            if (state.heated && state.h2so4Added) {
              log = {
                warn: true,
                title: "Thêm nước cất: Este tách lớp kém rõ rệt",
                text: "Ethyl acetate tan một phần trong nước cất thường (khoảng 8g/100mL), do đó không tạo được ranh giới 2 lớp sắc nét như khi dùng dung dịch NaCl bão hòa!",
                rxn: "Bài học: Bắt buộc dùng NaCl bão hòa để thu hồi tối đa este!"
              };
            } else {
              log = { info: true, title: "Đã thêm nước cất", text: "Dung dịch bị pha loãng.", rxn: null };
            }
          }
          return log;
        }
      },

      // 2. CHƯƠNG 2 - CHẶNG 2: PHẢN ỨNG TRÁNG BẠC GLUCOSE
      "g12c2_1": {
        id: "glucose_tollens_lab",
        title: "Phòng thí nghiệm ảo: Phản ứng Tráng gương của Glucose & Phân biệt Fructose",
        subtitle: "Thao tác: Nhỏ thuốc thử Tollens [Ag(NH₃)₂]OH → Bấm đun nóng nhẹ để quan sát lớp bạc sáng bóng tráng kín thành ống!",
        substrate: {
          name: "Dung dịch Glucose (C₆H₁₂O₆) 5%",
          smiles: "OC[C@@H]1OC(O)[C@H](O)[C@@H](O)[C@@H]1O",
          cid: 5793,
          formula: "CH₂OH-[CHOH]₄-CHO (M = 180)",
          desc: "Dung dịch đường nho không màu, chứa đồng thời 5 nhóm -OH kề nhau và 1 nhóm aldehyde -CHO."
        },
        initial: {
          volume: 30,
          color: "rgba(240, 249, 255, 0.45)",
          temp: 25,
          clarity: "clear",
          precipitate: false,
          bubbles: false,
          mirror: false,
          tollensAdded: false,
          br2Added: false,
          cuoh2Added: false,
          heated: false
        },
        reagents: [
          { id: "tollens", name: "Thuốc thử Tollens [Ag(NH₃)₂]OH", color: "#94a3b8", dropColor: "#cbd5e1", desc: "Phức bạc trong môi trường kiềm NH₃" },
          { id: "br2", name: "Nước Bromine (Br₂)", color: "#ea580c", dropColor: "#ea580c", desc: "Dung dịch màu vàng nâu (thuốc thử phân biệt fructose)" },
          { id: "cuoh2", name: "Cu(OH)₂ trong kiềm", color: "#0284c7", dropColor: "#0284c7", desc: "Tạo phức xanh lam, đun nóng ra kết tủa đỏ gạch Cu₂O" }
        ],
        actions: [
          { id: "heat", name: "Đun nóng nhẹ (65°C)", icon: "flame" },
          { id: "shake", name: "Lắc đều ống nghiệm", icon: "refresh" },
          { id: "reset", name: "Làm mới ống nghiệm", icon: "trash" }
        ],
        processAction: function (state, actionId) {
          if (actionId === "reset") return null;
          var log = null;
          if (actionId === "heat") {
            state.temp = 65;
            state.heated = true;
            if (state.tollensAdded) {
              state.mirror = true;
              state.color = "rgba(148, 163, 184, 0.4)";
              log = {
                success: true,
                title: "HIỆN TƯỢNG TRÁNG GƯƠNG NGOẠN MỤC!",
                text: "Dưới tác dụng nhiệt, nhóm aldehyde -CHO của glucose khử ion phức [Ag(NH₃)₂]⁺ thành kim loại Bạc (Ag). Bạc kim loại kết tủa bám dính cực kỳ mịn màng tạo thành một chiếc gương soi sáng bóng như kim loại trên thành ống nghiệm!",
                rxn: "CH₂OH[CHOH]₄CHO + 2[Ag(NH₃)₂]OH → CH₂OH[CHOH]₄COONH₄ + 2Ag↓ (gương bạc) + 3NH₃ + H₂O"
              };
            } else if (state.cuoh2Added) {
              state.precipitate = { color: "#dc2626", name: "Cu₂O đỏ gạch" };
              state.color = "rgba(239, 68, 68, 0.35)";
              log = {
                success: true,
                title: "Xuất hiện kết tủa đỏ gạch Cu₂O!",
                text: "Khi đun nóng với Cu(OH)₂ trong kiềm, nhóm -CHO bị oxi hóa tạo kết tủa đồng(I) oxide Cu₂O màu đỏ gạch.",
                rxn: "C₆H₁₂O₆ + 2Cu(OH)₂ + NaOH → Muối + Cu₂O↓ (đỏ gạch) + 3H₂O"
              };
            } else {
              log = { info: true, title: "Đã đun nóng", text: "Nhiệt độ dung dịch đạt 65°C. Cần cho thuốc thử Tollens vào để phản ứng xảy ra.", rxn: null };
            }
          } else if (actionId === "shake") {
            log = { info: true, title: "Lắc nhẹ", text: "Trộn đều dung dịch trong ống nghiệm.", rxn: null };
          }
          return log;
        },
        processReagent: function (state, reagentId) {
          var log = null;
          state.volume = Math.min(state.volume + 8, 85);
          if (reagentId === "tollens") {
            state.tollensAdded = true;
            state.color = "rgba(203, 213, 225, 0.55)";
            log = {
              info: true,
              title: "Đã thêm thuốc thử Tollens [Ag(NH₃)₂]OH",
              text: "Ở nhiệt độ phòng, phản ứng diễn ra rất chậm. Hãy bấm nút 'Đun nóng nhẹ' để kích hoạt phản ứng tráng gương bạc!",
              rxn: "Chưa đun nóng: Dung dịch vẫn trong suốt không màu."
            };
          } else if (reagentId === "br2") {
            state.br2Added = true;
            state.color = "rgba(240, 253, 250, 0.35)";
            log = {
              success: true,
              title: "NƯỚC BROMINE BỊ MẤT MÀU HOÀN TOÀN!",
              text: "Màu vàng nâu của nước Br₂ lập tức biến mất do nhóm -CHO của glucose bị oxi hóa thành acid gluconic. Đây là thuốc thử duy nhất phân biệt Glucose với Fructose (Fructose không làm mất màu nước Br₂ vì môi trường không kiềm)!",
              rxn: "CH₂OH[CHOH]₄CHO + Br₂ + H₂O → CH₂OH[CHOH]₄COOH (gluconic acid) + 2HBr"
            };
          } else if (reagentId === "cuoh2") {
            state.cuoh2Added = true;
            state.color = "rgba(14, 165, 233, 0.78)";
            log = {
              success: true,
              title: "Tạo dung dịch phức đồng màu xanh lam thẫm!",
              text: "Do có 5 nhóm -OH liền kề nhau, glucose hòa tan kết tủa Cu(OH)₂ ngay ở nhiệt độ thường tạo phức đồng xanh lam thẫm đặc trưng của polyalcohol.",
              rxn: "2C₆H₁₂O₆ + Cu(OH)₂ → [C₆H₁₁O₆]₂Cu (dung dịch xanh lam thẫm) + 2H₂O"
            };
          }
          return log;
        }
      },

      // 3. CHƯƠNG 2 - CHẶNG 4: HỒ TINH BỘT + IODINE
      "g12c2_3": {
        id: "starch_iodine_lab",
        title: "Phòng thí nghiệm ảo: Phản ứng màu Hồ tinh bột + Iodine (Đun nóng & Để nguội)",
        subtitle: "Thao tác: Nhỏ dung dịch Iodine (I₂) → Xuất hiện màu xanh tím → Bấm đun nóng để màu biến mất → Để nguội màu hiện lại!",
        substrate: {
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
          iodineAdded: false,
          heated: false
        },
        reagents: [
          { id: "iodine", name: "Dung dịch Iodine (I₂)", color: "#78350f", dropColor: "#9a3412", desc: "Dung dịch iot màu vàng nâu nhạt" },
          { id: "water", name: "Nước cất (pha loãng)", color: "#0284c7", dropColor: "#38bdf8", desc: "Nước tinh khiết" }
        ],
        actions: [
          { id: "heat", name: "Đun nóng ống nghiệm (80°C)", icon: "flame" },
          { id: "cool", name: "Để nguội ống nghiệm (25°C)", icon: "snow" },
          { id: "reset", name: "Làm mới ống nghiệm", icon: "trash" }
        ],
        processAction: function (state, actionId) {
          if (actionId === "reset") return null;
          var log = null;
          if (actionId === "heat") {
            state.temp = 80;
            state.heated = true;
            if (state.iodineAdded) {
              state.color = "rgba(241, 245, 249, 0.4)";
              log = {
                success: true,
                title: "MÀU XANH TÍM BIẾN MẤT HOÀN TOÀN!",
                text: "Khi đun nóng, dao động nhiệt làm cấu trúc hình xoắn ốc của amylose bị duỗi thẳng ra. Các phân tử Iodine (I₂) bị giải phóng và bay hơi ra khỏi lòng ống xoắn, làm dung dịch mất màu xanh tím trở lại trong suốt!",
                rxn: "Nhiệt độ cao: Chuỗi amylose duỗi thẳng → Iodine bị giải phóng → Mất màu xanh tím."
              };
            }
          } else if (actionId === "cool") {
            state.temp = 25;
            state.heated = false;
            if (state.iodineAdded) {
              state.color = "rgba(30, 27, 75, 0.88)";
              log = {
                success: true,
                title: "MÀU XANH TÍM XUẤT HIỆN TRỞ LẠI KỲ DIỆU!",
                text: "Khi để nguội, các phân tử amylose tự động co cuộn xoắn ốc trở lại và tái hấp phụ các phân tử I₂ vào lòng ống xoắn, làm màu xanh tím đậm đặc trưng lập tức tái sinh!",
                rxn: "Để nguội: Amylose cuộn xoắn lại → Hấp phụ I₂ trở lại → Hiện màu xanh tím."
              };
            }
          }
          return log;
        },
        processReagent: function (state, reagentId) {
          var log = null;
          state.volume = Math.min(state.volume + 8, 85);
          if (reagentId === "iodine") {
            state.iodineAdded = true;
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
                text: "Các phân tử Iodine (I₂) lọt vào và bị hấp phụ chặt chẽ bên trong lòng ống xoắn ốc của phân tử amylose, tạo hợp chất bọc có màu xanh tím đặc trưng.",
                rxn: "Amylose (xoắn) + I₂ → Hợp chất bọc màu xanh tím (đặc trưng nhận biết tinh bột)."
              };
            }
          } else if (reagentId === "water") {
            log = { info: true, title: "Thêm nước cất", text: "Pha loãng dung dịch.", rxn: null };
          }
          return log;
        }
      },

      // 4. CHƯƠNG 3 - CHẶNG 3: ANILINE
      "g12c3_2": {
        id: "aniline_bromine_lab",
        title: "Phòng thí nghiệm ảo: Chu trình Đục – Trong – Đục & Phản ứng thế Aniline",
        subtitle: "Thao tác: Nhỏ HCl (dung dịch trong veo) → Nhỏ tiếp NaOH (vẩn đục trở lại) → Nhỏ nước Bromine (bão tuyết kết tủa trắng)!",
        substrate: {
          name: "Aniline (C₆H₅NH₂) trong nước",
          smiles: "c1ccccc1N",
          cid: 6115,
          formula: "C₆H₅NH₂ (M = 93)",
          desc: "Chất lỏng sánh như dầu, ít tan trong nước lạnh, chìm xuống đáy ống nghiệm tạo dung dịch vẩn đục phân lớp."
        },
        initial: {
          volume: 28,
          color: "rgba(226, 232, 240, 0.8)",
          temp: 25,
          clarity: "turbid",
          isSalt: false,
          precipitate: false,
          bubbles: false
        },
        reagents: [
          { id: "hcl", name: "Dung dịch HCl 1M", color: "#38bdf8", dropColor: "#38bdf8", desc: "Acid mạnh trung hòa tính base của aniline" },
          { id: "naoh", name: "Dung dịch NaOH 1M", color: "#c084fc", dropColor: "#c084fc", desc: "Base mạnh đẩy aniline tái sinh" },
          { id: "br2", name: "Nước Bromine (Br₂)", color: "#ea580c", dropColor: "#ea580c", desc: "Dung dịch màu nâu đỏ thử phản ứng thế nhân thơm" }
        ],
        actions: [
          { id: "shake", name: "Lắc đều ống nghiệm", icon: "refresh" },
          { id: "reset", name: "Làm mới ống nghiệm", icon: "trash" }
        ],
        processAction: function (state, actionId) {
          if (actionId === "reset") return null;
          return { info: true, title: "Lắc đều", text: "Trộn đều các chất trong ống nghiệm.", rxn: null };
        },
        processReagent: function (state, reagentId) {
          var log = null;
          state.volume = Math.min(state.volume + 8, 85);
          if (reagentId === "hcl") {
            state.isSalt = true;
            state.clarity = "clear";
            state.color = "rgba(240, 249, 255, 0.35)";
            log = {
              success: true,
              title: "DUNG DỊCH TAN TRONG SUỐT VEO!",
              text: "Do tính base, aniline nhận proton H⁺ từ axit HCl tạo thành muối phenylammonium chloride [C₆H₅NH₃]⁺Cl⁻ tan hoàn toàn trong nước, làm ống nghiệm trong veo trở lại!",
              rxn: "C₆H₅NH₂ (không tan) + HCl → C₆H₅NH₃Cl (muối tan trong nước)"
            };
          } else if (reagentId === "naoh") {
            if (state.isSalt) {
              state.isSalt = false;
              state.clarity = "turbid";
              state.color = "rgba(226, 232, 240, 0.8)";
              log = {
                success: true,
                title: "DUNG DỊCH VẨN ĐỤC TRỞ LẠI!",
                text: "Base mạnh NaOH đẩy aniline yếu hơn ra khỏi muối: C₆H₅NH₃Cl + NaOH → C₆H₅NH₂↓ + NaCl + H₂O. Aniline tái sinh không tan trong nước làm dung dịch vẩn đục trở lại!",
                rxn: "C₆H₅NH₃Cl + NaOH → C₆H₅NH₂ (tái tạo, vẩn đục) + NaCl + H₂O"
              };
            } else {
              log = { info: true, title: "Đã thêm NaOH", text: "Aniline có tính base yếu nên không tác dụng với dung dịch kiềm NaOH.", rxn: null };
            }
          } else if (reagentId === "br2") {
            state.color = "rgba(248, 250, 252, 0.45)";
            state.precipitate = { color: "#ffffff", name: "2,4,6-tribromoaniline" };
            log = {
              success: true,
              title: "CƠN BÃO TUYẾT: KẾT TỦA TRẮNG XUẤT HIỆN!",
              text: "Nhóm amino (-NH₂) đẩy electron hoạt hóa nhân thơm cực mạnh ở các vị trí ortho và para. Ngay ở nhiệt độ thường, aniline thế đồng thời 3 nguyên tử Bromine tạo kết tủa trắng xoá 2,4,6-tribromoaniline rơi xuống đáy ống nghiệm!",
              rxn: "C₆H₅NH₂ + 3Br₂ → C₆H₂Br₃NH₂↓ (kết tủa trắng) + 3HBr"
            };
          }
          return log;
        }
      },

      // 5. CHƯƠNG 3 - CHẶNG 5: PHẢN ỨNG MÀU BIURET & ĐÔNG TỤ PROTEIN
      "g12c3_4": {
        id: "biuret_protein_lab",
        title: "Phòng thí nghiệm ảo: Phản ứng màu Biuret & Đông tụ Protein",
        subtitle: "Thao tác: Nhỏ NaOH rồi nhỏ CuSO₄ → Xuất hiện màu tím biuret đặc trưng → Bấm đun sôi để quan sát sự đông tụ protein!",
        substrate: {
          name: "Dung dịch Lòng trắng trứng (Albumin)",
          smiles: "NCC(=O)NCC(=O)NCC(=O)O",
          cid: 6093,
          formula: "Protein polypeptide (M > 10.000)",
          desc: "Dung dịch protein keo lỏng trong suốt, gồm chuỗi dài các gốc α-amino acid liên kết peptide."
        },
        initial: {
          volume: 30,
          color: "rgba(240, 249, 255, 0.4)",
          temp: 25,
          clarity: "clear",
          naohAdded: false,
          cuso4Added: false,
          biuretDone: false,
          coagulated: false
        },
        reagents: [
          { id: "naoh", name: "Dung dịch NaOH 30%", color: "#c084fc", dropColor: "#c084fc", desc: "Môi trường kiềm đậm đặc" },
          { id: "cuso4", name: "Dung dịch CuSO₄ 2%", color: "#0284c7", dropColor: "#0284c7", desc: "Cung cấp ion Cu²⁺ tạo phức màu tím" }
        ],
        actions: [
          { id: "heat", name: "Đun sôi ống nghiệm (100°C)", icon: "flame" },
          { id: "shake", name: "Lắc đều", icon: "refresh" },
          { id: "reset", name: "Làm mới ống nghiệm", icon: "trash" }
        ],
        processAction: function (state, actionId) {
          if (actionId === "reset") return null;
          var log = null;
          if (actionId === "heat") {
            state.temp = 100;
            state.coagulated = true;
            state.color = "rgba(241, 245, 249, 0.92)";
            log = {
              success: true,
              title: "HIỆN TƯỢNG ĐÔNG TỤ PROTEIN (RIÊU CUA / LUỘC TRỨNG)!",
              text: "Ở 100°C, nhiệt độ cao phá vỡ các liên kết hydrogen và cầu nối disulfide duy trì cấu trúc không gian bậc cao của albumin. Các chuỗi polypeptide bung ra, kết cụm lại với nhau tạo thành các mảng đông đặc màu trắng đục không thể tan lại!",
              rxn: "Nhiệt độ cao: Protein hình cầu tan → Biến tính → Đông tụ không thuận nghịch."
            };
          } else if (actionId === "shake") {
            log = { info: true, title: "Lắc đều", text: "Trộn đều thuốc thử.", rxn: null };
          }
          return log;
        },
        processReagent: function (state, reagentId) {
          var log = null;
          state.volume = Math.min(state.volume + 8, 85);
          if (reagentId === "naoh") {
            state.naohAdded = true;
            log = {
              info: true,
              title: "Đã thêm NaOH tạo môi trường kiềm",
              text: "Phản ứng màu Biuret bắt buộc phải xảy ra trong môi trường kiềm mạnh.",
              rxn: null
            };
          } else if (reagentId === "cuso4") {
            state.cuso4Added = true;
            if (state.naohAdded) {
              state.biuretDone = true;
              state.color = "rgba(147, 51, 234, 0.88)";
              log = {
                success: true,
                title: "XUẤT HIỆN DUNG DỊCH MÀU TÍM BIURET ĐẶC TRƯNG!",
                text: "Trong môi trường kiềm, hai liên kết peptide (-CO-NH-) trở lên tạo phức chelate với ion Cu²⁺ cho hợp chất màu tím biuret rực rỡ. Bẫy tử huyệt: Dipeptide (như Gly-Ala) CHỈ CÓ 1 LIÊN KẾT PEPTIDE NÊN KHÔNG CÓ PHẢN ỨNG NÀY!",
                rxn: "Protein + Cu(OH)₂ (trong kiềm) → Phức chất màu tím đặc trưng (Phản ứng Biuret)."
              };
            } else {
              state.color = "rgba(2, 132, 199, 0.4)";
              log = {
                warn: true,
                title: "Chưa có kiềm NaOH!",
                text: "Cần nhỏ dung dịch NaOH vào trước để tạo môi trường kiềm cho phản ứng tạo phức.",
                rxn: null
              };
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

    // Render Full Interactive Widget
    renderWidget: function (chId, stageIdx) {
      var sc = this.getLab(chId, stageIdx);
      if (!sc) return "";
      var st = this.getOrCreateState(chId, stageIdx);

      var reagentCards = sc.reagents.map(function (r) {
        return '<div class="chemlab-reagent-card" draggable="true" data-chemlab-act="dragReagent" data-ch="' + chId + '" data-idx="' + stageIdx + '" data-rid="' + r.id + '" style="--rg-color:' + r.color + '">' +
          '<div class="rg-card-head">' +
            '<span class="rg-grip" title="Kéo thả trực tiếp vào ống nghiệm">' + cIco("grip") + '</span>' +
            '<span class="rg-bottle-badge" style="background:' + r.color + '">' + cIco("pipette") + '</span>' +
            '<b class="rg-name">' + r.name + '</b>' +
          '</div>' +
          '<div class="rg-desc">' + r.desc + '</div>' +
          '<div class="rg-card-foot">' +
            '<button class="chemlab-add-btn" data-chemlab-act="reagent" data-ch="' + chId + '" data-idx="' + stageIdx + '" data-rid="' + r.id + '">' +
              cIco("drop") + ' Nhỏ giọt vào ống' +
            '</button>' +
          '</div>' +
        '</div>';
      }).join("");

      var actionBtns = sc.actions.map(function (a) {
        return '<button class="btn ghost small chemlab-tool-btn" data-chemlab-act="tool" data-ch="' + chId + '" data-idx="' + stageIdx + '" data-aid="' + a.id + '">' +
          cIco(a.icon) + ' ' + a.name +
        '</button>';
      }).join("");

      var liquidHeight = st.volume + "%";
      var separatedDisplay = st.separated ? 'block' : 'none';
      var precipitateDisplay = st.precipitate ? 'block' : 'none';
      var precipitateBg = st.precipitate ? (st.precipitate.color || '#fff') : '#fff';
      var mirrorClass = st.mirror ? ' mirror-on' : '';

      var logObj = st.log || { info: true, title: "Sẵn sàng", text: sc.subtitle };
      var logCls = logObj.success ? "success" : (logObj.warn ? "warn" : "info");
      var logIcon = logObj.success ? cIco("check") : (logObj.warn ? cIco("alert") : cIco("bulb"));

      return '<div class="chemlab-card" id="chemlab-' + chId + '-' + stageIdx + '">' +
        '<div class="chemlab-header">' +
          '<div class="chemlab-title-group">' +
            '<div class="chemlab-badge">' + cIco("flask") + ' PHÒNG THÍ NGHIỆM ẢO TƯƠNG TÁC</div>' +
            '<h4 class="chemlab-title">' + sc.title + '</h4>' +
            '<p class="chemlab-sub">' + sc.subtitle + '</p>' +
          '</div>' +
          '<div class="chemlab-mol-btns">' +
            '<button class="btn ghost small mol-btn" data-chemlab-mol="2d" data-ch="' + chId + '" data-idx="' + stageIdx + '" title="Xem công thức cấu tạo 2D">' +
              cIco("eye") + ' Cấu tạo 2D (Smiles)' +
            '</button>' +
            '<button class="btn ghost small mol-btn" data-chemlab-mol="3d" data-ch="' + chId + '" data-idx="' + stageIdx + '" title="Xoay tương tác mô hình 3D">' +
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
                  // SVG Wave Surface Meniscus
                  '<div class="liquid-wave-wrap">' +
                    '<svg class="liquid-wave-svg" viewBox="0 0 100 20" preserveAspectRatio="none">' +
                      '<path class="wave-path" d="M0 10 Q 25 3, 50 10 T 100 10 V 20 H 0 Z"></path>' +
                    '</svg>' +
                  '</div>' +

                  // Separated Top Layer (Este nổi)
                  '<div class="tube-layer-top" id="layer-top-' + chId + '-' + stageIdx + '" style="display:' + separatedDisplay + ';background-color:' + st.layerTopColor + '">' +
                    '<span class="layer-tag">Váng este nổi</span>' +
                  '</div>' +

                  // Precipitate Sediment
                  '<div class="tube-precipitate" id="precip-' + chId + '-' + stageIdx + '" style="display:' + precipitateDisplay + ';background-color:' + precipitateBg + '"></div>' +

                  // Dynamic Particles Container
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
            '<div class="tube-drop-hint">' + cIco("pipette") + ' Có thể kéo lọ hoá chất thả trực tiếp vào ống</div>' +
          '</div>' +

          // Right: Reagents Shelf & Tools
          '<div class="chemlab-controls">' +
            '<div class="ctrl-sec-title">HÓA CHẤT & THUỐC THỬ (KÉO THẢ HOẶC BẤM NHỎ GIỌT)</div>' +
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

    // In-Place Smooth Fluid Reaction Execution with GSAP
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

      // Execute scenario logic to calculate next state
      var log = sc.processReagent(st, reagentId);
      st.log = log;

      var dropColor = rObj.dropColor || rObj.color;
      var newHeight = st.volume + "%";
      var newBg = st.color;

      // GSAP Liquid Dropping Animation
      if (window.gsap && pipEl && dropEl && liquidEl) {
        if (fluidEl) fluidEl.style.backgroundColor = dropColor;
        dropEl.style.backgroundColor = dropColor;

        var tl = gsap.timeline();

        // 1. Pipette glides in over the tube opening
        tl.to(pipEl, { opacity: 1, y: 18, duration: 0.25, ease: "power2.out" })
          // 2. Squeeze drop out
          .fromTo(dropEl, { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.2, ease: "back.out(2)" })
          // 3. Droplet accelerates downward into the tube
          .to(dropEl, { y: 62, duration: 0.32, ease: "power2.in" })
          // 4. Splash impact
          .add(function () {
            dropEl.style.opacity = "0";
            dropEl.style.transform = "none";

            // Splash ring ripple
            if (splashEl) {
              splashEl.style.borderColor = dropColor;
              gsap.fromTo(splashEl, { scale: 0.4, opacity: 0.9 }, { scale: 2.2, opacity: 0, duration: 0.35, ease: "power1.out" });
            }

            // Tube elastic wobble
            if (tubeEl) {
              gsap.fromTo(tubeEl, { scaleY: 0.97, scaleX: 1.03 }, { scaleY: 1, scaleX: 1, duration: 0.4, ease: "elastic.out(1.2, 0.3)" });
            }

            // Liquid level rising smoothly
            gsap.to(liquidEl, { height: newHeight, duration: 0.85, ease: "power2.out" });

            // Liquid color morphing smoothly
            gsap.to(liquidEl, { backgroundColor: newBg, duration: 1.1, ease: "sine.inOut" });

            // If separated ester layer
            if (st.separated && topLayerEl) {
              topLayerEl.style.display = "block";
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
          .to(pipEl, { opacity: 0, y: -10, duration: 0.25, delay: 0.1 });
      } else {
        // Fallback without GSAP
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

    // In-Place Smooth Tool Execution (Heat, Shake, Reset)
    triggerTool: function (chId, stageIdx, actionId) {
      var sc = this.getLab(chId, stageIdx);
      if (!sc) return;

      if (actionId === "reset") {
        this.resetLab(chId, stageIdx);
        // Clean re-render of widget
        var card = document.getElementById("chemlab-" + chId + "-" + stageIdx);
        if (card) {
          var temp = document.createElement("div");
          temp.innerHTML = this.renderWidget(chId, stageIdx);
          card.replaceWith(temp.firstElementChild);
        }
        return;
      }

      var st = this.getOrCreateState(chId, stageIdx);
      var log = sc.processAction(st, actionId);
      if (log) st.log = log;

      var tubeEl = document.getElementById("tube-" + chId + "-" + stageIdx);
      var liquidEl = document.getElementById("liquid-" + chId + "-" + stageIdx);
      var logEl = document.getElementById("log-" + chId + "-" + stageIdx);
      var pillTemp = document.getElementById("pill-temp-" + chId + "-" + stageIdx);

      // Tool Animations
      if (window.gsap && tubeEl) {
        if (actionId === "shake") {
          gsap.timeline()
            .to(tubeEl, { rotation: 8, duration: 0.08 })
            .to(tubeEl, { rotation: -8, duration: 0.08 })
            .to(tubeEl, { rotation: 5, duration: 0.08 })
            .to(tubeEl, { rotation: 0, duration: 0.1, ease: "elastic.out(1, 0.3)" });
        } else if (actionId === "heat") {
          // Heat glow effect
          gsap.fromTo(tubeEl, 
            { filter: "drop-shadow(0 0 18px rgba(239, 68, 68, 0.85))" }, 
            { filter: "drop-shadow(0 0 0 rgba(0,0,0,0))", duration: 1.4, ease: "power2.out" }
          );

          if (st.mirror) {
            tubeEl.classList.add("mirror-on");
            gsap.fromTo(tubeEl, { filter: "brightness(1.5)" }, { filter: "brightness(1)", duration: 0.8 });
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
        if (window.gsap) gsap.fromTo(pillTemp, { scale: 1.2 }, { scale: 1, duration: 0.3 });
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

    // Built-in High-Fidelity 2D Structural Formula Renderer (Zero-failure Canvas Blueprint)
    renderFallback2D: function (sub, canvas) {
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      var w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Clean Blueprint background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);

      // Grid watermark
      ctx.strokeStyle = "rgba(226, 232, 240, 0.7)";
      ctx.lineWidth = 1;
      for (var x = 20; x < w; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (var y = 20; y < h; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

      // Title & Formula
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 17px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(sub.name, w / 2, 34);

      ctx.fillStyle = "#0284c7";
      ctx.font = "600 14px monospace";
      ctx.fillText(sub.formula, w / 2, 56);

      // Specific Vector Blueprints for Key Curriculum Molecules
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#1e293b";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      var id = sub.smiles;

      if (id.includes("CCOC(=O)C")) {
        // Ethyl acetate: CH3 - C(=O) - O - CH2 - CH3
        ctx.font = "bold 15px sans-serif";
        // C(=O) center
        var cx = w / 2 - 30, cy = h / 2 + 10;
        // Draw zigzag bonds
        ctx.beginPath();
        ctx.moveTo(cx - 70, cy); ctx.lineTo(cx - 20, cy); // CH3 - C
        ctx.lineTo(cx + 35, cy); // C - O
        ctx.lineTo(cx + 85, cy - 25); // O - CH2
        ctx.lineTo(cx + 130, cy); // CH2 - CH3
        ctx.stroke();

        // C=O double bond
        ctx.beginPath();
        ctx.moveTo(cx - 24, cy); ctx.lineTo(cx - 24, cy - 50);
        ctx.moveTo(cx - 16, cy); ctx.lineTo(cx - 16, cy - 50);
        ctx.stroke();

        // Atom labels
        ctx.fillStyle = "#dc2626"; // Oxygen Red
        ctx.fillText("=O", cx - 20, cy - 56);
        ctx.fillText("O", cx + 35, cy + 5);

        ctx.fillStyle = "#0f172a";
        ctx.fillText("H₃C", cx - 85, cy + 5);
        ctx.fillText("CH₂", cx + 85, cy - 32);
        ctx.fillText("CH₃", cx + 145, cy + 5);

        // Group box highlight
        ctx.strokeStyle = "rgba(234, 179, 8, 0.4)";
        ctx.fillStyle = "rgba(254, 240, 138, 0.15)";
        ctx.strokeRect(cx - 40, cy - 70, 100, 95);
        ctx.fillRect(cx - 40, cy - 70, 100, 95);
        ctx.fillStyle = "#854d0e";
        ctx.font = "11px sans-serif";
        ctx.fillText("Nhóm chức Este (-COO-)", cx + 10, cy + 42);

      } else if (id.includes("c1ccccc1N")) {
        // Aniline: Benzene ring + NH2
        var cx = w / 2, cy = h / 2 + 15, r = 45;
        // Draw Benzene hexagon
        ctx.beginPath();
        for (var a = 0; a < 6; a++) {
          var ang = (a * 60 - 90) * Math.PI / 180;
          var px = cx + r * Math.cos(ang), py = cy + r * Math.sin(ang);
          if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        // Aromatic pi circle
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.58, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(30, 41, 59, 0.8)";
        ctx.stroke();

        // Bond to NH2
        var topX = cx, topY = cy - r;
        ctx.beginPath();
        ctx.moveTo(topX, topY);
        ctx.lineTo(topX, topY - 35);
        ctx.stroke();

        // NH2 label
        ctx.fillStyle = "#2563eb"; // Nitrogen Blue
        ctx.font = "bold 16px sans-serif";
        ctx.fillText("NH₂", topX, topY - 42);

        ctx.fillStyle = "#1e40af";
        ctx.font = "11px sans-serif";
        ctx.fillText("Nhóm Amino (-NH₂) hoạt hoá vòng thơm", cx, cy + r + 24);

      } else if (id.includes("OC[C@@H]1O") || id.includes("CHO")) {
        // Glucose Haworth Ring Representation
        var cx = w / 2, cy = h / 2 + 20;
        ctx.beginPath();
        // Pyranose ring
        ctx.moveTo(cx - 70, cy);
        ctx.lineTo(cx - 35, cy - 35);
        ctx.lineTo(cx + 35, cy - 35);
        ctx.lineTo(cx + 70, cy);
        ctx.lineTo(cx + 35, cy + 35);
        ctx.lineTo(cx - 35, cy + 35);
        ctx.closePath();
        ctx.stroke();

        // Oxygen in ring
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(cx + 25, cy - 42, 20, 16);
        ctx.fillStyle = "#dc2626";
        ctx.font = "bold 15px sans-serif";
        ctx.fillText("O", cx + 35, cy - 30);

        // OH groups
        ctx.fillStyle = "#dc2626";
        ctx.font = "bold 13px sans-serif";
        ctx.fillText("CH₂OH", cx - 45, cy - 48);
        ctx.fillText("OH", cx - 85, cy + 5);
        ctx.fillText("OH", cx - 35, cy + 52);
        ctx.fillText("OH", cx + 35, cy + 52);
        ctx.fillText("OH (hemiacetal)", cx + 85, cy + 5);

        ctx.fillStyle = "#0369a1";
        ctx.font = "11px sans-serif";
        ctx.fillText("Vòng 6 cạnh α,β-Glucose có 5 nhóm -OH kề nhau", cx, cy + 72);

      } else {
        // Generic representation
        ctx.fillStyle = "#334155";
        ctx.font = "14px monospace";
        ctx.fillText("SMILES: " + sub.smiles, w / 2, h / 2);
        ctx.fillStyle = "#64748b";
        ctx.font = "12px sans-serif";
        ctx.fillText(sub.desc, w / 2, h / 2 + 30);
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
      modal.innerHTML = '<div class="chemlab-modal-card">' +
        '<div class="modal-header">' +
          '<div>' +
            '<h3 style="margin:0;font-size:1.2rem;display:flex;align-items:center;gap:8px">' +
              (mode === "3d" ? cIco("atom") + ' Mô hình phân tử 3D WebGL' : cIco("eye") + ' Cấu tạo hoá học 2D') +
            '</h3>' +
            '<p class="muted small" style="margin:4px 0 0">Chất: <b>' + sub.name + '</b> · <code>' + sub.formula + '</code></p>' +
          '</div>' +
          '<button class="btn ghost tiny modal-close-btn" data-act="closeMolModal" title="Đóng cửa sổ">' + cIco("close") + '</button>' +
        '</div>' +
        '<div class="modal-body">' +
          (mode === "3d" 
            ? '<div id="mol-3d-viewer" class="mol-3d-box" style="width:100%;height:350px;position:relative;border-radius:12px;overflow:hidden;background:#0f172a"></div>' +
              '<p class="muted small" style="text-align:center;margin-top:8px">Chuột trái: Xoay 3D · Con lăn: Phóng to/thu nhỏ · Chuột phải: Dịch chuyển</p>'
            : '<div style="display:flex;justify-content:center;padding:12px;background:#ffffff;border-radius:12px;border:1px solid #e2e8f0;box-shadow:inset 0 1px 3px rgba(0,0,0,0.05)">' +
                '<canvas id="mol-2d-canvas" width="420" height="280" style="max-width:100%;height:auto;"></canvas>' +
              '</div>' +
              '<p class="muted small" style="text-align:center;margin-top:8px">Bản vẽ cấu tạo phân tử & tâm hoạt tính hoá học</p>'
          ) +
        '</div>' +
      '</div>';

      document.body.appendChild(modal);

      // Render 2D
      if (mode === "2d") {
        var canvas = document.getElementById("mol-2d-canvas");
        var drawnByLib = false;

        if (canvas && root.SmilesDrawer && typeof root.SmilesDrawer.parse === "function") {
          try {
            var drawerClass = root.SmilesDrawer.Drawer || root.SmilesDrawer;
            var drawerInstance = new drawerClass({ width: 420, height: 280, bondThickness: 1.6 });
            root.SmilesDrawer.parse(sub.smiles, function (tree) {
              drawerInstance.draw(tree, canvas, "light", false);
              drawnByLib = true;
            }, function (err) {
              console.warn("SmilesDrawer parse error:", err);
            });
          } catch (e) {
            console.warn("SmilesDrawer execution exception:", e);
          }
        }

        // If library was unable to draw or failed, use our high-fidelity built-in canvas blueprint
        if (!drawnByLib) {
          ChemLab.renderFallback2D(sub, canvas);
        }
      }

      // Render 3D with 3Dmol.js
      if (mode === "3d") {
        var viewerEl = document.getElementById("mol-3d-viewer");
        if (root.$3Dmol && viewerEl) {
          try {
            var viewer = root.$3Dmol.createViewer(viewerEl, { backgroundColor: "0x0f172a" });
            if (sub.cid) {
              root.$3Dmol.download("cid:" + sub.cid, viewer, {}, function () {
                viewer.setStyle({}, { stick: { radius: 0.16 }, sphere: { scale: 0.3 } });
                viewer.zoomTo();
                viewer.render();
                viewer.spin(true);
              });
            } else {
              viewer.addLabel(sub.name, { fontSize: 16, fontColor: "white" });
              viewer.render();
            }
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
