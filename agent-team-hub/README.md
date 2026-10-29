# Agent Team Hub

Hub cộng tác local cho **OpenCode**, **Freebuff** và **Antigravity** qua MCP (Model Context Protocol). Toàn bộ task, message, lịch sử trạng thái và context dùng chung được lưu trong SQLite trên máy hiện tại.

- **Không cần cloud.**
- **Không cần API key.**
- **Không gọi model AI** trong smoke test.
- Server mặc định: `http://127.0.0.1:8931/mcp`.
- Database: `data/team_hub.db`.

## 1. Cấu trúc

```text
agent-team-hub/
├── server/
│   ├── __init__.py
│   ├── main.py          # FastMCP server + 8 tool
│   ├── db.py            # SQLite schema + persistence
│   └── models.py        # domain constants/models
├── scripts/
│   ├── smoke_test.py    # kiểm thử end-to-end, không gọi AI
│   ├── start_hub.sh     # Linux/macOS/WSL
│   └── start_hub.ps1    # Windows PowerShell
├── configs/
│   ├── opencode.mcp.json
│   ├── freebuff.mcp.json
│   └── antigravity.mcp.json
├── data/
│   └── team_hub.db      # tự tạo khi server chạy
├── AGENTS.md
├── README.md
└── requirements.txt
```

## 2. Yêu cầu

- Python **3.11+**
- `fastmcp` (đã bao gồm dependency HTTP/uvicorn cần thiết)
- SQLite (module `sqlite3` có sẵn trong Python)

Kiểm tra:

```bash
python --version
```

## 3. Cài đặt

Từ thư mục `agent-team-hub`:

```bash
python -m pip install -r requirements.txt
```

Nếu dùng `uv`:

```bash
uv pip install -r requirements.txt
```

Chỉ cần cài một lần. Nếu `fastmcp` đã có, lệnh trên sẽ bỏ qua.

## 4. Khởi động Team Hub

### Windows PowerShell

```powershell
cd agent-team-hub
.\scripts\start_hub.ps1
```

Hoặc:

```powershell
python -m server.main
```

### Linux / macOS / WSL

```bash
cd agent-team-hub
chmod +x scripts/start_hub.sh
./scripts/start_hub.sh
```

Hoặc:

```bash
python -m server.main
```

Khi thành công, server lắng nghe tại:

```text
http://127.0.0.1:8931/mcp
```

Giữ cửa sổ này mở trong lúc các agent làm việc. Nếu muốn chạy nền trên Windows:

```powershell
Start-Process python -ArgumentList "-m","server.main" -WorkingDirectory "D:\duong\dan\agent-team-hub"
```

Database và bảng được tự tạo ở lần khởi động đầu tiên. Dữ liệu cũ được giữ nguyên khi khởi động lại.

## 5. Cấu hình các agent

Các file trong `configs/` là **template**. Hãy merge nội dung vào config thật của từng công cụ; không cần chạy cả ba file cùng lúc.

### OpenCode

Merge block `mcp` từ `configs/opencode.mcp.json` vào config OpenCode của bạn, hoặc dùng lệnh:

```bash
opencode mcp add team-hub --url http://127.0.0.1:8931/mcp
```

Nội dung tham khảo:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "team-hub": {
      "type": "remote",
      "url": "http://127.0.0.1:8931/mcp",
      "enabled": true
    }
  }
}
```

Sau khi thêm, khởi động lại OpenCode (hoặc reload MCP) và kiểm tra tool `team-hub`.

### Freebuff

Copy `configs/freebuff.mcp.json` thành `.agents/mcp.json` trong project thật:

```text
<project>/.agents/mcp.json
```

Nội dung:

```json
{
  "mcpServers": {
    "team-hub": {
      "url": "http://127.0.0.1:8931/mcp"
    }
  }
}
```

Nếu project đã có `.agents/mcp.json`, merge key `team-hub` vào `mcpServers`, không ghi đè các server khác.

### Antigravity

Dùng `configs/antigravity.mcp.json` làm template cho `mcp_config.json` của Antigravity:

```json
{
  "mcpServers": {
    "team-hub": {
      "url": "http://127.0.0.1:8931/mcp"
    }
  }
}
```

**Lưu ý:** schema MCP của Antigravity có thể thay đổi theo phiên bản cài đặt. File này là template HTTP remote; hãy kiểm tra lại tên file, vị trí và schema theo phiên bản Antigravity đang dùng. Nếu Antigravity yêu cầu `type` hoặc `transport`, thêm trường tương ứng theo tài liệu của nó.

## 6. Chạy smoke test

Đảm bảo hub đang chạy, sau đó từ thư mục `agent-team-hub`:

```bash
python -m compileall server scripts
python scripts/smoke_test.py
```

Smoke test sẽ:

1. Kết nối tới hub (hoặc tự khởi động server tạm nếu port chưa mở).
2. Kiểm tra đủ 8 MCP tool.
3. Tạo task cho Freebuff.
4. Gửi message `update`.
5. Đọc lại message.
6. Chuyển task sang `in_progress`.
7. Hoàn thành task với evidence `smoke_test_passed`.
8. Xác nhận `get_task` trả `completed`.
9. Kiểm tra `list_tasks`, `broadcast_context` và các lỗi/transition quan trọng.

Kết quả cuối phải là:

```text
SMOKE TEST: PASS
```

Nếu có bất kỳ bước nào fail, script in `SMOKE TEST: FAIL` và trả exit code khác 0. Không dùng kết quả này để báo hoàn thành.

## 7. Đưa `AGENTS.md` vào project thật

Copy `AGENTS.md` vào thư mục gốc của project mà các agent cùng làm việc:

```bash
cp AGENTS.md /duong/dan/project/AGENTS.md
```

Nếu project đã có `AGENTS.md`, hãy merge phần vai trò, workflow và safety rules vào file hiện có thay vì ghi đè. Đảm bảo cả ba agent đọc cùng một phiên bản.

## 8. Danh sách MCP tool

| Tool | Mục đích |
|---|---|
| `create_task` | Tạo task mới, sinh `TASK-0001`, ... |
| `get_task` | Lấy task + message + lịch sử trạng thái |
| `list_tasks` | Lọc task theo status/assignee, ưu tiên urgent |
| `send_message` | Gửi question/update/result/blocker/review_request/approval/handoff |
| `get_messages` | Đọc message, hỗ trợ `since` và `limit` |
| `update_status` | Đổi trạng thái, ghi audit history |
| `complete_task` | Hoàn thành task, bắt buộc có evidence |
| `broadcast_context` | Lưu context chung, sinh `CTX-0001`, ... |

### Quy tắc quan trọng

- `blocker` tự chuyển task sang `blocked`.
- `review_request` tự chuyển task sang `review`.
- `complete_task` từ chối nếu `evidence` rỗng.
- Không thể đưa task từ `completed` về `open` nếu không có `reason`.
- `list_tasks` mặc định chỉ trả task chưa hoàn thành; dùng `include_completed=true` để thấy cả completed/failed.

## 9. Xử lý lỗi phổ biến

### Port 8931 bị chiếm

Kiểm tra process đang giữ port:

```powershell
Get-NetTCPConnection -LocalPort 8931 -State Listen
Get-Process -Id <OwningProcess>
```

Linux/macOS:

```bash
lsof -i :8931
```

Cách xử lý:

- Nếu đó là Team Hub cũ, dùng nó hoặc dừng process rồi khởi động lại.
- Nếu là process khác, dừng process đó hoặc đổi port bằng biến môi trường:

```powershell
$env:TEAM_HUB_PORT="8932"
python -m server.main
```

Khi đổi port, cập nhật URL trong cả ba config và đặt `TEAM_HUB_URL` khi chạy smoke test:

```powershell
$env:TEAM_HUB_URL="http://127.0.0.1:8932/mcp"
python scripts/smoke_test.py
```

### MCP không kết nối được

1. Kiểm tra server còn chạy: mở terminal khác và chạy `python scripts/smoke_test.py`.
2. Kiểm tra URL đúng `http://127.0.0.1:8931/mcp` (có `/mcp`).
3. Restart lại agent sau khi sửa config.
4. Kiểm tra log server ở terminal đang chạy hub.
5. Nếu dùng firewall/proxy, đảm bảo `127.0.0.1` được phép.
6. Không thêm `/` thừa hoặc dùng `https` cho local hub.

### SQLite database bị lock

Hub dùng WAL và `busy_timeout=5000`, nhưng nếu process khác đang giữ transaction lâu:

```powershell
Get-Process python
```

- Dừng process Python không cần thiết.
- Không mở DB bằng công cụ GUI ở chế độ exclusive trong lúc smoke test.
- Khởi động lại hub.
- Nếu file `data/team_hub.db-wal`/`-shm` còn sót sau khi tắt đột ngột, khởi động lại hub để SQLite tự phục hồi; không xoá DB nếu còn dữ liệu cần giữ.

### Agent không thấy tool

- Kiểm tra server đang chạy và port mở.
- Kiểm tra config đúng loại: OpenCode dùng `mcp`, Freebuff/Antigravity dùng `mcpServers` (theo template).
- Restart agent/extension sau khi sửa config.
- Chạy `python scripts/smoke_test.py` để chắc hub trả đủ 8 tool.
- Nếu agent dùng config global, đảm bảo không bị config project ghi đè.
- Với OpenCode, thử `opencode mcp add team-hub --url http://127.0.0.1:8931/mcp`.

## 10. Ghi chú vận hành

- DB là local và không được commit nếu chứa dữ liệu làm việc thật.
- Không lưu secret/token/nội dung `.env` vào task, message hoặc context.
- Hub không có authentication vì chỉ lắng nghe trên loopback. Không đổi host thành `0.0.0.0` khi chưa có lớp bảo vệ.
- Nếu cần nhiều máy cùng dùng, hiện tại phải tự thêm lớp proxy/auth; phạm vi bản này là local.
