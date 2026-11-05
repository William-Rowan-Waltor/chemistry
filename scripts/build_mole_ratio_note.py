# -*- coding: utf-8 -*-
import sys

sys.stdout.reconfigure(encoding="utf-8")

note_title = "⚡ CẨM NANG TỈ LỆ MOL & QUAN HỆ LƯỢNG CHẤT HOÁ HỌC 12 (TOÀN TẬP - GDPT 2018)"

note_body = """═════════════════════════════════════════════════════════════════════
📖 CẨM NANG TỈ LỆ MOL & QUAN HỆ LƯỢNG CHẤT HOÁ HỌC 12 (TOÀN TẬP)
Biên soạn chuẩn Chương trình GDPT 2018 (Cánh Diều, Kết Nối Tri Thức, Chân Trời Sáng Tạo)
Tổng hợp đầy đủ lý thuyết, bài tập định lượng và 20 đề thi trắc nghiệm trên hệ thống.
═════════════════════════════════════════════════════════════════════

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 PHẦN I: ESTER – LIPID – XÀ PHÒNG & CHẤT GIẶT RỬA (CHƯƠNG 1)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. PHẢN ỨNG ESTER HOÁ & THUỶ PHÂN TRONG MÔI TRƯỜNG ACID (Thuận nghịch, xúc tác H₂SO₄ đặc, t°):
   • Ester đơn chức:
     RCOOH + R'OH ⇌ RCOOR' + H₂O
     Tỉ lệ mol: n(acid) : n(alcohol) : n(ester) : n(H₂O) = 1 : 1 : 1 : 1
     Hằng số cân bằng: Kc = [RCOOR'][H₂O] / ([RCOOH][R'OH])
   • Acid đa chức (x chức) + Alcohol đơn chức:
     R(COOH)x + x R'OH ⇌ R(COOR')x + x H₂O
     Tỉ lệ mol: 1 : x : 1 : x  ⇒  n(alcohol) = n(H₂O) = x · n(ester)
   • Alcohol đa chức (y chức) + Acid đơn chức:
     y RCOOH + R'(OH)y ⇌ (RCOO)yR' + y H₂O
     Tỉ lệ mol: y : 1 : 1 : y  ⇒  n(acid) = n(H₂O) = y · n(ester)

2. THUỶ PHÂN TRONG MÔI TRƯỜNG KIỀM (XÀ PHÒNG HOÁ – Phản ứng 1 chiều):
   • Ester đơn chức thông thường (gốc alcohol no, bền):
     RCOOR' + NaOH → RCOONa + R'OH
     Tỉ lệ mol: n(ester) : n(NaOH) : n(muối) : n(alcohol) = 1 : 1 : 1 : 1
     Bảo toàn khối lượng: m(ester) + m(NaOH) = m(muối) + m(alcohol)
     (Nếu dùng KOH: thay 40 g/mol NaOH bằng 56 g/mol KOH)
   • Ester của phenol (Bẫy kinh điển đề thi):
     RCOOC₆H₄R' + 2 NaOH → RCOONa + R'C₆H₄ONa + H₂O
     Tỉ lệ mol: n(ester) : n(NaOH) : n(hỗn hợp muối) : n(H₂O) = 1 : 2 : 2 : 1
     Dấu hiệu: n(NaOH) / n(ester) = 2; tạo 2 muối, KHÔNG sinh ra alcohol, sinh ra 1 H₂O!
     Bảo toàn khối lượng: m(ester) + 2 · 40 · n(ester) = m(muối) + 18 · n(ester)
   • Ester vinyl (thủy phân sinh Aldehyde):
     RCOOCH=CH-R' + NaOH → RCOONa + R'-CH₂-CHO
     Tỉ lệ mol: 1 : 1 : 1 : 1. Aldehyde sinh ra tráng bạc: 1 aldehyde → 2 Ag↓.
   • Ester isopropenyl (thủy phân sinh Ketone):
     RCOOC(CH₃)=CH₂ + NaOH → RCOONa + CH₃COCH₃
     Tỉ lệ mol: 1 : 1 : 1 : 1

3. TRIGLYCERIDE (CHẤT BÉO) – XÀ PHÒNG HOÁ & HYDROGEN HOÁ:
   • Công thức tổng quát: (RCOO)₃C₃H₅ (M: Triolein=884, Tristearin=890, Tripalmitin=806, Trilinolein=878)
   • Phản ứng xà phòng hoá với NaOH:
     (RCOO)₃C₃H₅ + 3 NaOH → 3 RCOONa + C₃H₅(OH)₃ (glycerol)
     Tỉ lệ vàng:
       n(NaOH) = 3 · n(chất béo) = 3 · n(glycerol) = n(muối xà phòng)
       n(glycerol) = 1/3 · n(NaOH) = n(chất béo)
     Bảo toàn khối lượng:
       m(chất béo) + m(NaOH) = m(muối) + m(glycerol)
       m(muối) = m(chất béo) + 28 · n(chất béo)
       (Nếu dùng KOH: m(muối) = m(chất béo) + 76 · n(chất béo))
       m(xà phòng thương phẩm) = m(muối xà phòng) / (% muối)
   • Hydrogen hoá chất béo lỏng (dầu thực vật) thành chất béo rắn (bơ nhân tạo):
     (C₁₇H₃₃COO)₃C₃H₅ (Triolein, 3 nối đôi C=C) + 3 H₂ → (C₁₇H₃₅COO)₃C₃H₅ (Tristearin)
       Tỉ lệ mol: n(triolein) : n(H₂) : n(tristearin) = 1 : 3 : 1
     (C₁₇H₃₁COO)₃C₃H₅ (Trilinolein, 6 nối đôi C=C) + 6 H₂ → (C₁₇H₃₅COO)₃C₃H₅ (Tristearin)
       Tỉ lệ mol: n(trilinolein) : n(H₂) : n(tristearin) = 1 : 6 : 1
   • Phản ứng cộng dung dịch Bromine của chất béo:
     n(Br₂) = k(C=C) · n(chất béo)  (Triolein ăn 3 Br₂; Trilinolein ăn 6 Br₂)

4. ĐỐT CHÁY ESTER & LIPID:
   • Ester no, đơn chức, mạch hở (CnH₂nO₂, n ≥ 2):
     CnH₂nO₂ + (3n - 2)/2 O₂ → n CO₂ + n H₂O
     Tỉ lệ quan trọng: n(CO₂) = n(H₂O)
     Bảo toàn nguyên tố O: 2 · n(ester) + 2 · n(O₂) = 3 · n(CO₂)
   • Ester không no, có 1 nối đôi C=C, đơn hở (CnH₂n₋₂O₂, n ≥ 3):
     n(ester) = n(CO₂) - n(H₂O)
   • Chất béo bất kì có độ bất bão hoà k (gồm 3 nhóm COO và k' nối đôi C=C):
     n(chất béo) = [n(CO₂) - n(H₂O)] / (k - 1)
     n(H₂ phản ứng cộng) = n(Br₂ cộng) = (k - 3) · n(chất béo) = [n(CO₂) - n(H₂O)] - 2 · n(chất béo)

5. TRÁNG BẠC CỦA ESTER FORMATE:
   HCOOR + 2 [Ag(NH₃)₂]OH → ROCOONH₄ + 2 Ag↓ + 3 NH₃ + H₂O
   Tỉ lệ: 1 mol ester formate (HCOOR) → 2 mol Ag↓

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 PHẦN II: CARBOHYDRATE (CHƯƠNG 2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. GLUCOSE (C₆H₁₂O₆, M = 180):
   • Phản ứng với Cu(OH)₂ ở t° thường (tính polyalcohol liền kề):
     2 C₆H₁₂O₆ + Cu(OH)₂ → (C₆H₁₁O₆)₂Cu (phức xanh lam thẫm) + 2 H₂O
     Tỉ lệ mol: 2 glucose : 1 Cu(OH)₂ : 1 phức Cu : 2 H₂O
   • Phản ứng tráng bạc (thuốc thử Tollens):
     CH₂OH[CHOH]₄CHO + 2 [Ag(NH₃)₂]OH → CH₂OH[CHOH]₄COONH₄ + 2 Ag↓ + 3 NH₃ + H₂O
     Tỉ lệ mol: 1 glucose → 2 Ag↓  (180 gam glucose → 216 gam Ag)
   • Phản ứng với Cu(OH)₂ trong kiềm đun nóng:
     CH₂OH[CHOH]₄CHO + 2 Cu(OH)₂ + NaOH → CH₂OH[CHOH]₄COONa + Cu₂O↓ (đỏ gạch) + 3 H₂O
     Tỉ lệ mol: 1 glucose : 2 Cu(OH)₂ : 1 Cu₂O↓  (180 g glucose → 144 g Cu₂O)
   • Phản ứng với nước Bromine (nhận biết nhóm aldehyde):
     CH₂OH[CHOH]₄CHO + Br₂ + H₂O → CH₂OH[CHOH]₄COOH (gluconic acid) + 2 HBr
     Tỉ lệ mol: 1 glucose : 1 Br₂ : 1 gluconic acid : 2 HBr  (Làm mất màu nước Br₂)
   • Phản ứng khử với H₂ (xúc tác Ni, t°):
     C₆H₁₂O₆ + H₂ → C₆H₁₄O₆ (Sorbitol, M = 182)
     Tỉ lệ mol: 1 glucose : 1 H₂ : 1 sorbitol
   • Phản ứng lên men rượu (Ethanol):
     C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂↑  (men rượu, 30–35°C)
     Tỉ lệ mol: 1 glucose → 2 ethanol + 2 CO₂
     Tỉ lệ khối lượng: 180 gam glucose → 92 gam alcohol (2 × 46) + 88 gam CO₂ (2 × 44)
     Nếu dẫn CO₂ vào dung dịch Ca(OH)₂ dư: n(CaCO₃↓) = n(CO₂) = 2 · n(glucose pứ)
   • Phản ứng lên men giấm (2 giai đoạn):
     C₆H₁₂O₆ → 2 C₂H₅OH → 2 CH₃COOH
     Tỉ lệ: 1 glucose (180 g) → 2 acetic acid (120 g)
   • Phản ứng lên men Lactic:
     C₆H₁₂O₆ → 2 CH₃-CH(OH)-COOH (lactic acid)
     Tỉ lệ: 1 glucose → 2 lactic acid

2. FRUCTOSE (C₆H₁₂O₆, M = 180):
   • Trong môi trường kiềm: Fructose ⇌ Glucose (đồng phân hoá thuận nghịch).
   • Hoà tan Cu(OH)₂ ở t° thường: 2 fructose : 1 Cu(OH)₂ (dung dịch xanh lam thẫm).
   • Phản ứng tráng bạc: 1 fructose → 2 Ag↓ (do chuyển thành glucose trong môi trường kiềm của NH₃).
   • Nước Bromine: KHÔNG PHẢN ỨNG (không làm mất màu nước bromine vì không có môi trường base để chuyển hoá thành glucose).
   • Khử bằng H₂ (Ni, t°): 1 fructose + 1 H₂ → 1 sorbitol.

3. SACCHAROSE (C₁₂H₂₂O₁₁, M = 342 – ĐƯỜNG MÍA):
   • Hoà tan Cu(OH)₂ ở t° thường: 2 saccharose : 1 Cu(OH)₂ (dung dịch xanh lam).
   • Tráng bạc trực tiếp: KHÔNG tráng bạc (không có nhóm hemiacetal / aldehyde tự do).
   • Thuỷ phân trong môi trường acid (H⁺, t°) hoặc enzyme sucrase:
     C₁₂H₂₂O₁₁ + H₂O → C₆H₁₂O₆ (glucose) + C₆H₁₂O₆ (fructose)
     Tỉ lệ mol: 1 saccharose + 1 H₂O → 1 glucose + 1 fructose
     Tỉ lệ khối lượng: 342 gam saccharose + 18 gam H₂O → 180 gam glucose + 180 gam fructose
   • Tráng bạc sản phẩm thuỷ phân (sau khi trung hoà acid):
     1 saccharose → (1 glucose + 1 fructose) → 4 Ag↓
     Tỉ lệ vàng kinh điển: 1 mol saccharose → 4 mol Ag↓  (342 gam saccharose → 432 gam Ag)
     (Nếu hiệu suất thuỷ phân là H%: n(Ag) = 4 · n(saccharose) · H%)

4. MALTOSE (C₁₂H₂₂O₁₁, M = 342 – ĐƯỜNG MẠCH NHA):
   • Tráng bạc trực tiếp: 1 maltose → 2 Ag↓ (do còn 1 nhóm -OH hemiacetal mở vòng).
   • Thuỷ phân trong acid: 1 maltose + 1 H₂O → 2 glucose.
   • Tráng bạc sản phẩm thuỷ phân: 1 maltose → 2 glucose → 4 Ag↓.

5. TINH BỘT ((C₆H₁₀O₅)n, M mắt xích = 162):
   • Nhận biết bằng hồ tinh bột + dung dịch I₂ → Hợp chất bọc màu xanh tím (đun nóng mất màu, để nguội hiện lại).
   • Thuỷ phân hoàn toàn:
     (C₆H₁₀O₅)n + n H₂O → n C₆H₁₂O₆ (glucose)
     Tỉ lệ: 1 mol mắt xích (162 gam) + 1 mol H₂O (18 gam) → 1 mol glucose (180 gam)
   • Sản xuất cồn công nghiệp từ tinh bột qua lên men:
     (C₆H₁₀O₅)n → n C₆H₁₂O₆ → 2n C₂H₅OH + 2n CO₂
     Tỉ lệ then chốt: 162 gam tinh bột → 92 gam alcohol (2 × 46) + 88 gam CO₂ (2 × 44)
   • Phản ứng quang hợp của cây xanh tạo tinh bột:
     6n CO₂ + 5n H₂O → (C₆H₁₀O₅)n + 6n O₂  (ánh sáng, diệp lục)
     Tỉ lệ: 6 mol CO₂ : 5 mol H₂O → 1 mol mắt xích tinh bột : 6 mol O₂

6. CELLULOSE ([C₆H₇O₂(OH)₃]n, M mắt xích = 162):
   • Thuỷ phân hoàn toàn: [C₆H₇O₂(OH)₃]n + n H₂O → n C₆H₁₂O₆ (162 g → 180 g).
   • Điều chế thuốc súng không khói (Cellulose trinitrate):
     [C₆H₇O₂(OH)₃]n + 3n HNO₃ → [C₆H₇O₂(ONO₂)₃]n + 3n H₂O  (H₂SO₄ đặc, t°)
     Tỉ lệ mol: 1 mắt xích cellulose : 3 HNO₃ : 1 mắt xích trinitrate : 3 H₂O
     Tỉ lệ khối lượng: 162 g cellulose + 189 g HNO₃ (3 × 63) → 297 g cellulose trinitrate + 54 g H₂O (3 × 18)
   • Phản ứng điều chế Tơ Acetate (Cellulose triacetate):
     [C₆H₇O₂(OH)₃]n + 3n (CH₃CO)₂O → [C₆H₇O₂(OCOCH₃)₃]n + 3n CH₃COOH
     Tỉ lệ: 1 mắt xích cellulose (162 g) + 3 anhydride acetic (306 g) → 1 triacetate (288 g) + 3 acetic acid (180 g)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 PHẦN III: HỢP CHẤT CHỨA NITROGEN (AMINE – AMINO ACID – PEPTIDE – PROTEIN)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. AMINE:
   • Amine đơn chức tác dụng acid vô cơ đơn chức (HCl, HNO₃):
     R-NH₂ + HCl → R-NH₃Cl
     Tỉ lệ: n(amine) = n(HCl) = n(muối) = n(N)
     Tăng giảm khối lượng: Δm(muối tăng) = m(muối) - m(amine) = 36,5 · n(HCl)
     ⇒ n(amine) = [m(muối) - m(amine)] / 36,5
   • Amine đơn chức tác dụng H₂SO₄ loãng:
     2 R-NH₂ + H₂SO₄ → (R-NH₃)₂SO₄
     Tỉ lệ: n(amine) : n(H₂SO₄) = 2 : 1
   • Amine đa chức (x chức):
     R(NH₂)x + x HCl → R(NH₃Cl)x  ⇒  n(HCl) = x · n(amine) = n(N)
   • Aniline (C₆H₅NH₂, M = 93) tác dụng với nước Bromine:
     C₆H₅NH₂ + 3 Br₂ → C₆H₂Br₃NH₂↓ (2,4,6-tribromoaniline kết tủa trắng, M = 330) + 3 HBr
     Tỉ lệ mol: 1 aniline : 3 Br₂ : 1 kết tủa trắng : 3 HBr
     Tỉ lệ khối lượng: 93 gam aniline + 480 gam Br₂ (3 × 160) → 330 gam kết tủa + 243 gam HBr (3 × 81)
   • Amine bậc 1 tác dụng Nitrous acid (HNO₂ / NaNO₂ + HCl):
     R-NH₂ + HNO₂ → R-OH + N₂↑ + H₂O  ⇒  n(N₂) = n(amine)
     Aniline (0–5°C): C₆H₅NH₂ + HNO₂ + HCl → [C₆H₅N₂]⁺Cl⁻ (muối diazonium) + 2 H₂O
   • Đốt cháy amine no, đơn chức, mạch hở (CnH₂n₊₃N):
     CnH₂n₊₃N + (6n + 3)/4 O₂ → n CO₂ + (2n + 3)/2 H₂O + 1/2 N₂
     Hệ thức then chốt: n(H₂O) - n(CO₂) = 1,5 · n(amine)  ⇒  n(amine) = [n(H₂O) - n(CO₂)] / 1,5

2. AMINO ACID ((H₂N)x-R-(COOH)y):
   • Tác dụng với base mạnh (NaOH, KOH):
     (H₂N)x-R-(COOH)y + y NaOH → (H₂N)x-R-(COONa)y + y H₂O
     Tỉ lệ then chốt: n(NaOH) = n(-COOH) = n(H₂O) = y · n(amino acid)
     Bảo toàn khối lượng: m(amino acid) + m(NaOH) = m(muối) + m(H₂O)
     Tăng giảm khối lượng: Δm(muối tăng) = (23 - 1) · n(NaOH) = 22 · y · n(amino acid)
   • Tác dụng với acid mạnh (HCl):
     (H₂N)x-R-(COOH)y + x HCl → (ClH₃N)x-R-(COOH)y
     Tỉ lệ then chốt: n(HCl) = n(-NH₂) = x · n(amino acid)
     Tăng giảm khối lượng: Δm(muối tăng) = m(HCl) = 36,5 · x · n(amino acid)
   • Tỉ lệ mol của 5 Amino acid tiêu chuẩn cần thuộc lòng:
     ① Glycine (Gly, M = 75, H₂N-CH₂-COOH): 1 -NH₂, 1 -COOH. Tỉ lệ NaOH = 1 : 1; Tỉ lệ HCl = 1 : 1 (quỳ tím không đổi màu).
     ② Alanine (Ala, M = 89, CH₃-CH(NH₂)-COOH): 1 -NH₂, 1 -COOH. Tỉ lệ NaOH = 1 : 1; Tỉ lệ HCl = 1 : 1 (quỳ tím không đổi màu).
     ③ Valine (Val, M = 117, (CH₃)₂CH-CH(NH₂)-COOH): 1 -NH₂, 1 -COOH. Tỉ lệ NaOH = 1 : 1; Tỉ lệ HCl = 1 : 1 (quỳ tím không đổi màu).
     ④ Glutamic acid (Glu, M = 147, HOOC-(CH₂)₂-CH(NH₂)-COOH): 1 -NH₂, 2 -COOH. Tỉ lệ NaOH = 1 : 2; Tỉ lệ HCl = 1 : 1 (quỳ tím chuyển đỏ/hồng).
     ⑤ Lysine (Lys, M = 146, H₂N-(CH₂)₄-CH(NH₂)-COOH): 2 -NH₂, 1 -COOH. Tỉ lệ NaOH = 1 : 1; Tỉ lệ HCl = 1 : 2 (quỳ tím chuyển xanh).
   • Phương pháp quy đổi phản ứng nối tiếp (X + HCl rồi + NaOH, hoặc X + NaOH rồi + HCl):
     Coi như hỗn hợp {amino acid, HCl} cùng phản ứng đồng thời với NaOH:
       n(NaOH) = n(-COOH) + n(HCl)
     Coi như hỗn hợp {amino acid, NaOH} cùng phản ứng đồng thời với HCl:
       n(HCl) = n(-NH₂) + n(NaOH)

3. PEPTIDE & PROTEIN:
   • Tạo chuỗi n-peptide từ các α-amino acid no (1 -NH₂, 1 -COOH):
     n Amino acid → 1 n-peptide + (n - 1) H₂O
     Số liên kết peptide: n - 1
     Khối lượng mol peptide: M(peptide) = ∑ M(gốc amino acid) - 18 · (n - 1)
   • Thuỷ phân hoàn toàn trong môi trường Acid (HCl):
     1 n-peptide + (n - 1) H₂O + n HCl → n muối clorua
     Tỉ lệ then chốt:
       n(H₂O) = (n - 1) · n(peptide)
       n(HCl) = n · n(peptide)
       m(muối) = m(peptide) + 18 · (n - 1) · n(peptide) + 36,5 · n · n(peptide)
   • Thuỷ phân hoàn toàn trong môi trường Kiềm (NaOH) – QUY TẮC VÀNG ĐỀ THI:
     1 n-peptide + n NaOH → n muối natri + 1 H₂O
     LƯU Ý CỐT LÕI: Phản ứng chỉ sinh ra DUY NHẤT 1 mol H₂O từ đầu C tự do (-COOH)!
     Tỉ lệ then chốt:
       n(NaOH) = n · n(peptide)
       n(H₂O) = n(peptide)  (chỉ bằng đúng số mol peptide!)
       m(muối) = m(peptide) + 40 · n · n(peptide) - 18 · n(peptide) = m(peptide) + (40n - 18) · n(peptide)
     (Nếu trong chuỗi có gốc Glu: mỗi gốc Glu ăn thêm 1 NaOH và sinh thêm 1 H₂O).
   • Phản ứng màu Biuret:
     Điều kiện: Phải từ Tripeptide trở lên (n ≥ 3, có ít nhất 2 liên kết peptide) hoặc Protein.
     Dipeptide TUYỆT ĐỐI KHÔNG CÓ phản ứng Biuret!
     Tỉ lệ tạo phức với Cu(OH)₂ trong kiềm: 1 chuỗi peptide : 1 Cu(OH)₂ (dung dịch phức màu tím đặc trưng).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 PHẦN IV: POLYMER & VẬT LIỆU POLYMER LỚP 12
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. TƠ NILON-6 (Polycaproamide):
   • Phương pháp trùng ngưng từ ε-aminocaproic acid:
     n H₂N-(CH₂)₅-COOH → -[HN-(CH₂)₅-CO]n- + n H₂O
     Tỉ lệ: 1 mol acid (131 g) → 1 mol mắt xích (113 g) + 1 mol H₂O (18 g)
   • Phương pháp trùng hợp mở vòng Caprolactam:
     n C₆H₁₁NO → -[HN-(CH₂)₅-CO]n-
     Tỉ lệ: 1 mol monomer (113 g) → 1 mol mắt xích (113 g)  (KHÔNG sinh H₂O!)

2. TƠ NILON-6,6 (Poly(hexamethylene adipamide)):
   n H₂N-(CH₂)₆-NH₂ + n HOOC-(CH₂)₄-COOH → -[HN-(CH₂)₆-NH-CO-(CH₂)₄-CO]n- + 2n H₂O
   Tỉ lệ: 1 diamine (116 g) : 1 diacid (146 g) → 1 mắt xích Nilon-6,6 (226 g) : 2 H₂O (36 g)

3. TƠ LAPSAN / POLYESTER (Poly(ethylene terephthalate) – PET):
   n p-HOOC-C₆H₄-COOH + n HO-CH₂-CH₂-OH → -[CO-C₆H₄-COO-CH₂-CH₂-O]n- + 2n H₂O
   Tỉ lệ: 1 terephthalic acid (166 g) : 1 ethylene glycol (62 g) → 1 mắt xích lapsan (192 g) : 2 H₂O (36 g)

4. POLY(METHYL METHACRYLATE) (Plexiglas / Thuỷ tinh hữu cơ):
   n CH₂=C(CH₃)-COOCH₃ → -[CH₂-C(CH₃)(COOCH₃)]n-
   Tỉ lệ: 1 monomer (100 g/mol) → 1 mắt xích polymer (100 g/mol)

5. CAO SU BUNA, BUNA-S, BUNA-N:
   • Cao su Buna: n CH₂=CH-CH=CH₂ → -[CH₂-CH=CH-CH₂]n- (Tỉ lệ 1 : 1, M mắt xích = 54)
   • Cao su Buna-S: n buta-1,3-diene + m styrene → -[C₄H₆]n-[C₈H₈]m- (Tỉ lệ mol mắt xích n : m)
   • Cao su Buna-N: n buta-1,3-diene + m acrylonitrile → -[C₄H₆]n-[C₃H₃N]m- (Tỉ lệ mol mắt xích n : m)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 PHẦN V: CÁC QUAN HỆ MOL & CÔNG THỨC GIẢI NHANH ĐỊNH LƯỢNG KINH ĐIỂN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. CÔNG THỨC ĐỘ BẤT BÃO HOÀ k (Liên kết π + Vòng) KHI ĐỐT CHÁY HỢP CHẤT HỮU CƠ:
   n(chất hữu cơ) = [n(CO₂) - n(H₂O)] / (k - 1)  (với k ≠ 1)
   n(H₂ hoặc Br₂ phản ứng cộng) = (k - π_chức) · n(chất hữu cơ)

2. BẢO TOÀN NGUYÊN TỐ OXI KHI ĐỐT CHÁY:
   x · n(hợp chất CxHyOz) + 2 · n(O₂) = 2 · n(CO₂) + n(H₂O)

3. BÀI TOÁN DẪN KHÍ CO₂ VÀO DUNG DỊCH NƯỚC VÔI TRONG Ca(OH)₂ / Ba(OH)₂:
   • Nếu kiềm dư: n(CO₂) = n(kết tủa) = n(CaCO₃↓)
   • Nếu kiềm không dư (tạo 2 muối): n(CO₂) = n(OH⁻) - n(kết tủa)
   • Khối lượng bình tăng: m(bình tăng) = m(CO₂) + m(H₂O)
   • Độ biến thiên khối lượng dung dịch:
     Δm(dung dịch) = [m(CO₂) + m(H₂O)] - m(kết tủa)
     (Nếu Δm > 0: dung dịch tăng; Nếu Δm < 0: dung dịch giảm).
═════════════════════════════════════════════════════════════════════"""

print("Generated note body length:", len(note_body))
print("Sample lines:")
for l in note_body.split("\n")[:25]:
    print(l)
