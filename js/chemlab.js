/* ═══════════════════════════════════════════════════════════════════
   CHEMLAB ENGINE & INTERACTIVE VIRTUAL LABORATORY
   Features:
   - Rule-based chemical reaction state machine
   - SVG + GSAP real-time liquid, meniscus, bubbles, precipitate & mirror animations
   - 2D molecular structures with SmilesDrawer
   - 3D interactive WebGL molecular rotation with 3Dmol.js
   ═══════════════════════════════════════════════════════════════════ */

(function (root) {
  'use strict';

  var ChemLab = {
    // Current runtime states for active labs
    activeStates: {},

    // Scenarios keyed by chapterId + "_" + stageIndex
    scenarios: {
      // 1. CHƯƠNG 1 - CHẶNG 3: ĐIỀU CHẾ ETHYL ACETATE & TÁCH LỚP
      "g12c1_2": {
        id: "ethyl_acetate_prep",
        title: "Phòng thí nghiệm ảo: Điều chế Ethyl Acetate & Tách lớp este",
        subtitle: "Thao tác: Nhỏ H₂SO₄ đặc → Đun cách thuỷ ở 65-70°C → Rót vào dung dịch NaCl bão hoà để quan sát este tách lớp.",
        substrate: {
          name: "Hỗn hợp: C₂H₅OH (2 mL) + CH₃COOH (2 mL)",
          smiles: "CCOC(=O)C",
          cid: 8857, // Ethyl acetate PubChem CID
          formula: "CH₃COOC₂H₅ (M = 88)",
          desc: "Hỗn hợp ban đầu gồm ethanol và acetic acid băng, là chất lỏng không màu, đồng nhất."
        },
        initial: {
          volume: 35, // percent
          color: "rgba(224, 242, 254, 0.45)", // clear liquid
          temp: 25,
          clarity: "clear",
          separated: false, // tách lớp
          layerTopColor: null,
          precipitate: false,
          bubbles: false,
          mirror: false,
          h2so4Added: false,
          heated: false,
          naclAdded: false
        },
        reagents: [
          { id: "h2so4", name: "H₂SO₄ đặc (xúc tác)", color: "#eab308", dropColor: "rgba(234, 179, 8, 0.9)", desc: "Xúc tác tăng tốc & hút nước chuyển dịch cân bằng" },
          { id: "nacl_sat", name: "Dung dịch NaCl bão hoà", color: "#38bdf8", dropColor: "rgba(56, 189, 248, 0.8)", desc: "Tăng tỉ trọng & giảm độ tan este (salting-out)" },
          { id: "water", name: "Nước cất (H₂O)", color: "#0284c7", dropColor: "rgba(2, 132, 199, 0.5)", desc: "Thử đối chứng (este tan 1 phần trong nước)" }
        ],
        actions: [
          { id: "heat", name: "Đun cách thuỷ (65–70°C)", icon: "flame" },
          { id: "shake", name: "Lắc nhẹ ống nghiệm", icon: "refresh" },
          { id: "reset", name: "Làm mới ống nghiệm", icon: "trash" }
        ],
        processAction: function (state, actionId) {
          if (actionId === "reset") return null; // Reset to initial
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
                rxn: "CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ (ethyl acetate) + H₂O (H₂SO₄ đặc, 65-70°C)"
              };
            }
          } else if (actionId === "shake") {
            log = {
              info: true,
              title: "Lắc đều ống nghiệm",
              text: "Các chất phản ứng tiếp xúc tối đa với nhau.",
              rxn: null
            };
          }
          return log;
        },
        processReagent: function (state, reagentId) {
          var log = null;
          state.volume = Math.min(state.volume + 8, 85);

          if (reagentId === "h2so4") {
            state.h2so4Added = true;
            state.color = "rgba(254, 240, 138, 0.5)"; // slightly yellowish warm
            state.temp = 35; // tỏa nhiệt nhẹ
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
              state.layerTopColor = "rgba(250, 204, 21, 0.75)"; // ester layer
              state.color = "rgba(224, 242, 254, 0.6)"; // bottom salt water layer
              log = {
                success: true,
                title: "HIỆN TƯỢNG KỲ DIỆU: Este tách lớp váng dầu nổi lên trên!",
                text: "Do dung dịch NaCl bão hòa có khối lượng riêng lớn và ethyl acetate hầu như không tan trong nước muối (hiệu ứng salting-out), este tách thành một lớp dầu màu vàng nhạt nổi rõ rệt lên trên bề mặt, tỏa mùi thơm chuối chín / táo thơm phức!",
                rxn: "Este nhẹ hơn nước (d ≈ 0.9 g/mL) và không tan trong NaCl bão hoà → Tách 2 lớp hoàn toàn."
              };
            } else {
              log = {
                info: true,
                title: "Đã thêm NaCl bão hòa",
                text: "Dung dịch chưa đun tạo este nên chưa quan sát thấy lớp este tách ra.",
                rxn: null
              };
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
              log = {
                info: true,
                title: "Đã thêm nước cất",
                text: "Dung dịch bị pha loãng.",
                rxn: null
              };
            }
          }
          return log;
        }
      },

      // 2. CHƯƠNG 2 - CHẶNG 2: PHẢN ỨNG TRÁNG BẠC GLUCOSE & NƯỚC BROMINE
      "g12c2_1": {
        id: "glucose_tollens_lab",
        title: "Phòng thí nghiệm ảo: Phản ứng Tráng gương của Glucose & Phân biệt Fructose",
        subtitle: "Thao tác: Nhỏ thuốc thử Tollens [Ag(NH₃)₂]OH → Bấm đun nóng nhẹ để quan sát lớp bạc sáng bóng tráng kín thành ống!",
        substrate: {
          name: "Dung dịch Glucose (C₆H₁₂O₆) 5%",
          smiles: "OC[C@@H]1OC(O)[C@H](O)[C@@H](O)[C@@H]1O",
          cid: 5793, // Glucose CID
          formula: "CH₂OH-[CHOH]₄-CHO (M = 180)",
          desc: "Dung dịch đường nho không màu, chứa đồng thời 5 nhóm -OH kề nhau và 1 nhóm aldehyde -CHO."
        },
        initial: {
          volume: 30,
          color: "rgba(240, 249, 255, 0.4)",
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
          { id: "tollens", name: "Thuốc thử Tollens [Ag(NH₃)₂]OH", color: "#94a3b8", dropColor: "rgba(148, 163, 184, 0.8)", desc: "Phức bạc trong môi trường kiềm NH₃" },
          { id: "br2", name: "Nước Bromine (Br₂)", color: "#ea580c", dropColor: "rgba(234, 88, 12, 0.9)", desc: "Dung dịch màu vàng nâu (thuốc thử phân biệt fructose)" },
          { id: "cuoh2", name: "Cu(OH)₂ trong kiềm", color: "#0284c7", dropColor: "rgba(2, 132, 199, 0.8)", desc: "Tạo phức xanh lam, đun nóng ra kết tủa đỏ gạch Cu₂O" }
        ],
        actions: [
          { id: "heat", name: "Đun nóng nhẹ (60–70°C)", icon: "flame" },
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
              state.mirror = true; // Tráng gương Ag sáng bóng!
              state.color = "rgba(100, 116, 139, 0.3)";
              log = {
                success: true,
                title: "HIỆN TƯỢNG TRÁNG GƯƠNG NGOẠN MỤC!",
                text: "Dưới tác dụng nhiệt, nhóm aldehyde -CHO của glucose khử ion phức [Ag(NH₃)₂]⁺ thành kim loại Bạc (Ag). Bạc kim loại kết tủa bám dính cực kỳ mịn màng tạo thành một chiếc gương soi sáng bóng như kim loại trên thành ống nghiệm!",
                rxn: "CH₂OH[CHOH]₄CHO + 2[Ag(NH₃)₂]OH → CH₂OH[CHOH]₄COONH₄ + 2Ag↓ (gương bạc) + 3NH₃ + H₂O"
              };
            } else if (state.cuoh2Added) {
              state.precipitate = { color: "#b91c1c", name: "Cu₂O đỏ gạch" };
              state.color = "rgba(239, 68, 68, 0.35)";
              log = {
                success: true,
                title: "Xuất hiện kết tủa đỏ gạch Cu₂O!",
                text: "Khi đun nóng với Cu(OH)₂ trong kiềm, nhóm -CHO bị oxi hóa tạo kết tủa đồng(I) oxide Cu₂O màu đỏ gạch.",
                rxn: "C₆H₁₂O₆ + 2Cu(OH)₂ + NaOH → Muối + Cu₂O↓ (đỏ gạch) + 3H₂O"
              };
            } else {
              log = {
                info: true,
                title: "Đã đun nóng dung dịch",
                text: "Nhiệt độ dung dịch đạt 65°C. Cần cho thuốc thử Tollens vào để phản ứng xảy ra.",
                rxn: null
              };
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
            state.color = "rgba(203, 213, 225, 0.45)";
            log = {
              info: true,
              title: "Đã thêm thuốc thử Tollens [Ag(NH₃)₂]OH",
              text: "Ở nhiệt độ phòng, phản ứng diễn ra rất chậm. Hãy bấm nút 'Đun nóng nhẹ' để kích hoạt phản ứng tráng gương bạc!",
              rxn: "Chưa đun nóng: Dung dịch vẫn trong suốt không màu."
            };
          } else if (reagentId === "br2") {
            state.br2Added = true;
            // Glucose làm mất màu nước bromine
            state.color = "rgba(240, 253, 250, 0.4)"; // mất màu trong veo
            log = {
              success: true,
              title: "NƯỚC BROMINE BỊ MẤT MÀU HOÀN TOÀN!",
              text: "Màu vàng nâu của nước Br₂ lập tức biến mất do nhóm -CHO của glucose bị oxi hóa thành acid gluconic. Đây là thuốc thử duy nhất phân biệt Glucose với Fructose (Fructose không làm mất màu nước Br₂ vì môi trường không kiềm)!",
              rxn: "CH₂OH[CHOH]₄CHO + Br₂ + H₂O → CH₂OH[CHOH]₄COOH (gluconic acid) + 2HBr"
            };
          } else if (reagentId === "cuoh2") {
            state.cuoh2Added = true;
            state.color = "rgba(14, 165, 233, 0.75)"; // xanh lam thẫm
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

      // 3. CHƯƠNG 2 - CHẶNG 4: HỒ TINH BỘT + IODINE (ĐUN NÓNG & ĐỂ NGUỘI)
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
          { id: "iodine", name: "Dung dịch Iodine (I₂)", color: "#78350f", dropColor: "rgba(120, 53, 15, 0.9)", desc: "Dung dịch iot màu vàng nâu nhạt" },
          { id: "water", name: "Nước cất (pha loãng)", color: "#0284c7", dropColor: "rgba(2, 132, 199, 0.5)", desc: "Nước tinh khiết" }
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
              state.color = "rgba(241, 245, 249, 0.4)"; // Mất màu hoàn toàn!
              log = {
                success: true,
                title: "MÀU XANH TÍM BIẾN MẤT HOÀN TOÀN!",
                text: "Khi đun nóng, dao động nhiệt làm cấu trúc hình xoắn ốc của amylose bị duỗi thẳng ra. Các phân tử Iodine (I₂) bị giải phóng và bay hơi ra khỏi lòng ống xoắn, làm dung dịch mất màu xanh tím trở lại trong suốt!",
                rxn: "Nhiệt độ cao: Chuỗi amylose duỗi thẳng → Iodine bị giải phóng → Mất màu xanh tím."
              };
            } else {
              log = { info: true, title: "Đã đun nóng", text: "Hồ tinh bột nóng lên.", rxn: null };
            }
          } else if (actionId === "cool") {
            state.temp = 25;
            state.heated = false;
            if (state.iodineAdded) {
              state.color = "rgba(30, 27, 75, 0.88)"; // Màu xanh tím đậm hiện lại!
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
              state.color = "rgba(30, 27, 75, 0.88)"; // Xanh tím đậm
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

      // 4. CHƯƠNG 3 - CHẶNG 3: ANILINE (CHU TRÌNH ĐỤC - TRONG - ĐỤC & NƯỚC BROMINE)
      "g12c3_2": {
        id: "aniline_bromine_lab",
        title: "Phòng thí nghiệm ảo: Chu trình Đục – Trong – Đục & Phản ứng thế Aniline",
        subtitle: "Thao tác: Nhỏ HCl (dung dịch trong veo) → Nhỏ tiếp NaOH (vẩn đục trở lại) → Nhỏ nước Bromine (xuất hiện bão tuyết kết tủa trắng)!",
        substrate: {
          name: "Aniline (C₆H₅NH₂) trong nước",
          smiles: "c1ccccc1N",
          cid: 6115, // Aniline PubChem CID
          formula: "C₆H₅NH₂ (M = 93)",
          desc: "Chất lỏng sánh như dầu, ít tan trong nước lạnh, chìm xuống đáy ống nghiệm tạo dung dịch vẩn đục phân lớp."
        },
        initial: {
          volume: 25,
          color: "rgba(226, 232, 240, 0.75)", // đục sữa phân lớp
          temp: 25,
          clarity: "turbid",
          isSalt: false, // đã tạo muối phenylammonium chloride
          precipitate: false,
          bubbles: false
        },
        reagents: [
          { id: "hcl", name: "Dung dịch HCl 1M", color: "#38bdf8", dropColor: "rgba(56, 189, 248, 0.85)", desc: "Acid mạnh trung hòa tính base của aniline" },
          { id: "naoh", name: "Dung dịch NaOH 1M", color: "#c084fc", dropColor: "rgba(192, 132, 252, 0.85)", desc: "Base mạnh đẩy aniline tái sinh" },
          { id: "br2", name: "Nước Bromine (Br₂)", color: "#ea580c", dropColor: "rgba(234, 88, 12, 0.95)", desc: "Dung dịch màu nâu đỏ thử phản ứng thế nhân thơm" }
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
            state.color = "rgba(240, 249, 255, 0.35)"; // Tan trong suốt!
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
              state.color = "rgba(226, 232, 240, 0.75)"; // Đục trở lại!
              log = {
                success: true,
                title: "DUNG DỊCH VẨN ĐỤC TRỞ LẠI!",
                text: "Base mạnh NaOH đẩy aniline yếu hơn ra khỏi muối: C₆H₅NH₃Cl + NaOH → C₆H₅NH₂↓ + NaCl + H₂O. Aniline tái sinh không tan trong nước làm dung dịch vẩn đục trở lại!",
                rxn: "C₆H₅NH₃Cl + NaOH → C₆H₅NH₂ (tái tạo, vẩn đục) + NaCl + H₂O"
              };
            } else {
              log = {
                info: true,
                title: "Đã thêm NaOH",
                text: "Aniline có tính base yếu nên không tác dụng với dung dịch kiềm NaOH.",
                rxn: null
              };
            }
          } else if (reagentId === "br2") {
            state.color = "rgba(248, 250, 252, 0.45)"; // Mất màu nước Br2
            state.precipitate = { color: "#ffffff", name: "2,4,6-tribromoaniline" }; // Kết tủa trắng
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
          smiles: "NCC(=O)NCC(=O)NCC(=O)O", // Tripeptide Gly-Gly-Gly đại diện
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
          coagulated: false // đông tụ
        },
        reagents: [
          { id: "naoh", name: "Dung dịch NaOH 30%", color: "#c084fc", dropColor: "rgba(192, 132, 252, 0.85)", desc: "Môi trường kiềm đậm đặc" },
          { id: "cuso4", name: "Dung dịch CuSO₄ 2%", color: "#0284c7", dropColor: "rgba(2, 132, 199, 0.9)", desc: "Cung cấp ion Cu²⁺ tạo phức màu tím" }
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
            state.color = "rgba(241, 245, 249, 0.9)"; // đông tụ trắng đục
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
              state.color = "rgba(147, 51, 234, 0.85)"; // Màu tím biuret rực rỡ!
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

    // Check if stage has a lab scenario
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
      this.getOrCreateState(chId, stageIdx);
    },

    // Render HTML Widget for Guided Learning
    renderWidget: function (chId, stageIdx) {
      var sc = this.getLab(chId, stageIdx);
      if (!sc) return "";
      var st = this.getOrCreateState(chId, stageIdx);

      var reagentBtns = sc.reagents.map(function (r) {
        return '<button class="chemlab-reagent-btn" data-chemlab-act="reagent" data-ch="' + chId + '" data-idx="' + stageIdx + '" data-rid="' + r.id + '" style="--rg-color:' + r.color + '">' +
          '<span class="rg-dot" style="background:' + r.color + '"></span>' +
          '<span class="rg-name">' + r.name + '</span>' +
          '<span class="rg-drop-pill">+ Nhỏ giọt</span>' +
        '</button>';
      }).join("");

      var actionBtns = sc.actions.map(function (a) {
        var iconSvg = root.ico ? root.ico(a.icon) : '•';
        return '<button class="btn ghost small chemlab-tool-btn" data-chemlab-act="tool" data-ch="' + chId + '" data-idx="' + stageIdx + '" data-aid="' + a.id + '">' +
          iconSvg + ' ' + a.name +
        '</button>';
      }).join("");

      // Liquid styles
      var liquidHeight = st.volume + "%";
      var liquidBg = st.color;
      var separatedTopStyle = st.separated ? ('background:' + st.layerTopColor + ';height:32%;display:block;') : 'display:none;';
      var mirrorClass = st.mirror ? ' mirror-on' : '';
      var precipitateHtml = st.precipitate ? ('<div class="tube-precipitate" style="background:' + (st.precipitate.color || '#fff') + '" title="' + (st.precipitate.name || 'Kết tủa') + '"></div>') : '';
      var bubblesHtml = st.bubbles ? '<div class="tube-bubbles"><span></span><span></span><span></span><span></span><span></span></div>' : '';

      // Log presentation
      var logObj = st.log || { info: true, title: "Sẵn sàng", text: sc.subtitle };
      var logCls = logObj.success ? "success" : (logObj.warn ? "warn" : "info");
      var logIcon = logObj.success ? (root.ico ? root.ico("check") : '✓') : (logObj.warn ? (root.ico ? root.ico("alert") : '⚠') : (root.ico ? root.ico("bulb") : 'ℹ'));

      return '<div class="chemlab-card" id="chemlab-' + chId + '-' + stageIdx + '">' +
        '<div class="chemlab-header">' +
          '<div class="chemlab-title-group">' +
            '<div class="chemlab-badge">' + (root.ico ? root.ico("flask") : '🧪') + ' PHÒNG THÍ NGHIỆM ẢO TƯƠNG TÁC</div>' +
            '<h4 class="chemlab-title">' + sc.title + '</h4>' +
            '<p class="chemlab-sub">' + sc.subtitle + '</p>' +
          '</div>' +
          '<div class="chemlab-mol-btns">' +
            '<button class="btn ghost small mol-btn" data-chemlab-mol="2d" data-ch="' + chId + '" data-idx="' + stageIdx + '" title="Xem cấu trúc hóa học 2D">' +
              (root.ico ? root.ico("eye") : '👁') + ' Cấu tạo 2D (Smiles)' +
            '</button>' +
            '<button class="btn ghost small mol-btn" data-chemlab-mol="3d" data-ch="' + chId + '" data-idx="' + stageIdx + '" title="Xoay tương tác mô hình 3D">' +
              (root.ico ? root.ico("target") : '🌐') + ' Xoay 3D (3Dmol)' +
            '</button>' +
          '</div>' +
        '</div>' +

        '<div class="chemlab-workbench">' +
          // Left: Test Tube Lab Area
          '<div class="chemlab-stage">' +
            '<div class="test-tube-assembly">' +
              '<div class="tube-dropper-pipette" id="pipette-' + chId + '-' + stageIdx + '"><div class="pipette-tip"></div><div class="pipette-drop"></div></div>' +
              '<div class="test-tube-glass' + mirrorClass + '" id="tube-' + chId + '-' + stageIdx + '">' +
                '<div class="glass-reflection"></div>' +
                '<div class="tube-graduations"><span>15mL</span><span>10mL</span><span>5mL</span></div>' +
                '<div class="tube-liquid" style="height:' + liquidHeight + ';background:' + liquidBg + '">' +
                  '<div class="tube-layer-top" style="' + separatedTopStyle + '"><span class="layer-tag">Este nổi</span></div>' +
                  bubblesHtml +
                  precipitateHtml +
                '</div>' +
              '</div>' +
              '<div class="tube-stand-base"></div>' +
            '</div>' +
            '<div class="tube-status-bar">' +
              '<span class="status-pill temp">' + (root.ico ? root.ico("flame") : '🌡') + ' ' + st.temp + '°C</span>' +
              '<span class="status-pill vol">' + (root.ico ? root.ico("flask") : '💧') + ' ' + (st.volume * 0.2).toFixed(1) + ' mL</span>' +
            '</div>' +
          '</div>' +

          // Right: Reagents Rack & Controls
          '<div class="chemlab-controls">' +
            '<div class="ctrl-sec-title">HÓA CHẤT & THUỐC THỬ CÓ SẴN (BẤM ĐỂ NHỎ VÀO ỐNG)</div>' +
            '<div class="chemlab-reagents-grid">' + reagentBtns + '</div>' +
            '<div class="ctrl-sec-title" style="margin-top:14px">THAO TÁC THÍ NGHIỆM</div>' +
            '<div class="chemlab-tools-row">' + actionBtns + '</div>' +
          '</div>' +
        '</div>' +

        // Observation & Chemistry Log
        '<div class="chemlab-log-box ' + logCls + '">' +
          '<div class="log-head">' + logIcon + ' <b>' + logObj.title + '</b></div>' +
          '<div class="log-body">' + logObj.text + '</div>' +
          (logObj.rxn ? '<div class="log-rxn"><b>Phương trình & Cơ chế:</b> <code>' + logObj.rxn + '</code></div>' : '') +
        '</div>' +
      '</div>';
    },

    // Trigger reagent addition with GSAP animations
    triggerReagent: function (chId, stageIdx, reagentId) {
      var sc = this.getLab(chId, stageIdx);
      if (!sc) return;
      var st = this.getOrCreateState(chId, stageIdx);
      var rObj = sc.reagents.find(function (r) { return r.id === reagentId; });

      // Run GSAP Dropper Animation
      var pipEl = document.getElementById("pipette-" + chId + "-" + stageIdx);
      var tubeEl = document.getElementById("tube-" + chId + "-" + stageIdx);

      if (window.gsap && pipEl) {
        var dropEl = pipEl.querySelector(".pipette-drop");
        if (dropEl && rObj) {
          dropEl.style.background = rObj.dropColor || rObj.color;
        }

        var tl = gsap.timeline();
        tl.to(pipEl, { opacity: 1, y: 0, duration: 0.2 })
          .to(dropEl, { y: 65, opacity: 1, duration: 0.35, ease: "power2.in" })
          .to(dropEl, { opacity: 0, duration: 0.1, onComplete: function () {
            // Drop hit liquid: ripple tube
            if (tubeEl) {
              gsap.fromTo(tubeEl, { scaleX: 0.98 }, { scaleX: 1, duration: 0.3, ease: "elastic.out(1, 0.4)" });
            }
          }})
          .to(pipEl, { opacity: 0, y: -10, duration: 0.2 });
      }

      // Update state via scenario rule
      var log = sc.processReagent(st, reagentId);
      st.log = log;

      // Re-render only widget box without touching scroll
      this.refreshWidget(chId, stageIdx);
    },

    triggerTool: function (chId, stageIdx, actionId) {
      var sc = this.getLab(chId, stageIdx);
      if (!sc) return;

      if (actionId === "reset") {
        this.resetLab(chId, stageIdx);
        this.refreshWidget(chId, stageIdx);
        return;
      }

      var st = this.getOrCreateState(chId, stageIdx);

      // GSAP thermal/shake feedback
      var tubeEl = document.getElementById("tube-" + chId + "-" + stageIdx);
      if (window.gsap && tubeEl) {
        if (actionId === "shake") {
          gsap.fromTo(tubeEl, { rotation: -6 }, { rotation: 0, duration: 0.4, ease: "elastic.out(1.2, 0.2)" });
        } else if (actionId === "heat") {
          gsap.fromTo(tubeEl, { filter: "drop-shadow(0 0 16px rgba(239, 68, 68, 0.7))" }, { filter: "drop-shadow(0 0 0 rgba(0,0,0,0))", duration: 1.2 });
        }
      }

      var log = sc.processAction(st, actionId);
      if (log) st.log = log;

      this.refreshWidget(chId, stageIdx);
    },

    refreshWidget: function (chId, stageIdx) {
      var card = document.getElementById("chemlab-" + chId + "-" + stageIdx);
      if (!card) return;
      var tempDiv = document.createElement("div");
      tempDiv.innerHTML = this.renderWidget(chId, stageIdx);
      var newCard = tempDiv.firstElementChild;
      if (newCard) {
        card.replaceWith(newCard);
      }
    },

    // 2D & 3D Molecule Modal Visualizer
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
            '<h3 style="margin:0;font-size:1.25rem">' + (mode === "3d" ? '🌐 Mô hình phân tử 3D WebGL' : '👁 Cấu tạo hóa học 2D') + '</h3>' +
            '<p class="muted small" style="margin:4px 0 0">Chất: <b>' + sub.name + '</b> · ' + sub.formula + '</p>' +
          '</div>' +
          '<button class="btn ghost tiny modal-close-btn" data-act="closeMolModal">&times;</button>' +
        '</div>' +
        '<div class="modal-body">' +
          (mode === "3d" 
            ? '<div id="mol-3d-viewer" class="mol-3d-box" style="width:100%;height:360px;position:relative;"></div>' +
              '<p class="muted small" style="text-align:center;margin-top:8px">Chuột trái: Xoay 3D · Con lăn: Phóng to/thu nhỏ · Chuột phải: Di chuyển</p>'
            : '<div style="display:flex;justify-content:center;padding:20px;background:#ffffff;border-radius:12px;border:1px solid #e2e8f0">' +
                '<canvas id="mol-2d-canvas" width="380" height="260"></canvas>' +
              '</div>' +
              '<p class="muted small" style="text-align:center;margin-top:8px">Vẽ chuẩn xác 2D cấu tạo bởi SmilesDrawer</p>'
          ) +
        '</div>' +
      '</div>';

      document.body.appendChild(modal);

      // Render 2D with SmilesDrawer
      if (mode === "2d") {
        if (root.SmilesDrawer) {
          try {
            var drawer = new root.SmilesDrawer.Drawer({ width: 380, height: 260 });
            root.SmilesDrawer.parse(sub.smiles, function (tree) {
              drawer.draw(tree, "mol-2d-canvas", "light", false);
            });
          } catch (e) {
            console.error("SmilesDrawer error:", e);
          }
        } else {
          var can = document.getElementById("mol-2d-canvas");
          if (can) {
            var ctx = can.getContext("2d");
            ctx.font = "16px sans-serif";
            ctx.fillText(sub.name + ": " + sub.formula, 40, 120);
          }
        }
      }

      // Render 3D with 3Dmol.js
      if (mode === "3d") {
        var viewerEl = document.getElementById("mol-3d-viewer");
        if (root.$3Dmol && viewerEl) {
          try {
            var viewer = root.$3Dmol.createViewer(viewerEl, { backgroundColor: "0x1e293b" });
            if (sub.cid) {
              // Download 3D SDF from PubChem directly
              root.$3Dmol.download("cid:" + sub.cid, viewer, {}, function () {
                viewer.setStyle({}, { stick: { radius: 0.15 }, sphere: { scale: 0.28 } });
                viewer.zoomTo();
                viewer.render();
                viewer.spin(true);
              });
            } else {
              viewer.addLabel(sub.name, { fontSize: 16, fontColor: "white" });
              viewer.render();
            }
          } catch (e) {
            console.error("3Dmol error:", e);
          }
        }
      }
    }
  };

  // Delegated Global Event Listener for ChemLab interactions
  document.addEventListener("click", function (ev) {
    var target = ev.target;
    var btn = target.closest ? target.closest("[data-chemlab-act]") : null;
    if (btn) {
      ev.preventDefault();
      var act = btn.getAttribute("data-chemlab-act");
      var ch = btn.getAttribute("data-ch");
      var idx = parseInt(btn.getAttribute("data-idx"), 10);
      if (act === "reagent") {
        var rid = btn.getAttribute("data-rid");
        ChemLab.triggerReagent(ch, idx, rid);
      } else if (act === "tool") {
        var aid = btn.getAttribute("data-aid");
        ChemLab.triggerTool(ch, idx, aid);
      }
      return;
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

  // Export to window
  root.ChemLab = ChemLab;
})(window);
