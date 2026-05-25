# Host DCA Short App lên Vercel — Hướng dẫn từng bước

Có URL kiểu `https://dca-short.vercel.app` truy cập từ mọi thiết bị, miễn phí trọn đời.

## Cách 1: Vercel CLI (5 phút — nhanh nhất, không cần đăng ký GitHub)

### Bước 1: Cài Node.js (nếu chưa có)
- Tải: https://nodejs.org/ — chọn bản LTS
- Cài xong mở Terminal/CMD gõ `node -v` để kiểm tra

### Bước 2: Cài Vercel CLI
Mở Terminal/CMD/PowerShell:
```bash
npm install -g vercel
```

### Bước 3: Deploy
Giải nén file `dca-pwa.zip` ra thư mục `dca-pwa`. Vào thư mục đó:
```bash
cd đường/dẫn/đến/dca-pwa
vercel
```

Lần đầu sẽ hỏi:
- Login: chọn `Continue with Email` → nhập email → check email click link
- `Set up and deploy "dca-pwa"?` → **Y**
- `Which scope?` → chọn tài khoản của bạn
- `Link to existing project?` → **N**
- `What's your project's name?` → gõ `dca-short` (hoặc tên gì tùy)
- `In which directory is your code located?` → Enter (mặc định `./`)
- Sau đó nó tự build → ra URL kiểu `https://dca-short-xxx.vercel.app`

### Bước 4: Deploy production (URL ngắn gọn)
```bash
vercel --prod
```
URL sẽ thành `https://dca-short.vercel.app` (hoặc tên bạn đặt).

### Bước 5 (sau này khi sửa code)
Mỗi lần sửa file → chỉ cần chạy lại:
```bash
vercel --prod
```
Trong 5 giây site online được cập nhật.

---

## Cách 2: Vercel Web (Kéo thả qua GitHub — không cần Terminal)

### Bước 1: Tạo tài khoản Vercel
- Vào https://vercel.com → Sign Up
- Đăng nhập bằng GitHub (cần tài khoản GitHub miễn phí ở https://github.com)

### Bước 2: Tạo GitHub repo cho dca-pwa

**Cách 2A: Qua web GitHub (dễ nhất)**
1. Vào https://github.com/new
2. Repository name: `dca-short`
3. Public hoặc Private đều được (Private vẫn deploy được)
4. Tick "Add a README file" → Create repository
5. Trong repo mới: nút **"Add file"** → **"Upload files"**
6. Giải nén `dca-pwa.zip`, kéo TẤT CẢ file trong thư mục `dca-pwa` (không phải cả thư mục) vào trang
7. Commit changes

### Bước 3: Import vào Vercel
1. Quay lại Vercel Dashboard → **"Add New..."** → **"Project"**
2. Tìm repo `dca-short` → **Import**
3. Để mặc định tất cả → **Deploy**
4. Đợi ~30s → có URL

### Bước 4: Sau này khi sửa code
- Sửa file trên GitHub web (hoặc dùng GitHub Desktop)
- Mỗi commit → Vercel tự deploy lại trong 30 giây

---

## Cách 3: Netlify Drop (Đơn giản nhất, không setup gì)

Nếu bạn không muốn dùng Vercel/Git:

1. Giải nén `dca-pwa.zip` ra thư mục
2. Vào https://app.netlify.com/drop
3. Kéo thả thư mục `dca-pwa` (không phải file zip) vào ô lớn giữa trang
4. ~10 giây sau có URL `https://random-name.netlify.app`
5. Tạo tài khoản (email) để claim URL → đổi thành tên dễ nhớ trong Settings

**Nhược điểm:** Mỗi lần sửa code phải kéo thả lại từ đầu. Vercel/Git update tự động hơn.

---

## Sau khi đã có URL online

### Mở trên điện thoại Android
1. Mở URL bằng Chrome
2. Chrome sẽ tự hiện popup **"Cài đặt ứng dụng"** ở dưới cùng — bấm để cài
3. Hoặc menu 3 chấm → **"Cài đặt ứng dụng"** / **"Thêm vào Màn hình chính"**
4. Icon "DCA Short" xuất hiện trên màn hình chính
5. Mở từ icon → chạy fullscreen như app thật

### Mở trên iPhone (Safari)
1. Mở URL bằng Safari (KHÔNG dùng Chrome trên iPhone)
2. Nút Share (hình vuông + mũi tên) → **"Thêm vào Màn hình chính"**

### Bookmark đơn giản
Không cài app cũng được — chỉ cần bookmark URL trong trình duyệt.

---

## Tip quan trọng

### Đặt URL ngắn dễ nhớ
- Vercel: vào Project Settings → Domains → Add domain → bạn được URL dạng `dcashort.vercel.app`
- Netlify: Site Settings → Change site name → đổi thành tên bạn muốn

### Dữ liệu lưu ở đâu?
- localStorage **trên trình duyệt mỗi thiết bị** (không sync mặc định)
- Muốn sync nhiều thiết bị: dùng tab **Đồng Bộ** → kết nối Google Drive (xem hướng dẫn trong app)
- Hoặc Export JSON → gửi qua Zalo/Telegram cho chính mình → Import ở thiết bị khác

### Auto-refresh giá Binance
App đã có tính năng auto-refresh 1 phút/lần. Bật nút **"⊙ AUTO 1P"** ở góc trên Portfolio.
- Khi bật: nút thành xanh có chấm nhấp nháy, hiện đếm ngược "tick sau Xs"
- App lấy giá tất cả coin từ Binance, cập nhật P&L, vùng cảnh báo
- Trạng thái bật/tắt được nhớ giữa các lần mở app

### Tiết kiệm pin trên điện thoại
- Auto-refresh chỉ chạy khi tab/app đang mở
- Khóa màn hình → trình duyệt suspend → auto-refresh dừng (tự động)
- Mở lại app → auto-refresh chạy tiếp

---

## Tôi khuyên bạn dùng cách nào?

**Đơn giản nhất + tự update:** Cách 1 (Vercel CLI) — Mất 5 phút lần đầu, sau này 1 lệnh là xong.

**Không thích Terminal:** Cách 3 (Netlify Drop) — Kéo thả là xong, nhưng update tay.

**Pro hơn, muốn version control:** Cách 2 (GitHub + Vercel) — Setup hơi lâu nhưng có lịch sử thay đổi.
