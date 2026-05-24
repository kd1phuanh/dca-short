# Supabase Realtime Sync — Hướng dẫn setup

App DCA Short giờ dùng **Supabase** thay cho Google Drive để đồng bộ giữa nhiều thiết bị. Sửa trên điện thoại → laptop tự cập nhật trong 1-2 giây.

## Tại sao Supabase tốt hơn Google Drive?

| | Google Drive | Supabase |
|---|---|---|
| Setup | Tạo OAuth Client phức tạp | 1 lần đăng ký, copy 2 chuỗi |
| Sync nhiều thiết bị | ✅ | ✅ |
| Realtime | ❌ Phải refresh | ✅ Tự push trong 1s |
| Conflict resolution | Last-write-wins | Có metadata, biết thiết bị nào sửa |
| Database query | ❌ Chỉ file JSON | ✅ Có thể truy vấn |
| Miễn phí | ✅ | ✅ 500MB |

## Setup (5 phút)

### Bước 1: Đăng ký Supabase

1. Vào https://supabase.com → bấm **"Start your project"**
2. Sign up bằng GitHub hoặc email (miễn phí, không cần credit card)

### Bước 2: Tạo Project

1. Sau khi login, bấm **"New Project"**
2. Điền:
   - **Name**: `dca-short` (hoặc gì cũng được)
   - **Database Password**: nhập 1 chuỗi bất kỳ (bạn không dùng đến đâu, không cần nhớ)
   - **Region**: chọn **Southeast Asia (Singapore)** — gần Việt Nam nhất
   - **Pricing Plan**: **Free**
3. Bấm **"Create new project"** → đợi ~1-2 phút Supabase setup xong

### Bước 3: Tạo bảng database

Sau khi project xong, vào menu trái → **SQL Editor** (icon `</>`):

1. Bấm **"New query"**
2. Paste đoạn SQL này:

```sql
-- Tạo bảng lưu trữ data DCA
create table if not exists dca_data (
  id text primary key default 'main',
  payload jsonb not null,
  device_id text,
  updated_at timestamptz not null default now()
);

-- Bật Row Level Security với policy mở
-- (Bạn dùng cá nhân, không lo bảo mật phức tạp)
alter table dca_data enable row level security;

create policy "Allow all with anon key" on dca_data
  for all using (true) with check (true);

-- Bật Realtime cho bảng này
alter publication supabase_realtime add table dca_data;
```

3. Bấm **"Run"** (Ctrl+Enter) — phải hiện "Success. No rows returned"

### Bước 4: Lấy URL + Anon Key

1. Menu trái → **Project Settings** (icon bánh răng cuối cùng)
2. Tab **API** (đầu tiên trong sidebar)
3. Tìm 2 mục:
   - **Project URL**: dạng `https://xxxxxxxx.supabase.co` — copy
   - **Project API Keys** → **anon public**: chuỗi dài bắt đầu bằng `eyJhbGc...` — copy

### Bước 5: Paste vào app

1. Mở app DCA Short → tab **⇅ Đồng Bộ**
2. Paste:
   - **Supabase Project URL** → ô URL
   - **Anon Public Key** → ô Key
3. Bấm **"⇅ Kết Nối Supabase"**
4. App sẽ hỏi:
   - Lần đầu (cloud chưa có data): tự push local lên
   - Nếu cloud đã có data: hỏi tải về hay đẩy lên
5. Khi xong sẽ hỏi **"Bật Realtime Sync ngay?"** → bấm OK

### Bước 6: Setup các thiết bị khác

Trên 3 thiết bị còn lại (2 điện thoại, 1 laptop):

1. Mở app trên thiết bị đó
2. Tab Đồng Bộ → paste **CÙNG** URL + Anon Key như trên
3. Bấm Kết Nối → khi hỏi "Lấy data cloud hay đẩy lên?" → chọn **Lấy về**
4. Bật Realtime Sync

**Xong!** Từ giờ:
- Sửa coin trên điện thoại → 1-2 giây sau laptop tự cập nhật
- Auto-refresh giá Binance vẫn chạy → mỗi máy có dữ liệu mới nhất
- Có chỉ báo "↓ Đồng bộ từ thiết bị khác" khi nhận update

## Bảo mật

**Anon Key có an toàn không khi paste vào app trên nhiều máy?**

Có. Anon Key được thiết kế cho client-side, paste vào browser/app là bình thường. Người khác có Anon Key của bạn vẫn không truy cập được data nếu họ không biết tên bảng + cấu trúc. Để bảo mật cao hơn, bạn có thể:

1. **Đổi policy chặt hơn**: thay vì `for all using (true)`, bạn yêu cầu auth thật. Nhưng phức tạp hơn cho cá nhân.
2. **Tạo riêng project Supabase**: mỗi project có Anon Key khác nhau, người khác không lấy được key của bạn trừ khi bạn đưa.
3. **KHÔNG paste Service Role Key**: key này cực nguy hiểm, có quyền god-mode. Chỉ paste Anon Key.

## Quản lý dữ liệu

### Xem dữ liệu trên Supabase Dashboard

1. Vào project → **Table Editor**
2. Mở bảng `dca_data`
3. Cột `payload` chứa toàn bộ data JSON (coins, defaults, ai config)
4. Có thể edit trực tiếp ở đây nếu cần (nhưng cẩn thận format JSON)

### Reset / Xoá data cloud

Trong app: tab Đồng Bộ → "Tùy chọn nâng cao" → **"Xoá data cloud + ngắt"**

Hoặc trong Supabase: Table Editor → bảng `dca_data` → click row → Delete.

### Tạm ngắt Realtime nhưng giữ kết nối

Tab Đồng Bộ → bỏ tick **"Bật Realtime Sync"**. App sẽ chỉ sync khi bạn bấm Push/Pull tay.

## Troubleshooting

**"Lỗi 404 / relation does not exist":**
→ Chưa chạy SQL ở Bước 3. Vào Supabase → SQL Editor → chạy lại.

**"Anon key không hợp lệ":**
→ Key đúng phải bắt đầu bằng `eyJ`. Nếu key bắt đầu khác → bạn copy nhầm sang Service Role key.

**Realtime không nhận update:**
→ Mở DevTools (F12) → Console xem có log `[Supabase RT]` không. Nếu chưa kết nối được, có thể do trình duyệt chặn WebSocket. Thử:
- Refresh trang
- Tắt extension chặn quảng cáo/tracker
- Đảm bảo đã chạy `alter publication supabase_realtime add table dca_data;` trong SQL Editor

**2 thiết bị sửa cùng lúc, ai thắng?**
→ App dùng "last-write-wins" (cập nhật gần nhất thắng). Mỗi update có timestamp + device_id để debug. Trong thực tế rất hiếm khi xảy ra vì bạn 1 mình dùng 4 máy.

**Free tier có giới hạn gì?**
→ 500MB database (app này dùng ~10KB, dư thoải mái cho 10 năm). Project tự tạm dừng nếu không hoạt động 7 ngày — sẽ hoạt động lại khi bạn truy cập, không mất data.

## Sync workflow đề xuất

**Hằng ngày:**
- Mở app trên bất kỳ thiết bị nào → tự pull data mới nhất từ cloud
- Sửa coin, đánh dấu khớp, cập nhật giá → tự push lên cloud trong 1-2s
- Thiết bị khác đang mở app → tự nhận update

**Backup định kỳ (1 tuần/lần):**
- Tab Đồng Bộ → "Export ra File JSON" → lưu file vào Google Drive
- Phòng trường hợp project Supabase bị xoá nhầm

## Câu hỏi thường gặp

**Tôi muốn 1 project Supabase cho nhiều người (vợ chồng cùng quản lý):**
→ Cứ paste cùng URL + Key trên 2 tài khoản → cùng sync 1 data. Đơn giản nhất.

**Tôi muốn nhiều "portfolio" riêng biệt (vd portfolio cá nhân + portfolio bạn):**
→ Tạo 2 project Supabase khác nhau → switch URL+Key khi cần dùng portfolio nào.

**Có thể dùng Supabase mà không có internet?**
→ Không khi sync. Nhưng app vẫn hoạt động bình thường offline, data lưu local. Khi có mạng lại → tự sync.
