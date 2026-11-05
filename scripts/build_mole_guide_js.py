# -*- coding: utf-8 -*-
import sys, json

sys.stdout.reconfigure(encoding="utf-8")

categories = [
    {"id": "all", "label": "Tất cả", "icon": "⚡", "count": 32},
    {"id": "c1", "label": "Ch.1 · Ester – Lipid", "icon": "🧪", "count": 7},
    {"id": "c2", "label": "Ch.2 · Carbohydrate", "icon": "🍬", "count": 8},
    {"id": "c3", "label": "Ch.3 · Hợp chất Nitrogen", "icon": "🧬", "count": 9},
    {"id": "c4", "label": "Ch.4 · Polymer", "icon": "🧶", "count": 4},
    {"id": "c5", "label": "Công thức & Bẫy", "icon": "🧮", "count": 4}
]

items = [
    # --- CHƯƠNG 1: ESTER – LIPID ---
    {
        "id": "c1_ester_acid",
        "ch": "c1",
        "chName": "Chương 1 · Ester – Lipid",
        "cat": "Ester",
        "tag": "Thuận nghịch",
        "tagType": "blue",
        "title": "1. Phản ứng Ester hoá & Thuỷ phân trong môi trường Acid",
        "eq": "RCOOH + R'OH ⇌ RCOOR' + H₂O",
        "cond": "H₂SO₄ đặc, đun nóng nhẹ (phản ứng 2 chiều)",
        "ratio": "1 acid : 1 alcohol : 1 ester : 1 H₂O",
        "ratioType": "blue",
        "points": [
            "Phản ứng thuận nghịch; xúc tác H₂SO₄ đặc vừa tăng tốc phản ứng vừa hút nước làm chuyển dịch cân bằng sang phải.",
            "Với acid x chức + alcohol đơn chức: R(COOH)x + x R'OH ⇌ R(COOR')x + x H₂O (tỉ lệ 1 : x : 1 : x).",
            "Hằng số cân bằng: Kc = [RCOOR'][H₂O] / ([RCOOH][R'OH])."
        ]
    },
    {
        "id": "c1_ester_base",
        "ch": "c1",
        "chName": "Chương 1 · Ester – Lipid",
        "cat": "Ester",
        "tag": "Trọng tâm · 1 chiều",
        "tagType": "emerald",
        "title": "2. Thuỷ phân Ester thông thường trong Kiềm (Xà phòng hoá)",
        "eq": "RCOOR' + NaOH → RCOONa + R'OH",
        "cond": "Đun nóng với dung dịch NaOH hoặc KOH",
        "ratio": "1 ester : 1 NaOH : 1 muối : 1 alcohol",
        "ratioType": "emerald",
        "points": [
            "Tỉ lệ mol: n(ester) = n(NaOH) = n(muối) = n(alcohol).",
            "Bảo toàn khối lượng: m(ester) + m(NaOH) = m(muối) + m(alcohol).",
            "Nếu dùng KOH: 1 mol NaOH (40 g) thay bằng 1 mol KOH (56 g)."
        ],
        "formula": "m(muối) = m(ester) + m(NaOH) - m(alcohol)"
    },
    {
        "id": "c1_ester_phenol",
        "ch": "c1",
        "chName": "Chương 1 · Ester – Lipid",
        "cat": "Ester",
        "tag": "Bẫy điểm 9+ ⭐",
        "tagType": "amber",
        "title": "3. Ester của Phenol (Ăn 2 NaOH, Sinh 2 Muối & Nước)",
        "eq": "RCOOC₆H₄R' + 2 NaOH → RCOONa + R'C₆H₄ONa + H₂O",
        "cond": "Đun sôi với dung dịch kiềm dư",
        "ratio": "1 ester : 2 NaOH : 2 muối : 1 H₂O",
        "ratioType": "amber",
        "points": [
            "⚠️ BẪY ĐỀ THI: Ester của phenol TUYỆT ĐỐI KHÔNG tạo ra alcohol mà sinh ra 1 mol H₂O!",
            "Dấu hiệu nhận biết: n(NaOH) / n(ester) = 2 và cô cạn thu được 2 muối hữu cơ.",
            "Bảo toàn khối lượng: m(ester) + 2·40·n(ester) = m(hỗn hợp 2 muối) + 18·n(ester)."
        ],
        "formula": "n(H₂O) = n(ester) = 1/2 · n(NaOH)"
    },
    {
        "id": "c1_ester_vinyl",
        "ch": "c1",
        "chName": "Chương 1 · Ester – Lipid",
        "cat": "Ester",
        "tag": "Sinh Aldehyde/Ketone",
        "tagType": "purple",
        "title": "4. Ester Vinyl & Isopropenyl (Không tạo Alcohol)",
        "eq": "RCOOCH=CH₂ + NaOH → RCOONa + CH₃CHO\nRCOOC(CH₃)=CH₂ + NaOH → RCOONa + CH₃COCH₃",
        "cond": "Đun nóng với dung dịch kiềm",
        "ratio": "1 ester : 1 NaOH : 1 muối : 1 aldehyde/ketone",
        "ratioType": "purple",
        "points": [
            "Vinyl ester thuỷ phân tạo Aldehyde có khả năng tráng bạc (1 aldehyde → 2 Ag↓).",
            "Isopropenyl ester thuỷ phân tạo Ketone (Acetone), không tráng bạc.",
            "Dấu hiệu: Sản phẩm sau xà phòng hoá tham gia phản ứng tráng bạc dù ester ban đầu không phải formate."
        ]
    },
    {
        "id": "c1_lipid_soap",
        "ch": "c1",
        "chName": "Chương 1 · Ester – Lipid",
        "cat": "Lipid",
        "tag": "Định lượng kinh điển 🧮",
        "tagType": "emerald",
        "title": "5. Xà phòng hoá Triglyceride (Chất béo)",
        "eq": "(RCOO)₃C₃H₅ + 3 NaOH → 3 RCOONa + C₃H₅(OH)₃ (glycerol)",
        "cond": "Đun sôi, thêm dung dịch NaCl bão hoà để tách muối xà phòng",
        "ratio": "1 chất béo : 3 NaOH : 3 muối xà phòng : 1 glycerol",
        "ratioType": "emerald",
        "points": [
            "Tỉ lệ vàng: n(NaOH) = 3 · n(béo) = 3 · n(glycerol) = n(muối xà phòng).",
            "n(glycerol) = 1/3 · n(NaOH) = n(chất béo).",
            "Bảo toàn khối lượng: m(béo) + m(NaOH) = m(muối) + m(glycerol)."
        ],
        "formula": "m(muối) = m(béo) + 28·n(béo) [NaOH] | m(muối) = m(béo) + 76·n(béo) [KOH]"
    },
    {
        "id": "c1_lipid_hydrogen",
        "ch": "c1",
        "chName": "Chương 1 · Ester – Lipid",
        "cat": "Lipid",
        "tag": "Chất béo lỏng → rắn",
        "tagType": "blue",
        "title": "6. Hydrogen hoá & Cộng Bromine của Chất béo lỏng",
        "eq": "Triolein (C₁₇H₃₃COO)₃C₃H₅ + 3 H₂ → Tristearin (C₁₇H₃₅COO)₃C₃H₅\nTrilinolein (C₁₇H₃₁COO)₃C₃H₅ + 6 H₂ → Tristearin",
        "cond": "Xúc tác Ni, đun nóng, áp suất cao",
        "ratio": "Triolein ăn 3 H₂/Br₂ | Trilinolein ăn 6 H₂/Br₂",
        "ratioType": "blue",
        "points": [
            "Công thức tổng quát: n(H₂) = n(Br₂) = k(C=C) · n(chất béo).",
            "Triolein có 3 gốc oleate (mỗi gốc 1 C=C) ⇒ ăn 3 H₂ (hoặc 3 Br₂).",
            "Trilinolein có 3 gốc linoleate (mỗi gốc 2 C=C) ⇒ ăn 6 H₂ (hoặc 6 Br₂)."
        ]
    },
    {
        "id": "c1_ester_combustion",
        "ch": "c1",
        "chName": "Chương 1 · Ester – Lipid",
        "cat": "Đốt cháy",
        "tag": "Bảo toàn số mol",
        "tagType": "orange",
        "title": "7. Đốt cháy Ester & Triglyceride",
        "eq": "CnH₂nO₂ + (3n - 2)/2 O₂ → n CO₂ + n H₂O",
        "cond": "Đốt cháy hoàn toàn trong O₂ dư",
        "ratio": "Ester no đơn hở: n(CO₂) = n(H₂O)",
        "ratioType": "orange",
        "points": [
            "Ester no, đơn chức, mạch hở: n(CO₂) = n(H₂O) và 2·n(ester) + 2·n(O₂) = 3·n(CO₂).",
            "Ester 1 nối đôi C=C đơn hở: n(ester) = n(CO₂) - n(H₂O).",
            "Chất béo có độ bất bão hoà k: n(béo) = [n(CO₂) - n(H₂O)] / (k - 1)."
        ],
        "formula": "n(Br₂ cộng) = n(H₂ cộng) = (k - 3)·n(béo) = [n(CO₂) - n(H₂O)] - 2·n(béo)"
    },

    # --- CHƯƠNG 2: CARBOHYDRATE ---
    {
        "id": "c2_glucose_cuoh2",
        "ch": "c2",
        "chName": "Chương 2 · Carbohydrate",
        "cat": "Glucose",
        "tag": "Polyalcohol liền kề",
        "tagType": "blue",
        "title": "8. Glucose & Fructose với Cu(OH)₂ ở t° thường",
        "eq": "2 C₆H₁₂O₆ + Cu(OH)₂ → (C₆H₁₁O₆)₂Cu + 2 H₂O",
        "cond": "Nhiệt độ phòng, môi trường kiềm nhẹ",
        "ratio": "2 carbohydrate : 1 Cu(OH)₂ : 1 phức Cu : 2 H₂O",
        "ratioType": "blue",
        "points": [
            "Hiện tượng: Cu(OH)₂ kết tủa xanh nhạt bị hoà tan tạo dung dịch màu xanh lam thẫm.",
            "Chứng minh phân tử có nhiều nhóm -OH kề nhau.",
            "Cả Glucose, Fructose, Saccharose, Maltose đều có phản ứng này."
        ]
    },
    {
        "id": "c2_glucose_silver",
        "ch": "c2",
        "chName": "Chương 2 · Carbohydrate",
        "cat": "Glucose",
        "tag": "Tráng bạc Tollens 🪞",
        "tagType": "purple",
        "title": "9. Phản ứng Tráng bạc của Glucose (Thuốc thử Tollens)",
        "eq": "CH₂OH[CHOH]₄CHO + 2 [Ag(NH₃)₂]OH → CH₂OH[CHOH]₄COONH₄ + 2 Ag↓ + 3 NH₃ + H₂O",
        "cond": "Đun nóng nhẹ cách thuỷ (60–70°C)",
        "ratio": "1 Glucose (180 g) → 2 Ag↓ (216 g)",
        "ratioType": "purple",
        "points": [
            "Tỉ lệ mol: 1 mol Glucose sinh ra 2 mol Ag kết tủa bám sáng bóng.",
            "Tỉ lệ khối lượng: 180 gam Glucose → 216 gam Ag.",
            "Hiệu suất: m(Ag thu được) = m(Ag lý thuyết) × H%."
        ]
    },
    {
        "id": "c2_glucose_cu2o",
        "ch": "c2",
        "chName": "Chương 2 · Carbohydrate",
        "cat": "Glucose",
        "tag": "Tạo kết tủa đỏ gạch",
        "tagType": "coral",
        "title": "10. Glucose với Cu(OH)₂ trong kiềm đun nóng",
        "eq": "CH₂OH[CHOH]₄CHO + 2 Cu(OH)₂ + NaOH → CH₂OH[CHOH]₄COONa + Cu₂O↓ (đỏ gạch) + 3 H₂O",
        "cond": "Đun sôi hỗn hợp phản ứng",
        "ratio": "1 Glucose : 2 Cu(OH)₂ : 1 Cu₂O↓ (đỏ gạch)",
        "ratioType": "coral",
        "points": [
            "Tỉ lệ: 1 mol glucose tiêu tốn 2 mol Cu(OH)₂ và tạo 1 mol Cu₂O đỏ gạch.",
            "Khối lượng: 180 gam glucose → 144 gam Cu₂O.",
            "Chứng minh tính chất khử của nhóm aldehyde (-CHO)."
        ]
    },
    {
        "id": "c2_glucose_br2",
        "ch": "c2",
        "chName": "Chương 2 · Carbohydrate",
        "cat": "Glucose",
        "tag": "Phân biệt Fructose ⚠️",
        "tagType": "amber",
        "title": "11. Glucose với Nước Bromine (Oxi hoá nhóm -CHO)",
        "eq": "CH₂OH[CHOH]₄CHO + Br₂ + H₂O → CH₂OH[CHOH]₄COOH (gluconic acid) + 2 HBr",
        "cond": "Nhiệt độ phòng",
        "ratio": "1 Glucose : 1 Br₂ : 1 Gluconic acid : 2 HBr",
        "ratioType": "amber",
        "points": [
            "Glucose làm MẤT MÀU nước bromine.",
            "⚠️ BẪY ĐỀ THI: Fructose TUYỆT ĐỐI KHÔNG làm mất màu nước bromine (vì nước Br₂ có tính acid/trung tính, không có môi trường base để Fructose chuyển hoá thành Glucose)!",
            "Dùng nước Bromine là thuốc thử duy nhất để phân biệt Glucose và Fructose."
        ]
    },
    {
        "id": "c2_glucose_ferment",
        "ch": "c2",
        "chName": "Chương 2 · Carbohydrate",
        "cat": "Lên men",
        "tag": "Sản xuất cồn & Giấm",
        "tagType": "emerald",
        "title": "12. Phản ứng Lên men Rượu & Lên men Giấm từ Glucose",
        "eq": "C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂↑ (men rượu, 30–35°C)\nC₂H₅OH + O₂ → CH₃COOH + H₂O (men giấm)",
        "cond": "Lên men sinh học ở nhiệt độ thích hợp",
        "ratio": "1 Glucose (180 g) → 2 C₂H₅OH (92 g) + 2 CO₂ (88 g)",
        "ratioType": "emerald",
        "points": [
            "Tỉ lệ mol: 1 mol Glucose → 2 mol Ethanol + 2 mol CO₂.",
            "Dẫn CO₂ vào nước vôi trong Ca(OH)₂ dư: n(CaCO₃↓) = n(CO₂) = 2 · n(glucose phản ứng).",
            "Nếu tổng hợp giấm ăn: 1 mol Glucose (180 g) → 2 mol Acetic acid (120 g)."
        ]
    },
    {
        "id": "c2_saccharose",
        "ch": "c2",
        "chName": "Chương 2 · Carbohydrate",
        "cat": "Disaccharide",
        "tag": "Bẫy 1 ăn 4 Ag ⭐",
        "tagType": "purple",
        "title": "13. Thuỷ phân Saccharose & Tráng bạc sản phẩm",
        "eq": "C₁₂H₂₂O₁₁ + H₂O → C₆H₁₂O₆ (glucose) + C₆H₁₂O₆ (fructose)\n(1 glucose + 1 fructose) → 4 Ag↓ (khi tráng bạc)",
        "cond": "Thuỷ phân trong acid (H⁺, t°), sau đó trung hoà bằng kiềm rồi tráng bạc",
        "ratio": "1 Saccharose (342 g) → 4 Ag↓ (432 g)",
        "ratioType": "purple",
        "points": [
            "Bản thân Saccharose KHÔNG tráng bạc (không có nhóm hemiacetal tự do).",
            "⚠️ BẪY ĐỀ THI: Khi thuỷ phân hoàn toàn rồi tráng bạc: 1 Saccharose sinh ra 1 Glucose (→ 2 Ag) + 1 Fructose (→ 2 Ag) = TỔNG CỘNG 4 Ag!",
            "Nếu hiệu suất thuỷ phân là H%: n(Ag) = 4 · n(saccharose) · H%."
        ]
    },
    {
        "id": "c2_maltose",
        "ch": "c2",
        "chName": "Chương 2 · Carbohydrate",
        "cat": "Disaccharide",
        "tag": "Tráng bạc trực tiếp & thuỷ phân",
        "tagType": "blue",
        "title": "14. Maltose (Đường mạch nha) – Tráng bạc & Thuỷ phân",
        "eq": "C₁₂H₂₂O₁₁ (Maltose) → 2 Ag↓ (trực tiếp)\nC₁₂H₂₂O₁₁ + H₂O → 2 Glucose → 4 Ag↓ (sau thuỷ phân)",
        "cond": "Đun nóng nhẹ với thuốc thử Tollens",
        "ratio": "Trực tiếp: 1 Maltose → 2 Ag | Sau thuỷ phân: 1 Maltose → 4 Ag",
        "ratioType": "blue",
        "points": [
            "Maltose có cấu tạo từ 2 gốc α-glucose liên kết qua cầu α-1,4-glycosidic, còn 1 nhóm hemiacetal tự do nên tráng bạc được trực tiếp (1 : 2 Ag).",
            "Sau thuỷ phân trong acid tạo 2 glucose, đem tráng bạc thu được 4 Ag."
        ]
    },
    {
        "id": "c2_starch_cellulose",
        "ch": "c2",
        "chName": "Chương 2 · Carbohydrate",
        "cat": "Polysaccharide",
        "tag": "Tinh bột & Thuốc súng không khói",
        "tagType": "amber",
        "title": "15. Tinh bột & Cellulose (Thuỷ phân, Quang hợp, Trinitrate)",
        "eq": "(C₆H₁₀O₅)n + n H₂O → n C₆H₁₂O₆ (thủy phân, 162 g → 180 g)\n[C₆H₇O₂(OH)₃]n + 3n HNO₃ → [C₆H₇O₂(ONO₂)₃]n + 3n H₂O",
        "cond": "Thuỷ phân (H⁺, t°); Điều chế trinitrate (H₂SO₄ đặc, t°)",
        "ratio": "1 mắt xích Cellulose (162 g) + 3 HNO₃ (189 g) → 1 Trinitrate (297 g) + 3 H₂O",
        "ratioType": "amber",
        "points": [
            "Thuỷ phân tinh bột hoặc cellulose: 1 mol mắt xích (162 g) + 1 mol H₂O (18 g) → 1 mol Glucose (180 g).",
            "Lên men rượu từ tinh bột: 162 gam tinh bột → 92 gam ethanol + 88 gam CO₂.",
            "Cellulose trinitrate (thuốc súng không khói): Tỉ lệ mol 1 mắt xích : 3 HNO₃ : 1 trinitrate : 3 H₂O (162 g + 189 g → 297 g + 54 g)."
        ]
    },

    # --- CHƯƠNG 3: HỢP CHẤT NITROGEN ---
    {
        "id": "c3_amine_hcl",
        "ch": "c3",
        "chName": "Chương 3 · Hợp chất Nitrogen",
        "cat": "Amine",
        "tag": "Tăng giảm khối lượng",
        "tagType": "blue",
        "title": "16. Amine tác dụng với Acid vô cơ (HCl, H₂SO₄)",
        "eq": "R-NH₂ + HCl → R-NH₃Cl\n2 R-NH₂ + H₂SO₄ → (R-NH₃)₂SO₄",
        "cond": "Nhiệt độ phòng (phản ứng tạo muối)",
        "ratio": "Amine đơn: n(amine) = n(HCl) = n(muối) = n(N)",
        "ratioType": "blue",
        "points": [
            "Tăng giảm khối lượng: Δm(muối tăng) = m(muối) - m(amine) = 36,5 · n(HCl).",
            "Amine x chức: R(NH₂)x + x HCl → R(NH₃Cl)x  ⇒  n(HCl) = x · n(amine).",
            "Tác dụng với H₂SO₄: n(amine) : n(H₂SO₄) = 2 : 1."
        ],
        "formula": "n(amine đơn) = [m(muối) - m(amine)] / 36,5"
    },
    {
        "id": "c3_aniline_br2",
        "ch": "c3",
        "chName": "Chương 3 · Hợp chất Nitrogen",
        "cat": "Aniline",
        "tag": "Kết tủa trắng nhận biết",
        "tagType": "coral",
        "title": "17. Aniline với Nước Bromine (Nhận biết Aniline)",
        "eq": "C₆H₅NH₂ + 3 Br₂ → C₆H₂Br₃NH₂↓ (trắng, M=330) + 3 HBr",
        "cond": "Nhiệt độ phòng, phản ứng thế vào các vị trí ortho và para",
        "ratio": "1 Aniline (93 g) : 3 Br₂ (480 g) : 1 kết tủa trắng (330 g) : 3 HBr",
        "ratioType": "coral",
        "points": [
            "Hiện tượng: Nước bromine bị mất màu và xuất hiện kết tủa trắng 2,4,6-tribromoaniline.",
            "Tỉ lệ mol: 1 mol Aniline phản ứng vừa đủ với 3 mol Br₂.",
            "Tỉ lệ khối lượng: 93 gam Aniline + 480 gam Br₂ → 330 gam kết tủa trắng."
        ]
    },
    {
        "id": "c3_amine_hno2_burn",
        "ch": "c3",
        "chName": "Chương 3 · Hợp chất Nitrogen",
        "cat": "Amine",
        "tag": "Khí thoát ra & Đốt cháy",
        "tagType": "orange",
        "title": "18. Amine với HNO₂ & Phản ứng đốt cháy Amine",
        "eq": "R-NH₂ + HNO₂ → R-OH + N₂↑ + H₂O (amine no bậc 1)\nCnH₂n₊₃N + (6n+3)/4 O₂ → n CO₂ + (2n+3)/2 H₂O + 1/2 N₂",
        "cond": "Tác dụng HNO₂ ở nhiệt độ phòng; Đốt cháy trong O₂",
        "ratio": "Amine bậc 1: n(N₂) = n(amine) | Đốt cháy: n(H₂O) - n(CO₂) = 1,5 · n(amine)",
        "ratioType": "orange",
        "points": [
            "Amine no bậc 1 tác dụng HNO₂ giải phóng khí N₂: n(N₂) = n(amine).",
            "Aniline tác dụng HNO₂ + HCl ở 0–5°C tạo muối diazonium: C₆H₅N₂⁺Cl⁻ (không sủi bọt khí).",
            "Đốt cháy amine no đơn hở: n(amine) = [n(H₂O) - n(CO₂)] / 1,5."
        ]
    },
    {
        "id": "c3_amino_acid_naoh",
        "ch": "c3",
        "chName": "Chương 3 · Hợp chất Nitrogen",
        "cat": "Amino Acid",
        "tag": "Tính acid của nhóm -COOH",
        "tagType": "emerald",
        "title": "19. Amino Acid tác dụng với Base mạnh (NaOH, KOH)",
        "eq": "(H₂N)x-R-(COOH)y + y NaOH → (H₂N)x-R-(COONa)y + y H₂O",
        "cond": "Nhiệt độ phòng hoặc đun nhẹ",
        "ratio": "n(NaOH) = n(-COOH) = n(H₂O) = y · n(amino acid)",
        "ratioType": "emerald",
        "points": [
            "Số mol NaOH phản ứng đúng bằng số nhóm -COOH và số mol H₂O sinh ra.",
            "Bảo toàn khối lượng: m(amino acid) + m(NaOH) = m(muối) + m(H₂O).",
            "Tăng giảm khối lượng: Δm(muối tăng) = (23 - 1) · n(NaOH) = 22 · y · n(amino acid)."
        ],
        "formula": "Δm(muối tăng) = 22 · n(NaOH)"
    },
    {
        "id": "c3_amino_acid_hcl",
        "ch": "c3",
        "chName": "Chương 3 · Hợp chất Nitrogen",
        "cat": "Amino Acid",
        "tag": "Tính base của nhóm -NH₂",
        "tagType": "blue",
        "title": "20. Amino Acid tác dụng với Acid mạnh (HCl)",
        "eq": "(H₂N)x-R-(COOH)y + x HCl → (ClH₃N)x-R-(COOH)y",
        "cond": "Nhiệt độ phòng",
        "ratio": "n(HCl) = n(-NH₂) = x · n(amino acid)",
        "ratioType": "blue",
        "points": [
            "Số mol HCl phản ứng đúng bằng số nhóm -NH₂.",
            "Bảo toàn khối lượng: m(muối) = m(amino acid) + m(HCl).",
            "Tăng giảm khối lượng: Δm(muối tăng) = m(HCl) = 36,5 · x · n(amino acid)."
        ],
        "formula": "n(HCl) = [m(muối) - m(amino acid)] / 36,5"
    },
    {
        "id": "c3_5_standard_aa",
        "ch": "c3",
        "chName": "Chương 3 · Hợp chất Nitrogen",
        "cat": "Amino Acid",
        "tag": "5 chất kinh điển ⭐",
        "tagType": "purple",
        "title": "21. Tỉ lệ mol của 5 Amino Acid tiêu chuẩn (Gly, Ala, Val, Glu, Lys)",
        "eq": "Gly (75), Ala (89), Val (117): 1 -NH₂, 1 -COOH\nGlu (147): 1 -NH₂, 2 -COOH | Lys (146): 2 -NH₂, 1 -COOH",
        "cond": "Thuộc lòng công thức, phân tử khối và phản ứng quỳ tím",
        "ratio": "Gly/Ala/Val: 1 NaOH, 1 HCl | Glu: 2 NaOH, 1 HCl | Lys: 1 NaOH, 2 HCl",
        "ratioType": "purple",
        "points": [
            "Glycine (75), Alanine (89), Valine (117): Số nhóm -NH₂ = -COOH ⇒ Quỳ tím KHÔNG đổi màu.",
            "Glutamic acid (147): 2 nhóm -COOH, 1 -NH₂ ⇒ Quỳ tím HOÁ ĐỎ/HỒNG. Ăn 2 NaOH, 1 HCl.",
            "Lysine (146): 2 nhóm -NH₂, 1 -COOH ⇒ Quỳ tím HOÁ XANH. Ăn 1 NaOH, 2 HCl."
        ]
    },
    {
        "id": "c3_aa_series_convert",
        "ch": "c3",
        "chName": "Chương 3 · Hợp chất Nitrogen",
        "cat": "Amino Acid",
        "tag": "Quy đổi phản ứng nối tiếp",
        "tagType": "emerald",
        "title": "22. Phương pháp Quy đổi phản ứng Nối tiếp của Amino Acid",
        "eq": "Cho amino acid tác dụng với HCl rồi cho dung dịch tác dụng tiếp với NaOH (hoặc ngược lại)",
        "cond": "Xem như phản ứng đồng thời của hỗn hợp với chất sau",
        "ratio": "n(NaOH) = n(-COOH) + n(HCl) | n(HCl) = n(-NH₂) + n(NaOH)",
        "ratioType": "emerald",
        "points": [
            "Nếu cho X + HCl rồi cho dung dịch + NaOH: Coi như hỗn hợp {X, HCl} cùng phản ứng đồng thời với NaOH: n(NaOH) = n(-COOH) + n(HCl).",
            "Nếu cho X + NaOH rồi cho dung dịch + HCl: Coi như hỗn hợp {X, NaOH} cùng phản ứng đồng thời với HCl: n(HCl) = n(-NH₂) + n(NaOH)."
        ]
    },
    {
        "id": "c3_peptide_acid",
        "ch": "c3",
        "chName": "Chương 3 · Hợp chất Nitrogen",
        "cat": "Peptide",
        "tag": "Thuỷ phân hoàn toàn",
        "tagType": "blue",
        "title": "23. Thuỷ phân Peptide trong môi trường Acid (HCl)",
        "eq": "1 n-peptide + (n - 1) H₂O + n HCl → n muối clorua",
        "cond": "Đun sôi với dung dịch HCl",
        "ratio": "n(H₂O) = (n - 1) · n(pep) | n(HCl) = n · n(pep)",
        "ratioType": "blue",
        "points": [
            "Cần (n - 1) mol H₂O để cắt đứt (n - 1) liên kết peptide thành các amino acid tự do.",
            "Cần n mol HCl để tác dụng với n nhóm -NH₂ tạo muối clorua.",
            "Bảo toàn khối lượng: m(muối) = m(peptide) + 18(n - 1)n(pep) + 36,5·n·n(pep)."
        ],
        "formula": "m(muối) = m(pep) + 18·(n - 1)·n(pep) + 36,5·n·n(pep)"
    },
    {
        "id": "c3_peptide_base",
        "ch": "c3",
        "chName": "Chương 3 · Hợp chất Nitrogen",
        "cat": "Peptide",
        "tag": "QUY TẮC VÀNG ĐỀ THI ⭐",
        "tagType": "amber",
        "title": "24. Thuỷ phân Peptide trong môi trường Kiềm (NaOH)",
        "eq": "1 n-peptide + n NaOH → n muối natri + 1 H₂O",
        "cond": "Đun sôi với dung dịch NaOH",
        "ratio": "1 n-peptide : n NaOH : n muối : DUY NHẤT 1 H₂O",
        "ratioType": "amber",
        "points": [
            "⚠️ QUY TẮC VÀNG: Bất kể peptide dài bao nhiêu mắt xích (di, tri, tetra...), phản ứng thuỷ phân trong kiềm LUÔN CHỈ SINH RA DUY NHẤT 1 mol H₂O từ nhóm -COOH tự do ở đầu C!",
            "Tỉ lệ mol: n(NaOH) = n · n(peptide) và n(H₂O) = n(peptide).",
            "Bảo toàn khối lượng: m(muối) = m(peptide) + 40·n·n(pep) - 18·n(pep) = m(peptide) + (40n - 18)·n(pep).",
            "Lưu ý: Nếu trong chuỗi có gốc Glu (mang 2 -COOH), mỗi gốc Glu sẽ tiêu tốn thêm 1 NaOH và sinh thêm 1 H₂O."
        ],
        "formula": "m(muối) = m(peptide) + (40n - 18) · n(peptide)"
    },

    # --- CHƯƠNG 4: POLYMER & VẬT LIỆU ---
    {
        "id": "c4_nylon6",
        "ch": "c4",
        "chName": "Chương 4 · Polymer",
        "cat": "Polyamide",
        "tag": "Trùng ngưng vs Trùng hợp",
        "tagType": "blue",
        "title": "25. Tơ Nilon-6 (Polycaproamide)",
        "eq": "n H₂N-(CH₂)₅-COOH → -[HN-(CH₂)₅-CO]n- + n H₂O (trùng ngưng)\nn C₆H₁₁NO → -[HN-(CH₂)₅-CO]n- (trùng hợp mở vòng caprolactam)",
        "cond": "Nhiệt độ, áp suất, chất xúc tác",
        "ratio": "Trùng ngưng: 131 g acid → 113 g polime + 18 g H₂O | Trùng hợp: 1 : 1",
        "ratioType": "blue",
        "points": [
            "Trùng ngưng: n mol ε-aminocaproic acid sinh ra 1 mol polime (mắt xích 113 g) và n mol H₂O.",
            "Trùng hợp mở vòng: 1 mol caprolactam tạo 1 mol mắt xích Nilon-6, TUYỆT ĐỐI KHÔNG sinh ra H₂O.",
            "Bẫy đề thi: Nilon-6 có thể điều chế bằng CẢ 2 PHƯƠNG PHÁP: trùng ngưng hoặc trùng hợp!"
        ]
    },
    {
        "id": "c4_nylon66",
        "ch": "c4",
        "chName": "Chương 4 · Polymer",
        "cat": "Polyamide",
        "tag": "Trùng ngưng 2 monomer",
        "tagType": "emerald",
        "title": "26. Tơ Nilon-6,6 (Poly(hexamethylene adipamide))",
        "eq": "n H₂N-(CH₂)₆-NH₂ + n HOOC-(CH₂)₄-COOH → -[HN-(CH₂)₆-NH-CO-(CH₂)₄-CO]n- + 2n H₂O",
        "cond": "Đun nóng hỗn hợp diamine và diacid",
        "ratio": "1 diamine (116 g) : 1 diacid (146 g) → 1 mắt xích Nilon-6,6 (226 g) : 2 H₂O (36 g)",
        "ratioType": "emerald",
        "points": [
            "Monomer: Hexamethylenediamine (116 g/mol) và Adipic acid (146 g/mol).",
            "Mỗi mắt xích Nilon-6,6 sinh ra 2 phân tử H₂O.",
            "Tỉ lệ khối lượng: 116 g diamine + 146 g diacid → 226 g Nilon-6,6 + 36 g H₂O."
        ]
    },
    {
        "id": "c4_lapsan",
        "ch": "c4",
        "chName": "Chương 4 · Polymer",
        "cat": "Polyester",
        "tag": "Tơ Lapsan (PET)",
        "tagType": "purple",
        "title": "27. Tơ Lapsan / Poly(ethylene terephthalate) – PET",
        "eq": "n p-HOOC-C₆H₄-COOH + n HO-CH₂-CH₂-OH → -[CO-C₆H₄-COO-CH₂-CH₂-O]n- + 2n H₂O",
        "cond": "Đun nóng với xúc tác thích hợp",
        "ratio": "1 terephthalic acid (166 g) : 1 ethylene glycol (62 g) → 1 lapsan (192 g) : 2 H₂O",
        "ratioType": "purple",
        "points": [
            "Thuộc loại tơ polyester (chứa liên kết ester trong mạch chính).",
            "Tỉ lệ mol: 1 mol acid terephthalic + 1 mol ethylene glycol → 1 mol mắt xích lapsan + 2 mol H₂O.",
            "Tỉ lệ khối lượng: 166 gam acid + 62 gam glycol → 192 gam Lapsan + 36 gam H₂O."
        ]
    },
    {
        "id": "c4_pmma_rubber",
        "ch": "c4",
        "chName": "Chương 4 · Polymer",
        "cat": "Polymer",
        "tag": "Plexiglas & Cao su",
        "tagType": "coral",
        "title": "28. Poly(methyl methacrylate) (Plexiglas) & Cao su Buna",
        "eq": "n CH₂=C(CH₃)-COOCH₃ → -[CH₂-C(CH₃)(COOCH₃)]n- (Plexiglas)\nn CH₂=CH-CH=CH₂ → -[CH₂-CH=CH-CH₂]n- (Cao su Buna)",
        "cond": "Trùng hợp nhờ nhiệt độ, áp suất, chất khơi mào",
        "ratio": "1 monomer → 1 mắt xích polymer (tỉ lệ mol 1 : 1, không sinh sản phẩm phụ)",
        "ratioType": "coral",
        "points": [
            "Methyl methacrylate (M = 100 g/mol) trùng hợp tạo thuỷ tinh hữu cơ Plexiglas dùng làm kính máy bay, răng giả.",
            "Cao su Buna-S: n Butadiene + m Styrene → Cao su Buna-S (tỉ lệ mắt xích n : m).",
            "Cao su Buna-N: n Butadiene + m Acrylonitrile → Cao su Buna-N (tỉ lệ mắt xích n : m)."
        ]
    },

    # --- CHƯƠNG 5: CÔNG THỨC & BẪY ĐỊNH LƯỢNG ---
    {
        "id": "c5_unsat_k",
        "ch": "c5",
        "chName": "Chương 5 · Công thức & Bẫy",
        "cat": "Công thức",
        "tag": "Độ bất bão hoà k",
        "tagType": "emerald",
        "title": "29. Quan hệ Độ bất bão hoà k khi Đốt cháy hợp chất hữu cơ",
        "eq": "n(chất hữu cơ) = [n(CO₂) - n(H₂O)] / (k - 1)  (với k ≠ 1)\nn(H₂ phản ứng) = n(Br₂ phản ứng) = (k - π_chức) · n(chất hữu cơ)",
        "cond": "Áp dụng cho mọi hợp chất CxHyOz, ester, lipid, amino acid...",
        "ratio": "k = 0 (ancol no/ankan): n = n(H₂O) - n(CO₂) | k = 2: n = n(CO₂) - n(H₂O)",
        "ratioType": "emerald",
        "points": [
            "k = tổng số liên kết π + số vòng trong phân tử = (2C + 2 - H + N) / 2.",
            "Nếu k = 1 (ester no đơn hở): n(CO₂) = n(H₂O).",
            "Nếu k = 2 (ester 1 nối đôi C=C đơn hở): n(ester) = n(CO₂) - n(H₂O).",
            "Chất béo (k = 3 nhóm COO + k' nối đôi C=C): n(Br₂ cộng) = k' · n(béo) = [n(CO₂) - n(H₂O)] - 2 · n(béo)."
        ]
    },
    {
        "id": "c5_oxygen_balance",
        "ch": "c5",
        "chName": "Chương 5 · Công thức & Bẫy",
        "cat": "Công thức",
        "tag": "Bảo toàn nguyên tố O",
        "tagType": "blue",
        "title": "30. Bảo toàn Nguyên tố Oxi khi Đốt cháy",
        "eq": "x · n(hợp chất CxHyOz) + 2 · n(O₂) = 2 · n(CO₂) + n(H₂O)",
        "cond": "Áp dụng định luật bảo toàn nguyên tố trong mọi bài toán cháy",
        "ratio": "Ester đơn chức (2 O): 2·n(ester) + 2·n(O₂) = 2·n(CO₂) + n(H₂O)\nChất béo (6 O): 6·n(béo) + 2·n(O₂) = 2·n(CO₂) + n(H₂O)",
        "ratioType": "blue",
        "points": [
            "Giúp tìm nhanh số mol O₂ phản ứng hoặc số mol nhóm chức mà không cần viết phương trình cháy.",
            "Với Glucose/Fructose (6 O): 6·n(carb) + 2·n(O₂) = 2·n(CO₂) + n(H₂O) (Đặc biệt: n(O₂) = n(CO₂) đối với Cn(H₂O)m!)."
        ]
    },
    {
        "id": "c5_co2_limewater",
        "ch": "c5",
        "chName": "Chương 5 · Công thức & Bẫy",
        "cat": "Bẫy định lượng",
        "tag": "CO₂ vào nước vôi trong",
        "tagType": "amber",
        "title": "31. Bài toán Sục khí CO₂ vào dung dịch kiềm Ca(OH)₂ / Ba(OH)₂",
        "eq": "CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O\nCO₂ + CaCO₃ + H₂O → Ca(HCO₃)₂",
        "cond": "Dẫn sản phẩm cháy (CO₂, H₂O) qua bình đựng dung dịch kiềm",
        "ratio": "Kiềm dư: n(CO₂) = n(kết tủa) | Kiềm thiếu (tạo 2 muối): n(CO₂) = n(OH⁻) - n(kết tủa)",
        "ratioType": "amber",
        "points": [
            "Khối lượng bình tăng: m(bình tăng) = m(CO₂) + m(H₂O).",
            "Độ biến thiên khối lượng dung dịch: Δm(dung dịch) = [m(CO₂) + m(H₂O)] - m(kết tủa).",
            "Nếu Δm > 0: dung dịch TĂNG khối lượng.",
            "Nếu Δm < 0: dung dịch GIẢM khối lượng."
        ],
        "formula": "Δm(dung dịch) = [m(CO₂) + m(H₂O)] - m(kết tủa)"
    },
    {
        "id": "c5_biuret_trap",
        "ch": "c5",
        "chName": "Chương 5 · Công thức & Bẫy",
        "cat": "Bẫy điểm 9+",
        "tag": "Bẫy Biuret tử huyệt ⭐",
        "tagType": "coral",
        "title": "32. Bẫy Phản ứng màu Biuret: Dipeptide vs Tripeptide trở lên",
        "eq": "Tripeptide / Protein + Cu(OH)₂ / NaOH → Phức chất màu tím đặc trưng\nDipeptide + Cu(OH)₂ / NaOH → KHÔNG CÓ PHẢN ỨNG MÀU BIURET!",
        "cond": "Môi trường kiềm, Cu(OH)₂ mới điều chế",
        "ratio": "Tripeptide trở lên: 1 chuỗi peptide : 1 Cu(OH)₂ (phức tím) | Dipeptide: 0 phản ứng",
        "ratioType": "coral",
        "points": [
            "⚠️ BẪY ĐỀ THI TỬ HUYỆT: Để có phản ứng màu Biuret, phân tử bắt buộc phải có từ HAI LIÊN KẾT PEPTIDE TRỞ LÊN (tức là từ TRIPEPTIDE trở lên hoặc PROTEIN).",
            "Dipeptide chỉ có 1 liên kết peptide nên TUYỆT ĐỐI KHÔNG CÓ phản ứng màu biuret!",
            "Tỉ lệ tạo phức: 1 chuỗi peptide tạo phức với 1 Cu(OH)₂."
        ]
    }
]

print("Total categories:", len(categories))
print("Total items:", len(items))

# Let's write the complete mole-guide.js file
mole_guide_code = f"""/* ═══════════════════════════════════════════════════════════════════
   MOLE RATIOS & STOICHIOMETRIC GUIDE (CẨM NANG TỈ LỆ MOL HOÁ 12)
   Chương trình Giáo dục Phổ thông 2018 (Cánh Diều, Kết Nối Tri Thức, Chân Trời Sáng Tạo)
   32 Chuyên đề trọng tâm, phân loại phản ứng, tỉ lệ mol & bẫy đề thi
   ═══════════════════════════════════════════════════════════════════ */

(function (root) {{
  'use strict';

  var CATEGORIES = {json.dumps(categories, ensure_ascii=False, indent=2)};

  var ITEMS = {json.dumps(items, ensure_ascii=False, indent=2)};

  var state = {{
    filter: "all",
    search: "",
    viewMode: "cards", // "cards" or "table"
    expanded: {{}},
    allExpanded: false
  }};

  var MoleGuide = {{
    items: ITEMS,
    categories: CATEGORIES,
    state: state,

    setFilter: function (catId) {{
      state.filter = catId || "all";
      this.refreshUI();
    }},

    setSearch: function (q) {{
      state.search = (q || "").trim().toLowerCase();
      this.refreshUI();
    }},

    toggleViewMode: function () {{
      state.viewMode = (state.viewMode === "cards") ? "table" : "cards";
      this.refreshUI();
    }},

    toggleCard: function (id) {{
      state.expanded[id] = !state.expanded[id];
      var el = document.getElementById("mg-card-body-" + id);
      var btn = document.getElementById("mg-toggle-btn-" + id);
      if (el) {{
        if (state.expanded[id]) {{
          el.style.display = "block";
          if (btn) btn.innerHTML = '▲ Thu gọn';
        }} else {{
          el.style.display = "none";
          if (btn) btn.innerHTML = '▼ Chi tiết';
        }}
      }}
    }},

    toggleAll: function () {{
      state.allExpanded = !state.allExpanded;
      ITEMS.forEach(function (it) {{
        state.expanded[it.id] = state.allExpanded;
      }});
      this.refreshUI();
    }},

    copyAllText: function () {{
      if (root.SYSTEM_NOTE_MOLE_RATIO && root.SYSTEM_NOTE_MOLE_RATIO.b) {{
        var fullText = root.SYSTEM_NOTE_MOLE_RATIO.t + "\\n\\n" + root.SYSTEM_NOTE_MOLE_RATIO.b;
        if (navigator.clipboard && navigator.clipboard.writeText) {{
          navigator.clipboard.writeText(fullText).then(function () {{
            if (root.showMiniToast) root.showMiniToast("✓ Đã sao chép toàn bộ cẩm nang tỉ lệ mol vào clipboard!");
          }}).catch(function () {{
            if (root.showMiniToast) root.showMiniToast("Không thể sao chép tự động");
          }});
        }} else if (root.showMiniToast) {{
          root.showMiniToast("Trình duyệt không hỗ trợ clipboard API");
        }}
      }}
    }},

    refreshUI: function () {{
      var container = document.getElementById("moleGuideContainer");
      if (container) {{
        container.innerHTML = this.renderBody();
        // Restore search input value if active
        var searchInput = document.getElementById("moleSearchInput");
        if (searchInput && state.search) {{
          searchInput.value = state.search;
          searchInput.focus();
        }}
      }} else if (root.renderLibraryOnly) {{
        root.renderLibraryOnly();
      }}
    }},

    getFilteredItems: function () {{
      var f = state.filter;
      var q = state.search;
      return ITEMS.filter(function (it) {{
        var matchCat = (f === "all" || it.ch === f);
        if (!matchCat) return false;
        if (!q) return true;
        var text = (it.title + " " + it.eq + " " + it.ratio + " " + (it.points || []).join(" ") + " " + (it.formula || "")).toLowerCase();
        return text.indexOf(q) !== -1;
      }});
    }},

    render: function () {{
      return '<div class="mole-guide-shell" id="moleGuideShell">' +
        this.renderHeader() +
        '<div id="moleGuideContainer">' + this.renderBody() + '</div>' +
      '</div>';
    }},

    renderHeader: function () {{
      return '<div class="mole-hero">' +
        '<div class="mole-hero-content">' +
          '<div class="mole-hero-badge"><span class="badge g12">📌 SỔ TAY ĐIỂM 9+ · CHUẨN GDPT 2018</span></div>' +
          '<h3 class="mole-hero-title">⚡ Cẩm nang Tỉ lệ Mol &amp; Quan hệ Lượng chất Hoá học 12</h3>' +
          '<p class="mole-hero-desc">Tra cứu tức thì 32 quan hệ tỉ lệ mol, phương trình hoá học, bảo toàn khối lượng và các bẫy điểm 9+ kinh điển trong đề thi.</p>' +
          '<div class="mole-hero-actions">' +
            '<button class="btn ghost tiny" data-act="moleCopyAll"><svg class="ico" viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg> Sao chép toàn bộ</button>' +
            '<button class="btn ghost tiny" data-act="moleToggleAll"><svg class="ico" viewBox="0 0 24 24"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg> ' + (state.allExpanded ? 'Thu gọn tất cả' : 'Mở rộng tất cả') + '</button>' +
            '<button class="btn ghost tiny" data-act="moleToggleView"><svg class="ico" viewBox="0 0 24 24"><path d="M3 3h7v7H3z"/><path d="M14 3h7v7h-7z"/><path d="M14 14h7v7h-7z"/><path d="M3 14h7v7H3z"/></svg> ' + (state.viewMode === "cards" ? 'Xem bảng tra' : 'Xem dạng thẻ') + '</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }},

    renderBody: function () {{
      var filtered = this.getFilteredItems();
      var filterPills = '<div class="mole-filter-bar">' +
        CATEGORIES.map(function (c) {{
          var count = (c.id === "all") ? ITEMS.length : ITEMS.filter(function (it) {{ return it.ch === c.id; }}).length;
          var active = (state.filter === c.id) ? " active" : "";
          return '<button class="mole-chip' + active + '" data-act="moleFilter" data-cat="' + c.id + '">' +
            c.icon + ' ' + c.label + ' <span class="mole-chip-count">' + count + '</span>' +
          '</button>';
        }}).join("") +
      '</div>';

      var searchBar = '<div class="mole-search-wrap">' +
        '<input id="moleSearchInput" type="text" class="mole-search-input" placeholder="🔍 Tìm kiếm chất, PTHH, hoặc tỉ lệ (vd: phenol, tráng bạc, peptit, 1:2)..." value="' + (state.search || "") + '">' +
        (state.search ? '<button class="mole-search-clear" data-act="moleClearSearch">✕</button>' : '') +
      '</div>';

      var resultsMeta = '<div class="mole-results-meta">' +
        '<span>Hiển thị <b>' + filtered.length + '</b> / ' + ITEMS.length + ' chuyên đề</span>' +
        (state.search ? ' <span class="muted">(khớp từ khoá "' + state.search + '")</span>' : '') +
      '</div>';

      var contentHtml = "";
      if (!filtered.length) {{
        contentHtml = '<div class="mole-empty-state"><p>Không tìm thấy chuyên đề phù hợp với từ khoá "' + (state.search || "") + '".</p></div>';
      }} else if (state.viewMode === "table") {{
        contentHtml = this.renderTable(filtered);
      }} else {{
        contentHtml = this.renderCards(filtered);
      }}

      return filterPills + searchBar + resultsMeta + contentHtml;
    }},

    renderCards: function (items) {{
      var self = this;
      return '<div class="mole-cards-grid">' +
        items.map(function (it) {{
          var isExp = !!state.expanded[it.id];
          var badgeClass = "badge " + (it.tagType || "blue");
          var ratioBadgeCls = "mole-ratio-pill " + (it.ratioType || "blue");

          return '<div class="mole-card ' + (it.tagType ? 'border-' + it.tagType : '') + '">' +
            '<div class="mole-card-header">' +
              '<div class="mole-card-title-group">' +
                '<span class="' + badgeClass + '">' + it.tag + '</span>' +
                '<h4 class="mole-card-title">' + it.title + '</h4>' +
              '</div>' +
              '<button class="mole-card-toggle" id="mg-toggle-btn-' + it.id + '" data-act="moleToggleCard" data-id="' + it.id + '">' +
                (isExp ? '▲ Thu gọn' : '▼ Chi tiết') +
              '</button>' +
            '</div>' +

            '<div class="mole-card-main">' +
              '<div class="mole-eq-box">' +
                '<div class="mole-eq-label">Phương trình hoá học &amp; Điều kiện:</div>' +
                '<div class="mole-eq-code">' + (it.eq || "").replace(/\\n/g, "<br>") + '</div>' +
                (it.cond ? '<div class="mole-eq-cond">⚙ Điều kiện: ' + it.cond + '</div>' : '') +
              '</div>' +

              '<div class="mole-ratio-row">' +
                '<div class="mole-ratio-label">Tỉ lệ mol then chốt:</div>' +
                '<div class="' + ratioBadgeCls + '">' + it.ratio + '</div>' +
              '</div>' +
            '</div>' +

            '<div class="mole-card-body" id="mg-card-body-' + it.id + '" style="display:' + (isExp ? 'block' : 'none') + '">' +
              (it.formula ? '<div class="mole-formula-box">🧮 <b>Công thức tính nhanh:</b> <code>' + it.formula + '</code></div>' : '') +
              '<ul class="mole-points-list">' +
                (it.points || []).map(function (p) {{
                  var isWarn = p.indexOf("⚠️") !== -1 || p.indexOf("BẪY") !== -1;
                  return '<li class="' + (isWarn ? 'mole-warn-point' : '') + '">' + p + '</li>';
                }}).join("") +
              '</ul>' +
            '</div>' +
          '</div>';
        }}).join("") +
      '</div>';
    }},

    renderTable: function (items) {{
      return '<div class="mole-table-wrap">' +
        '<table class="mole-table">' +
          '<thead>' +
            '<tr>' +
              '<th style="width:28%">Phản ứng / Chuyên đề</th>' +
              '<th style="width:34%">Tỉ lệ mol &amp; Phương trình</th>' +
              '<th style="width:38%">Bảo toàn khối lượng &amp; Bẫy đề thi</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>' +
            items.map(function (it) {{
              var ratioBadgeCls = "mole-ratio-pill " + (it.ratioType || "blue");
              return '<tr>' +
                '<td class="col-title">' +
                  '<span class="badge ' + (it.tagType || "blue") + '" style="margin-bottom:4px;display:inline-block">' + it.tag + '</span>' +
                  '<div class="tbl-name"><b>' + it.title + '</b></div>' +
                  '<small class="muted">' + it.chName + '</small>' +
                '</td>' +
                '<td class="col-eq">' +
                  '<div class="' + ratioBadgeCls + '" style="margin-bottom:6px">' + it.ratio + '</div>' +
                  '<div class="tbl-eq-code">' + (it.eq || "").replace(/\\n/g, "<br>") + '</div>' +
                '</td>' +
                '<td class="col-notes">' +
                  (it.formula ? '<div class="tbl-formula">🧮 <code>' + it.formula + '</code></div>' : '') +
                  '<ul class="tbl-points">' +
                    (it.points || []).map(function (p) {{ return '<li>' + p + '</li>'; }}).join("") +
                  '</ul>' +
                '</td>' +
              '</tr>';
            }}).join("") +
          '</tbody>' +
        '</table>' +
      '</div>';
    }}
  }};

  root.MoleGuide = MoleGuide;

}})(typeof window !== "undefined" ? window : this);
"""

with open("js/mole-guide.js", "w", encoding="utf-8") as f:
    f.write(mole_guide_code)

print("Created js/mole-guide.js successfully!")
