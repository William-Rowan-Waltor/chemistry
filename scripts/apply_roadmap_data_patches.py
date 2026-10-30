import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
DATA_JS = ROOT / "js" / "data.js"
text = DATA_JS.read_text(encoding="utf-8")
m = re.search(r"var DATA\s*=\s*(?:window\.DATA\s*=\s*)*(\{.*?\});?\s*$", text, re.DOTALL)
data = json.loads(m.group(1))

print("=== 1. Patching g12t1#3 and g12t2#3 ===")
for t in data["tests"]:
    if t["id"] == "g12t1":
        # Q3 is index 2
        q = t["qs"][2]
        print("Found g12t1 Q3:", q["q"][:60])
        q["o"] = "A=(1) < (2) < (3) < (4);B=(3) < (1) < (2) < (4);C=(2) < (4) < (1) < (3);D=(2) < (1) < (3) < (4)"
        q["e"] = "Độ tan giảm khi phân tử khối M tăng (gốc hydrocarbon kị nước càng lớn); M(2) = 116 > M(4) = 102 > M(1) = 88 > M(3) = 74 nên thứ tự tăng dần độ tan trong nước là (2) < (4) < (1) < (3)."
    elif t["id"] == "g12t2":
        # Q3 is index 2
        q = t["qs"][2]
        print("Found g12t2 Q3:", q["q"][:60])
        q["o"] = "A=(1) < (2) < (3);B=(3) < (1) < (2);C=(2) < (3) < (1);D=(2) < (1) < (3)"
        q["e"] = "Ester không có liên kết hydrogen liên phân tử nên sôi thấp nhất; liên kết hydrogen của carboxylic acid bền hơn alcohol nên thứ tự tăng dần nhiệt độ sôi là: ester (3) < alcohol (1) < acid (2)."

print("\n=== 2. Patching g12t20 Q3 and typo Glutacid ===")
for t in data["tests"]:
    if t["id"] == "g12t20":
        # Q3 is index 2
        q3 = t["qs"][2]
        print("g12t20 Q3 options:", q3["o"])
        print("g12t20 Q3 old e:", q3["e"][:100])
        q3["e"] = "X là cellulose (chiếm ~98% bông nõn), Y là glucose.\n- B đúng: Cellulose tan tốt trong nước Schweizer (dung dịch [Cu(NH3)4](OH)2).\n- A sai: Tinh bột mới có cấu tạo xoắn và phản ứng màu với iodine; cellulose có cấu trúc mạch kéo dài dạng sợi không phân nhánh.\n- C sai: Cellulose là polymer (C6H10O5)n có phân tử khối rất lớn (162n), không phải 162.\n- D sai: Cellulose không tham gia phản ứng tráng bạc (chỉ Y là glucose tráng bạc)."

        # Q20 is index 19
        q20 = t["qs"][19]
        if "glutacid" in q20["q"].lower():
            print("Fixing Glutacid typo in g12t20 Q20...")
            q20["q"] = q20["q"].replace("Glutacid acid", "Glutamic acid")
            print("Fixed q20:", q20["q"][:80])

# Check g12t19 Q20 as well just in case
for t in data["tests"]:
    if t["id"] == "g12t19":
        for q in t["qs"]:
            if "glutacid" in q.get("q", "").lower():
                q["q"] = q["q"].replace("Glutacid acid", "Glutamic acid")
                print("Fixed in g12t19 as well.")

print("\n=== 3. Adding ch attribute to all questions in g12t19 and g12t20 ===")
ch_map_101 = [
    # Part I (MCQ 1-18)
    "g12c2", # Q1: Glucose tráng bạc
    "g12c3", # Q2: Polycaproamide
    "g12c2", # Q3: Thuỷ phân acid các carbohydrate
    "g12c1", # Q4: Ester formic + ethanol
    "g12c1", # Q5: Hydrogen hoá chất béo
    "g12c2", # Q6: Maltose
    "g12c3", # Q7: Glycine
    "g12c3", # Q8: Chuỗi polypeptide
    "g12c3", # Q9: Ethylamine + FeCl3
    "g12c3", # Q10: Biuret
    "g12c2", # Q11: Carbohydrate C, H, O
    "g12c3", # Q12: Phân tích nguyên tố C4H9O2N
    "g12c3", # Q13: Amphetamine
    "g12c3", # Q14: Tính chất amino acid
    "g12c3", # Q15: Amine tan trong nước
    "g12c3", # Q16: Dipeptide Gly-Ala
    "g12c3", # Q17: Pentapeptide
    "g12c2", # Q18: Bông nõn cellulose
    # Part II (TF Clusters 19-22)
    "g12c1", # Q19: Điều chế ethyl acetate
    "g12c1", # Q20: Chất béo no / mỡ lợn
    "g12c2", # Q21: Carbohydrate glucose/tinh bột
    "g12c3", # Q22: Aniline / amine
    # Part III (Short Answer 23-28)
    "g12c3", # Q23: Quỳ tím hoá xanh
    "g12c2", # Q24: Mất màu nước bromine
    "g12c1", # Q25: Khối lượng mỡ lợn
    "g12c2", # Q26: Thuỷ phân saccharose tráng bạc
    "g12c2", # Q27: Giấm lên men từ bột sắn
    "g12c3"  # Q28: Đồng phân amino acid C4H9O2N
]

for t in data["tests"]:
    if t["id"] == "g12t19":
        t["ch"] = "g12c1"
        for idx, q in enumerate(t["qs"]):
            q["ch"] = ch_map_101[idx]
        print(f"Tagged 28 questions in g12t19 with explicit ch")

# g12t20 (Mã 102) mapping
# 102 Part I: Q1=101#12(c3), Q2=8(c3), Q3=18(c2), Q4=3(c2), Q5=15(c3), Q6=16(c3), Q7=7(c3), Q8=5(c1), Q9=9(c3), Q10=11(c2), Q11=2(c3), Q12=4(c1), Q13=14(c3), Q14=6(c2), Q15=1(c2), Q16=10(c3), Q17=13(c3), Q18=17(c3)
# 102 Part II: Q19=101#20(c1), Q20=101#22(c3), Q21=101#19(c1), Q22=101#21(c2)
# 102 Part III: Q23=101#27(c2), Q24=101#25(c1), Q25=101#28(c3), Q26=101#26(c2), Q27=101#24(c2), Q28=101#23(c3)
ch_map_102 = [
    "g12c3", "g12c3", "g12c2", "g12c2", "g12c3", "g12c3", "g12c3", "g12c1", "g12c3", "g12c2", "g12c3", "g12c1", "g12c3", "g12c2", "g12c2", "g12c3", "g12c3", "g12c3",
    "g12c1", "g12c3", "g12c1", "g12c2",
    "g12c2", "g12c1", "g12c3", "g12c2", "g12c2", "g12c3"
]

for t in data["tests"]:
    if t["id"] == "g12t20":
        t["ch"] = "g12c1"
        for idx, q in enumerate(t["qs"]):
            q["ch"] = ch_map_102[idx]
        print(f"Tagged 28 questions in g12t20 with explicit ch")

print("\n=== 4. Expanding g12c3 to cover Amino Acid, Peptide, Protein ===")
g12c3 = data.get("g12c3", {})
g12c3["title"] = "Chương 3 · Hợp chất chứa Nitrogen (Amine – Amino acid – Peptide – Protein)"
g12c3["feynman"] = "Hợp chất hữu cơ chứa nitrogen là nền tảng của sự sống. Amine giống như ammonia có tính base và mùi tanh khai. Khi nhóm amino (-NH₂) kết hợp cùng nhóm carboxyl (-COOH) trên cùng một phân tử, ta có Amino acid — những 'viên gạch' lưỡng tính thần kì. Các amino acid nối lại với nhau qua liên kết peptide (-CO-NH-) tạo thành chuỗi Peptide và Protein cấu tạo nên cơ bắp, kháng thể và enzyme xúc tác mọi phản ứng sinh học trong tế bào."

existing_notes = g12c3.get("notes", [])
if len(existing_notes) == 8:
    new_notes = [
        {
            "t": "9. Khái niệm, Cấu tạo & Danh pháp Amino acid",
            "b": "• Khái niệm: Amino acid là hợp chất hữu cơ tạp chức, phân tử chứa đồng thời nhóm amino (-NH₂) và nhóm carboxyl (-COOH).\n• Cấu tạo ion lưỡng cực: Trong dung dịch và tinh thể, nhóm -COOH chuyển proton H⁺ sang nhóm -NH₂ tạo ion lưỡng cực: H₃N⁺-CH(R)-COO⁻. Vì vậy amino acid ở điều kiện thường là chất rắn kết tinh, không màu, nhiệt độ nóng chảy cao và tan tốt trong nước.\n• Danh pháp thay thế: Tên acid tương ứng + tiền tố amino có chỉ số vị trí C (đánh số 1 từ nhóm -COOH). Ví dụ: CH₃-CH(NH₂)-COOH là 2-aminopropanoic acid.\n• Tên bán hệ thống: Dùng chữ cái Hy Lạp (α, β, γ...) chỉ vị trí nhóm -NH₂ so với -COOH. Ví dụ: α-aminopropionic acid (alanine).",
            "kind": "rule"
        },
        {
            "t": "10. Tính chất axit – bazơ & Tính lưỡng tính của Amino acid",
            "b": "• Tính chất lưỡng tính: Phân tử chứa nhóm -COOH (tính acid) và nhóm -NH₂ (tính base) nên tác dụng được với cả acid mạnh và base mạnh:\n  + Tác dụng acid: H₂N-CH₂-COOH + HCl → ClH₃N-CH₂-COOH\n  + Tác dụng base: H₂N-CH₂-COOH + NaOH → H₂N-CH₂-COONa + H₂O\n• Tác dụng lên giấy quỳ tím:\n  + Số nhóm -NH₂ = Số nhóm -COOH (như Gly, Ala, Val): pH ≈ 6, không đổi màu quỳ tím.\n  + Số nhóm -NH₂ > Số nhóm -COOH (như Lysine: 2 nhóm -NH₂, 1 nhóm -COOH): pH ≈ 9,7, làm quỳ tím chuyển xanh.\n  + Số nhóm -NH₂ < Số nhóm -COOH (như Glutamic acid: 1 nhóm -NH₂, 2 nhóm -COOH): pH ≈ 3,2, làm quỳ tím chuyển đỏ hồng.\n• Phản ứng ester hoá: H₂N-CH₂-COOH + C₂H₅OH <=(HCl khí, t°)=> ClH₃N-CH₂-COOC₂H₅ + H₂O.",
            "kind": "rule"
        },
        {
            "t": "11. 5 Amino acid tiêu biểu cấu thành sự sống",
            "b": "Tên gọi | Kí hiệu | Công thức cấu tạo | M (g/mol) | Quỳ tím\nGlycine | Gly | H₂N-CH₂-COOH | 75 | Không đổi màu\nAlanine | Ala | CH₃-CH(NH₂)-COOH | 89 | Không đổi màu\nValine | Val | (CH₃)₂CH-CH(NH₂)-COOH | 117 | Không đổi màu\nGlutamic acid | Glu | HOOC-[CH₂]₂-CH(NH₂)-COOH | 147 | Quỳ hoá đỏ hồng\nLysine | Lys | H₂N-[CH₂]₄-CH(NH₂)-COOH | 146 | Quỳ hoá xanh",
            "kind": "table"
        },
        {
            "t": "12. Khái niệm & Cấu trúc Peptide",
            "b": "• Liên kết peptide: Là liên kết amide (-CO-NH-) giữa nhóm α-amino của đơn vị amino acid này với nhóm α-carboxyl của đơn vị amino acid khác.\n• Định nghĩa peptide: Chuỗi gồm từ 2 đến 50 gốc α-amino acid liên kết qua liên kết peptide. Phân loại:\n  + Oligopeptide: gồm 2 đến 10 gốc (dipeptide có 1 liên kết peptide; tripeptide có 2 liên kết; tetrapeptide có 3 liên kết).\n  + Polypeptide: gồm 11 đến 50 gốc.\n• Quy ước đầu chuỗi: Đầu N (chứa nhóm -NH₂ tự do) viết bên trái, đầu C (chứa nhóm -COOH tự do) viết bên phải. Ví dụ: H₂N-CH₂-CO-NH-CH(CH₃)-COOH là Gly-Ala (khác với Ala-Gly).",
            "kind": "rule"
        },
        {
            "t": "13. Phản ứng thuỷ phân Peptide & Phương pháp ghép chuỗi",
            "b": "• Thuỷ phân hoàn toàn: Dưới tác dụng của acid, base hoặc enzyme, peptide thuỷ phân hoàn toàn thành các α-amino acid:\n  Peptide n gốc + (n - 1) H₂O -(H⁺, t°)-> n α-amino acid\n• Thuỷ phân dở dang: Thu được hỗn hợp các peptide ngắn hơn và amino acid. Phương pháp giải bài toán xác định thứ tự chuỗi peptide:\n  Ví dụ: Thuỷ phân chuỗi X thu được Gly-Ala, Ala-Val, Val-Gly. Ghép nối các mảnh chồng lấn: Gly-Ala + Ala-Val → Gly-Ala-Val; nối tiếp Val-Gly → Gly-Ala-Val-Gly.",
            "kind": "rule"
        },
        {
            "t": "14. Phản ứng màu Biuret đặc trưng",
            "b": "• Hiện tượng: Trong môi trường kiềm, các peptide có từ 2 liên kết peptide trở lên (tức từ tripeptide trở lên) và protein tác dụng với Cu(OH)₂ tạo phức chất màu tím đặc trưng.\n• Lưu ý cốt tử:\n  + Dipeptide CHỈ CÓ 1 liên kết peptide nên KHÔNG có phản ứng màu biuret!\n  + Dùng phản ứng biuret để phân biệt dipeptide với tripeptide và protein.",
            "kind": "rule"
        },
        {
            "t": "15. Cấu trúc & Tính chất của Protein",
            "b": "• Khái niệm: Protein là những polypeptide cao phân tử có phân tử khối từ vài vạn đến vài triệu đvC (gồm hơn 50 gốc α-amino acid).\n• Cấu trúc: Có 4 bậc cấu trúc (Bậc 1: trật tự chuỗi polypeptide; Bậc 2: xoắn α hoặc gấp nếp β; Bậc 3: cấu trúc không gian 3 chiều cuộn lại; Bậc 4: tổ hợp của nhiều chuỗi polypeptide).\n• Sự đông tụ protein: Dưới tác dụng của nhiệt độ, acid, base hoặc ion kim loại nặng, cấu trúc không gian của protein bị phá vỡ khiến protein kết tụ lại và tách ra khỏi dung dịch (Ví dụ: nấu canh cua nổi gạch, luộc trứng chín, vắt chanh vào sữa đậu nành).",
            "kind": "rule"
        },
        {
            "t": "16. Enzyme & Tơ Polyamide tổng hợp",
            "b": "• Enzyme: Hầu hết enzyme là protein có tính xúc tác sinh học cực kì cao và có tính chọn lọc rất nghiêm ngặt (mỗi enzyme chỉ xúc tác cho 1 hoặc một số phản ứng nhất định ở điều kiện êm dịu 37°C, pH trung tính).\n• Polyamide liên quan: Phản ứng trùng ngưng 6-aminohexanoic acid (ε-aminocaproic acid) tạo Polycaproamide (Tơ nilon-6):\n  n H₂N-[CH₂]₅-COOH -(t°, xt)-> -[HN-[CH₂]₅-CO]-ₙ + n H₂O\n  Phản ứng trùng ngưng hexamethylenediamine và adipic acid tạo Tơ nilon-6,6.",
            "kind": "rule"
        }
    ]
    g12c3["notes"].extend(new_notes)
    print(f"Expanded g12c3: now has {len(g12c3['notes'])} notes!")

print("\n=== 5. Adding explicit 'u' units to calculation questions ===")
unit_patches = {
    # (test_id, question_index_0_based): unit
    ("g12t1", 36): "g",      # Q37: Ester X C9H10O2 M=116 g/mol
    ("g12t2", 37): "g/mol",  # Q38: M = 860 g/mol
    ("g12t3", 39): "gam",    # Q40: 100 gam
    ("g12t5", 36): "mol",    # Q37: 0.1 mol
    ("g12t5", 38): "gam",    # Q39: 1.62 gam
    ("g12t5", 39): "kg",     # Q40: 3.6 kg
    ("g12t11", 37): "mol",   # Q38: 1 mol
    ("g12t11", 38): "%",     # Q39: 60%
    ("g12t11", 39): "L",     # Q40: 426 L
    ("g12t12", 38): "%",     # H%
    ("g12t12", 39): "gam",   # m gam
    ("g12t13", 38): "kg",
    ("g12t13", 39): "tấn",
    ("g12t14", 37): "mol",
    ("g12t14", 38): "%",
    ("g12t14", 39): "gam",
    ("g12t16", 24): "kg",
    ("g12t16", 25): "gam",
    ("g12t16", 26): "%",
    ("g12t17", 24): "kg",
    ("g12t17", 25): "gam",
    ("g12t17", 26): "%",
    ("g12t18", 24): "kg",
    ("g12t18", 25): "gam",
    ("g12t18", 26): "%"
}

for (tid, qidx), unit_val in unit_patches.items():
    for t in data["tests"]:
        if t["id"] == tid and qidx < len(t["qs"]):
            t["qs"][qidx]["u"] = unit_val

print(f"Patched {len(unit_patches)} quantitative questions with explicit unit 'u'")

# Save data.js
formatted_json = json.dumps(data, ensure_ascii=False, indent=2)
DATA_JS.write_text(f"var DATA = window.DATA = {formatted_json};\n", encoding="utf-8")
print(f"Successfully saved updated {DATA_JS}")
