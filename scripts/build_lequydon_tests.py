#!/usr/bin/env python3
"""Build and append 2 new official tests (g12t19 & g12t20 - THPT Chuyên Lê Quý Đôn 2024-2025) to js/data.js."""

import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
DATA_JS = ROOT / "js" / "data.js"

sys.path.insert(0, str(ROOT / "scripts"))
from verify_chemistry_data import load_data

data = load_data()
tests = data.get("tests", [])

# Ensure g12t19 and g12t20 do not already exist
tests = [t for t in tests if t["id"] not in ("g12t19", "g12t20")]

# Shared explanations pool
EXP = {
    "glucose_ag": "Phương trình phản ứng: CH2OH[CHOH]4CHO + 2[Ag(NH3)2]OH -(t°)-> CH2OH[CHOH]4COONH4 + 2Ag↓ + 3NH3 + H2O. Do phản ứng diễn ra trong môi trường NH3 dư nên nhóm carboxyl -COOH tạo thành sẽ tác dụng ngay với NH3 để tạo muối ammonium gluconate (CH2OH[CHOH]4COONH4).",
    "polycaproamide": "Phản ứng tổng hợp polycaproamide (nylon-6) từ 6-aminohexanoic acid (ε-aminocaproic acid) là phản ứng trùng ngưng vì các monomer kết hợp với nhau đồng thời giải phóng các phân tử nhỏ (H2O).",
    "thuy_phan_acid": "Cả 4 chất đều bị thuỷ phân trong môi trường acid:\n- Triolein (chất béo/ester) thuỷ phân tạo glycerol và oleic acid.\n- Cellulose (polysaccharide) thuỷ phân tạo glucose.\n- Saccharose (disaccharide) thuỷ phân tạo glucose và fructose.\n- Tinh bột (polysaccharide) thuỷ phân tạo glucose.",
    "formic_ethyl": "Phản ứng ester hoá giữa formic acid (HCOOH) và ethyl alcohol (C2H5OH): HCOOH + C2H5OH <=(H2SO4 đặc, t°)=> HCOOC2H5 + H2O. Ester thu được là ethyl formate (HCOOC2H5).",
    "hydrogen_hoa": "Chất béo lỏng chứa các gốc acid béo không no (như triolein), khi cho tác dụng với hydrogen (xúc tác Ni, đun nóng) sẽ xảy ra phản ứng cộng H2 vào các nối đôi C=C (hydrogen hoá) tạo thành chất béo no ở thể rắn (như tristearin) thuận tiện cho việc vận chuyển và sản xuất bơ nhân tạo.",
    "maltose": "Maltose (còn gọi là đường mạch nha) là một disaccharide được tạo nên từ 2 gốc α-glucose liên kết với nhau qua liên kết α-1,4-glycoside, có nhiều trong mầm lúa mạch, kẹo mạch nha.",
    "glycine": "Amino acid là hợp chất hữu cơ tạp chức phân tử chứa đồng thời nhóm amino (-NH2) và nhóm carboxyl (-COOH). Chất thoả mãn là H2NCH2COOH (glycine).",
    "polypeptide_def": "Theo định nghĩa SGK Hoá học 12: Chuỗi polypeptide gồm các đơn vị α-amino acid liên kết với nhau qua liên kết peptide (-CO-NH-) theo một trật tự xác định.",
    "ethylamine_fecl3": "Ethylamine tan trong nước tạo môi trường base yếu: C2H5NH2 + H2O <=> C2H5NH3+ + OH-. Khi cho vào dung dịch FeCl3: Fe3+ + 3OH- -> Fe(OH)3↓ (kết tủa nâu đỏ). Vì amine không có khả năng tạo phức tan với Fe(OH)3 nên kết tủa nâu đỏ không tan khi amine dư.",
    "biuret": "Trong môi trường kiềm (base), các peptide có từ 2 liên kết peptide trở lên và protein phản ứng với Cu(OH)2 tạo phức chất màu tím đặc trưng gọi là phản ứng màu biuret.",
    "carb_elements": "Carbohydrate là hợp chất hữu cơ tạp chức có công thức chung Cn(H2O)m, thành phần chỉ gồm 3 nguyên tố: Carbon (C), Hydrogen (H) và Oxygen (O).",
    "x_c4h9o2n": "1. Xác định CTPT của X: M = 103.\nSố C = 103 * 46,60% / 12 = 4.\nSố H = 103 * 8,74% / 1 = 9.\nSố N = 103 * 13,59% / 14 = 1.\n%O = 100% - (46,6% + 8,74% + 13,59%) = 31,07% => Số O = 103 * 31,07% / 16 = 2.\n=> CTPT của X là C4H9O2N (A đúng).\n2. Z có CTPT CH4O => Z là CH3OH. Thuỷ phân X tạo α-amino acid Y và CH3OH => X là H2N-CH(CH3)-COOCH3 (methyl alaninate) (B đúng, C đúng).\n3. Y là CH3-CH(NH2)-COOH (alanine). Tên thay thế theo danh pháp IUPAC là 2-aminopropanoic acid (gốc no -an-). Tên 2-aminopropionic acid là tên bán hệ thống, do đó D không đúng.",
    "amphetamine": "Phân tử amphetamine gồm:\n- Vòng benzene (gốc phenyl C6H5-): 6 nguyên tử C, 5 nguyên tử H.\n- Mạch nhánh -CH2-CH(NH2)-CH3: 3 nguyên tử C, 8 nguyên tử H, 1 nguyên tử N.\nTổng số C: 6 + 3 = 9.\nTổng số H: 5 + 8 = 13.\nTổng số N: 1.\n=> Công thức phân tử là C9H13N.",
    "amino_acid_prop": "Các amino acid ở điều kiện thường là chất rắn kết tinh, không màu, có nhiệt độ nóng chảy cao, dễ tan trong nước vì tồn tại ở dạng ion lưỡng cực (H3N+-CHR-COO-). Các amino acid thiên nhiên cấu thành cơ thể sống và không có độc tính cao.",
    "amine_hbond_water": "Các amine đầu dãy (methylamine, dimethylamine, trimethylamine, ethylamine) ở thể khí tan rất tốt trong nước nhờ khả năng tạo liên kết hydrogen mạnh với các phân tử nước giữa nguyên tử N (còn cặp electron tự do) và nguyên tử H của nước.",
    "dipeptide_gly_ala": "Dipeptide là hợp chất chứa 1 liên kết peptide tạo bởi 2 gốc α-amino acid:\n- A và C chứa gốc β-alanine (không phải α-amino acid).\n- D chứa 2 liên kết peptide nên là tripeptide.\n- B tạo bởi Glycine (α) và Alanine (α), chứa 1 liên kết peptide (-CO-NH-) nên là dipeptide Gly-Ala.",
    "pentapeptide_seq": "1. Pentapeptide X gồm 2 gốc Ala, 2 gốc Gly và 1 gốc Val.\n2. Phân tích các mảnh thủy phân dở dang:\n- Có tripeptide: Gly-Ala-Val\n- Có dipeptide: Ala-Gly\n- Có dipeptide: Gly-Gly\nGhép nối các đoạn: Đoạn Ala-Gly và Gly-Gly liên kết tạo chuỗi Ala-Gly-Gly. Nối chuỗi này với mảnh Gly-Ala-Val ta được: Ala-Gly-Gly-Ala-Val.\nKiểm tra lại: Chứa Ala-Gly (1-2), Gly-Gly (2-3), Gly-Ala-Val (3-4-5). Phù hợp hoàn toàn.",
    "cellulose": "X là cellulose (chiếm ~98% bông nõn), Y là glucose.\n- A đúng: Cellulose tan tốt trong nước Schweizer (dung dịch [Cu(NH3)4](OH)2).\n- B sai: Cellulose là polymer (C6H10O5)n có phân tử khối rất lớn (162n), không phải 162.\n- C sai: Tinh bột mới có cấu trúc xoắn tạo màu với iodine, cellulose có cấu trúc mạch kéo dài dạng sợi.\n- D sai: Cellulose không tham gia phản ứng tráng bạc (chỉ Y là glucose tráng bạc)."
}

# ----------------- TEST 19: MÃ ĐỀ 101 -----------------
qs_101 = [
    # Part I: 18 MCQ
    {
        "id": "g12t19_q1", "k": "m",
        "q": "Cho dung dịch glucose vào ống nghiệm chứa dung dịch AgNO3 trong NH3 dư được ngâm trong cốc nước nóng, thu được sản phẩm hữu cơ X và bạc kim loại. Tên gọi của X là",
        "o": "A=glycerol; B=fructose; C=ammonium gluconate; D=gluconic acid",
        "a": "C", "e": EXP["glucose_ag"]
    },
    {
        "id": "g12t19_q2", "k": "m", "svgKey": "polycaproamide_reaction",
        "q": "Polycaproamide được tổng hợp theo phản ứng sau: n H2N-[CH2]5-COOH -(t°)-> -[HN-[CH2]5-CO]-n + n H2O. Polycaproamide được điều chế bằng phản ứng",
        "o": "A=trùng ngưng; B=phân hủy; C=trùng hợp; D=thế",
        "a": "A", "e": EXP["polycaproamide"]
    },
    {
        "id": "g12t19_q3", "k": "m",
        "q": "Cho các chất sau: triolein, cellulose, saccharose, tinh bột. Số chất bị thuỷ phân trong môi trường acid là",
        "o": "A=4; B=2; C=1; D=3",
        "a": "A", "e": EXP["thuy_phan_acid"]
    },
    {
        "id": "g12t19_q4", "k": "m",
        "q": "Ester được tạo thành từ formic acid và ethyl alcohol có công thức cấu tạo là",
        "o": "A=CH3COOCH3; B=C2H5COOCH3; C=HCOOC2H5; D=HCOOCH3",
        "a": "C", "e": EXP["formic_ethyl"]
    },
    {
        "id": "g12t19_q5", "k": "m",
        "q": "Trong công nghiệp, để chuyển hóa chất béo lỏng thành chất béo rắn, người ta dùng phương pháp nào sau đây?",
        "o": "A=Phản ứng oxi hóa; B=Phản ứng xà phòng hóa; C=Phản ứng ester hóa; D=Phản ứng hydrogen hóa",
        "a": "D", "e": EXP["hydrogen_hoa"]
    },
    {
        "id": "g12t19_q6", "k": "m",
        "q": "X là một loại disaccharide có nhiều trong mạch nha. Chất X là",
        "o": "A=glucose; B=maltose; C=saccharose; D=fructose",
        "a": "B", "e": EXP["maltose"]
    },
    {
        "id": "g12t19_q7", "k": "m",
        "q": "Chất nào sau đây là amino acid?",
        "o": "A=HOCH2COOH; B=H2NCH2COOH; C=CH3NH2; D=CH3COOH",
        "a": "B", "e": EXP["glycine"]
    },
    {
        "id": "g12t19_q8", "k": "m",
        "q": "Mỗi chuỗi polypeptide gồm các đơn vị ...(1)... liên kết với nhau qua ...(2)... theo một trật tự nhất định. Các cụm từ phù hợp cho mỗi khoảng trống trong câu trên lần lượt là",
        "o": "A=α-amino acid và liên kết glycoside; B=monosaccharide và liên kết peptide; C=monosaccharide và liên kết glycoside; D=α-amino acid và liên kết peptide",
        "a": "D", "e": EXP["polypeptide_def"]
    },
    {
        "id": "g12t19_q9", "k": "m",
        "q": "Cho từ từ đến dư ethylamine vào dung dịch FeCl3, hiện tượng quan sát được là",
        "o": "A=không có kết tủa xuất hiện; B=tạo kết tủa nâu đỏ không tan; C=tạo kết tủa nâu đỏ sau đó kết tủa tan ra; D=tạo dung dịch phức chất có màu xanh lam",
        "a": "B", "e": EXP["ethylamine_fecl3"]
    },
    {
        "id": "g12t19_q10", "k": "m",
        "q": "Trong môi trường base, protein có phản ứng màu biuret với chất nào sau đây?",
        "o": "A=HNO3; B=NaCl; C=Mg(OH)2; D=Cu(OH)2",
        "a": "D", "e": EXP["biuret"]
    },
    {
        "id": "g12t19_q11", "k": "m",
        "q": "Thành phần nguyên tố có trong phân tử carbohydrate là",
        "o": "A=C, H, O, S; B=C, H, O, N; C=C, H, S, N; D=C, H, O",
        "a": "D", "e": EXP["carb_elements"]
    },
    {
        "id": "g12t19_q12", "k": "m",
        "q": "Kết quả phân tích nguyên tố trong phân tử chất X như sau: %C = 46,60%; %H = 8,74%; %N = 13,59% (về khối lượng); còn lại là oxygen. Từ phổ khối lượng (MS), xác định được phân tử khối của X bằng 103. Thuỷ phân X thấy thu được một α-amino acid Y và chất Z có công thức phân tử CH4O. Phát biểu nào sau đây là không đúng?",
        "o": "A=Công thức phân tử của X là C4H9O2N; B=Công thức cấu tạo phân tử của X là H2NCH(CH3)COOCH3; C=Có thể điều chế chất X bằng phản ứng của α-amino acid với alcohol tương ứng; D=Tên gọi thay thế của Y là 2-aminopropionic acid",
        "a": "D", "e": EXP["x_c4h9o2n"]
    },
    {
        "id": "g12t19_q13", "k": "m", "svgKey": "amphetamine_structure",
        "q": "Amphetamine là chất kích thích (mạnh hơn caffeine) làm tăng sự tỉnh táo và giảm cảm giác thèm ăn. Nó được sử dụng rộng rãi trong thế chiến thứ hai để ngăn chặn sự mệt mỏi khi chiến đấu. Amphetamine có công thức cấu tạo như hình bên. Công thức phân tử của amphetamine là",
        "o": "A=C9H12N; B=C8H11N; C=C9H13N; D=C10H13N",
        "a": "C", "e": EXP["amphetamine"]
    },
    {
        "id": "g12t19_q14", "k": "m",
        "q": "Tính chất vật lí nào sau đây là không phải là của amino acid?",
        "o": "A=Là chất rắn ở nhiệt độ phòng; B=Có độc tính rất cao; C=Tan tốt trong nước; D=Nhiệt độ nóng chảy cao",
        "a": "B", "e": EXP["amino_acid_prop"]
    },
    {
        "id": "g12t19_q15", "k": "m",
        "q": "Các amine ở thể khí tan nhiều trong nước. Nguyên nhân là do các amine này",
        "o": "A=hình thành lực tương tác Van der Waals lớn giữa các phân tử; B=tạo được liên kết hydrogen liên phân tử với nhau; C=đều ở thể khí nên dễ phân tán vào nước; D=tạo được liên kết hydrogen với nước",
        "a": "D", "e": EXP["amine_hbond_water"]
    },
    {
        "id": "g12t19_q16", "k": "m",
        "q": "Hợp chất nào sau đây thuộc loại dipeptide?",
        "o": "A=H2NCH2CH2CONHCH2COOH; B=H2NCH2CONHCH(CH3)COOH; C=H2NCH2CH2CONHCH2CH2COOH; D=H2NCH2CONHCH2CONHCH2COOH",
        "a": "B", "e": EXP["dipeptide_gly_ala"]
    },
    {
        "id": "g12t19_q17", "k": "m",
        "q": "Thủy phân hoàn toàn 1 mol pentapeptide X thì thu được 2 mol Alanine, 2 mol Glycine và 1 mol Valine. Khi thủy phân không hoàn toàn X thì trong hỗn hợp sản phẩm thấy có dipeptide Ala-Gly, Gly-Gly và tripeptide Gly-Ala-Val. Công thức của X là",
        "o": "A=Gly-Ala-Val-Ala-Gly; B=Gly-Ala-Gly-Ala-Val; C=Ala-Gly-Gly-Ala-Val; D=Gly-Gly-Ala-Ala-Val",
        "a": "C", "e": EXP["pentapeptide_seq"]
    },
    {
        "id": "g12t19_q18", "k": "m",
        "q": "Polysaccharide X là chất rắn, màu trắng, dạng sợi. Trong bông nõn có gần 98% chất X. Thủy phân X, thu được monosaccharide Y. Phát biểu nào sau đây đúng?",
        "o": "A=X dễ tan trong nước Schweizer; B=Phân tử khối của X bằng 162; C=X có cấu tạo xoắn và phản ứng màu với iodine; D=X, Y đều tham gia phản ứng tráng bạc",
        "a": "A", "e": EXP["cellulose"]
    },

    # Part II: 4 TF clusters
    {
        "id": "g12t19_q19", "k": "tf",
        "q": "Khi phân tích thành phần nguyên tố của ester X thấy trong phân tử X có tỉ lệ số nguyên tử C và H tương ứng là 1 : 2. Thuỷ phân X trong môi trường acid được alcohol Y (MY = 46) và carboxylic acid Z (phân tử Z có số nguyên tử carbon bằng số nguyên tử carbon trong phân tử Y).",
        "sub": [
            {"id": "a", "q": "Ứng với công thức phân tử của X có 5 ester là đồng phân cấu tạo của nhau.", "a": "false", "e": "Sai. Alcohol Y có MY = 46 là C2H5OH (2 carbon). Carboxylic acid Z có cùng số C với Y nên Z là CH3COOH (2 carbon). Vậy ester X là CH3COOC2H5 (C4H8O2). Các đồng phân cấu tạo ester của C4H8O2 gồm: HCOOCH2CH2CH3, HCOOCH(CH3)2, CH3COOCH2CH3, C2H5COOCH3 (tổng cộng chỉ có 4 đồng phân, không phải 5)."},
            {"id": "b", "q": "Từ Y có thể điều chế trực tiếp được Z bằng xúc tác enzyme.", "a": "true", "e": "Đúng. Phản ứng lên men giấm chuyển hoá ethyl alcohol thành acetic acid nhờ xúc tác men giấm (enzyme): C2H5OH + O2 -(men giấm)-> CH3COOH + H2O."},
            {"id": "c", "q": "Khả năng tan trong nước của X là kém hơn Y và Z.", "a": "true", "e": "Đúng. Ester X (ethyl acetate) không tạo được liên kết hydrogen bền vững với nước nên rất ít tan, trong khi alcohol Y (C2H5OH) và carboxylic acid Z (CH3COOH) tạo liên kết hydrogen mạnh với nước nên tan vô hạn trong nước."},
            {"id": "d", "q": "Phân tử X có 60% carbon về khối lượng.", "a": "false", "e": "Sai. X là C4H8O2 (M = 88). Phần trăm khối lượng carbon là: %C = (4 * 12 / 88) * 100% ≈ 54,55% ≠ 60%."}
        ]
    },
    {
        "id": "g12t19_q20", "k": "tf", "svgKey": "saturated_triglyceride_structure",
        "q": "Cho 5 gam hợp chất hữu cơ X có cấu trúc phân tử (như hình bên) vào một bát sứ và thêm 15 mL dung dịch KOH 30% (dùng dư), sau đó đun nóng một thời gian để phản ứng xảy ra hoàn toàn.",
        "sub": [
            {"id": "a", "q": "Thí nghiệm trên là phản ứng xà phòng hoá triolein bằng KOH.", "a": "false", "e": "Sai. X là triglyceride no (như tripalmitin hoặc tristearin), không phải triolein (triolein là chất béo không no lỏng chứa gốc oleate C17H33)."},
            {"id": "b", "q": "Khi chưa đun nóng, trong bát sứ có sự tách lớp giữa các chất.", "a": "true", "e": "Đúng. Chất béo không tan trong nước và dung dịch kiềm, nhẹ hơn nước nên nổi lên trên tạo thành 2 lớp chất lỏng phân cách."},
            {"id": "c", "q": "Sau thí nghiệm, trong chén sứ chỉ chứa một dung dịch đồng nhất.", "a": "true", "e": "Đúng. Sau khi đun nóng để phản ứng xà phòng hoá hoàn toàn, chất béo bị thuỷ phân tạo potassium carboxylate (muối kali) và glycerol; cả hai chất này đều tan hoàn toàn trong nước và dung dịch kiềm dư ở nhiệt độ cao, tạo thành dung dịch đồng nhất."},
            {"id": "d", "q": "Chất rắn màu trắng thu được sau thí nghiệm có thành phần là muối sodium stearate.", "a": "false", "e": "Sai. Dung dịch kiềm sử dụng là KOH nên muối carboxylate thu được là muối potassium (như potassium stearate/palmitate), không phải muối sodium."}
        ]
    },
    {
        "id": "g12t19_q21", "k": "tf",
        "q": "Mỗi phát biểu sau đây về protein và enzyme là đúng hay sai?",
        "sub": [
            {"id": "a", "q": "Khi nấu canh cua hoặc riêu cua thì thấy các tảng “gạch cua” nổi lên.", "a": "true", "e": "Đúng. Khi đun nóng, protein trong thịt cua bị đông tụ do nhiệt độ và kết tảng nổi lên mặt nước."},
            {"id": "b", "q": "Khi trộn thịt, cá tươi với muối thì thịt cá đang mềm bị đông cứng lại.", "a": "true", "e": "Đúng. Muối ăn làm mất nước và gây đông tụ protein của cơ thịt cá, khiến cơ thịt săn chắc lại."},
            {"id": "c", "q": "Khi nấu canh thịt, nếu thêm giấm ăn hoặc quả chua vào thì thịt sẽ nhanh nhừ hơn.", "a": "true", "e": "Đúng. Môi trường acid từ giấm hoặc quả chua xúc tác phản ứng thuỷ phân các liên kết peptide trong protein của mô liên kết sợi thịt, giúp thịt nhanh mềm nhừ."},
            {"id": "d", "q": "Vai trò xúc tác của enzyme trong các quá trình sinh hoá sẽ có hiệu quả tốt ở nhiệt độ cao.", "a": "false", "e": "Sai. Enzyme có bản chất là protein nên ở nhiệt độ cao sẽ bị biến tính và mất hoàn toàn hoạt tính xúc tác. Nhiệt độ tối ưu của đa số enzyme chỉ trong khoảng 37°C - 45°C."}
        ]
    },
    {
        "id": "g12t19_q22", "k": "tf",
        "q": "Glutamic acid là một amino acid có vai trò quan trọng trong việc trao đổi chất của cơ thể động vật. Glutamic acid thuộc loại hợp chất hữu cơ tạp chức có công thức cấu tạo như sau: HOOC-CH2-CH2-CH(NH2)-COOH.",
        "sub": [
            {"id": "a", "q": "Đặt glutamic acid ở pH = 6,0 vào trong một điện trường, glutamic acid dịch chuyển về phía cực âm.", "a": "false", "e": "Sai. Điểm đẳng điện của glutamic acid là pI ≈ 3,22. Ở pH = 6,0 > pI, glutamic acid phân li chủ yếu thành anion tích điện âm (-1), do đó khi đặt trong điện trường nó sẽ dịch chuyển về phía cực dương (anode), không phải cực âm."},
            {"id": "b", "q": "Cho a mol glutamic acid tác dụng với a mol methanol khi có mặt xúc tác acid mạnh, đun nóng thu được hợp chất hữu cơ có chứa 2 nhóm chức ester và 1 nhóm amino.", "a": "false", "e": "Sai. Tỉ lệ mol giữa glutamic acid (có 2 nhóm -COOH) và methanol CH3OH (có 1 nhóm -OH) là 1 : 1 nên chỉ ester hoá được 1 nhóm carboxyl, tạo thành monoester chứa 1 nhóm ester, 1 nhóm -COOH và 1 nhóm -NH2, không thể chứa 2 nhóm ester."},
            {"id": "c", "q": "Glutamic acid có tên thay thế là α-aminoglutaric acid.", "a": "false", "e": "Sai. α-aminoglutaric acid là tên bán hệ thống. Tên thay thế theo IUPAC chuẩn của glutamic acid là 2-aminopentanedioic acid."},
            {"id": "d", "q": "Glutamic acid là một α-amino acid chứa đồng thời 1 nhóm amino, 2 nhóm carboxyl và có công thức phân tử là C5H9NO4.", "a": "true", "e": "Đúng. Cấu tạo HOOC-CH2-CH2-CH(NH2)-COOH có nhóm -NH2 ở vị trí số 2 (α) so với carboxyl, gồm 1 nhóm -NH2, 2 nhóm -COOH và có công thức phân tử là C5H9NO4."}
        ]
    },

    # Part III: 6 Short Answer
    {
        "id": "g12t19_q23", "k": "n",
        "q": "Nhỏ dung dịch của mỗi chất methylamine, glycine, aniline, lysine vào các mẩu giấy quỳ tím riêng rẽ. Có bao nhiêu dung dịch làm giấy quỳ tím chuyển thành màu xanh?",
        "a": "2",
        "e": "(1) Phân tích dữ kiện: Tính chất acid-base của các amine và amino acid trên giấy quỳ tím phụ thuộc vào cấu tạo nhóm chức.\n(2) Đánh giá từng chất:\n- Methylamine (CH3NH2): amine béo có tính base mạnh hơn NH3 -> làm quỳ tím chuyển xanh.\n- Glycine (H2N-CH2-COOH): có 1 nhóm -NH2 và 1 nhóm -COOH (pH ≈ 6) -> không đổi màu quỳ tím.\n- Aniline (C6H5NH2): có gốc phenyl hút e làm giảm mật độ electron trên N -> tính base rất yếu, không đổi màu quỳ tím.\n- Lysine (H2N-[CH2]4-CH(NH2)-COOH): có 2 nhóm -NH2 và 1 nhóm -COOH -> môi trường base (pH ≈ 9,7) -> làm quỳ tím chuyển xanh.\n(3) Kết luận: Có 2 dung dịch làm quỳ tím hóa xanh (methylamine và lysine)."
    },
    {
        "id": "g12t19_q24", "k": "n",
        "q": "Cho các carbohydrate sau: saccharose, maltose, glucose, fructose và cellulose. Có bao nhiêu chất có thể làm mất màu dung dịch bromine?",
        "a": "2",
        "e": "(1) Phân tích phản ứng: Dung dịch nước bromine oxi hoá nhóm chức aldehyde (-CHO) thành carboxylic acid (-COOH), làm mất màu dung dịch nước bromine da cam.\n(2) Khảo sát các carbohydrate:\n- Glucose: có nhóm -CHO ở dạng mạch hở -> làm mất màu nước bromine.\n- Maltose: còn nhóm -OH hemiacetal tự do có thể mở vòng tạo nhóm -CHO -> làm mất màu nước bromine.\n- Fructose: trong môi trường nước bromine có tính acid nhẹ, fructose không chuyển hoá thành glucose -> không làm mất màu nước bromine.\n- Saccharose: liên kết glycoside khoá cả 2 nhóm anomer, không mở vòng tạo -CHO -> không làm mất màu.\n- Cellulose: polysaccharide mạch dài, không có -CHO tự do -> không làm mất màu.\n(3) Kết luận: Có 2 chất làm mất màu dung dịch bromine (glucose và maltose)."
    },
    {
        "id": "g12t19_q25", "k": "n",
        "q": "Chỉ số xà phòng hoá là số miligam KOH cần để xà phòng hoá 1 g chất béo. Theo TCVN 6044:2013, CODEX STAN 211-1999, chỉ số xà phòng hoá trung bình của chất béo trong mỡ lợn là 198. Khi xà phòng hoàn toàn m kg mỡ lợn (chứa 92% chất béo) thu được trong quá trình chế biến thực phẩm để nấu xà phòng, lượng NaOH cần lấy ít nhất 80 kg. Tìm m? Biết các tạp chất trong mỡ lợn không tác dụng với NaOH. (Kết quả làm tròn đến hàng đơn vị).",
        "a": "615", "u": "kg",
        "e": "(1) Tóm tắt dữ kiện: Lượng NaOH cần dùng tối thiểu = 80 kg. Chỉ số xà phòng hoá = 198 mg KOH / 1 g chất béo. Độ tinh khiết chất béo trong mỡ lợn = 92%.\n(2) Phương trình và tương đương mol:\n1 mol NaOH tương đương 1 mol KOH về số mol nhóm -OH- xà phòng hoá:\nn_KOH = n_NaOH = (80 * 10^3 g) / (40 g/mol) = 2000 mol.\nKhối lượng KOH tương đương:\nm_KOH = 2000 mol * 56 g/mol = 112 000 g = 112 * 10^6 mg.\n(3) Tính khối lượng mỡ lợn:\nKhối lượng chất béo nguyên chất:\nm_chất béo = (112 * 10^6 mg) / (198 mg/g) = 565 656,57 g ≈ 565,66 kg.\nKhối lượng mỡ lợn m (chứa 92% chất béo):\nm = 565,65657 kg / 0,92 ≈ 614,84 kg.\nLàm tròn đến hàng đơn vị: 615."
    },
    {
        "id": "g12t19_q26", "k": "n",
        "q": "Thủy phân 4,275 g saccharose trong dung dịch H2SO4 loãng. Trung hòa dung dịch thu được sau phản ứng bằng dung dịch NaOH thu được dung dịch Y. Cho Y tác dụng với lượng dư thuốc thử Tollens thu được bao nhiêu gam Ag? Biết hiệu suất phản ứng thủy phân saccharose là 80%, hiệu suất phản ứng tráng gương 100%.",
        "a": "4.32", "u": "g",
        "e": "(1) Tóm tắt dữ kiện: m_saccharose = 4,275 g (M = 342 g/mol) => n_saccharose = 4,275 / 342 = 0,0125 mol. Hiệu suất thuỷ phân H = 80%.\n(2) Phương trình phản ứng:\nC12H22O11 + H2O -(H+, t°)-> C6H12O6 (glucose) + C6H12O6 (fructose)\nn_saccharose phản ứng = 0,0125 * 80% = 0,01 mol.\n=> n_glucose = 0,01 mol; n_fructose = 0,01 mol.\nTrong môi trường kiềm (thuốc thử Tollens), cả glucose và fructose đều tham gia phản ứng tráng bạc:\n1 mol glucose -> 2 mol Ag\n1 mol fructose -> 2 mol Ag\n=> n_Ag = 2 * (n_glucose + n_fructose) = 2 * (0,01 + 0,01) = 0,04 mol.\n(3) Khối lượng Ag thu được:\nm_Ag = 0,04 mol * 108 g/mol = 4,32 g."
    },
    {
        "id": "g12t19_q27", "k": "n",
        "q": "Hiện nay công nghệ sản xuất giấm bằng phương pháp lên men từ các loại tinh bột đang được sử dụng rộng rãi theo sơ đồ sản xuất như sau: Tinh bột -> glucose -> ethanol -> acetic acid (thành phần chính của giấm). Từ 16,875 tấn bột sắn chứa 90% tinh bột sản xuất được 200 tấn dung dịch acetic acid có nồng độ a%. Biết hiệu suất chung của cả quá trình sản xuất là 80%. Giá trị a bằng bao nhiêu? (Làm tròn đến hàng phần mười).",
        "a": "4.5", "u": "%",
        "e": "(1) Tóm tắt dữ kiện: m_bột sắn = 16,875 tấn, %tinh bột = 90% => m_tinh bột nguyên chất = 16,875 * 90% = 15,1875 tấn. m_dd giấm = 200 tấn, H_chung = 80%.\n(2) Sơ đồ phản ứng theo mắt xích:\n(C6H10O5)n -> n C6H12O6 -> 2n C2H5OH -> 2n CH3COOH\n162 g tinh bột  -------------------------> 2 * 60 = 120 g CH3COOH\nKhối lượng CH3COOH theo lý thuyết:\nm_acid_lt = 15,1875 * (120 / 162) = 11,25 tấn.\nKhối lượng CH3COOH thực tế thu được (H = 80%):\nm_acid_tt = 11,25 * 80% = 9,0 tấn.\n(3) Tính nồng độ a%:\na% = (m_acid_tt / m_dd) * 100% = (9,0 / 200) * 100% = 4,5%."
    },
    {
        "id": "g12t19_q28", "k": "n",
        "q": "Có bao nhiêu amino acid đồng phân cấu tạo của nhau có cùng công thức phân tử C4H9O2N?",
        "a": "5",
        "e": "(1) Phân tích dạng phân tử: C4H9O2N có k = (2*4 + 2 + 1 - 9)/2 = 1 (1 nhóm -COOH). Đây là amino acid no, đơn chức, mạch hở C3H6(NH2)COOH.\n(2) Xét các mạch carbon của gốc acid:\n* Trường hợp 1: Mạch 4C không phân nhánh C-C-C-COOH (butanoic acid), nhóm -NH2 có thể gắn vào 3 vị trí:\n  (1) Vị trí C2 (α): CH3-CH2-CH(NH2)-COOH (2-aminobutanoic acid)\n  (2) Vị trí C3 (β): CH3-CH(NH2)-CH2-COOH (3-aminobutanoic acid)\n  (3) Vị trí C4 (γ): H2N-CH2-CH2-CH2-COOH (4-aminobutanoic acid)\n* Trường hợp 2: Mạch 4C có nhánh C-C(CH3)-COOH (2-methylpropanoic acid), nhóm -NH2 có thể gắn vào 2 vị trí:\n  (4) Vị trí C2 (α): CH3-C(CH3)(NH2)-COOH (2-amino-2-methylpropanoic acid)\n  (5) Vị trí C3 (β): H2N-CH2-CH(CH3)-COOH (3-amino-2-methylpropanoic acid)\n(3) Kết luận: Có tất cả 5 đồng phân amino acid cấu tạo thỏa mãn."
    }
]

test_19 = {
    "id": "g12t19",
    "grade": "g12",
    "title": "Đề 19 · GHK1 Hoá 12 — THPT Chuyên Lê Quý Đôn (Bà Rịa – Vũng Tàu) 2024–2025 (Mã đề 101)",
    "desc": "Đề kiểm tra giữa kì 1 Hoá 12 THPT Chuyên Lê Quý Đôn (Bà Rịa – Vũng Tàu) năm học 2024–2025 theo đúng ma trận cấu trúc Bộ GD&ĐT (28 câu: 18 MCQ, 4 Đúng/Sai, 6 Trả lời ngắn).",
    "author": "THPT Chuyên Lê Quý Đôn (Bà Rịa – Vũng Tàu)",
    "timeMin": 50,
    "qs": qs_101
}

# ----------------- TEST 20: MÃ ĐỀ 102 -----------------
# Exact mapped order from Images 5 to 8
qs_102 = [
    # 1 (was 12 in 101)
    {
        "id": "g12t20_q1", "k": "m",
        "q": "Kết quả phân tích nguyên tố trong phân tử chất X như sau: %C = 46,60%; %H = 8,74%; %N = 13,59% (về khối lượng); còn lại là oxygen. Từ phổ khối lượng (MS), xác định được phân tử khối của X bằng 103. Thuỷ phân X thấy thu được một α-amino acid Y và chất Z có công thức phân tử CH4O. Phát biểu nào sau đây là không đúng?",
        "o": "A=Công thức phân tử của X là C4H9O2N; B=Công thức cấu tạo phân tử của X là H2NCH(CH3)COOCH3; C=Có thể điều chế chất X bằng phản ứng của α-amino acid với alcohol tương ứng; D=Tên gọi thay thế của Y là 2-aminopropionic acid",
        "a": "D", "e": EXP["x_c4h9o2n"]
    },
    # 2 (was 8 in 101)
    {
        "id": "g12t20_q2", "k": "m",
        "q": "Mỗi chuỗi polypeptide gồm các đơn vị ...(1)... liên kết với nhau qua ...(2)... theo một trật tự nhất định. Các cụm từ phù hợp cho mỗi khoảng trống trong câu trên lần lượt là",
        "o": "A=α-amino acid và liên kết peptide; B=monosaccharide và liên kết peptide; C=α-amino acid và liên kết glycoside; D=monosaccharide và liên kết glycoside",
        "a": "A", "e": EXP["polypeptide_def"]
    },
    # 3 (was 18 in 101)
    {
        "id": "g12t20_q3", "k": "m",
        "q": "Polysaccharide X là chất rắn, màu trắng, dạng sợi. Trong bông nõn có gần 98% chất X. Thủy phân X, thu được monosaccharide Y. Phát biểu nào sau đây đúng?",
        "o": "A=X có cấu tạo xoắn và phản ứng màu với iodine; B=X dễ tan trong nước Schweizer; C=Phân tử khối của X bằng 162; D=X, Y đều tham gia phản ứng tráng bạc",
        "a": "B", "e": EXP["cellulose"]
    },
    # 4 (was 3 in 101)
    {
        "id": "g12t20_q4", "k": "m",
        "q": "Cho các chất sau: triolein, cellulose, saccharose, tinh bột. Số chất bị thuỷ phân trong môi trường acid là",
        "o": "A=2; B=1; C=4; D=3",
        "a": "C", "e": EXP["thuy_phan_acid"]
    },
    # 5 (was 15 in 101)
    {
        "id": "g12t20_q5", "k": "m",
        "q": "Các amine ở thể khí tan nhiều trong nước. Nguyên nhân là do các amine này",
        "o": "A=tạo được liên kết hydrogen với nước; B=tạo được liên kết hydrogen liên phân tử với nhau; C=đều ở thể khí nên dễ phân tán vào nước; D=hình thành lực tương tác Van der Waals lớn giữa các phân tử",
        "a": "A", "e": EXP["amine_hbond_water"]
    },
    # 6 (was 16 in 101)
    {
        "id": "g12t20_q6", "k": "m",
        "q": "Hợp chất nào sau đây thuộc loại dipeptide?",
        "o": "A=H2NCH2CH2CONHCH2COOH; B=H2NCH2CONHCH(CH3)COOH; C=H2NCH2CH2CONHCH2CH2COOH; D=H2NCH2CONHCH2CONHCH2COOH",
        "a": "B", "e": EXP["dipeptide_gly_ala"]
    },
    # 7 (was 7 in 101)
    {
        "id": "g12t20_q7", "k": "m",
        "q": "Chất nào sau đây là amino acid?",
        "o": "A=H2NCH2COOH; B=CH3NH2; C=HOCH2COOH; D=CH3COOH",
        "a": "A", "e": EXP["glycine"]
    },
    # 8 (was 5 in 101)
    {
        "id": "g12t20_q8", "k": "m",
        "q": "Trong công nghiệp, để chuyển hóa chất béo lỏng thành chất béo rắn, người ta dùng phương pháp nào sau đây?",
        "o": "A=Phản ứng ester hóa; B=Phản ứng hydrogen hóa; C=Phản ứng xà phòng hóa; D=Phản ứng oxi hóa",
        "a": "B", "e": EXP["hydrogen_hoa"]
    },
    # 9 (was 9 in 101)
    {
        "id": "g12t20_q9", "k": "m",
        "q": "Cho từ từ đến dư ethylamine vào dung dịch FeCl3, hiện tượng quan sát được là",
        "o": "A=tạo kết tủa nâu đỏ sau đó kết tủa tan ra; B=tạo dung dịch phức chất có màu xanh lam; C=tạo kết tủa nâu đỏ không tan; D=không có kết tủa xuất hiện",
        "a": "C", "e": EXP["ethylamine_fecl3"]
    },
    # 10 (was 11 in 101)
    {
        "id": "g12t20_q10", "k": "m",
        "q": "Thành phần nguyên tố có trong phân tử carbohydrate là",
        "o": "A=C, H, O, N; B=C, H, O, S; C=C, H, S, N; D=C, H, O",
        "a": "D", "e": EXP["carb_elements"]
    },
    # 11 (was 2 in 101)
    {
        "id": "g12t20_q11", "k": "m", "svgKey": "polycaproamide_reaction",
        "q": "Polycaproamide được tổng hợp theo phản ứng sau: n H2N-[CH2]5-COOH -(t°)-> -[HN-[CH2]5-CO]-n + n H2O. Polycaproamide được điều chế bằng phản ứng",
        "o": "A=trùng hợp; B=trùng ngưng; C=thế; D=phân hủy",
        "a": "B", "e": EXP["polycaproamide"]
    },
    # 12 (was 4 in 101)
    {
        "id": "g12t20_q12", "k": "m",
        "q": "Ester được tạo thành từ formic acid và ethyl alcohol có công thức cấu tạo là",
        "o": "A=HCOOC2H5; B=C2H5COOCH3; C=HCOOCH3; D=CH3COOCH3",
        "a": "A", "e": EXP["formic_ethyl"]
    },
    # 13 (was 14 in 101)
    {
        "id": "g12t20_q13", "k": "m",
        "q": "Tính chất vật lí nào sau đây là không phải là của amino acid?",
        "o": "A=Là chất rắn ở nhiệt độ phòng; B=Có độc tính rất cao; C=Tan tốt trong nước; D=Nhiệt độ nóng chảy cao",
        "a": "B", "e": EXP["amino_acid_prop"]
    },
    # 14 (was 6 in 101)
    {
        "id": "g12t20_q14", "k": "m",
        "q": "X là một loại disaccharide có nhiều trong mạch nha. Chất X là",
        "o": "A=glucose; B=saccharose; C=fructose; D=maltose",
        "a": "D", "e": EXP["maltose"]
    },
    # 15 (was 1 in 101)
    {
        "id": "g12t20_q15", "k": "m",
        "q": "Cho dung dịch glucose vào ống nghiệm chứa dung dịch AgNO3 trong NH3 dư được ngâm trong cốc nước nóng, thu được sản phẩm hữu cơ X và bạc kim loại. Tên gọi của X là",
        "o": "A=ammonium gluconate; B=fructose; C=glycerol; D=gluconic acid",
        "a": "A", "e": EXP["glucose_ag"]
    },
    # 16 (was 10 in 101)
    {
        "id": "g12t20_q16", "k": "m",
        "q": "Trong môi trường base, protein có phản ứng màu biuret với chất nào sau đây?",
        "o": "A=HNO3; B=Cu(OH)2; C=Mg(OH)2; D=NaCl",
        "a": "B", "e": EXP["biuret"]
    },
    # 17 (was 13 in 101)
    {
        "id": "g12t20_q17", "k": "m", "svgKey": "amphetamine_structure",
        "q": "Amphetamine là chất kích thích (mạnh hơn caffeine) làm tăng sự tỉnh táo và giảm cảm giác thèm ăn. Nó được sử dụng rộng rãi trong thế chiến thứ hai để ngăn chặn sự mệt mỏi khi chiến đấu. Amphetamine có công thức cấu tạo như hình bên. Công thức phân tử của amphetamine là",
        "o": "A=C9H12N; B=C8H11N; C=C9H13N; D=C10H13N",
        "a": "C", "e": EXP["amphetamine"]
    },
    # 18 (was 17 in 101)
    {
        "id": "g12t20_q18", "k": "m",
        "q": "Thủy phân hoàn toàn 1 mol pentapeptide X thì thu được 2 mol Alanine, 2 mol Glycine và 1 mol Valine. Khi thủy phân không hoàn toàn X thì trong hỗn hợp sản phẩm thấy có dipeptide Ala-Gly, Gly-Gly và tripeptide Gly-Ala-Val. Công thức của X là",
        "o": "A=Gly-Ala-Val-Ala-Gly; B=Gly-Ala-Gly-Ala-Val; C=Ala-Gly-Gly-Ala-Val; D=Gly-Gly-Ala-Ala-Val",
        "a": "C", "e": EXP["pentapeptide_seq"]
    },

    # Part II: 4 TF clusters (Order from Image 7)
    # 1 (was Câu 20 in 101)
    {
        "id": "g12t20_q19", "k": "tf", "svgKey": "saturated_triglyceride_structure",
        "q": "Cho 5 gam hợp chất hữu cơ X có cấu trúc phân tử (như hình bên) vào một bát sứ và thêm 15 mL dung dịch KOH 30% (dùng dư), sau đó đun nóng một thời gian để phản ứng xảy ra hoàn toàn.",
        "sub": [
            {"id": "a", "q": "Thí nghiệm trên là phản ứng xà phòng hoá triolein bằng KOH.", "a": "false", "e": "Sai. X là triglyceride no (như tripalmitin hoặc tristearin), không phải triolein (triolein là chất béo không no lỏng chứa gốc oleate C17H33)."},
            {"id": "b", "q": "Khi chưa đun nóng, trong bát sứ có sự tách lớp giữa các chất.", "a": "true", "e": "Đúng. Chất béo không tan trong nước và dung dịch kiềm, nhẹ hơn nước nên nổi lên trên tạo thành 2 lớp chất lỏng phân cách."},
            {"id": "c", "q": "Sau thí nghiệm, trong chén sứ chỉ chứa một dung dịch đồng nhất.", "a": "true", "e": "Đúng. Sau khi đun nóng để phản ứng xà phòng hoá hoàn toàn, chất béo bị thuỷ phân tạo potassium carboxylate (muối kali) và glycerol; cả hai chất này đều tan hoàn toàn trong nước và dung dịch kiềm dư ở nhiệt độ cao, tạo thành dung dịch đồng nhất."},
            {"id": "d", "q": "Chất rắn màu trắng thu được sau thí nghiệm có thành phần là muối sodium stearate.", "a": "false", "e": "Sai. Dung dịch kiềm sử dụng là KOH nên muối carboxylate thu được là muối potassium (như potassium stearate/palmitate), không phải muối sodium."}
        ]
    },
    # 2 (was Câu 22 in 101, reordered sub-statements as seen in Image 7)
    {
        "id": "g12t20_q20", "k": "tf",
        "q": "Glutacid acid là một amino acid có vai trò quan trọng trong việc trao đổi chất của cơ thể động vật. Glutamic acid thuộc loại hợp chất hữu cơ tạp chức có công thức cấu tạo như sau: HOOC-CH2-CH2-CH(NH2)-COOH.",
        "sub": [
            {"id": "a", "q": "Cho a mol glutamic acid tác dụng với a mol methanol khi có mặt xúc tác acid mạnh, đun nóng thu được hợp chất hữu cơ có chứa 2 nhóm chức ester và 1 nhóm amino.", "a": "false", "e": "Sai. Tỉ lệ mol giữa glutamic acid (có 2 nhóm -COOH) và methanol CH3OH (có 1 nhóm -OH) là 1 : 1 nên chỉ ester hoá được 1 nhóm carboxyl, tạo thành monoester chứa 1 nhóm ester, 1 nhóm -COOH và 1 nhóm -NH2, không thể chứa 2 nhóm ester."},
            {"id": "b", "q": "Glutamic acid có tên thay thế là α-aminoglutaric acid.", "a": "false", "e": "Sai. α-aminoglutaric acid là tên bán hệ thống. Tên thay thế theo IUPAC chuẩn của glutamic acid là 2-aminopentanedioic acid."},
            {"id": "c", "q": "Đặt glutamic acid ở pH = 6,0 vào trong một điện trường, glutamic acid dịch chuyển về phía cực âm.", "a": "false", "e": "Sai. Điểm đẳng điện của glutamic acid là pI ≈ 3,22. Ở pH = 6,0 > pI, glutamic acid phân li chủ yếu thành anion tích điện âm (-1), do đó khi đặt trong điện trường nó sẽ dịch chuyển về phía cực dương (anode), không phải cực âm."},
            {"id": "d", "q": "Glutamic acid là một α-amino acid chứa đồng thời 1 nhóm amino, 2 nhóm carboxyl và có công thức phân tử là C5H9NO4.", "a": "true", "e": "Đúng. Cấu tạo HOOC-CH2-CH2-CH(NH2)-COOH có nhóm -NH2 ở vị trí số 2 (α) so với carboxyl, gồm 1 nhóm -NH2, 2 nhóm -COOH và có công thức phân tử là C5H9NO4."}
        ]
    },
    # 3 (was Câu 19 in 101)
    {
        "id": "g12t20_q21", "k": "tf",
        "q": "Khi phân tích thành phần nguyên tố của ester X thấy trong phân tử X có tỉ lệ số nguyên tử C và H tương ứng là 1 : 2. Thuỷ phân X trong môi trường acid được alcohol Y (MY = 46) và carboxylic acid Z (phân tử Z có số nguyên tử carbon bằng số nguyên tử carbon trong phân tử Y).",
        "sub": [
            {"id": "a", "q": "Ứng với công thức phân tử của X có 5 ester là đồng phân cấu tạo của nhau.", "a": "false", "e": "Sai. Alcohol Y có MY = 46 là C2H5OH (2 carbon). Carboxylic acid Z có cùng số C với Y nên Z là CH3COOH (2 carbon). Vậy ester X là CH3COOC2H5 (C4H8O2). Các đồng phân cấu tạo ester của C4H8O2 gồm: HCOOCH2CH2CH3, HCOOCH(CH3)2, CH3COOCH2CH3, C2H5COOCH3 (tổng cộng chỉ có 4 đồng phân, không phải 5)."},
            {"id": "b", "q": "Từ Y có thể điều chế trực tiếp được Z bằng xúc tác enzyme.", "a": "true", "e": "Đúng. Phản ứng lên men giấm chuyển hoá ethyl alcohol thành acetic acid nhờ xúc tác men giấm (enzyme): C2H5OH + O2 -(men giấm)-> CH3COOH + H2O."},
            {"id": "c", "q": "Khả năng tan trong nước của X là kém hơn Y và Z.", "a": "true", "e": "Đúng. Ester X (ethyl acetate) không tạo được liên kết hydrogen bền vững với nước nên rất ít tan, trong khi alcohol Y (C2H5OH) và carboxylic acid Z (CH3COOH) tạo liên kết hydrogen mạnh với nước nên tan vô hạn trong nước."},
            {"id": "d", "q": "Phân tử X có 60% carbon về khối lượng.", "a": "false", "e": "Sai. X là C4H8O2 (M = 88). Phần trăm khối lượng carbon là: %C = (4 * 12 / 88) * 100% ≈ 54,55% ≠ 60%."}
        ]
    },
    # 4 (was Câu 21 in 101)
    {
        "id": "g12t20_q22", "k": "tf",
        "q": "Mỗi phát biểu sau đây là đúng hay sai?",
        "sub": [
            {"id": "a", "q": "Khi nấu canh cua hoặc riêu cua thì thấy các tảng “gạch cua” nổi lên.", "a": "true", "e": "Đúng. Khi đun nóng, protein trong thịt cua bị đông tụ do nhiệt độ và kết tảng nổi lên mặt nước."},
            {"id": "b", "q": "Khi trộn thịt, cá tươi với muối thì thịt cá đang mềm bị đông cứng lại.", "a": "true", "e": "Đúng. Muối ăn làm mất nước và gây đông tụ protein của cơ thịt cá, khiến cơ thịt săn chắc lại."},
            {"id": "c", "q": "Khi nấu canh thịt, nếu thêm giấm ăn hoặc quả chua vào thì thịt sẽ nhanh nhừ hơn.", "a": "true", "e": "Đúng. Môi trường acid từ giấm hoặc quả chua xúc tác phản ứng thuỷ phân các liên kết peptide trong protein của mô liên kết sợi thịt, giúp thịt nhanh mềm nhừ."},
            {"id": "d", "q": "Vai trò xúc tác của enzyme trong các quá trình sinh hoá sẽ có hiệu quả tốt ở nhiệt độ cao.", "a": "false", "e": "Sai. Enzyme có bản chất là protein nên ở nhiệt độ cao sẽ bị biến tính và mất hoàn toàn hoạt tính xúc tác. Nhiệt độ tối ưu của đa số enzyme chỉ trong khoảng 37°C - 45°C."}
        ]
    },

    # Part III: 6 Short Answer (Order from Image 7 & 8)
    # 1 (was Câu 27 in 101)
    {
        "id": "g12t20_q23", "k": "n",
        "q": "Hiện nay công nghệ sản xuất giấm bằng phương pháp lên men từ các loại tinh bột đang được sử dụng rộng rãi theo sơ đồ sản xuất như sau: Tinh bột -> glucose -> ethanol -> acetic acid (thành phần chính của giấm). Từ 16,875 tấn bột sắn chứa 90% tinh bột sản xuất được 200 tấn dung dịch acetic acid có nồng độ a%. Biết hiệu suất chung của cả quá trình sản xuất là 80%. Giá trị a bằng bao nhiêu? (Làm tròn đến hàng phần mười).",
        "a": "4.5", "u": "%",
        "e": "(1) Tóm tắt dữ kiện: m_bột sắn = 16,875 tấn, %tinh bột = 90% => m_tinh bột nguyên chất = 16,875 * 90% = 15,1875 tấn. m_dd giấm = 200 tấn, H_chung = 80%.\n(2) Sơ đồ phản ứng theo mắt xích:\n(C6H10O5)n -> n C6H12O6 -> 2n C2H5OH -> 2n CH3COOH\n162 g tinh bột  -------------------------> 2 * 60 = 120 g CH3COOH\nKhối lượng CH3COOH theo lý thuyết:\nm_acid_lt = 15,1875 * (120 / 162) = 11,25 tấn.\nKhối lượng CH3COOH thực tế thu được (H = 80%):\nm_acid_tt = 11,25 * 80% = 9,0 tấn.\n(3) Tính nồng độ a%:\na% = (m_acid_tt / m_dd) * 100% = (9,0 / 200) * 100% = 4,5%."
    },
    # 2 (was Câu 25 in 101)
    {
        "id": "g12t20_q24", "k": "n",
        "q": "Chỉ số xà phòng hoá là số miligam KOH cần để xà phòng hoá 1 g chất béo. Theo TCVN 6044:2013, CODEX STAN 211-1999, chỉ số xà phòng hoá trung bình của chất béo trong mỡ lợn là 198. Khi xà phòng hoàn toàn m kg mỡ lợn (chứa 92% chất béo) thu được trong quá trình chế biến thực phẩm để nấu xà phòng, lượng NaOH cần lấy ít nhất 80 kg. Tìm m? Biết các tạp chất trong mỡ lợn không tác dụng với NaOH. (Kết quả làm tròn đến hàng đơn vị).",
        "a": "615", "u": "kg",
        "e": "(1) Tóm tắt dữ kiện: Lượng NaOH cần dùng tối thiểu = 80 kg. Chỉ số xà phòng hoá = 198 mg KOH / 1 g chất béo. Độ tinh khiết chất béo trong mỡ lợn = 92%.\n(2) Phương trình và tương đương mol:\n1 mol NaOH tương đương 1 mol KOH về số mol nhóm -OH- xà phòng hoá:\nn_KOH = n_NaOH = (80 * 10^3 g) / (40 g/mol) = 2000 mol.\nKhối lượng KOH tương đương:\nm_KOH = 2000 mol * 56 g/mol = 112 000 g = 112 * 10^6 mg.\n(3) Tính khối lượng mỡ lợn:\nKhối lượng chất béo nguyên chất:\nm_chất béo = (112 * 10^6 mg) / (198 mg/g) = 565 656,57 g ≈ 565,66 kg.\nKhối lượng mỡ lợn m (chứa 92% chất béo):\nm = 565,65657 kg / 0,92 ≈ 614,84 kg.\nLàm tròn đến hàng đơn vị: 615."
    },
    # 3 (was Câu 28 in 101)
    {
        "id": "g12t20_q25", "k": "n",
        "q": "Có bao nhiêu amino acid đồng phân cấu tạo của nhau có cùng công thức phân tử C4H9O2N?",
        "a": "5",
        "e": "(1) Phân tích dạng phân tử: C4H9O2N có k = (2*4 + 2 + 1 - 9)/2 = 1 (1 nhóm -COOH). Đây là amino acid no, đơn chức, mạch hở C3H6(NH2)COOH.\n(2) Xét các mạch carbon của gốc acid:\n* Trường hợp 1: Mạch 4C không phân nhánh C-C-C-COOH (butanoic acid), nhóm -NH2 có thể gắn vào 3 vị trí:\n  (1) Vị trí C2 (α): CH3-CH2-CH(NH2)-COOH (2-aminobutanoic acid)\n  (2) Vị trí C3 (β): CH3-CH(NH2)-CH2-COOH (3-aminobutanoic acid)\n  (3) Vị trí C4 (γ): H2N-CH2-CH2-CH2-COOH (4-aminobutanoic acid)\n* Trường hợp 2: Mạch 4C có nhánh C-C(CH3)-COOH (2-methylpropanoic acid), nhóm -NH2 có thể gắn vào 2 vị trí:\n  (4) Vị trí C2 (α): CH3-C(CH3)(NH2)-COOH (2-amino-2-methylpropanoic acid)\n  (5) Vị trí C3 (β): H2N-CH2-CH(CH3)-COOH (3-amino-2-methylpropanoic acid)\n(3) Kết luận: Có tất cả 5 đồng phân amino acid cấu tạo thỏa mãn."
    },
    # 4 (was Câu 26 in 101)
    {
        "id": "g12t20_q26", "k": "n",
        "q": "Thủy phân 4,275 g saccharose trong dung dịch H2SO4 loãng. Trung hòa dung dịch thu được sau phản ứng bằng dung dịch NaOH thu được dung dịch Y. Cho Y tác dụng với lượng dư thuốc thử Tollens thu được bao nhiêu gam Ag? Biết hiệu suất phản ứng thủy phân saccharose là 80%, hiệu suất phản ứng tráng gương 100%.",
        "a": "4.32", "u": "g",
        "e": "(1) Tóm tắt dữ kiện: m_saccharose = 4,275 g (M = 342 g/mol) => n_saccharose = 4,275 / 342 = 0,0125 mol. Hiệu suất thuỷ phân H = 80%.\n(2) Phương trình phản ứng:\nC12H22O11 + H2O -(H+, t°)-> C6H12O6 (glucose) + C6H12O6 (fructose)\nn_saccharose phản ứng = 0,0125 * 80% = 0,01 mol.\n=> n_glucose = 0,01 mol; n_fructose = 0,01 mol.\nTrong môi trường kiềm (thuốc thử Tollens), cả glucose và fructose đều tham gia phản ứng tráng bạc:\n1 mol glucose -> 2 mol Ag\n1 mol fructose -> 2 mol Ag\n=> n_Ag = 2 * (n_glucose + n_fructose) = 2 * (0,01 + 0,01) = 0,04 mol.\n(3) Khối lượng Ag thu được:\nm_Ag = 0,04 mol * 108 g/mol = 4,32 g."
    },
    # 5 (was Câu 24 in 101)
    {
        "id": "g12t20_q27", "k": "n",
        "q": "Cho các carbohydrate sau: saccharose, maltose, glucose, fructose và cellulose. Có bao nhiêu chất có thể làm mất màu dung dịch bromine?",
        "a": "2",
        "e": "(1) Phân tích phản ứng: Dung dịch nước bromine oxi hoá nhóm chức aldehyde (-CHO) thành carboxylic acid (-COOH), làm mất màu dung dịch nước bromine da cam.\n(2) Khảo sát các carbohydrate:\n- Glucose: có nhóm -CHO ở dạng mạch hở -> làm mất màu nước bromine.\n- Maltose: còn nhóm -OH hemiacetal tự do có thể mở vòng tạo nhóm -CHO -> làm mất màu nước bromine.\n- Fructose: trong môi trường nước bromine có tính acid nhẹ, fructose không chuyển hoá thành glucose -> không làm mất màu nước bromine.\n- Saccharose: liên kết glycoside khoá cả 2 nhóm anomer, không mở vòng tạo -CHO -> không làm mất màu.\n- Cellulose: polysaccharide mạch dài, không có -CHO tự do -> không làm mất màu.\n(3) Kết luận: Có 2 chất làm mất màu dung dịch bromine (glucose và maltose)."
    },
    # 6 (was Câu 23 in 101)
    {
        "id": "g12t20_q28", "k": "n",
        "q": "Nhỏ dung dịch của mỗi chất methylamine, glycine, aniline, lysine vào các mẩu giấy quỳ tím riêng rẽ. Có bao nhiêu dung dịch làm giấy quỳ tím chuyển thành màu xanh?",
        "a": "2",
        "e": "(1) Phân tích dữ kiện: Tính chất acid-base của các amine và amino acid trên giấy quỳ tím phụ thuộc vào cấu tạo nhóm chức.\n(2) Đánh giá từng chất:\n- Methylamine (CH3NH2): amine béo có tính base mạnh hơn NH3 -> làm quỳ tím chuyển xanh.\n- Glycine (H2N-CH2-COOH): có 1 nhóm -NH2 và 1 nhóm -COOH (pH ≈ 6) -> không đổi màu quỳ tím.\n- Aniline (C6H5NH2): có gốc phenyl hút e làm giảm mật độ electron trên N -> tính base rất yếu, không đổi màu quỳ tím.\n- Lysine (H2N-[CH2]4-CH(NH2)-COOH): có 2 nhóm -NH2 và 1 nhóm -COOH -> môi trường base (pH ≈ 9,7) -> làm quỳ tím chuyển xanh.\n(3) Kết luận: Có 2 dung dịch làm quỳ tím hóa xanh (methylamine và lysine)."
    }
]

test_20 = {
    "id": "g12t20",
    "grade": "g12",
    "title": "Đề 20 · GHK1 Hoá 12 — THPT Chuyên Lê Quý Đôn (Bà Rịa – Vũng Tàu) 2024–2025 (Mã đề 102)",
    "desc": "Đề kiểm tra giữa kì 1 Hoá 12 THPT Chuyên Lê Quý Đôn (Bà Rịa – Vũng Tàu) năm học 2024–2025 theo đúng ma trận cấu trúc Bộ GD&ĐT (28 câu: 18 MCQ, 4 Đúng/Sai, 6 Trả lời ngắn).",
    "author": "THPT Chuyên Lê Quý Đôn (Bà Rịa – Vũng Tàu)",
    "timeMin": 50,
    "qs": qs_102
}

tests.append(test_19)
tests.append(test_20)
data["tests"] = tests

print(f"Total tests now: {len(tests)}")
print(f"Appended g12t19 (28 qs) and g12t20 (28 qs).")

# Write updated data.js
formatted_json = json.dumps(data, ensure_ascii=False, indent=2)
new_data_js = f"var DATA = window.DATA = {formatted_json};\n"
DATA_JS.write_text(new_data_js, encoding="utf-8")
print(f"Successfully updated {DATA_JS}")
