# AGENTS.md — Giao thức cộng tác đa agent

Tài liệu này định nghĩa cách **OpenCode**, **Freebuff** và **Antigravity** cùng làm việc qua MCP **Team Hub** tại `http://127.0.0.1:8931/mcp`.

Team Hub là nguồn sự thật duy nhất cho task, trạng thái, tin nhắn và bằng chứng. Không agent nào được tự nhận là đã giao việc, đã review hoặc đã hoàn thành nếu chưa có bản ghi tương ứng trong hub.

## 1. Vai trò

### OpenCode — Orchestrator / Planner / Implementer chính

- Nhận yêu cầu từ user, làm rõ phạm vi và tiêu chí chấp nhận.
- Tạo task bằng `create_task`, ghi rõ objective, acceptance criteria, file liên quan, ràng buộc và priority.
- Phân rã công việc, giao task cho Freebuff hoặc Antigravity.
- Là người tổng hợp kết quả cuối cùng và báo lại user.
- Chịu trách nhiệm điều phối thứ tự công việc và tránh xung đột file.
- Với thay đổi quan trọng, yêu cầu Freebuff review trước khi đóng task.

### Freebuff — Researcher / Risk Analyst / Code Reviewer

- Nghiên cứu bối cảnh, đọc tài liệu và code liên quan.
- Phân tích rủi ro, phương án thay thế, tác động và edge case.
- Review code/diff, kiểm tra tiêu chí chấp nhận, chỉ ra lỗi hoặc thiếu bằng chứng.
- Gửi kết quả bằng `send_message` với `message_type: "result"` hoặc `"review_request"`.
- Không tự sửa file đang do agent khác sở hữu nếu chưa có handoff rõ ràng.

### Antigravity — Builder / Tester / Debugger / Deployment Preparer

- Triển khai thay đổi đã được giao, chạy test, tái hiện và sửa lỗi.
- Ghi lại lệnh đã chạy, test đã pass/fail, log và đường dẫn diff.
- Chuẩn bị các bước deploy nhưng **không deploy production** nếu chưa có xác nhận của user.
- Báo blocker ngay bằng `message_type: "blocker"`.
- Hoàn thành task bằng `complete_task` kèm evidence thực tế.

## 2. Vòng đời task

```text
open -> in_progress -> review -> completed
  |         |             |
  +------> blocked <-------+
  |
  +------> failed
```

- `open`: đã tạo, chưa bắt đầu.
- `in_progress`: đang được thực hiện.
- `blocked`: không thể tiếp tục; phải nêu rõ đang chờ gì.
- `review`: đã có kết quả, đang chờ review/approval.
- `completed`: đã xong và có evidence.
- `failed`: đã thử nhưng không đạt; phải ghi lý do.

## 3. Workflow chuẩn

1. **OpenCode nhận yêu cầu từ user.**
2. **OpenCode tạo task** qua `create_task`:
   - `assigned_to` là agent chịu trách nhiệm chính.
   - `objective` phải là kết quả quan sát được, không phải mô tả chung.
   - `acceptance_criteria` phải kiểm tra được.
   - `context_files` liệt kê file cần đọc.
   - `constraints` ghi rõ điều cấm hoặc giới hạn.
3. **OpenCode giao task** cho Freebuff hoặc Antigravity. Nếu cần handoff, gửi `send_message` với `message_type: "handoff"`.
4. **Agent được giao cập nhật**:
   - Bắt đầu: `update_status(status="in_progress", reason="...")`.
   - Tiến độ: `send_message(message_type="update", ...)`.
   - Câu hỏi: `send_message(message_type="question", ...)`.
   - Kẹt: `send_message(message_type="blocker", ...)`; hub tự chuyển task sang `blocked`.
   - Cần review: `send_message(message_type="review_request", ...)`; hub tự chuyển sang `review`.
5. **Khi có kết quả**, agent gọi `complete_task` với:
   - `summary`: đã làm gì.
   - `evidence`: ít nhất một bằng chứng cụ thể.
6. **OpenCode đọc kết quả** bằng `get_task`/`get_messages`, kiểm tra acceptance criteria, tổng hợp và báo user.
7. **Với thay đổi quan trọng**, OpenCode yêu cầu Freebuff review trước khi hoàn tất. Review xong, Freebuff gửi `approval` hoặc `review_request` kèm nhận xét.

## 4. Quy ước giao tiếp

- Mỗi message phải trả lời được: **ai gửi, cho task nào, loại gì, nội dung gì**.
- Dùng `message_type` đúng mục đích:
  - `question`: cần làm rõ.
  - `update`: tiến độ.
  - `result`: kết quả trung gian/cuối.
  - `blocker`: đang kẹt.
  - `review_request`: xin review.
  - `approval`: đã review xong/chấp thuận.
  - `handoff`: chuyển quyền sở hữu công việc.
- Không gộp nhiều task vào một message nếu có thể tách.
- Khi trả lời câu hỏi, trích lại `message_id` hoặc nội dung ngắn để dễ theo dõi.
- `broadcast_context` chỉ dùng cho thông tin chung, không thay thế message của task.

## 5. Quy tắc file và xung đột

- **Không cho hai agent sửa cùng một file cùng lúc.**
- Trước khi sửa, agent phải kiểm tra `context_files` và message gần nhất.
- Nếu cần sửa file đang thuộc agent khác, gửi `handoff` và chờ xác nhận.
- Một task chỉ nên có một **file owner** tại một thời điểm. Các file khác trong cùng task có thể do agent khác đọc song song.
- Trước khi kết thúc, ghi rõ file đã thay đổi trong `summary` hoặc `evidence`.

## 6. Evidence — điều kiện bắt buộc để hoàn thành

`complete_task` sẽ từ chối nếu `evidence` rỗng. Evidence hợp lệ gồm:

- Tên test đã pass, ví dụ `python -m compileall server scripts`.
- Đường dẫn file/diff đã kiểm tra.
- Lệnh kiểm chứng và kết quả tóm tắt.
- Log hoặc output của smoke test.
- Xác nhận review từ Freebuff (`approval` message ID).
- Đường dẫn commit/PR nếu có.

Không dùng các câu chung chung như “đã xong”, “chạy ổn” làm evidence duy nhất.

## 7. Safety rules

- **Không deploy production** nếu chưa có xác nhận rõ ràng của user.
- **Không push Git** nếu user không yêu cầu rõ ràng.
- **Không tiết lộ secret**, token, mật khẩu, nội dung `.env` hoặc dữ liệu nhạy cảm.
- **Không cho hai agent sửa cùng một file cùng lúc.**
- **Mọi task hoàn thành phải có evidence.**
- **Nếu MCP Team Hub không chạy**, agent phải báo lỗi rõ ràng và không được giả vờ đã giao việc. Kiểm tra lại URL `http://127.0.0.1:8931/mcp`, tiến trình hub và log.
- Không tự tạo task “đã hoàn thành” để che giấu việc chưa làm.
- Không xoá task/message của agent khác; chỉ thêm bản ghi mới.
- Không sửa trực tiếp database khi có thể dùng tool.

## 8. Khi bắt đầu một phiên

Agent nên:

1. Gọi `list_tasks(assigned_to="<tên agent>")` để xem việc đang mở.
2. Gọi `get_task` cho task được giao để đọc message và lịch sử.
3. Gửi `update` ngắn xác nhận đã nhận việc.
4. Chỉ bắt đầu sửa file sau khi xác định không có xung đột.

## 9. Khi kết thúc một phiên

- Cập nhật trạng thái task.
- Ghi lại file đã thay đổi, test đã chạy, việc còn lại.
- Nếu bàn giao, gửi `handoff` nêu rõ trạng thái hiện tại và bước tiếp theo.
- Không để task ở `in_progress` mà không có message giải thích.
