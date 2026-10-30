import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
BUILD_PY = ROOT / "scripts" / "build_lequydon_tests.py"
text = BUILD_PY.read_text(encoding="utf-8")

# 1. Update Glutacid typo in build script
text = text.replace("Glutacid acid", "Glutamic acid")

# 2. Update g12t20 Q3 explanation in build script
old_q3_e = """"e": "X là cellulose (chiếm ~98% bông nõn), Y là glucose.\\n- A đúng: Cellulose tan tốt trong nước Schweizer (dung dịch [Cu(NH3)4](OH)2).\\n- B sai: Cellulose là polymer (C6H10O5)n có phân tử khối rất lớn (162n), không phải 162.\\n- C sai: Tinh bột mới có cấu trúc xoắn và phản ứng màu với iodine, cellulose có cấu trúc mạch kéo dài dạng sợi.\\n- D sai: Cellulose không tham gia phản ứng tráng bạc (chỉ Y là glucose tráng bạc)." """

new_q3_e = """"e": "X là cellulose (chiếm ~98% bông nõn), Y là glucose.\\n- B đúng: Cellulose tan tốt trong nước Schweizer (dung dịch [Cu(NH3)4](OH)2).\\n- A sai: Tinh bột mới có cấu tạo xoắn và phản ứng màu với iodine; cellulose có cấu trúc mạch kéo dài dạng sợi không phân nhánh.\\n- C sai: Cellulose là polymer (C6H10O5)n có phân tử khối rất lớn (162n), không phải 162.\\n- D sai: Cellulose không tham gia phản ứng tráng bạc (chỉ Y là glucose tráng bạc)." """

text = text.replace(old_q3_e.strip(), new_q3_e.strip())

BUILD_PY.write_text(text, encoding="utf-8")
print("Updated scripts/build_lequydon_tests.py")
