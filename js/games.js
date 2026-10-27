/* ═══════════════════════════════════════════════════════════════════
   CHEMISTRY MINI-GAMES ARENA (ĐẤU TRƯỜNG MINI-GAMES HOÁ HỌC)
   3 Interactive Pedagogical Mini-Games:
   1. Sắp xếp Chuỗi phản ứng & Quy trình thí nghiệm (Chain Reaction Arranger)
   2. Thách đấu Ghép đôi Hoá chất & Hiện tượng thực nghiệm (Reagent Matcher)
   3. Thám tử Hoá học: Đoán chất bí ẩn qua chuỗi manh mối (Chemical Detective)
   ═══════════════════════════════════════════════════════════════════ */

(function (root) {
  'use strict';

  var GAME_ICONS = {
    sparkles: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/>',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v3h10v-3c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34M6 4h12a2 2 0 0 1 2 2v3a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6V6a2 2 0 0 1 2-2z"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    shuffle: '<path d="M16 3h5v5M4 20l17-17M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
    arrowUp: '<path d="m18 15-6-6-6 6"/>',
    arrowDown: '<path d="m6 9 6 6 6-6"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4"/>',
    cards: '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M2 6h2v14a2 2 0 0 0 2 2h12v2H6a4 4 0 0 1-4-4V6z"/>',
    rotate: '<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8M21 3v5h-5"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    atom: '<circle cx="12" cy="12" r="2.5"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(30 12 12)" fill="none"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(90 12 12)" fill="none"/><ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(150 12 12)" fill="none"/>'
  };

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function gIco(n) {
    var svg = GAME_ICONS[n] || (root.ICONS && root.ICONS[n]) || GAME_ICONS.sparkles;
    return '<svg class="ico game-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + svg + '</svg>';
  }

  /* ═══════════ SCENARIO REPOSITORIES ═══════════ */
  var CHAIN_SCENARIOS = [
    {
      id: "chain_pva",
      title: "Chuỗi điều chế Poly(vinyl alcohol) từ Khí thiên nhiên",
      tagline: "Tổng hợp màng bọc viên giặt thông minh tan trong nước từ methane CH₄",
      steps: [
        { id: "s1", label: "CH₄ (Methane)", desc: "Khí thiên nhiên khai thác từ mỏ khí" },
        { id: "s2", label: "C₂H₂ (Acetylene)", desc: "Nhiệt phân 1500°C làm lạnh nhanh: 2CH₄ → C₂H₂ + 3H₂" },
        { id: "s3", label: "CH₃COOCH=CH₂ (Vinyl acetate)", desc: "Cộng acetic acid: C₂H₂ + CH₃COOH → CH₃COOCH=CH₂" },
        { id: "s4", label: "[-CH₂-CH(OCOCH₃)-]ₙ (Poly(vinyl acetate) - PVA)", desc: "Trùng hợp monomer vinyl acetate (xúc tác peroxide, t°)" },
        { id: "s5", label: "[-CH₂-CH(OH)-]ₙ (Poly(vinyl alcohol))", desc: "Thủy phân kiềm một phần PVA trong dung dịch NaOH nóng" }
      ],
      insight: "Xuất sắc! Poly(vinyl alcohol) không thể điều chế trực tiếp bằng cách trùng hợp alcohol vinyl CH₂=CH-OH vì alcohol này không bền tự chuyển vị thành acetaldehyde CH₃CHO. Người ta bắt buộc phải đi vòng qua monomer vinyl acetate rồi thủy phân!"
    },
    {
      id: "chain_ethyl_acetate",
      title: "Quy trình chuẩn Điều chế & Tách chiết Ethyl Acetate trong Lab",
      tagline: "5 thao tác chuẩn mực trong phòng thí nghiệm Hóa học hữu cơ",
      steps: [
        { id: "s1", label: "1. Nạp chất phản ứng vào ống nghiệm khô", desc: "Cho 2 mL C₂H₅OH nguyên chất và 2 mL CH₃COOH băng" },
        { id: "s2", label: "2. Thêm xúc tác acid", desc: "Cho từ từ 1 mL H₂SO₄ đặc dọc theo thành ống nghiệm và lắc nhẹ" },
        { id: "s3", label: "3. Lắp ống sinh hàn & đun cách thuỷ", desc: "Đun trong nồi nước nóng 65 - 70°C khoảng 5-10 phút để ngưng tụ hồi lưu" },
        { id: "s4", label: "4. Salting-out (Muối kết)", desc: "Rót hỗn hợp phản ứng vào ống nghiệm chứa sẵn 2 mL dung dịch NaCl bão hoà lạnh" },
        { id: "s5", label: "5. Tách pha và thu hồi sản phẩm", desc: "Este nhẹ và không tan nổi lên trên thành lớp váng dầu trong suốt thơm ngát" }
      ],
      insight: "Chuẩn xác 100%! Đun cách thủy 65-70°C giúp kiểm soát nhiệt độ an toàn, tránh cồn bốc cháy hoặc este sôi bay hơi mất. Dung dịch NaCl bão hòa lạnh làm giảm độ tan và tăng chênh lệch khối lượng riêng, đẩy este nổi lên trên."
    },
    {
      id: "chain_aniline_cycle",
      title: "Chu trình Đục - Trong - Đục của Aniline",
      tagline: "Khảo sát tính base cực yếu và phản ứng tương tác acid-base của hợp chất thơm",
      steps: [
        { id: "s1", label: "1. Aniline trong nước cất", desc: "Aniline ít tan trong nước lạnh, tạo dung dịch vẩn đục và lắng xuống đáy" },
        { id: "s2", label: "2. Nhỏ dung dịch HCl đặc", desc: "Aniline phản ứng với HCl tạo muối [C₆H₅NH₃]⁺Cl⁻ tan tốt trong nước" },
        { id: "s3", label: "3. Quan sát dung dịch sau khi thêm HCl", desc: "Ống nghiệm chuyển từ vẩn đục sang trong suốt hoàn toàn" },
        { id: "s4", label: "4. Nhỏ tiếp dung dịch NaOH dư", desc: "Base mạnh NaOH đẩy amine yếu ra: C₆H₅NH₃Cl + NaOH → C₆H₅NH₂ + NaCl + H₂O" },
        { id: "s5", label: "5. Kết quả chu trình", desc: "Aniline tự do tái sinh không tan trong nước, dung dịch vẩn đục trở lại" }
      ],
      insight: "Rất chính xác! Thí nghiệm kinh điển chứng minh aniline có tính base (tác dụng với acid mạnh HCl tạo muối tan), nhưng lực base của aniline rất yếu (bị kiềm mạnh NaOH đẩy ra khỏi muối dễ dàng)."
    },
    {
      id: "chain_bio_ethanol",
      title: "Chuỗi sản xuất Xăng sinh học E5 từ Nông sản",
      tagline: "Quy trình công nghệ chế biến tinh bột ngô/sắn thành cồn sinh học thân thiện môi trường",
      steps: [
        { id: "s1", label: "1. Nguyên liệu Tinh bột (C₆H₁₀O₅)ₙ", desc: "Ngô, sắn lát được nghiền nhỏ và nấu chín tạo dịch tinh bột lỏng" },
        { id: "s2", label: "2. Đường hoá bằng Enzyme Amylase", desc: "Cắt mạch tinh bột thành Dextrin, Maltose và giải phóng Glucose C₆H₁₂O₆" },
        { id: "s3", label: "3. Lên men rượu ở 30 - 35°C", desc: "Men rượu chuyển hoá: C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂↑" },
        { id: "s4", label: "4. Chưng cất & Tách nước tuyệt đối", desc: "Chưng cất phân đoạn và làm khan đạt độ tinh khiết Ethanol ≥ 99,5%" },
        { id: "s5", label: "5. Phối trộn xăng sinh học E5", desc: "Phối trộn 5% thể tích bio-ethanol khan với 95% thể tích xăng khoáng RON 92" }
      ],
      insight: "Tư duy quy trình công nghiệp rất mạch lạc! Cần phải tách nước tuyệt đối (độ cồn >99.5%) trước khi phối trộn với xăng khoáng, vì nếu còn nước, xăng và cồn sẽ bị tách pha trong bình xăng động cơ."
    },
    {
      id: "chain_soap_making",
      title: "Quy trình Nấu xà phòng & Thu hồi Glycerol từ Mỡ bò",
      tagline: "Phản ứng xà phòng hoá chất béo no trong làng nghề và công nghiệp mỹ phẩm",
      steps: [
        { id: "s1", label: "1. Phối trộn nguyên liệu ban đầu", desc: "Cho mỡ bò (tristearin) và dung dịch xút NaOH 40% vào nồi nấu" },
        { id: "s2", label: "2. Gia nhiệt & khuấy đều liên tục", desc: "Đun sôi nhẹ hỗn hợp 30 - 45 phút, liên tục châm thêm nước để giữ thể tích" },
        { id: "s3", label: "3. Thêm dung dịch NaCl bão hoà nóng", desc: "Muối ăn làm giảm độ tan của muối sodium stearate (hiệu ứng muối kết)" },
        { id: "s4", label: "4. Vớt xà phòng đóng bánh", desc: "Xà phòng đông đặc nhẹ hơn nổi lên trên bề mặt, vớt ra ép khuôn bánh" },
        { id: "s5", label: "5. Thu hồi Glycerol tinh khiết", desc: "Lớp dung dịch đáy chứa glycerol C₃H₅(OH)₃ và NaCl, cô đặc và chưng cất thu glycerol" }
      ],
      insight: "Hoàn hảo! Nước cần được bổ sung liên tục trong quá trình đun để tránh xút cạn làm cháy khét chất béo. Dung dịch NaCl bão hòa là bí quyết để xà phòng đông đặc đóng bánh nổi lên trên."
    }
  ];

  var MATCH_SETS = [
    {
      id: "match_reagents",
      title: "Bộ 1: Thuốc thử Nhận biết Hoá học 12",
      desc: "Nối cặp chất phản ứng với hiện tượng thực nghiệm đặc trưng nhất",
      pairs: [
        {
          left: "Glucose + Cu(OH)₂ (nhiệt độ thường)",
          right: "Dung dịch xanh lam thẫm (phức chelate polyol)",
          note: "Do có 5 nhóm -OH kề nhau hòa tan Cu(OH)₂"
        },
        {
          left: "Glucose + Cu(OH)₂ (đun nóng)",
          right: "Kết tủa đỏ gạch Cu₂O↓",
          note: "Nhóm -CHO bị oxi hóa thành -COOH, Cu²⁺ khử thành Cu⁺"
        },
        {
          left: "Glucose + Thuốc thử Tollens (đun nhẹ)",
          right: "Bạc kim loại Ag sáng bóng bám thành ống",
          note: "1 mol Glucose sinh ra đúng 2 mol Ag"
        },
        {
          left: "Hồ tinh bột + Dung dịch Iodine (I₂)",
          right: "Hợp chất bọc màu xanh tím đặc trưng",
          note: "Phân tử I₂ chui vào lòng xoắn amylose; đun mất màu, nguội hiện lại"
        },
        {
          left: "Aniline + Nước Bromine (Br₂)",
          right: "Kết tủa trắng 2,4,6-tribromoaniline",
          note: "Nhóm -NH₂ hoạt hóa vòng thơm thế 3 nguyên tử Br"
        },
        {
          left: "Lòng trắng trứng (Albumin) + Cu(OH)₂/NaOH",
          right: "Dung dịch màu tím đặc trưng (Phản ứng Biuret)",
          note: "Protein có nhiều liên kết peptide tạo phức tím với Cu²⁺"
        }
      ]
    },
    {
      id: "match_lipids_polymers",
      title: "Bộ 2: Tính chất Chất béo, Amino acid & Polime",
      desc: "Nối các chất hữu cơ với phản ứng và tính chất hóa học cốt lõi",
      pairs: [
        {
          left: "Triolein (lỏng) + H₂ (xúc tác Ni, t°)",
          right: "Chất béo rắn Tristearin (bơ nhân tạo)",
          note: "Hydrogen hóa liên kết đôi C=C của gốc oleate không no"
        },
        {
          left: "Glutamic acid + Giấy quỳ tím ẩm",
          right: "Quỳ tím chuyển sang màu đỏ",
          note: "Phân tử có 2 nhóm -COOH và 1 nhóm -NH₂ (tính acid trội hơn)"
        },
        {
          left: "Lysine + Giấy quỳ tím ẩm",
          right: "Quỳ tím chuyển sang màu xanh",
          note: "Phân tử có 2 nhóm -NH₂ và 1 nhóm -COOH (tính base trội hơn)"
        },
        {
          left: "Dipeptide Gly-Ala + Cu(OH)₂/NaOH",
          right: "Không có hiện tượng màu tím (không phản ứng)",
          note: "Dipeptide chỉ có 1 liên kết peptide, Biuret cần từ 2 liên kết trở lên"
        },
        {
          left: "Trùng hợp Vinyl chloride (CH₂=CHCl)",
          right: "Nhựa Poly(vinyl chloride) - PVC làm ống dẫn nước",
          note: "Phản ứng trùng hợp nhờ mở liên kết đôi C=C"
        },
        {
          left: "Đun sôi nước canh riêu cua đồng",
          right: "Protein cua bị nhiệt đông tụ đóng bánh nổi lên",
          note: "Nhiệt độ cao phá vỡ cấu trúc không gian bậc cao của protein"
        }
      ]
    }
  ];

  var DETECTIVE_CASES = [
    {
      id: "case_aniline",
      title: "Vụ án 01: Giọt dầu sánh trong suốt bí ẩn",
      suspects: ["Aniline", "Phenol", "Glycerol", "Benzyl alcohol"],
      correct: "Aniline",
      clues: [
        {
          level: 1,
          name: "Trạng thái vật lý ban đầu",
          text: "Chất lỏng sánh như dầu, không màu, để lâu ngoài không khí bị ngả màu nâu đen do oxi hóa chậm. Rất ít tan trong nước lạnh và nặng hơn nước, lắng xuống đáy ống nghiệm."
        },
        {
          level: 2,
          name: "Phản ứng với halogen",
          text: "Chỉ cần nhỏ một giọt nước bromine vào ống nghiệm ở nhiệt độ thường (không cần bất kỳ xúc tác kim loại nào), ngay lập tức xuất hiện kết tủa trắng tinh che kín dung dịch."
        },
        {
          level: 3,
          name: "Tính chất acid - base & chỉ thị màu",
          text: "Dù phân tử có tính base, nhưng nhúng giấy quỳ tím ẩm vào hoàn toàn KHÔNG ĐỔI MÀU. Khi thêm dung dịch HCl vào thì chất lỏng lập tức tan hết tạo dung dịch trong suốt."
        },
        {
          level: 4,
          name: "Ứng dụng công nghiệp cốt lõi",
          text: "Ở 0 - 5°C phản ứng với nitrous acid (HNO₂) tạo muối benzenediazonium chloride, là nguyên liệu khởi đầu then chốt sản xuất phẩm nhuộm azo rực rỡ cho ngành dệt may."
        }
      ],
      reveal: {
        formula: "C₆H₅NH₂ (M = 93)",
        summary: "Aniline là arylamine bậc một tiêu biểu. Vòng thơm hút electron làm giảm mạnh lực base (không làm đổi màu quỳ tím) nhưng nhóm -NH₂ lại hoạt hóa vị trí ortho và para của nhân thơm cực mạnh tạo kết tủa trắng 2,4,6-tribromoaniline với nước Br₂."
      }
    },
    {
      id: "case_glucose",
      title: "Vụ án 02: Viên tinh thể ngọt ngào trong huyết thanh",
      suspects: ["Glucose", "Fructose", "Saccharose", "Glycerol"],
      correct: "Glucose",
      clues: [
        {
          level: 1,
          name: "Trạng thái & Nguồn gốc sinh học",
          text: "Chất rắn kết tinh không màu, vị ngọt thanh, dễ tan trong nước. Luôn duy trì nồng độ ổn định khoảng 0,1% trong máu người bình thường để nuôi dưỡng các tế bào não."
        },
        {
          level: 2,
          name: "Thực nghiệm với Cu(OH)₂",
          text: "Ở nhiệt độ phòng, hòa tan kết tủa Cu(OH)₂ tạo dung dịch màu xanh lam thẫm. Nhưng khi đun nóng ống nghiệm, màu xanh biến mất và xuất hiện kết tủa đỏ gạch Cu₂O."
        },
        {
          level: 3,
          name: "Phản ứng phân biệt đặc hiệu",
          text: "Làm mất màu nâu đỏ của dung dịch nước bromine tạo gluconic acid (khác hẳn với đồng phân fructose của nó không làm mất màu nước bromine)."
        },
        {
          level: 4,
          name: "Ứng dụng y tế & công nghiệp",
          text: "Dung dịch 5% dùng làm huyết thanh ngọt truyền dịch cấp cứu hồi phục sức khỏe tức thì; dùng để tráng ruột phích giữ nhiệt an toàn thay thế formaldehyde độc hại."
        }
      ],
      reveal: {
        formula: "CH₂OH-[CHOH]₄-CHO (C₆H₁₂O₆, M = 180)",
        summary: "Glucose là monosaccharide aldohexose. Có 5 nhóm -OH kề nhau (tạo phức xanh lam với Cu(OH)₂) và 1 nhóm aldehyde -CHO (tráng bạc tỉ lệ 1:2, làm mất màu nước bromine và khử Cu(OH)₂ đun nóng thành kết tủa đỏ gạch Cu₂O)."
      }
    },
    {
      id: "case_glutamic",
      title: "Vụ án 03: Hạt gia vị Umami đậm đà",
      suspects: ["Glutamic acid", "Glycine", "Lysine", "Alanine"],
      correct: "Glutamic acid",
      clues: [
        {
          level: 1,
          name: "Trạng thái vật lý & Cấu trúc ion",
          text: "Chất rắn kết tinh màu trắng, nhiệt độ nóng chảy cao và phân hủy trước khi sôi. Tồn tại chủ yếu ở dạng ion lưỡng cực trong dung dịch nước."
        },
        {
          level: 2,
          name: "Phản ứng với quỳ tím",
          text: "Trong số các amino acid chuẩn của SGK, dung dịch chất này là một trong những trường hợp đặc biệt làm giấy quỳ tím hóa ĐỎ rõ rệt."
        },
        {
          level: 3,
          name: "Phân tích nhóm chức",
          text: "Công thức phân tử C₅H₉NO₄ (M = 147). Phân tử chứa 1 nhóm amine (-NH₂) nhưng có tới 2 nhóm carboxyl (-COOH), giải thích vì sao tính acid chiếm ưu thế."
        },
        {
          level: 4,
          name: "Đời sống ẩm thực & Y học",
          text: "Muối monosodium của chất này (bột ngọt / mì chính) kích thích thụ thể vị giác tạo nên vị ngọt thịt Umami; acid tự do là chất dẫn truyền thần kinh quan trọng trong não bộ."
        }
      ],
      reveal: {
        formula: "HOOC-CH₂-CH₂-CH(NH₂)-COOH (M = 147)",
        summary: "Glutamic acid là α-amino acid có 2 nhóm -COOH và 1 nhóm -NH₂. Do số nhóm -COOH nhiều hơn -NH₂ nên dung dịch có pH < 7 làm quỳ tím chuyển sang màu đỏ. Muối monosodium glutamate là gia vị mì chính quen thuộc."
      }
    },
    {
      id: "case_phenyl_acetate",
      title: "Vụ án 04: Este ngang tàng không sinh alcohol",
      suspects: ["Phenyl acetate", "Ethyl acetate", "Vinyl acetate", "Methyl benzoate"],
      correct: "Phenyl acetate",
      clues: [
        {
          level: 1,
          name: "Trạng thái & Khối lượng phân tử",
          text: "Chất lỏng không màu, ít tan trong nước, có mùi thơm nhẹ. Công thức phân tử C₈H₈O₂ (M = 136), chứa vòng benzene trong phân tử."
        },
        {
          level: 2,
          name: "Tỉ lệ phản ứng xà phòng hoá bất thường",
          text: "Dù chỉ là ester đơn chức nhưng khi phản ứng với dung dịch NaOH nóng, 1 mol chất này lại tiêu tốn ĐÚNG 2 MOL NaOH (tỉ lệ mol 1 : 2)!"
        },
        {
          level: 3,
          name: "Bản chất sản phẩm sau phản ứng",
          text: "Dung dịch sau phản ứng hoàn toàn KHÔNG CHỨA ALCOHOL hay phenol tự do, mà thu được hỗn hợp gồm 2 MUỐI và H₂O."
        },
        {
          level: 4,
          name: "Thành phần 2 muối thu được",
          text: "Khi cô cạn dung dịch sau xà phòng hóa, thu được muối sodium acetate (CH₃COONa) và muối sodium phenolate (C₆H₅ONa)."
        }
      ],
      reveal: {
        formula: "CH₃COOC₆H₅ (M = 136)",
        summary: "Phenyl acetate là este của phenol. Khi thủy phân trong NaOH, phenol sinh ra có tính acid nên lập tức phản ứng tiếp với NaOH tạo C₆H₅ONa và H₂O. Vì vậy este của phenol luôn ăn 2 NaOH và tạo 2 muối, không bao giờ sinh ra alcohol!"
      }
    }
  ];

  /* ═══════════ GAME CONTROLLER STATE ═══════════ */
  var ChemGames = {
    mode: "hub", // "hub" | "chain" | "match" | "detective"
    scenarioIdx: 0,

    // Game 1: Chain Arranger state
    chain: {
      currentItems: [],
      checked: false,
      isCorrect: false,
      movesCount: 0
    },

    // Game 2: Match state
    match: {
      leftCards: [],
      rightCards: [],
      selectedLeft: null,
      selectedRight: null,
      matchedPairs: {},
      combo: 0,
      startTime: 0,
      endTime: 0
    },

    // Game 3: Detective state
    detective: {
      revealedCount: 1,
      guessed: false,
      userPick: null,
      isCorrect: false
    },

    init: function () {
      // Intentionally kept lean
    },

    /* ═══════════ MAIN RENDER DISPATCHER ═══════════ */
    renderArena: function () {
      var content = "";
      if (this.mode === "chain") content = this.renderChainView();
      else if (this.mode === "match") content = this.renderMatchView();
      else if (this.mode === "detective") content = this.renderDetectiveView();
      else content = this.renderHubView();

      return '<div class="chem-games-arena">' +
        this.renderArenaHeader() +
        content +
      '</div>';
    },

    renderArenaHeader: function () {
      var navButtons = '<div class="arena-nav-chips">' +
        '<button class="arena-chip' + (this.mode === "hub" ? " active" : "") + '" data-act="cgNav" data-gmode="hub">' + gIco("cards") + ' Sảnh trò chơi</button>' +
        '<button class="arena-chip' + (this.mode === "chain" ? " active" : "") + '" data-act="cgNav" data-gmode="chain">' + gIco("link") + ' 1. Sắp xếp Chuỗi phản ứng</button>' +
        '<button class="arena-chip' + (this.mode === "match" ? " active" : "") + '" data-act="cgNav" data-gmode="match">' + gIco("zap") + ' 2. Thách đấu Ghép đôi</button>' +
        '<button class="arena-chip' + (this.mode === "detective" ? " active" : "") + '" data-act="cgNav" data-gmode="detective">' + gIco("search") + ' 3. Thám tử Đoán chất</button>' +
      '</div>';

      return '<div class="arena-header">' +
        '<div class="arena-title-row">' +
          '<div>' +
            '<h2>' + gIco("sparkles") + ' Đấu trường Mini-games Hoá học 12</h2>' +
            '<p class="muted small">Vừa chơi vừa nhớ sâu: Biến chuỗi phản ứng khô khan và hiện tượng thí nghiệm thành thử thách phản xạ sinh động!</p>' +
          '</div>' +
        '</div>' +
        navButtons +
      '</div>';
    },

    /* ═══════════ 0. HUB VIEW ═══════════ */
    renderHubView: function () {
      return '<div class="game-hub-grid">' +
        '<div class="game-hub-card chain-card">' +
          '<div class="gh-badge chain">' + gIco("link") + ' Trò chơi tư duy quy trình</div>' +
          '<h3>Sắp xếp Chuỗi phản ứng & Lab</h3>' +
          '<p>Các mắt xích chuyển hóa và quy trình thí nghiệm hữu cơ bị đảo lộn thứ tự. Hãy vận dụng tư duy cơ chế để hoán đổi các bước về đúng trật tự chuẩn xác!</p>' +
          '<div class="gh-stats"><span>' + gIco("sparkles") + ' 5 Thử thách lớp 12</span><span>' + gIco("trophy") + ' +30 XP / màn</span></div>' +
          '<button class="btn primary full-w" data-act="cgStartChain" data-idx="0">Bắt đầu Sắp xếp chuỗi →</button>' +
        '</div>' +

        '<div class="game-hub-card match-card">' +
          '<div class="gh-badge match">' + gIco("zap") + ' Phản xạ ghép đôi siêu tốc</div>' +
          '<h3>Thách đấu Ghép đôi Hoá chất</h3>' +
          '<p>Nối nhanh cặp chất phản ứng với màu sắc và hiện tượng kết tủa / tráng gương đặc trưng. Giữ vững chuỗi combo ghép đúng liên tiếp để nhân đôi điểm thưởng!</p>' +
          '<div class="gh-stats"><span>' + gIco("flame") + ' 2 Bộ thuốc thử cốt lõi</span><span>' + gIco("trophy") + ' +40 XP / màn</span></div>' +
          '<button class="btn primary full-w" data-act="cgStartMatch" data-idx="0">Vào Đấu trường Ghép đôi →</button>' +
        '</div>' +

        '<div class="game-hub-card detective-card">' +
          '<div class="gh-badge detective">' + gIco("search") + ' Thám tử phá án hoá học</div>' +
          '<h3>Thám tử Hoá học: Đoán chất bí ẩn</h3>' +
          '<p>Lần theo 4 manh mối thực nghiệm: từ tính chất vật lý, phản ứng định tính đến ứng dụng đời sống để vạch trần danh tính của chất hữu cơ bí ẩn X!</p>' +
          '<div class="gh-stats"><span>' + gIco("shield") + ' 4 Vụ án điểm 9+</span><span>' + gIco("trophy") + ' Lên tới +50 XP</span></div>' +
          '<button class="btn primary full-w" data-act="cgStartDetective" data-idx="0">Mở Hồ sơ Vụ án →</button>' +
        '</div>' +
      '</div>';
    },

    /* ═══════════ 1. GAME: CHAIN REACTION ARRANGER ═══════════ */
    startChainGame: function (idx) {
      this.mode = "chain";
      this.scenarioIdx = Math.max(0, Math.min(idx || 0, CHAIN_SCENARIOS.length - 1));
      var sc = CHAIN_SCENARIOS[this.scenarioIdx];
      // Clone & shuffle items initially
      var shuffled = sc.steps.slice();
      for (var i = shuffled.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = shuffled[i]; shuffled[i] = shuffled[j]; shuffled[j] = tmp;
      }
      this.chain = {
        currentItems: shuffled,
        checked: false,
        isCorrect: false,
        movesCount: 0
      };
      if (root.renderPracticeOnly) root.renderPracticeOnly();
    },

    renderChainView: function () {
      var sc = CHAIN_SCENARIOS[this.scenarioIdx];
      var ch = this.chain;

      var selectorOpts = CHAIN_SCENARIOS.map(function (s, i) {
        return '<option value="' + i + '" ' + (i === ChemGames.scenarioIdx ? "selected" : "") + '>' + (i + 1) + '. ' + s.title + '</option>';
      }).join("");

      var itemsHtml = ch.currentItems.map(function (it, i) {
        var cls = "chain-step-card";
        if (ch.checked) {
          var isAtCorrectPos = (sc.steps[i].id === it.id);
          cls += isAtCorrectPos ? " correct" : " wrong";
        }
        return '<div class="' + cls + '" data-id="' + it.id + '">' +
          '<div class="csc-pos">' + (i + 1) + '</div>' +
          '<div class="csc-content">' +
            '<div class="csc-label">' + it.label + '</div>' +
            '<div class="csc-desc">' + it.desc + '</div>' +
          '</div>' +
          '<div class="csc-actions">' +
            '<button class="csc-btn up" data-act="cgChainMove" data-dir="up" data-idx="' + i + '" ' + (i === 0 || ch.isCorrect ? 'disabled' : '') + ' title="Di chuyển lên trên">' + gIco("arrowUp") + '</button>' +
            '<button class="csc-btn down" data-act="cgChainMove" data-dir="down" data-idx="' + i + '" ' + (i === ch.currentItems.length - 1 || ch.isCorrect ? 'disabled' : '') + ' title="Di chuyển xuống dưới">' + gIco("arrowDown") + '</button>' +
          '</div>' +
        '</div>' +
        (i < ch.currentItems.length - 1 ? '<div class="chain-connector ' + (ch.isCorrect ? 'active' : '') + '">' + gIco("arrowDown") + '</div>' : '');
      }).join("");

      var feedbackHtml = "";
      if (ch.checked) {
        if (ch.isCorrect) {
          feedbackHtml = '<div class="chain-feedback ok">' +
            '<div class="cfb-head">' + gIco("check") + ' <b>Chuỗi phản ứng hoàn toàn chính xác! (+30 XP)</b></div>' +
            '<div class="cfb-body">' + sc.insight + '</div>' +
            '<div class="cfb-nav" style="margin-top:14px;display:flex;gap:10px">' +
              (this.scenarioIdx < CHAIN_SCENARIOS.length - 1 ? '<button class="btn primary small" data-act="cgStartChain" data-idx="' + (this.scenarioIdx + 1) + '">Thử thách tiếp theo →</button>' : '') +
              '<button class="btn ghost small" data-act="cgStartChain" data-idx="' + this.scenarioIdx + '">' + gIco("rotate") + ' Xếp lại màn này</button>' +
            '</div>' +
          '</div>';
        } else {
          feedbackHtml = '<div class="chain-feedback bad">' +
            '<div class="cfb-head">' + gIco("close") + ' <b>Thứ tự chưa hoàn toàn đúng!</b></div>' +
            '<div class="cfb-body">Các ô màu đỏ đang nằm sai vị trí trong chuỗi chuyển hóa hoặc quy trình điều chế. Hãy bấm phím mũi tên ↑ / ↓ để hoán đổi lại vị trí!</div>' +
          '</div>';
        }
      }

      return '<div class="game-view chain-game">' +
        '<div class="gv-top-bar">' +
          '<button class="btn ghost tiny" data-act="cgNav" data-gmode="hub">← Về sảnh game</button>' +
          '<div style="min-width:260px"><select class="sel" data-act="cgChainSelect">' + selectorOpts + '</select></div>' +
        '</div>' +
        '<div class="chain-game-box">' +
          '<div class="cgb-header">' +
            '<h3>' + gIco("link") + ' ' + sc.title + '</h3>' +
            '<p class="muted small">' + sc.tagline + ' · Sử dụng nút <b>↑ / ↓</b> để xếp đúng trật tự từ bước đầu đến sản phẩm cuối cùng.</p>' +
          '</div>' +
          '<div class="chain-steps-list">' + itemsHtml + '</div>' +
          feedbackHtml +
          '<div class="cgb-actions" style="margin-top:18px;display:flex;justify-content:center;gap:12px">' +
            '<button class="btn primary" data-act="cgChainCheck" ' + (ch.isCorrect ? 'disabled' : '') + '>' + gIco("check") + ' Kiểm tra chuỗi phản ứng</button>' +
            '<button class="btn ghost" data-act="cgStartChain" data-idx="' + this.scenarioIdx + '">' + gIco("shuffle") + ' Xáo trộn lại</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    },

    moveChainStep: function (idx, dir) {
      if (this.chain.isCorrect) return;
      var targetIdx = dir === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= this.chain.currentItems.length) return;

      var tmp = this.chain.currentItems[idx];
      this.chain.currentItems[idx] = this.chain.currentItems[targetIdx];
      this.chain.currentItems[targetIdx] = tmp;
      this.chain.movesCount++;
      this.chain.checked = false; // Reset check state on move

      if (root.renderPracticeOnly) root.renderPracticeOnly();
    },

    checkChain: function () {
      var sc = CHAIN_SCENARIOS[this.scenarioIdx];
      var correct = true;
      for (var i = 0; i < sc.steps.length; i++) {
        if (sc.steps[i].id !== this.chain.currentItems[i].id) {
          correct = false;
          break;
        }
      }
      this.chain.checked = true;
      this.chain.isCorrect = correct;
      if (correct) {
        if (root.addXP && root.profile) root.addXP(root.profile(), "g12c1", 30);
      }
      if (root.renderPracticeOnly) root.renderPracticeOnly();
    },

    /* ═══════════ 2. GAME: CHEMICAL REAGENT MATCHER ═══════════ */
    startMatchGame: function (idx) {
      this.mode = "match";
      this.scenarioIdx = Math.max(0, Math.min(idx || 0, MATCH_SETS.length - 1));
      var set = MATCH_SETS[this.scenarioIdx];

      var left = set.pairs.map(function (p, i) { return { id: i, text: p.left, note: p.note }; });
      var right = set.pairs.map(function (p, i) { return { id: i, text: p.right }; });

      // Shuffle right column independently
      for (var i = right.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = right[i]; right[i] = right[j]; right[j] = tmp;
      }

      this.match = {
        leftCards: left,
        rightCards: right,
        selectedLeft: null,
        selectedRight: null,
        matchedPairs: {},
        combo: 0,
        startTime: Date.now(),
        endTime: 0
      };
      if (root.renderPracticeOnly) root.renderPracticeOnly();
    },

    renderMatchView: function () {
      var set = MATCH_SETS[this.scenarioIdx];
      var m = this.match;
      var totalPairs = set.pairs.length;
      var matchedCount = Object.keys(m.matchedPairs).length;
      var isAllDone = matchedCount >= totalPairs;

      var selectorOpts = MATCH_SETS.map(function (s, i) {
        return '<option value="' + i + '" ' + (i === ChemGames.scenarioIdx ? "selected" : "") + '>' + s.title + '</option>';
      }).join("");

      var leftHtml = m.leftCards.map(function (c) {
        var isMatched = !!m.matchedPairs[c.id];
        var isSelected = (m.selectedLeft === c.id);
        var cls = "match-card-item left";
        if (isMatched) cls += " matched";
        if (isSelected) cls += " selected";
        return '<button class="' + cls + '" data-act="cgMatchPickLeft" data-id="' + c.id + '" ' + (isMatched ? 'disabled' : '') + '>' +
          '<span class="mci-icon">' + gIco("atom") + '</span>' +
          '<span class="mci-text">' + c.text + '</span>' +
        '</button>';
      }).join("");

      var rightHtml = m.rightCards.map(function (c) {
        var isMatched = !!m.matchedPairs[c.id];
        var isSelected = (m.selectedRight === c.id);
        var cls = "match-card-item right";
        if (isMatched) cls += " matched";
        if (isSelected) cls += " selected";
        return '<button class="' + cls + '" data-act="cgMatchPickRight" data-id="' + c.id + '" ' + (isMatched ? 'disabled' : '') + '>' +
          '<span class="mci-icon">' + gIco("sparkles") + '</span>' +
          '<span class="mci-text">' + c.text + '</span>' +
        '</button>';
      }).join("");

      var victoryBanner = "";
      if (isAllDone) {
        var elapsedSec = Math.round(((m.endTime || Date.now()) - m.startTime) / 1000);
        victoryBanner = '<div class="match-victory-box">' +
          '<h3>' + gIco("trophy") + ' Xuất sắc! Bạn đã ghép đôi chính xác toàn bộ hiện tượng!</h3>' +
          '<p>Thời gian hoàn thành: <b>' + elapsedSec + 's</b> · Thưởng <b>+40 XP</b></p>' +
          '<div style="margin-top:12px;display:flex;justify-content:center;gap:10px">' +
            (this.scenarioIdx < MATCH_SETS.length - 1 ? '<button class="btn primary small" data-act="cgStartMatch" data-idx="' + (this.scenarioIdx + 1) + '">Bộ câu hỏi kế tiếp →</button>' : '') +
            '<button class="btn ghost small" data-act="cgStartMatch" data-idx="' + this.scenarioIdx + '">' + gIco("rotate") + ' Chơi lại bộ này</button>' +
          '</div>' +
        '</div>';
      }

      return '<div class="game-view match-game">' +
        '<div class="gv-top-bar">' +
          '<button class="btn ghost tiny" data-act="cgNav" data-gmode="hub">← Về sảnh game</button>' +
          '<div style="min-width:260px"><select class="sel" data-act="cgMatchSelect">' + selectorOpts + '</select></div>' +
        '</div>' +
        '<div class="match-game-box">' +
          '<div class="mgb-top-stats">' +
            '<div>' +
              '<h3>' + gIco("zap") + ' ' + set.title + '</h3>' +
              '<p class="muted small">' + set.desc + '</p>' +
            '</div>' +
            '<div class="mgb-score-pill">' +
              '<span>Tiến độ: <b>' + matchedCount + ' / ' + totalPairs + '</b></span>' +
              (m.combo > 1 ? '<span class="combo-pill">' + gIco("flame") + ' Combo x' + m.combo + '</span>' : '') +
            '</div>' +
          '</div>' +
          victoryBanner +
          '<div class="match-columns-grid">' +
            '<div class="match-col">' +
              '<div class="match-col-title">' + gIco("atom") + ' Thuốc thử / Cặp chất</div>' +
              '<div class="match-cards-stack">' + leftHtml + '</div>' +
            '</div>' +
            '<div class="match-col">' +
              '<div class="match-col-title">' + gIco("sparkles") + ' Hiện tượng / Màu sắc / Sản phẩm</div>' +
              '<div class="match-cards-stack">' + rightHtml + '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    },

    pickMatchLeft: function (id) {
      id = parseInt(id, 10);
      this.match.selectedLeft = id;
      if (this.match.selectedRight !== null) {
        this.evaluateMatch();
      } else {
        if (root.renderPracticeOnly) root.renderPracticeOnly();
      }
    },

    pickMatchRight: function (id) {
      id = parseInt(id, 10);
      this.match.selectedRight = id;
      if (this.match.selectedLeft !== null) {
        this.evaluateMatch();
      } else {
        if (root.renderPracticeOnly) root.renderPracticeOnly();
      }
    },

    evaluateMatch: function () {
      var m = this.match;
      var leftId = m.selectedLeft;
      var rightId = m.selectedRight;

      if (leftId === rightId) {
        // MATCH!
        m.matchedPairs[leftId] = true;
        m.combo++;
        m.selectedLeft = null;
        m.selectedRight = null;

        var set = MATCH_SETS[this.scenarioIdx];
        if (Object.keys(m.matchedPairs).length >= set.pairs.length) {
          m.endTime = Date.now();
          if (root.addXP && root.profile) root.addXP(root.profile(), "g12c2", 40);
        }
      } else {
        // MISMATCH
        m.combo = 0;
        m.selectedLeft = null;
        m.selectedRight = null;
      }
      if (root.renderPracticeOnly) root.renderPracticeOnly();
    },

    /* ═══════════ 3. GAME: CHEMICAL DETECTIVE (ĐOÁN CHẤT BÍ ẨN) ═══════════ */
    startDetectiveGame: function (idx) {
      this.mode = "detective";
      this.scenarioIdx = Math.max(0, Math.min(idx || 0, DETECTIVE_CASES.length - 1));
      this.detective = {
        revealedCount: 1,
        guessed: false,
        userPick: null,
        isCorrect: false
      };
      if (root.renderPracticeOnly) root.renderPracticeOnly();
    },

    renderDetectiveView: function () {
      var dCase = DETECTIVE_CASES[this.scenarioIdx];
      var d = this.detective;

      var selectorOpts = DETECTIVE_CASES.map(function (c, i) {
        return '<option value="' + i + '" ' + (i === ChemGames.scenarioIdx ? "selected" : "") + '>' + c.title + '</option>';
      }).join("");

      // Calculate reward XP based on clues used
      var maxXP = 50;
      if (d.revealedCount === 2) maxXP = 35;
      else if (d.revealedCount === 3) maxXP = 25;
      else if (d.revealedCount >= 4) maxXP = 15;

      var cluesHtml = dCase.clues.map(function (clue, idx) {
        var isRevealed = (idx < d.revealedCount);
        return '<div class="detective-clue-card' + (isRevealed ? " revealed" : " locked") + '">' +
          '<div class="dcc-head">' +
            '<span class="dcc-badge">' + gIco("search") + ' Manh mối #' + (idx + 1) + ': ' + clue.name + '</span>' +
            (!isRevealed ? '<span class="dcc-lock">' + gIco("shield") + ' Đang khoá</span>' : '') +
          '</div>' +
          (isRevealed
            ? '<div class="dcc-body">' + clue.text + '</div>'
            : '<div class="dcc-teaser">Bấm "Mở manh mối tiếp theo" để khám phá thêm dấu vết thực nghiệm.</div>') +
        '</div>';
      }).join("");

      var suspectsHtml = dCase.suspects.map(function (sus) {
        var cls = "suspect-opt-btn";
        var isPicked = (d.userPick === sus);
        if (d.guessed) {
          if (sus === dCase.correct) cls += " is-correct";
          if (isPicked && sus !== dCase.correct) cls += " is-wrong";
        }
        return '<button class="' + cls + '" data-act="cgDetectiveGuess" data-sub="' + esc(sus) + '" ' + (d.guessed ? 'disabled' : '') + '>' +
          '<span class="sob-name"><b>' + sus + '</b></span>' +
        '</button>';
      }).join("");

      var verdictHtml = "";
      if (d.guessed) {
        if (d.isCorrect) {
          verdictHtml = '<div class="detective-verdict ok">' +
            '<div class="dv-head">' + gIco("trophy") + ' <b>Phá án thành công! Thám tử hạng S (+' + maxXP + ' XP)</b></div>' +
            '<div class="dv-reveal">' +
              '<div class="dv-formula">Chất bí ẩn chính là: <b>' + dCase.correct + '</b> [' + dCase.reveal.formula + ']</div>' +
              '<div class="dv-sum">' + dCase.reveal.summary + '</div>' +
            '</div>' +
            '<div style="margin-top:14px;display:flex;gap:10px">' +
              (this.scenarioIdx < DETECTIVE_CASES.length - 1 ? '<button class="btn primary small" data-act="cgStartDetective" data-idx="' + (this.scenarioIdx + 1) + '">Mở Vụ án tiếp theo →</button>' : '') +
              '<button class="btn ghost small" data-act="cgStartDetective" data-idx="' + this.scenarioIdx + '">' + gIco("rotate") + ' Thử lại vụ án</button>' +
            '</div>' +
          '</div>';
        } else {
          verdictHtml = '<div class="detective-verdict bad">' +
            '<div class="dv-head">' + gIco("close") + ' <b>Suy luận chưa chuẩn xác!</b></div>' +
            '<div class="dv-body">Chất bạn chọn không khớp với các bằng chứng thực nghiệm ở trên. Hãy quan sát kỹ lại các manh mối và thử lại!</div>' +
            '<div style="margin-top:12px"><button class="btn warn small" data-act="cgStartDetective" data-idx="' + this.scenarioIdx + '">Lật lại hồ sơ vụ án</button></div>' +
          '</div>';
        }
      }

      return '<div class="game-view detective-game">' +
        '<div class="gv-top-bar">' +
          '<button class="btn ghost tiny" data-act="cgNav" data-gmode="hub">← Về sảnh game</button>' +
          '<div style="min-width:260px"><select class="sel" data-act="cgDetectiveSelect">' + selectorOpts + '</select></div>' +
        '</div>' +
        '<div class="detective-game-box">' +
          '<div class="dgb-header">' +
            '<div>' +
              '<h3>' + gIco("search") + ' ' + dCase.title + '</h3>' +
              '<p class="muted small">Lần theo các manh mối để tìm ra chất hữu cơ bí ẩn. Càng dùng ít manh mối, điểm thưởng phá án càng cao!</p>' +
            '</div>' +
            '<div class="bounty-pill">' + gIco("trophy") + ' Phần thưởng hiện tại: <b>+' + maxXP + ' XP</b></div>' +
          '</div>' +
          '<div class="detective-clues-list">' + cluesHtml + '</div>' +
          (d.revealedCount < 4 && !d.guessed
            ? '<div style="text-align:center;margin:16px 0"><button class="btn ghost small" data-act="cgDetectiveRevealClue">' + gIco("sparkles") + ' Mở manh mối tiếp theo (' + (d.revealedCount + 1) + '/4)</button></div>'
            : '') +
          '<div class="detective-guess-area">' +
            '<h4>' + gIco("target") + ' Đưa ra kết luận điều tra — Chất bí ẩn X là ai?</h4>' +
            '<div class="suspects-grid">' + suspectsHtml + '</div>' +
            verdictHtml +
          '</div>' +
        '</div>' +
      '</div>';
    },

    revealNextClue: function () {
      if (this.detective.revealedCount < 4) {
        this.detective.revealedCount++;
        if (root.renderPracticeOnly) root.renderPracticeOnly();
      }
    },

    guessDetective: function (sub) {
      if (this.detective.guessed) return;
      var dCase = DETECTIVE_CASES[this.scenarioIdx];
      var isCorrect = (sub === dCase.correct);
      this.detective.guessed = true;
      this.detective.userPick = sub;
      this.detective.isCorrect = isCorrect;

      if (isCorrect) {
        var xp = 50;
        if (this.detective.revealedCount === 2) xp = 35;
        else if (this.detective.revealedCount === 3) xp = 25;
        else if (this.detective.revealedCount >= 4) xp = 15;
        if (root.addXP && root.profile) root.addXP(root.profile(), "g12c3", xp);
      }
      if (root.renderPracticeOnly) root.renderPracticeOnly();
    }
  };

  root.ChemGames = ChemGames;
})(typeof window !== 'undefined' ? window : this);
