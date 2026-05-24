# DCA SHORT Terminal - PWA

App quản lý DCA Coin Short, có thể chạy như app điện thoại.

## Files trong gói này

```
dca-pwa/
├── index.html          ← App chính
├── manifest.json       ← Cấu hình PWA
├── sw.js              ← Service worker (chạy offline)
└── icons/
    ├── icon-192.png
    ├── icon-512.png
    └── icon-maskable-512.png
```

## Có 3 cách dùng — chọn cách phù hợp với bạn

---

## 🟢 CÁCH 1: Dùng ngay không cần host (Đơn giản nhất)

Mở file `index.html` trực tiếp trên điện thoại Android:

1. Copy thư mục `dca-pwa` vào điện thoại (qua USB, Google Drive, Zalo...)
2. Dùng file manager mở file `index.html` → Chọn Chrome
3. Menu 3 chấm → **"Thêm vào màn hình chính"**
4. Đặt tên "DCA Short" → Thêm

**Hạn chế:** Mở từ file local, không có service worker (offline), không có nút "Install" chính thức. Nhưng vẫn lưu được dữ liệu (localStorage).

---

## 🟢 CÁCH 2: Host miễn phí + Add to Home Screen (PWA đầy đủ)

PWA cần HTTPS để hoạt động đầy đủ. Hosting miễn phí dễ nhất:

### Cách 2a: Netlify Drop (5 phút, không cần đăng ký)

1. Vào https://app.netlify.com/drop
2. Kéo thả thư mục `dca-pwa` vào trang
3. Sẽ có URL kiểu `https://random-name.netlify.app`
4. Mở URL trên điện thoại → Chrome sẽ hiện popup **"Cài đặt ứng dụng"**
5. Bấm cài → có icon trên màn hình chính như app thật, chạy offline

### Cách 2b: Vercel/GitHub Pages

Tương tự, upload folder lên Vercel hoặc GitHub Pages (đều miễn phí HTTPS).

---

## 🔴 CÁCH 3: Build thành file APK (Cài như app Android thật)

Sau khi đã có PWA online (theo Cách 2), dùng **PWABuilder** để tạo APK:

### Bước 1: Đảm bảo PWA đã online
Bạn cần URL HTTPS từ Cách 2 (ví dụ: `https://dca-short.netlify.app`).

### Bước 2: Dùng PWABuilder.com

1. Vào https://www.pwabuilder.com
2. Nhập URL PWA của bạn → "Start"
3. Trang sẽ kiểm tra PWA — tất cả phải hiện ✓ (manifest, service worker, icons)
4. Bấm **"Package For Stores"** → chọn **Android**
5. Settings:
   - **Package ID**: `com.yourname.dcashort` (tự đặt, không trùng app khác)
   - **App name**: DCA Short
   - **Signing key**: Chọn "Generate new" (PWABuilder tự tạo)
   - Còn lại để mặc định
6. Bấm **"Generate Package"** → tải file ZIP

### Bước 3: Cài APK lên điện thoại

ZIP chứa nhiều file, file quan trọng là `app-release-signed.apk`:

1. Copy `app-release-signed.apk` vào điện thoại
2. Settings → Security → Bật **"Cài đặt từ nguồn không xác định"** (cho file manager)
3. Mở file APK → Cài đặt
4. Mở app → dùng như app bình thường

### Bước 4 (tùy chọn): Bỏ qua màn hình "App đang chạy qua PWABuilder"

APK do PWABuilder tạo thực chất là **TWA (Trusted Web Activity)** — wrap WebView quanh PWA online. Cần PWA luôn online để chạy. Nếu mất mạng, app vẫn chạy được nhờ service worker đã cache.

---

## 🟡 CÁCH 4: Build APK hoàn toàn offline với Capacitor (Cho dev)

Phức tạp hơn nhưng app chạy hoàn toàn offline, không cần URL public.

Cần: Node.js, Android Studio đã cài.

```bash
# 1. Tạo Capacitor project
npm create @capacitor/app@latest my-dca-app
cd my-dca-app
npm install @capacitor/android

# 2. Copy file PWA vào thư mục www/ (xóa file mặc định trước)
# Đặt index.html, manifest.json, sw.js, icons/ vào my-dca-app/www/

# 3. Add Android platform
npx cap add android
npx cap sync

# 4. Mở Android Studio
npx cap open android

# 5. Trong Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)
# File APK ở: android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Lưu ý quan trọng

### Lưu trữ dữ liệu trong APK
- Dữ liệu DCA lưu trong **localStorage** của WebView/PWA
- Nếu gỡ app → dữ liệu mất. **Luôn Export JSON backup** trước khi gỡ
- Google Drive Sync vẫn hoạt động bình thường trong APK

### Cập nhật app
- **PWA (Cách 2)**: Tự cập nhật khi bạn refresh, không cần làm gì
- **APK TWA (Cách 3)**: Tự update theo PWA online, vì TWA chỉ là vỏ
- **APK Capacitor (Cách 4)**: Phải build APK mới khi sửa code

### Truy cập API
- Binance API: hoạt động bình thường
- Gemini AI: hoạt động bình thường
- Google Drive: cần config OAuth Client ID cho domain mà PWA host

---

## Tôi khuyên gì?

Bạn dùng cá nhân và muốn cài như app → **Làm theo Cách 2 (Netlify Drop)** trước. Mất 5 phút, có app trên điện thoại với icon đẹp, offline được. Nếu vẫn muốn APK thực sự, làm tiếp **Cách 3 (PWABuilder)**.
