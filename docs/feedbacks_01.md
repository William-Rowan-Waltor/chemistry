Bạn đang đóng vai trò là Senior Frontend Developer kiêm Chuyên gia biên soạn nội dung Hóa học THPT. Hãy xử lý các vấn đề tồn đọng trong dự án theo danh sách nhiệm vụ chi tiết dưới đây:

### 1. Sửa lỗi Giao diện & Trải nghiệm (UI/UX)
- [x] **Mục Lý thuyết nhanh (Quick Theory modal/popup):** Sửa triệt để lỗi tràn/vỡ text và căn chỉnh lại component hiển thị ngay tại chỗ (TASK-0013).
- [x] **Dạng câu hỏi Đúng/Sai:** Gom toàn bộ nội dung (câu hỏi dẫn + 4 mệnh đề con a, b, c, d) vào cùng 1 trang/màn hình duy nhất, tránh ngắt trang rời rạc (tf-cluster-container).
- [x] **Dạng Trả lời ngắn:** Thiết kế lại (style) ô nhập số chuyên biệt: căn giữa số, hỗ trợ hiển thị đơn vị rõ ràng, xử lý trường hợp số thập phân/phân số (short-ans-box, checkNum, TASK-0012).

### 2. Cấu trúc Dữ liệu & Phân loại Đề
- [x] Thêm trường `author` vào schema dữ liệu của từng bộ đề thi (Đã thêm đầy đủ cho 20/20 bộ đề).
- [x] Tách biệt các bộ đề có chung giáo viên thành từng bài test độc lập thay vì gộp chung, gắn tag `author` tương ứng (ví dụ: `author: "Nguyễn Quốc Dũng"` - g12t16, g12t17, g12t18).

### 3. Chuẩn hóa & Nâng cấp Chất lượng Nội dung (Chuyên môn Hóa học)
- [x] **Làm sạch đề bài:** Loại bỏ toàn bộ các câu/đoạn kết thừa (lời dặn, footer, chữ ký...) ở cuối các câu hỏi (Đã làm sạch g12t6 - g12t10).
- [x] **Sửa đáp án & Flashcards:** Rà soát lại tính chính xác của đáp án ở các bộ đề và flashcards (Bộ regression suite kiểm chứng 649 câu hỏi và 42 flashcards đạt 100%).
- [x] **Nâng cấp phần giải thích (Bắt buộc chi tiết):**
  - Không để giải thích ngắn/chung chung (như "Bài toán định lượng G12C1").
  - Với câu lý thuyết: Giải thích rõ vì sao chọn đáp án đó và vì sao các đáp án còn lại sai.
  - Với bài tập tính toán: Trình bày đủ 3 bước: (1) Phân tích đề/tóm tắt dữ kiện, (2) Lập PTHH (nếu có), (3) Các bước bấm máy/tính toán số mol và đáp số cụ thể.

### 4. Xử lý Đề thi mới (Từ file ảnh đính kèm)
- [x] Trích xuất đề thi từ ảnh đính kèm của thầy Nguyễn Quốc Dũng (84 câu hỏi qua 3 bộ đề g12t16, g12t17, g12t18 kèm 18 SVG mô phỏng).
- [x] Chuyển đổi thành cấu trúc JSON/dữ liệu chuẩn của dự án với tag `author: "Nguyễn Quốc Dũng"`, kèm lời giải chi tiết và đáp án chính xác theo quy chuẩn ở Mục 3.
