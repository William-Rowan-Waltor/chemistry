/* ═══════════════════════════════════════════════════════════════════
   EXAM PITFALL & TRAP ENCYCLOPEDIA (SỔ TAY BẪY ĐỀ THI & ĐIỂM 9+)
   Feynman 2.0 Pedagogical Diagnostic Suite
   15 Classic Traps in Grade 12 Chemistry Exams (THPT & ĐGNL)
   ═══════════════════════════════════════════════════════════════════ */

(function (root) {
  'use strict';

  var TRAP_ICONS = {
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    sparkles: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/>',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v3h10v-3c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34M6 4h12a2 2 0 0 1 2 2v3a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6V6a2 2 0 0 1 2-2z"/>',
    bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 2v20"/>',
    filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
    rotate: '<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8M21 3v5h-5"/>'
  };

  function tIco(n) {
    var svg = TRAP_ICONS[n] || TRAP_ICONS.alert;
    return '<svg class="ico trap-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + svg + '</svg>';
  }

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ═══════════ REPOSITORY OF 15 CLASSIC EXAM TRAPS ═══════════ */
  var CHEM_TRAPS = [
    /* ---------- CHƯƠNG 1: ESTER - LIPID - XÀ PHÒNG ---------- */
    {
      id: "trap_c4h8o2_isomers",
      category: "g12c1",
      tag: "Ester & Lipid",
      danger: "critical",
      dangerLabel: "84% thí sinh đếm thiếu",
      title: "Bẫy từ khóa: 'Hợp chất đơn chức' vs 'Este' khi đếm đồng phân C₄H₈O₂",
      trapStatement: "Cho các chất có CTPT C₄H₈O₂, số đồng phân đơn chức mạch hở là 4.",
      whyFails: "Thí sinh đọc lướt qua đề thi, não bộ tự động gắn mác C₄H₈O₂ là este no đơn chức và đếm ra 4 este (HCOOCH₂CH₂CH₃, HCOOCH(CH₃)₂, CH₃COOC₂H₅, C₂H₅COOCH₃). Đề bài dùng từ 'ĐƠN CHỨC' chứ KHÔNG PHẢI 'ESTE'.",
      antidote: "Công thức CₙH₂ₙO₂ mạch hở chứa 2 loại đồng phân đơn chức: Este (RCOOR') và Acid carboxylic (RCOOH). Với C₄H₈O₂, có 4 este + 2 acid (CH₃CH₂CH₂COOH và (CH₃)₂CHCOOH) → Tổng cộng phải là 6 đồng phân đơn chức!",
      mnemonic: "Khẩu quyết C₄H₈O₂: 'Bốn Este - Hai Acid'. Đề hỏi este chọn 4, hỏi đơn chức chọn 6!",
      quiz: {
        q: "Hợp chất hữu cơ X mạch hở, đơn chức có công thức phân tử C₄H₈O₂ tác dụng được với dung dịch NaOH. Số công thức cấu tạo thoả mãn điều kiện của X là:",
        opts: [
          { k: "A", t: "4 chất" },
          { k: "B", t: "5 chất" },
          { k: "C", t: "6 chất" },
          { k: "D", t: "2 chất" }
        ],
        a: "C",
        exp: "Chính xác! Tác dụng với NaOH gồm cả este (4 đồng phân) và acid carboxylic (2 đồng phân). Cả hai loại đều phản ứng với NaOH, vậy có tổng cộng 4 + 2 = 6 chất."
      }
    },
    {
      id: "trap_phenol_ester_ratio",
      category: "g12c1",
      tag: "Ester & Lipid",
      danger: "critical",
      dangerLabel: "90% nhầm sản phẩm",
      title: "Bẫy este của phenol: Ăn 2 NaOH và TUYỆT ĐỐI KHÔNG sinh ra alcohol",
      trapStatement: "Xà phòng hoá hoàn toàn 1 mol phenyl acetate CH₃COOC₆H₅ bằng dung dịch NaOH dư thu được 1 mol muối và 1 mol alcohol thơm C₆H₅OH.",
      whyFails: "Thí sinh áp dụng máy móc quy tắc thủy phân este thông thường (RCOOR' + NaOH → RCOONa + R'OH) và kết luận sinh ra phenol C₆H₅OH đóng vai trò như alcohol.",
      antidote: "Phenol C₆H₅OH có tính acid yếu nên lập tức phản ứng tiếp với NaOH theo phản ứng acid-base: C₆H₅OH + NaOH → C₆H₅ONa + H₂O. Do đó: CH₃COOC₆H₅ + 2NaOH → CH₃COONa + C₆H₅ONa + H₂O. Tỉ lệ mol là 1 este : 2 NaOH, sinh ra 2 MUỐI và H₂O, TUYỆT ĐỐI KHÔNG có alcohol hay phenol tự do!",
      mnemonic: "Este phenol: Ăn 2 kiềm, sinh 2 muối + nước, alcohol bặt vô âm tín!",
      quiz: {
        q: "Cho 0,1 mol phenyl acetate tác dụng hoàn toàn với 300 mL dung dịch NaOH 1M đun nóng. Sau khi phản ứng kết thúc, cô cạn dung dịch thu được m gam chất rắn khan. Giá trị của m là:",
        opts: [
          { k: "A", t: "19,8 gam" },
          { k: "B", t: "23,8 gam" },
          { k: "C", t: "15,8 gam" },
          { k: "D", t: "27,8 gam" }
        ],
        a: "B",
        exp: "CH₃COOC₆H₅ (0,1 mol) + 2NaOH → CH₃COONa (0,1 mol) + C₆H₅ONa (0,1 mol) + H₂O (0,1 mol). n(NaOH ban đầu) = 0,3 mol → NaOH dư = 0,3 - 0,2 = 0,1 mol. Chất rắn khan gồm 3 chất: CH₃COONa (0,1 × 82 = 8,2g) + C₆H₅ONa (0,1 × 116 = 11,6g) + NaOH dư (0,1 × 40 = 4g) → m = 8,2 + 11,6 + 4 = 23,8 gam."
      }
    },
    {
      id: "trap_vinyl_ester",
      category: "g12c1",
      tag: "Ester & Lipid",
      danger: "high",
      dangerLabel: "75% viết sai sản phẩm",
      title: "Bẫy este vinyl & isopropenyl: Thủy phân tạo Aldehyde hoặc Ketone",
      trapStatement: "Thủy phân vinyl acetate trong môi trường kiềm thu được muối sodium acetate và vinyl alcohol CH₂=CH-OH.",
      whyFails: "Thí sinh quen tay cắt liên kết C-O rồi gắn nhóm -OH vào gốc hydrocarbon mà không nhận ra rượu enol chứa liên kết đôi C=C-OH là hợp chất kém bền.",
      antidote: "Khi nhóm -OH đính trực tiếp vào carbon có liên kết đôi C=C (dạng enol), proton H tự động chuyển dịch sang C bên cạnh và liên kết đôi chuyển thành liên kết C=O bền vững hơn: CH₂=CH-OH → CH₃-CH=O (acetaldehyde). Nếu là este isopropenyl CH₃COOC(CH₃)=CH₂ thì sinh ra Ketone (acetone CH₃-CO-CH₃).",
      mnemonic: "C-O gắn C=C: Ra aldehyde nếu đầu mạch (-CH=CH₂), ra ketone nếu nhánh giữa!",
      quiz: {
        q: "Este X có công thức phân tử C₄H₆O₂. Khi xà phòng hoá X bằng dung dịch NaOH đun nóng thu được muối và một aldehyde Y có khả năng tráng bạc. Công thức cấu tạo của X là:",
        opts: [
          { k: "A", t: "CH₃COOCH=CH₂" },
          { k: "B", t: "HCOOCH₂CH=CH₂" },
          { k: "C", t: "CH₂=CHCOOCH₃" },
          { k: "D", t: "HCOOC(CH₃)=CH₂" }
        ],
        a: "A",
        exp: "CH₃COOCH=CH₂ + NaOH → CH₃COONa + CH₃CHO (acetaldehyde). CH₃CHO tráng bạc tỉ lệ 1:2. Câu B sinh alcohol allyl; Câu C sinh muối acrylate + alcohol methyl; Câu D sinh ketone acetone."
      }
    },
    {
      id: "trap_nacl_salting_out",
      category: "g12c1",
      tag: "Ester & Lipid",
      danger: "high",
      dangerLabel: "72% hiểu sai bản chất",
      title: "Bẫy vai trò NaCl bão hoà: Hiệu ứng muối kết chứ KHÔNG PHẢI chất xúc tác",
      trapStatement: "Trong thí nghiệm điều chế ethyl acetate, dung dịch NaCl bão hoà lạnh được thêm vào để xúc tác cho phản ứng este hoá diễn ra triệt để hơn.",
      whyFails: "Thí sinh nghĩ mọi chất thêm vào ống nghiệm đều để xúc tác hoặc phản ứng hóa học.",
      antidote: "Xúc tác của phản ứng este hóa là H₂SO₄ đặc (vừa xúc tác vừa hút nước chuyển dịch cân bằng). Dung dịch NaCl bão hòa lạnh có 2 vai trò vật lý thuần túy: (1) Tăng khối lượng riêng của lớp dung dịch nước phía dưới; (2) Giảm mạnh độ tan của este trong nước (hiệu ứng salting-out), khiến ester nhẹ hơn nổi hẳn lên trên thành lớp váng dầu trong suốt để dễ tách chiết.",
      mnemonic: "NaCl bão hòa: Tăng tỉ trọng dung dịch, ép este và xà phòng nổi lên tách pha!",
      quiz: {
        q: "Trong thí nghiệm xà phòng hoá chất béo bằng dung dịch NaOH, việc thêm dung dịch NaCl bão hoà nóng vào hỗn hợp phản ứng nhằm mục đích chính là gì?",
        opts: [
          { k: "A", t: "Tách xà phòng nổi lên trên bề mặt do làm giảm độ tan của muối sodium stearate" },
          { k: "B", t: "Làm chất xúc tác tăng tốc độ phản ứng xà phòng hoá" },
          { k: "C", t: "Hòa tan hoàn toàn glycerol để dung dịch trong suốt" },
          { k: "D", t: "Tạo môi trường trung tính an toàn cho người thao tác" }
        ],
        a: "A",
        exp: "Chính xác! NaCl làm giảm độ tan của xà phòng (muối sodium của acid béo), làm xà phòng đông đặc và nổi lên bề mặt để vớt ra đóng bánh."
      }
    },
    {
      id: "trap_formic_ester_silver",
      category: "g12c1",
      tag: "Ester & Lipid",
      danger: "medium",
      dangerLabel: "68% bỏ sót tráng bạc",
      title: "Bẫy tráng bạc của Este: Duy nhất nhóm Formate (H-COO-R') có tráng bạc",
      trapStatement: "Este là hợp chất trung tính không chứa nhóm chức aldehyde tự do nên không thể tráng bạc.",
      whyFails: "Thí sinh chỉ nhớ aldehyde và glucose tráng bạc, coi este là một họ chất hoàn toàn trơ với thuốc thử Tollens.",
      antidote: "Este của formic acid có cấu tạo H-C(=O)-O-R'. Phần H-C(=O)- chính là cấu trúc của nhóm aldehyde! Do đó, TẤT CẢ các este formate (methyl formate, ethyl formate, phenyl formate...) đều tham gia phản ứng tráng bạc và khử Cu(OH)₂ đun nóng tạo Cu₂O đỏ gạch theo tỉ lệ 1 mol este : 2 mol Ag.",
      mnemonic: "Đầu H-COO- mang gen aldehyde: Tráng bạc vô tư tỉ lệ 1 ăn 2 Ag!",
      quiz: {
        q: "Chất nào sau đây vừa tác dụng được với dung dịch NaOH khi đun nóng, vừa có khả năng tham gia phản ứng tráng bạc?",
        opts: [
          { k: "A", t: "Methyl acetate (CH₃COOCH₃)" },
          { k: "B", t: "Ethyl formate (HCOOC₂H₅)" },
          { k: "C", t: "Acetic acid (CH₃COOH)" },
          { k: "D", t: "Dimethyl ether (CH₃OCH₃)" }
        ],
        a: "B",
        exp: "Ethyl formate HCOOC₂H₅ là este (thủy phân trong NaOH nóng) và có gốc HCOO- (tráng bạc tạo 2 Ag)."
      }
    },

    /* ---------- CHƯƠNG 2: CARBOHYDRATE ---------- */
    {
      id: "trap_fructose_bromine",
      category: "g12c2",
      tag: "Carbohydrate",
      danger: "critical",
      dangerLabel: "88% nhầm lẫn Glucose & Fructose",
      title: "Bẫy Fructose vs Nước Bromine: Tráng bạc thì CÓ, Bromine thì KHÔNG!",
      trapStatement: "Vì Fructose tráng bạc được nên Fructose cũng làm mất màu nước bromine như Glucose.",
      whyFails: "Thí sinh suy diễn: Fructose tráng bạc được vì chuyển thành Glucose, vậy nó cũng sẽ làm mất màu nước bromine như Glucose.",
      antidote: "Fructose là polyhydroxy ketone. Trong môi trường KIỀM (như thuốc thử Tollens [Ag(NH₃)₂]OH), fructose chuyển hoá thuận nghịch thành glucose nên TRÁNG BẠC ĐƯỢC. Tuy nhiên, dung dịch nước bromine có môi trường TRUNG TÍNH/ACID YẾU, không có ion OH⁻ để xúc tác chuyển hóa fructose thành glucose! Do đó, Fructose TUYỆT ĐỐI KHÔNG làm mất màu nước bromine. Đây là phản ứng chuẩn mực để phân biệt Glucose và Fructose!",
      mnemonic: "Fructose: Tráng bạc thì CÓ (do kiềm chuyển vị), Bromine thì KHÔNG!",
      quiz: {
        q: "Để phân biệt hai dung dịch mất nhãn Glucose và Fructose một cách nhanh chóng và chính xác nhất, người ta sử dụng thuốc thử nào sau đây?",
        opts: [
          { k: "A", t: "Dung dịch AgNO₃ trong NH₃ dư đun nóng" },
          { k: "B", t: "Dung dịch nước Bromine (Br₂)" },
          { k: "C", t: "Cu(OH)₂ ở nhiệt độ thường" },
          { k: "D", t: "Kim loại Sodium (Na)" }
        ],
        a: "B",
        exp: "Chính xác! Nước Bromine bị Glucose làm mất màu (oxi hóa nhóm -CHO thành -COOH). Fructose không phản ứng trong môi trường nước bromine nên màu nâu đỏ của Br₂ vẫn giữ nguyên."
      }
    },
    {
      id: "trap_saccharose_hydrolysis_silver",
      category: "g12c2",
      tag: "Carbohydrate",
      danger: "high",
      dangerLabel: "78% tính sai lượng Ag",
      title: "Bẫy thủy phân Saccharose: Bản thân không tráng bạc nhưng đẻ con 1 ăn 4!",
      trapStatement: "Thủy phân hoàn toàn 1 mol saccharose, sản phẩm thu được cho tác dụng với lượng dư AgNO₃/NH₃ sinh ra 2 mol Ag.",
      whyFails: "Thí sinh nghĩ saccharose thủy phân sinh ra 1 mol glucose (tạo 2 Ag), còn fructose có nhóm ketone bị bỏ qua.",
      antidote: "1 mol Saccharose (C₁₂H₂₂O₁₁) thủy phân hoàn toàn tạo 1 mol Glucose + 1 mol Fructose. Khi cho vào dung dịch AgNO₃/NH₃ nóng: 1 mol Glucose sinh 2 mol Ag; 1 mol Fructose trong môi trường kiềm NH₃ chuyển thành Glucose và sinh tiếp 2 mol Ag! Do đó, tổng lượng bạc thu được là 2 + 2 = 4 mol Ag!",
      mnemonic: "Saccharose trơ lì không tráng gương; thủy phân xong đẻ đôi ăn 4 Ag rực rỡ!",
      quiz: {
        q: "Thủy phân hoàn toàn 34,2 gam saccharose trong môi trường acid với hiệu suất 80%. Trung hoà dung dịch sau phản ứng rồi cho tác dụng với lượng dư dung dịch AgNO₃/NH₃ đun nóng. Khối lượng Ag thu được là:",
        opts: [
          { k: "A", t: "43,2 gam" },
          { k: "B", t: "34,56 gam" },
          { k: "C", t: "17,28 gam" },
          { k: "D", t: "21,6 gam" }
        ],
        a: "B",
        exp: "n(saccharose) = 34,2 / 342 = 0,1 mol. n(Ag lý thuyết) = 4 × n(saccharose) = 4 × 0,1 = 0,4 mol. Do H = 80% → n(Ag thực tế) = 0,4 × 0,8 = 0,32 mol → m(Ag) = 0,32 × 108 = 34,56 gam."
      }
    },
    {
      id: "trap_neutralize_starch_acid",
      category: "g12c2",
      tag: "Carbohydrate",
      danger: "high",
      dangerLabel: "81% quên bước trung hoà",
      title: "Bẫy quy trình: BẮT BUỘC trung hoà acid sau thủy phân tinh bột / cellulose",
      trapStatement: "Đun sôi dung dịch hồ tinh bột với vài giọt H₂SO₄ loãng. Sau đó nhỏ trực tiếp thuốc thử Tollens vào để kiểm tra glucose sinh ra.",
      whyFails: "Thí sinh chỉ nhớ phản ứng hóa học (tinh bột → glucose; glucose + Tollens → Ag) mà quên mất tương tác acid-base của môi trường phản ứng.",
      antidote: "Thuốc thử Tollens [Ag(NH₃)₂]OH và Cu(OH)₂ chỉ bền và hoạt động trong môi trường KIỀM. Axit H₂SO₄ dư từ bước thủy phân nếu không được trung hòa sẽ phản ứng ngay với NH₃ hoặc Cu(OH)₂, làm acid hoá dung dịch và phá huỷ phức bạc/đồng khiến phản ứng tráng bạc hoàn toàn thất bại. Bắt buộc phải thêm dung dịch NaOH hoặc NaHCO₃ để trung hòa acid trước!",
      mnemonic: "Thủy phân bằng acid xong, muốn thử Tollens hay Cu(OH)₂ BẮT BUỘC PHẢI TRUNG HÒA KIỀM!",
      quiz: {
        q: "Trong thí nghiệm chứng minh sự thủy phân của tinh bột: Sau khi đun sôi tinh bột với H₂SO₄ loãng 20%, người ta để nguội rồi cho tiếp dung dịch chất nào sau đây vào TRƯỚC KHI thực hiện phản ứng tráng bạc?",
        opts: [
          { k: "A", t: "Dung dịch NaOH loãng (cho đến khi quỳ tím đổi màu)" },
          { k: "B", t: "Dung dịch HCl đặc" },
          { k: "C", t: "Dung dịch cồn iodine" },
          { k: "D", t: "Dung dịch NaCl bão hoà" }
        ],
        a: "A",
        exp: "Bắt buộc cho dung dịch kiềm NaOH để trung hoà hoàn toàn acid H₂SO₄ xúc tác, tạo môi trường kiềm thích hợp cho phản ứng tráng bạc xảy ra."
      }
    },
    {
      id: "trap_amylose_branching",
      category: "g12c2",
      tag: "Carbohydrate",
      danger: "medium",
      dangerLabel: "66% đảo ngược cấu trúc",
      title: "Bẫy cấu trúc Tinh bột: Amylose MẠCH KHÔNG PHÂN NHÁNH (xoắn lò xo)",
      trapStatement: "Cả Amylose và Amylopectin đều có cấu trúc mạch phân nhánh tạo nên độ dẻo quánh của xôi nếp.",
      whyFails: "Thí sinh nhầm lẫn rằng tinh bột là chất phức tạp nên cả 2 thành phần đều phân nhánh.",
      antidote: "Amylose chỉ chiếm 20-30% tinh bột, gồm các gốc α-glucose liên kết qua liên kết α-1,4-glycosidic tạo thành mạch DÀI KHÔNG PHÂN NHÁNH, xoắn lại thành hình lò xo (chính khoang rỗng này bọc phân tử I₂ tạo màu xanh tím). Còn Amylopectin (chiếm 70-80%) mới là mạch PHÂN NHÁNH nhờ có thêm liên kết α-1,6-glycosidic tại các điểm rẽ nhánh!",
      mnemonic: "Amylose: Thẳng đuột xoắn lò xo (chỉ có 1,4); Amylopectin: Cành cây phân nhánh (có cả 1,4 và 1,6)!",
      quiz: {
        q: "Phát biểu nào sau đây về cấu tạo của tinh bột là ĐÚNG?",
        opts: [
          { k: "A", t: "Amylose có cấu trúc mạch phân nhánh gồm các liên kết α-1,4 và α-1,6-glycosidic" },
          { k: "B", t: "Amylose có cấu trúc mạch không phân nhánh, xoắn hình lò xo" },
          { k: "C", t: "Amylopectin tan hoàn toàn trong nước lạnh" },
          { k: "D", t: "Tinh bột và cellulose là đồng phân cấu tạo của nhau vì cùng có CTPT (C₆H₁₀O₅)ₙ" }
        ],
        a: "B",
        exp: "Chính xác! Amylose mạch không phân nhánh, xoắn lò xo. (Lưu ý: Tinh bột và cellulose KHÔNG PHẢI đồng phân vì hệ số polymer hoá n khác nhau hoàn toàn)."
      }
    },

    /* ---------- CHƯƠNG 3: AMINE - AMINO ACID - PEPTIDE - PROTEIN ---------- */
    {
      id: "trap_amine_basicity_order",
      category: "g12c3",
      tag: "Amine & Peptide",
      danger: "critical",
      dangerLabel: "86% sắp xếp sai lực base",
      title: "Bẫy so sánh lực base của Amine: Vòng thơm hút electron làm suy kiệt tính base",
      trapStatement: "Aniline C₆H₅NH₂ có nhóm -NH₂ gắn vào vòng benzene làm tăng mật độ electron nên có lực base mạnh hơn ammonia.",
      whyFails: "Thí sinh nghĩ gốc thơm to lớn sẽ đẩy electron mạnh hơn phân tử nhỏ NH₃.",
      antidote: "Gốc phenyl C₆H₅- có hệ electron liên hợp hút electron của đôi electron tự do trên nguyên tử N vào vòng benzene, làm mật độ electron trên N giảm mạnh → Lực base cực kỳ yếu (không làm đổi màu quỳ tím, không đổi màu phenolphthalein). Ngược lại, gốc alkyl (CH₃-, C₂H₅-) đẩy electron làm tăng mật độ e trên N → Lực base mạnh hơn NH₃. Thứ tự chuẩn: (CH₃)₂NH (bậc 2) > CH₃NH₂ (bậc 1) > NH₃ > C₆H₅NH₂ (Aniline).",
      mnemonic: "Bậc 2 no > Bậc 1 no > Ammonia (NH₃) > Amine thơm (Aniline đội sổ quỳ không thèm đổi)!",
      quiz: {
        q: "Dãy chất nào sau đây được sắp xếp đúng theo thứ tự tính base GIẢM DẦN từ trái sang phải?",
        opts: [
          { k: "A", t: "(CH₃)₂NH > CH₃NH₂ > NH₃ > C₆H₅NH₂" },
          { k: "B", t: "C₆H₅NH₂ > NH₃ > CH₃NH₂ > (CH₃)₂NH" },
          { k: "C", t: "CH₃NH₂ > (CH₃)₂NH > NH₃ > C₆H₅NH₂" },
          { k: "D", t: "(CH₃)₂NH > C₆H₅NH₂ > NH₃ > CH₃NH₂" }
        ],
        a: "A",
        exp: "Chính xác! Amine bậc 2 no có 2 gốc alkyl đẩy e nên mạnh nhất, kế đến amine bậc 1 no, tiếp theo là NH₃, và yếu nhất là arylamine (aniline)."
      }
    },
    {
      id: "trap_amino_acid_litmus",
      category: "g12c3",
      tag: "Amine & Peptide",
      danger: "high",
      dangerLabel: "74% quên đếm nhóm chức",
      title: "Bẫy quỳ tím của Amino acid: Cuộc chiến đếm số nhóm -COOH vs -NH₂",
      trapStatement: "Mọi hợp chất amino acid đều làm đổi màu giấy quỳ tím vì chứa nhóm amine có tính base.",
      whyFails: "Thí sinh chỉ nhìn thấy nhóm amine mà quên rằng phân tử còn có nhóm carboxyl -COOH có tính acid triệt tiêu lẫn nhau.",
      antidote: "Amino acid tồn tại ở dạng ion lưỡng cực H₃N⁺-R-COO⁻. Đổi màu quỳ phụ thuộc vào tỉ số số lượng hai nhóm chức: Nếu số nhóm -COOH = số nhóm -NH₂ (như Glycine, Alanine, Valine) → pH xấp xỉ 6-7, KHÔNG ĐỔI MÀU quỳ tím! Nếu -COOH > -NH₂ (Glutamic acid có 2 -COOH, 1 -NH₂) → quỳ hóa ĐỎ! Nếu -NH₂ > -COOH (Lysine có 2 -NH₂, 1 -COOH) → quỳ hóa XANH!",
      mnemonic: "Glu ĐỎ (nhiều acid) - Lys XANH (nhiều amine) - Gly/Ala/Val HÒA BÌNH không đổi màu!",
      quiz: {
        q: "Dung dịch của chất nào sau đây làm giấy quỳ tím chuyển sang màu ĐỎ?",
        opts: [
          { k: "A", t: "Lysine" },
          { k: "B", t: "Glutamic acid" },
          { k: "C", t: "Glycine" },
          { k: "D", t: "Alanine" }
        ],
        a: "B",
        exp: "Glutamic acid HOOC-CH₂-CH₂-CH(NH₂)-COOH có 2 nhóm -COOH và 1 nhóm -NH₂ nên tính acid chiếm ưu thế, làm quỳ tím chuyển sang màu đỏ."
      }
    },
    {
      id: "trap_dipeptide_biuret",
      category: "g12c3",
      tag: "Amine & Peptide",
      danger: "critical",
      dangerLabel: "89% dính bẫy Dipeptide",
      title: "Bẫy Biuret tử huyệt: DIPEPTIDE TUYỆT ĐỐI KHÔNG CÓ phản ứng Biuret!",
      trapStatement: "Nhỏ vài giọt dung dịch CuSO₄ và NaOH vào ống nghiệm đựng dipeptide Gly-Ala thu được dung dịch màu tím đặc trưng.",
      whyFails: "Thí sinh nhớ mang máng 'Peptide phản ứng màu Biuret với Cu(OH)₂ ra màu tím' và mặc định dipeptide cũng là peptide nên phản ứng được.",
      antidote: "Phản ứng Biuret là phản ứng tạo phức chelate màu tím giữa Cu²⁺ và các nguyên tử N của liên kết peptide. Để tạo được phức màu tím bền vững này, phân tử BẮT BUỘC PHẢI CÓ TỪ 2 LIÊN KẾT PEPTIDE TRỞ LÊN (tức từ TRIPEPTIDE trở lên)! Dipeptide (như Gly-Ala, Ala-Gly) chỉ có duy nhất 1 liên kết peptide (-CO-NH-) nên TUYỆT ĐỐI KHÔNG PHẢN ỨNG MÀU BIURET!",
      mnemonic: "Dipeptide chỉ 1 liên kết: CẤM ĐƯỢC MƠ MÀU TÍM BIURET! Phải từ Tripeptide trở lên!",
      quiz: {
        q: "Chất nào sau đây KHÔNG tham gia phản ứng màu Biuret với Cu(OH)₂ trong môi trường kiềm?",
        opts: [
          { k: "A", t: "Gly-Ala-Gly (Tripeptide)" },
          { k: "B", t: "Lòng trắng trứng (Albumin)" },
          { k: "C", t: "Ala-Gly (Dipeptide)" },
          { k: "D", t: "Gly-Ala-Val-Ala (Tetrapeptide)" }
        ],
        a: "C",
        exp: "Ala-Gly là dipeptide (chỉ có 1 liên kết peptide) nên không có phản ứng màu Biuret. Các peptide từ tripeptide trở lên và protein đều cho phản ứng Biuret tạo màu tím."
      }
    },
    {
      id: "trap_peptide_link_count",
      category: "g12c3",
      tag: "Amine & Peptide",
      danger: "medium",
      dangerLabel: "65% đếm nhầm số liên kết",
      title: "Bẫy đếm số liên kết peptide: n mắt xích amino acid chỉ có n - 1 liên kết!",
      trapStatement: "Một pentapeptide mạch hở cấu tạo từ glycine có chứa 5 liên kết peptide trong phân tử.",
      whyFails: "Thí sinh thấy tiền tố 'penta' (5) là phán luôn 5 liên kết peptide.",
      antidote: "Một chuỗi peptide mạch hở gồm n gốc α-amino acid liên kết với nhau bằng đúng (n - 1) liên kết peptide. Giống như đoàn tàu hỏa có 5 toa tàu thì chỉ có đúng 4 khớp nối! Pentapeptide (n = 5) có 5 gốc amino acid nhưng CHỈ CÓ 4 LIÊN KẾT PEPTIDE (-CO-NH-).",
      mnemonic: "Toa tàu trừ 1 ra khớp nối: n mắt xích chỉ có (n - 1) liên kết peptide!",
      quiz: {
        q: "Số liên kết peptide có trong một phân tử Tetrapeptide mạch hở Gly-Ala-Val-Gly là:",
        opts: [
          { k: "A", t: "4 liên kết" },
          { k: "B", t: "3 liên kết" },
          { k: "C", t: "2 liên kết" },
          { k: "D", t: "5 liên kết" }
        ],
        a: "B",
        exp: "Tetrapeptide cấu tạo từ 4 gốc amino acid: Gly-Ala-Val-Gly có 3 liên kết peptide nằm giữa các gốc (Gly-CO-NH-Ala-CO-NH-Val-CO-NH-Gly)."
      }
    },

    /* ---------- POLIME & VẬT LIỆU ---------- */
    {
      id: "trap_fiber_classification",
      category: "polymers",
      tag: "Polime & Vật liệu",
      danger: "critical",
      dangerLabel: "82% phân loại sai Tơ",
      title: "Bẫy phân loại tơ: Tơ visco & Tơ acetate là TƠ BÁN TỔNG HỢP (Nhân tạo)",
      trapStatement: "Tơ visco và tơ cellulose acetate là tơ tổng hợp vì được sản xuất trong các nhà máy sợi tổng hợp hiện đại.",
      whyFails: "Thí sinh nghĩ cái gì sản xuất công nghiệp bằng hóa chất đều là 'tổng hợp'.",
      antidote: "Tơ được phân thành 2 nhánh lớn: (1) Tơ thiên nhiên (bông, len lông cừu, tơ tằm lấy từ tự nhiên); (2) Tơ hóa học. Tơ hóa học lại chia đôi: Tơ bán tổng hợp (hay tơ nhân tạo): chế biến hóa học từ polime thiên nhiên có sẵn (như cellulose → tơ visco, tơ acetate); Tơ tổng hợp: chế biến hoàn toàn từ các monomer tổng hợp hữu cơ từ dầu mỏ (như nylon-6,6, tơ nitron/olon, tơ capron).",
      mnemonic: "Visco và Acetate = Bán tổng hợp (nhân tạo). Bắt đầu từ thiên nhiên rồi hóa học chế biến!",
      quiz: {
        q: "Dãy gồm các loại tơ nào sau đây đều thuộc loại tơ bán tổng hợp (tơ nhân tạo)?",
        opts: [
          { k: "A", t: "Tơ visco và tơ cellulose acetate" },
          { k: "B", t: "Tơ tằm và tơ bông" },
          { k: "C", t: "Tơ nilon-6,6 và tơ nitron" },
          { k: "D", t: "Tơ visco và tơ nilon-6" }
        ],
        a: "A",
        exp: "Chính xác! Tơ visco và tơ acetate đều đi từ cellulose thiên nhiên chế biến hóa học nên gọi là tơ bán tổng hợp (nhân tạo)."
      }
    },
    {
      id: "trap_nylon6_dual_synthesis",
      category: "polymers",
      tag: "Polime & Vật liệu",
      danger: "high",
      dangerLabel: "76% chỉ biết 1 cách điều chế",
      title: "Bẫy điều chế Nilon-6: Trùng hợp Caprolactam HOẶC Trùng ngưng acid 6 carbon",
      trapStatement: "Tơ nilon-6 chỉ có thể điều chế duy nhất bằng phản ứng trùng ngưng acid ε-aminocaproic.",
      whyFails: "Thí sinh chỉ học vẹt phản ứng trùng ngưng amino acid mà quên mất phản ứng trùng hợp mở vòng caprolactam.",
      antidote: "Nilon-6 (tơ capron) là polime đặc biệt có thể điều chế bằng CẢ 2 PHƯƠNG PHÁP: (1) Trùng hợp mở vòng monomer caprolactam ở nhiệt độ cao; HOẶC (2) Trùng ngưng monomer acid ε-aminocaproic H₂N-(CH₂)₅-COOH giải phóng H₂O. Cả 2 con đường đều cho sản phẩm poliamide có cùng mắt xích: [-NH-(CH₂)₅-CO-]ₙ.",
      mnemonic: "Nilon-6 hai cửa vào: Mở vòng Capro (trùng hợp) hoặc Ngưng tụ acid 6 carbon!",
      quiz: {
        q: "Polime nào sau đây có thể điều chế được bằng cả phản ứng trùng hợp và phản ứng trùng ngưng?",
        opts: [
          { k: "A", t: "Poly(ethylene terephthalate)" },
          { k: "B", t: "Poly(hexamethylene adipamide) (Nilon-6,6)" },
          { k: "C", t: "Polycaproamide (Nilon-6)" },
          { k: "D", t: "Poly(methyl methacrylate)" }
        ],
        a: "C",
        exp: "Nilon-6 có thể điều chế bằng phản ứng trùng ngưng acid ε-aminocaproic hoặc trùng hợp mở vòng caprolactam."
      }
    }
  ];

  /* ═══════════ CHEMTRAPS CONTROLLER & RENDERER ═══════════ */
  var ChemTraps = {
    activeCategory: "all",
    mastered: {},
    quizState: {},

    init: function () {
      try {
        var raw = localStorage.getItem("hoa11_12_mastered_traps");
        if (raw) this.mastered = JSON.parse(raw) || {};
      } catch (e) { this.mastered = {}; }
    },

    saveMastered: function () {
      try {
        localStorage.setItem("hoa11_12_mastered_traps", JSON.stringify(this.mastered));
      } catch (e) {}
    },

    setCategory: function (cat) {
      this.activeCategory = cat || "all";
      if (root.renderLibraryOnly) root.renderLibraryOnly();
    },

    answerQuiz: function (trapId, optKey) {
      var trap = CHEM_TRAPS.find(function (t) { return t.id === trapId; });
      if (!trap) return;
      var isCorrect = (optKey === trap.quiz.a);
      this.quizState[trapId] = {
        picked: optKey,
        isCorrect: isCorrect
      };
      if (isCorrect && !this.mastered[trapId]) {
        this.mastered[trapId] = true;
        this.saveMastered();
        if (root.addXP && root.profile) {
          root.addXP(root.profile(), trap.category, 15);
        }
        if (root.updateHeaderStats) root.updateHeaderStats(true);
      }
      if (root.renderLibraryOnly) root.renderLibraryOnly();
    },

    resetQuiz: function (trapId) {
      delete this.quizState[trapId];
      if (root.renderLibraryOnly) root.renderLibraryOnly();
    },

    /* Render the complete Sổ tay Bẫy đề thi View */
    render: function () {
      this.init();
      var self = this;
      var totalTraps = CHEM_TRAPS.length;
      var masteredCount = Object.keys(this.mastered).length;
      var progressPct = Math.round((masteredCount / totalTraps) * 100);

      var categories = [
        { id: "all", label: "Tất cả (" + totalTraps + ")" },
        { id: "g12c1", label: "Ester & Lipid (" + CHEM_TRAPS.filter(function(t){ return t.category === "g12c1"; }).length + ")" },
        { id: "g12c2", label: "Carbohydrate (" + CHEM_TRAPS.filter(function(t){ return t.category === "g12c2"; }).length + ")" },
        { id: "g12c3", label: "Amine & Peptide (" + CHEM_TRAPS.filter(function(t){ return t.category === "g12c3"; }).length + ")" },
        { id: "polymers", label: "Polime & Vật liệu (" + CHEM_TRAPS.filter(function(t){ return t.category === "polymers"; }).length + ")" }
      ];

      var filterPills = '<div class="trap-filters-bar">' +
        categories.map(function (c) {
          return '<button class="trap-filter-pill' + (self.activeCategory === c.id ? " active" : "") + '" data-act="ctFilter" data-cat="' + c.id + '">' +
            c.label +
          '</button>';
        }).join("") +
      '</div>';

      var filteredTraps = (this.activeCategory === "all")
        ? CHEM_TRAPS
        : CHEM_TRAPS.filter(function (t) { return t.category === self.activeCategory; });

      var trapCardsHtml = filteredTraps.map(function (trap, idx) {
        var isMastered = !!self.mastered[trap.id];
        var qState = self.quizState[trap.id] || null;

        var dangerBadgeCls = trap.danger === "critical" ? "critical" : trap.danger === "high" ? "high" : "medium";

        // Quiz options HTML
        var quizOptsHtml = trap.quiz.opts.map(function (opt) {
          var cls = "micro-opt-btn";
          if (qState) {
            if (opt.k === trap.quiz.a) cls += " opt-correct";
            if (qState.picked === opt.k && !qState.isCorrect) cls += " opt-wrong";
          }
          return '<button class="' + cls + '" data-act="ctQuizPick" data-tid="' + trap.id + '" data-k="' + esc(opt.k) + '" ' + (qState ? 'disabled' : '') + '>' +
            '<span class="opt-key">' + esc(opt.k) + '.</span><span class="opt-text">' + esc(opt.t) + '</span>' +
          '</button>';
        }).join("");

        var quizResultHtml = "";
        if (qState) {
          if (qState.isCorrect) {
            quizResultHtml = '<div class="micro-quiz-fb ok">' +
              '<div class="mqfb-title">' + tIco("check") + ' <b>Xuất sắc! Bạn đã vô hiệu hoá bẫy này (+15 XP)</b></div>' +
              '<div class="mqfb-exp">' + trap.quiz.exp + '</div>' +
            '</div>';
          } else {
            quizResultHtml = '<div class="micro-quiz-fb bad">' +
              '<div class="mqfb-title">' + tIco("close") + ' <b>Bạn đã dính bẫy!</b></div>' +
              '<div class="mqfb-exp">' + trap.quiz.exp + '</div>' +
              '<button class="btn warn tiny" style="margin-top:8px" data-act="ctQuizRetry" data-tid="' + trap.id + '">' + tIco("rotate") + ' Thử lại câu này</button>' +
            '</div>';
          }
        }

        return '<article class="trap-card' + (isMastered ? ' mastered' : '') + '" data-tid="' + trap.id + '">' +
          '<div class="tc-header">' +
            '<div class="tc-meta-row">' +
              '<span class="tc-tag">' + trap.tag + '</span>' +
              '<span class="tc-danger ' + dangerBadgeCls + '">' + tIco("alert") + ' ' + trap.dangerLabel + '</span>' +
              (isMastered ? '<span class="tc-mastered-badge">' + tIco("shield") + ' Đã làm chủ</span>' : '') +
            '</div>' +
            '<h3 class="tc-title">' + (idx + 1) + '. ' + trap.title + '</h3>' +
          '</div>' +

          '<div class="tc-statement-box">' +
            '<div class="tcs-label">' + tIco("alert") + ' Mệnh đề bẫy kinh điển trong đề thi:</div>' +
            '<div class="tcs-quote">"' + trap.trapStatement + '"</div>' +
          '</div>' +

          '<div class="tc-columns-grid">' +
            '<div class="tc-col why-box">' +
              '<div class="tcc-head">' + tIco("close") + ' <b>Tại sao thí sinh dễ mắc bẫy?</b></div>' +
              '<div class="tcc-body">' + trap.whyFails + '</div>' +
            '</div>' +
            '<div class="tc-col antidote-box">' +
              '<div class="tcc-head">' + tIco("check") + ' <b>Bản chất chuẩn xác & Bí kíp phá bẫy:</b></div>' +
              '<div class="tcc-body">' + trap.antidote + '</div>' +
            '</div>' +
          '</div>' +

          '<div class="tc-mnemonic-box">' +
            '<div class="tcm-label">' + tIco("sparkles") + ' Khẩu quyết phản xạ 3 giây:</div>' +
            '<div class="tcm-text">' + trap.mnemonic + '</div>' +
          '</div>' +

          '<div class="tc-micro-quiz">' +
            '<div class="tmq-head">' + tIco("target") + ' <b>Thử thách phá bẫy tại chỗ:</b></div>' +
            '<div class="tmq-question">' + trap.quiz.q + '</div>' +
            '<div class="tmq-opts">' + quizOptsHtml + '</div>' +
            quizResultHtml +
          '</div>' +
        '</article>';
      }).join("");

      return '<div class="trap-encyclopedia-shell">' +
        '<div class="trap-hero-banner">' +
          '<div class="thb-content">' +
            '<h2>' + tIco("alert") + ' Sổ tay Bẫy Đề Thi & Tử Huyệt Điểm 9+</h2>' +
            '<p class="muted small">15 Cái bẫy kinh điển nhất trong đề thi Tốt nghiệp THPT & Đánh giá năng lực: Khám nghiệm tư duy sai lầm, nắm chắc bản chất cơ chế và thuộc lòng khẩu quyết 3 giây để không mất điểm oan!</p>' +
          '</div>' +
          '<div class="thb-progress-pill">' +
            '<div class="thbp-val">' + masteredCount + ' / ' + totalTraps + '</div>' +
            '<div class="thbp-label">Bẫy đã hoá giải (' + progressPct + '%)</div>' +
            '<div class="thbp-bar"><i style="width:' + progressPct + '%"></i></div>' +
          '</div>' +
        '</div>' +
        filterPills +
        '<div class="traps-list">' + trapCardsHtml + '</div>' +
      '</div>';
    }
  };

  root.ChemTraps = ChemTraps;
  root.CHEM_TRAPS = CHEM_TRAPS;
})(typeof window !== 'undefined' ? window : this);
