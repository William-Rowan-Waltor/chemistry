Bạn đang đóng vai trò là Senior Frontend Developer kiêm Chuyên gia biên soạn nội dung Hóa học THPT. Hãy xử lý các vấn đề tồn đọng trong dự án theo danh sách nhiệm vụ chi tiết dưới đây:

### 1. Sửa lỗi Giao diện & Trải nghiệm (UI/UX)
- [ ] **Mục Lý thuyết nhanh (Quick Theory modal/popup):** Sửa triệt để lỗi tràn/vỡ text và căn chỉnh lại component hiển thị ngay tại chỗ.
- [ ] **Dạng câu hỏi Đúng/Sai:** Gom toàn bộ nội dung (câu hỏi dẫn + 4 mệnh đề con a, b, c, d) vào cùng 1 trang/màn hình duy nhất, tránh ngắt trang rời rạc.
- [ ] **Dạng Trả lời ngắn:** Thiết kế lại (style) ô nhập số chuyên biệt: căn giữa số, hỗ trợ hiển thị đơn vị rõ ràng, xử lý trường hợp số thập phân/phân số.

### 2. Cấu trúc Dữ liệu & Phân loại Đề
- [ ] Thêm trường `author` vào schema dữ liệu của từng bộ đề thi.
- [ ] Tách biệt các bộ đề có chung giáo viên thành từng bài test độc lập thay vì gộp chung, gắn tag `author` tương ứng (ví dụ: `author: "Nguyễn Quốc Dũng"`).

### 3. Chuẩn hóa & Nâng cấp Chất lượng Nội dung (Chuyên môn Hóa học)
- [ ] **Làm sạch đề bài:** Loại bỏ toàn bộ các câu/đoạn kết thừa (lời dặn, footer, chữ ký...) ở cuối các câu hỏi.
- [ ] **Sửa đáp án & Flashcards:** Rà soát lại tính chính xác của đáp án ở các bộ đề và flashcards.
- [ ] **Nâng cấp phần giải thích (Bắt buộc chi tiết):**
  - Không để giải thích ngắn/chung chung (như "Bài toán định lượng G12C1").
  - Với câu lý thuyết: Giải thích rõ vì sao chọn đáp án đó và vì sao các đáp án còn lại sai.
  - Với bài tập tính toán: Trình bày đủ 3 bước: (1) Phân tích đề/tóm tắt dữ kiện, (2) Lập PTHH (nếu có), (3) Các bước bấm máy/tính toán số mol và đáp số cụ thể.

### 4. Xử lý Đề thi mới (Từ file ảnh đính kèm)
- [ ] Trích xuất đề thi từ ảnh đính kèm của thầy Nguyễn Quốc Dũng.
- [ ] Chuyển đổi thành cấu trúc JSON/dữ liệu chuẩn của dự án với tag `author: "Nguyễn Quốc Dũng"`, kèm lời giải chi tiết và đáp án chính xác theo quy chuẩn ở Mục 3.


*** Khuyến khích sử dụng các skills đã cung cấp sẵn