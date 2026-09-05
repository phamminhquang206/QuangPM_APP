# FlowHub - All in One Productivity App

Tài liệu đặc tả yêu cầu và các tính năng hiện có của dự án **FlowHub** (phiên bản v1.3).

---

## 1. Countdown / Pomodoro Timer (Bộ đếm thời gian tập trung)

* **REQ 1.1 - Lựa chọn chế độ làm việc**:
  * Tùy chọn 30 phút/rep: 25 phút làm việc + 5 phút nghỉ ngơi.
  * Tùy chọn 50 phút/rep: 40 phút làm việc + 10 phút nghỉ ngơi.
* **REQ 1.2 - Tùy chỉnh số Rep & Vòng lặp tự động**:
  * Cho phép tăng/giảm số rep linh hoạt (mặc định 3 rep).
  * Tự động chuyển tiếp lần lượt qua các phiên làm việc và nghỉ ngơi cho đến khi hoàn thành toàn bộ số rep.
* **REQ 1.3 - Vòng tiến trình trực quan & Điều khiển**:
  * Hiển thị vòng tròn đếm ngược SVG mượt mà với màu sắc thay đổi theo trạng thái (tím khi làm việc, xanh lục khi nghỉ ngơi).
  * Các nút điều khiển: Bắt đầu (Start), Tạm dừng (Pause), Tiếp tục (Resume), Đặt lại (Reset).
* **REQ 1.4 - Âm thanh thông báo**:
  * Phát âm thanh beep (Web Audio API) khi kết thúc mỗi phiên làm việc/nghỉ ngơi và khi hoàn thành toàn bộ chu kỳ.
* **REQ 1.5 - Lưu trữ & Hiển thị lịch sử**:
  * Tự động lưu lịch sử các phiên Pomodoro đã hoàn thành theo ngày vào Firebase Firestore.
  * Hiển thị danh sách lịch sử trực quan (ngày tháng, chế độ, số rep, thời gian hoàn thành).

---

## 2. To-do List (Quản lý công việc)

* **REQ 2.1 - Thao tác cơ bản**:
  * Thêm công việc mới nhanh chóng bằng phím Enter hoặc nút "+ Thêm".
  * Đánh dấu hoàn thành / chưa hoàn thành (custom checkbox, hiệu ứng gạch ngang text).
  * Xóa công việc với nút xóa tiện lợi.
* **REQ 2.2 - Bộ lọc công việc (Filter)**:
  * Lọc theo trạng thái: Tất cả (All) - Đang làm (In-progress) - Hoàn thành (Completed).
  * Hiển thị thanh thống kê tiến độ: số việc đang làm, số việc hoàn thành và tổng số việc.
* **REQ 2.3 - Công việc con (Subtasks)**:
  * Tạo danh sách các mục công việc con cho từng task cha.
  * Đánh dấu hoàn thành hoặc xóa từng việc con độc lập.
  * Thanh tiến độ mini hiển thị tỷ lệ hoàn thành các việc con.
* **REQ 2.4 - Quản lý thời hạn chi tiết (Start Date & End Date kèm Giờ/Phút)**:
  * Thiết lập thời hạn chi tiết theo ngày, giờ, phút (`datetime-local`) cho từng task.
  * Tùy chọn linh hoạt: Có thể chỉ đặt ngày bắt đầu (`startDate`), chỉ đặt ngày kết thúc (`endDate`), hoặc đặt cả hai.
  * Tự động gắn tag trạng thái: "Hôm nay" (Today) hoặc "Quá hạn" (Overdue) theo thời gian thực.
  * Hỗ trợ xóa hạn ngày giờ khi không cần thiết.
* **REQ 2.5 - Hộp thoại xác nhận (Confirm Modal)**:
  * Hiển thị modal xác nhận trước khi xóa task chính hoặc xóa việc con nhằm tránh thao tác nhầm.
* **REQ 2.6 - Đồng bộ dữ liệu**:
  * Đồng bộ thời gian thực (Real-time Firestore) theo từng tài khoản cá nhân, hỗ trợ offline persistence.
* **REQ 2.7 - Nhắc nhở công việc (Task Reminder) & Cơ chế 3 tầng thông báo**:
  * Tùy chọn bật nhắc nhở với tần suất: Một lần, Hàng ngày, Hàng tuần, Hàng tháng.
  * Cơ chế 3 tầng thông báo:
    1. Thông báo trước 5 phút: Nhắc nhở còn 5 phút nữa đến giờ hẹn.
    2. Thông báo đúng giờ hẹn (kèm Popup Modal cảnh báo, nút "✓ Hoàn thành task", "⏰ Báo lại 5p" và "Đã hiểu").
    3. Thông báo trễ sau 5 phút: Nếu task chưa hoàn thành và người dùng chưa tắt nhắc, sau 5 phút sẽ phát thêm thông báo trễ.
  * Chuỗi lặp có giới hạn ngày kết thúc:
    * Nếu đặt cả `startDate` và `endDate` với tần suất lặp (ví dụ: Hàng ngày từ 05/09 đến 20/09): Mỗi ngày đúng giờ hẹn sẽ kích hoạt chu trình 3 tầng. Sau khi hoàn tất ngày cuối cùng (`endDate`), hệ thống tự động ngừng lặp.
  * Tự động dừng nhắc nhở ngay lập tức khi task được tích hoàn thành (✓).
  * Hỗ trợ thông báo thiết bị (Web Notification API, Service Worker Push/PWA, popup modal và chuông báo).

---

## 3. Quick Notes (Ghi chú nhanh)

* **REQ 3.1 - Giao diện ghi chú dạng lưới (Google Keep Style)**:
  * Bố cục thẻ ghi chú (cards) responsive dạng masonry/grid hiện đại, đơn giản, trực quan.
* **REQ 3.2 - Tạo & Chỉnh sửa ghi chú**:
  * Nút "+ Ghi chú mới" mở modal soạn thảo đè lên màn hình (tiêu đề, nội dung ghi chú).
  * Cho phép bấm vào bất kỳ ghi chú nào để xem lại và chỉnh sửa nội dung.
* **REQ 3.3 - Bảng màu sắc phân loại (Color Picker)**:
  * Lựa chọn màu nền cho ghi chú: Mặc định, Tím, Xanh lá, Xanh dương, Vàng, Hồng, Cam.
* **REQ 3.4 - Chọn nhiều & Xóa hàng loạt (Bulk Selection)**:
  * Checkbox chọn ở góc mỗi ghi chú.
  * Khi có ghi chú được chọn, xuất hiện nút "🗑 Xóa đã chọn" màu đỏ nổi bật.
* **REQ 3.5 - Xác nhận xóa an toàn**:
  * Luôn hiển thị cửa sổ xác nhận trước khi xóa một hoặc nhiều ghi chú đã chọn.

---

## 4. Prices (Theo dõi giá vàng & Hàng hóa)

* **REQ 4.1 - Giá vàng trong nước (DOJI)**:
  * Cập nhật và hiển thị giá Vàng miếng SJC và Nhẫn tròn Hưng Thịnh Vượng.
  * Hiển thị đầy đủ cả giá Mua vào và giá Bán ra.
* **REQ 4.2 - Hàng hóa toàn cầu (Global Commodities)**:
  * Theo dõi giá Vàng thế giới (World Gold - USD/oz) và Dầu thô WTI (Crude Oil - USD/thùng).
  * Hiển thị xu hướng biến động tăng/giảm (▲/▼) kèm tỷ lệ phần trăm và màu sắc trực quan (xanh lá/đỏ).
* **REQ 4.3 - Cập nhật dữ liệu & Thời gian**:
  * Nút "🔄 Làm mới" (Refresh) với hiệu ứng xoay loading để cập nhật dữ liệu mới nhất bất cứ lúc nào.
  * Hiển thị thời gian cập nhật lần cuối (Last updated timestamp).

---

## 5. Authentication & Quản lý người dùng

* **REQ 5.1 - Đăng nhập đa nền tảng**:
  * Đăng nhập bằng tài khoản Google (Google OAuth).
  * Đăng nhập bằng tài khoản GitHub (GitHub OAuth).
* **REQ 5.2 - Phân quyền dữ liệu cá nhân**:
  * Dữ liệu Pomodoro, To-do và Notes được lưu biệt lập theo từng `userId` trên Firestore (`users/{uid}/...`).
* **REQ 5.3 - Thanh người dùng (User Bar)**:
  * Hiển thị ảnh đại diện (avatar) và tên người dùng sau khi đăng nhập.
  * Nút "Đăng xuất" (Logout) với xác nhận an toàn.

---

## 6. PWA & Cài đặt App Di động (Progressive Web App)

* **REQ 6.1 - Khả năng cài đặt như ứng dụng native (Installable PWA)**:
  * Hỗ trợ cài đặt trực tiếp vào màn hình chính (Home Screen) trên Android, iOS (iPhone/iPad) và Desktop (Chrome/Edge/macOS) mà không cần qua kho ứng dụng.
  * Tự động chạy toàn màn hình, không thanh URL, khởi động nhanh và mượt mà.
* **REQ 6.2 - Vị trí các nút Cài app**:
  * Nút "📲 Cài app" cố định trên thanh Header actions của ứng dụng.
  * Nút "📲 Cài đặt ứng dụng vào điện thoại" ngay trên thẻ Đăng nhập (Login Card).
  * Thanh banner nổi thông minh (Floating Install Banner) ở góc dưới với nút "Cài đặt" và nút đóng "✕" (ghi nhớ trong session).
* **REQ 6.3 - Hỗ trợ chuyên biệt cho iOS (iPhone/iPad)**:
  * Modal hướng dẫn cài đặt trực quan 3 bước dành riêng cho trình duyệt Safari trên iOS (Chia sẻ 📤 -> Thêm vào MH chính ➕ -> Thêm).
* **REQ 6.4 - Nhận diện trạng thái đã cài đặt**:
  * Tự động phát hiện khi ứng dụng đang chạy ở chế độ Standalone (`display-mode: standalone`) để ẩn các lời nhắc cài đặt không cần thiết.
* **REQ 6.5 - Hoạt động Offline**:
  * Service Worker (`sw.js`) cache toàn bộ tài nguyên tĩnh (HTML, CSS, JS, Fonts, Icons) và hỗ trợ offline cache của Firestore.

---

## 7. General Rules & UI/UX (Thiết kế & Trải nghiệm)

* **GEN 1 - Đa ngôn ngữ (i18n)**:
  * Nút chuyển đổi ngôn ngữ linh hoạt giữa Tiếng Việt (🇻🇳 VI) và Tiếng Anh (🇬🇧 EN).
  * Lưu cấu hình ngôn ngữ vào `localStorage` và tự động cập nhật toàn bộ giao diện (tiêu đề, placeholder, modal, banner, thông báo).
* **GEN 2 - Nút Tải lại nhanh (Reload/F5)**:
  * Nút bấm 🔄 trên Header hỗ trợ làm mới app tức thì với hiệu ứng xoay mượt mà.
* **GEN 3 - Thẩm mỹ Glassmorphism & Micro-animations**:
  * Nền tối sang trọng kết hợp các quả cầu chuyển động gradient mờ ảo (animated bg orbs).
  * Các thẻ (cards) hiệu ứng kính mờ `backdrop-filter: blur()`, viền tím neon phát sáng khi tương tác.
  * Hiệu ứng chuyển tab mượt mà không tải lại trang.
* **GEN 4 - Tương thích mọi thiết bị (Responsive Design)**:
  * Tối ưu hoàn hảo giao diện từ màn hình điện thoại nhỏ (360px - 480px), máy tính bảng đến màn hình máy tính lớn.
