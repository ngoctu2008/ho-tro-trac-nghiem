# Gemini Quiz Helper 🤖

Một tiện ích mở rộng siêu nhẹ dành cho trình duyệt Chrome/Edge (Manifest V3) giúp bạn giải đáp nhanh chóng các câu hỏi trắc nghiệm, tự luận trên web bằng sức mạnh của **Google Gemini 1.5 Flash API**.

## 🌟 Tính năng nổi bật
- **Siêu nhẹ & Nhanh chóng**: Sử dụng hoàn toàn Vanilla JS (JavaScript thuần), không dùng thư viện ngoài.
- **Dễ sử dụng**: Chỉ cần bôi đen câu hỏi (> 15 ký tự), bấm vào biểu tượng Robot 🤖 nổi lên và nhận câu trả lời cùng giải thích chi tiết.
- **An toàn & Riêng tư**: Gọi API qua Service Worker (`background.js`), tự động khắc phục lỗi CORS và bảo mật mã nguồn. Khóa API (API Key) được lưu an toàn trực tiếp trên bộ nhớ máy cục bộ (`chrome.storage.local`).
- **Giao diện hiện đại**: Popup (Khung nổi) kết quả được thiết kế hiện đại, sạch sẽ và tích hợp trình chuyển đổi Markdown cơ bản.

## 📥 Hướng dẫn Cài đặt

Vì extension này đang ở dạng mã nguồn mở chưa được đưa lên Chrome Web Store, bạn sẽ cài đặt thông qua chế độ dành cho Nhà phát triển (Developer Mode).

1. **Tải mã nguồn**:
   - Tải hoặc giải nén toàn bộ thư mục gốc (nơi chứa file `manifest.json`) về máy tính của bạn.
2. **Mở trang Tiện ích (Extensions)**:
   - Trên Google Chrome hoặc Microsoft Edge, truy cập vào đường dẫn: `chrome://extensions/` (hoặc `edge://extensions/`).
3. **Bật chế độ Nhà phát triển**:
   - Nhìn lên góc trên bên phải màn hình, bật công tắc **"Chế độ dành cho nhà phát triển"** (Developer mode).
4. **Tải Tiện ích đã giải nén**:
   - Nhấn vào nút **"Tải tiện ích đã giải nén"** (Load unpacked) ở góc trên bên trái.
   - Chọn **thư mục gốc mà bạn vừa tải về (ví dụ: jules_session_...)**, không chọn vào các thư mục con sâu hơn. Miễn là trình duyệt thấy được file `manifest.json` bên trong là sẽ cài được thành công.
5. Tiện ích sẽ xuất hiện trong danh sách. Hãy ghim nó lên thanh công cụ (Toolbar) nếu cần thiết.

## ⚙️ Hướng dẫn Cấu hình API Key

Để extension hoạt động, nó cần một chìa khóa (API Key) để nói chuyện với Google Gemini.

1. Truy cập vào trang [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Đăng nhập bằng tài khoản Google của bạn và tạo một **API Key** mới (Hoàn toàn miễn phí).
3. Copy đoạn mã API Key vừa tạo.
4. Trên trình duyệt, bấm chuột trái vào biểu tượng của **Gemini Quiz Helper** trên thanh công cụ để mở trang **Cài đặt**.
5. Dán API Key vào ô trống và nhấn **Lưu lại**.

## 🚀 Cách Sử dụng

1. Truy cập vào bất kỳ trang web nào chứa câu hỏi trắc nghiệm hoặc bài tập bạn muốn giải (ví dụ: các trang thi thử lý thuyết, đọc tài liệu, v.v.).
2. **Bôi đen đoạn văn bản câu hỏi** (lưu ý: đoạn bôi đen phải dài hơn 15 ký tự).
3. Một biểu tượng Robot 🤖 sẽ nổi lên ngay bên cạnh con trỏ chuột của bạn.
4. **Nhấp chuột trái vào biểu tượng 🤖**.
5. Chờ vài giây để Gemini suy nghĩ. Khung hiển thị sẽ hiện lên ở góc phải màn hình cùng đáp án và giải thích chi tiết.
6. Sau khi đọc xong, bạn có thể nhấn nút **[X]** để đóng khung.

## 🌍 Hướng Dẫn Đưa Lên Chrome Web Store

Nếu bạn muốn chia sẻ ứng dụng này cho mọi người cùng cài đặt trực tiếp qua cửa hàng chính thức của Google, hãy làm theo các bước sau:

**Bước 1: Nén mã nguồn**
* Chọn tất cả các file trong thư mục gốc (bao gồm `manifest.json`, `background.js`, `content.js`, `options.html`, `options.js`, `style.css`...).
* Click chuột phải và nén chúng thành một file `.zip`. *(Lưu ý: Nén trực tiếp các file, không nén nguyên thư mục cha).*

**Bước 2: Đăng ký tài khoản Nhà phát triển**
* Truy cập trang [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole/).
* Đăng nhập bằng tài khoản Google. Bạn sẽ cần trả khoản phí một lần là **$5** để kích hoạt tài khoản Nhà phát triển.

**Bước 3: Tải file .zip lên**
* Trong giao diện Developer Dashboard, nhấn nút **"New Item"** (Mục mới) ở góc trên bên phải.
* Kéo thả file `.zip` bạn vừa tạo vào để tải lên hệ thống.

**Bước 4: Cập nhật thông tin cửa hàng (Store Listing)**
Sau khi tải lên thành công, bạn cần điền các thông tin sau để người dùng biết đến ứng dụng của bạn:
* **Tên và Mô tả**: Điền tên ứng dụng (VD: Gemini Quiz Helper) và mô tả chi tiết công dụng.
* **Biểu tượng (Icon)**: Tải lên các hình ảnh icon cho ứng dụng (thường là kích thước `128x128` pixel). Nếu bạn chưa có, hãy tạo một ảnh nhỏ và tham chiếu nó trong `manifest.json` (phần `"icons"`).
* **Ảnh chụp màn hình (Screenshots)**: Chụp lại màn hình lúc ứng dụng đang hoạt động (kích thước thường dùng là `1280x800` hoặc `640x400`).

**Bước 5: Khai báo Quyền riêng tư (Privacy)**
Đây là bước cực kỳ quan trọng đối với extension dùng API:
* Giải thích lý do bạn cần quyền `storage` (để lưu API Key do người dùng tự nhập) và `activeTab` / `<all_urls>` (để đọc văn bản bôi đen trên trang).
* Tích chọn xác nhận bạn **không** thu thập dữ liệu cá nhân hay gửi văn bản người dùng đọc về bất kỳ máy chủ nào khác ngoài Google API.

**Bước 6: Gửi đánh giá (Submit for Review)**
* Khi đã điền đủ thông tin, nhấn **"Submit for Review"** (Gửi đi để xem xét).
* Đội ngũ Google sẽ duyệt thủ công extension của bạn. Quá trình này thường mất từ vài ngày đến 1 tuần. Sau khi được duyệt, ứng dụng sẽ chính thức có mặt trên Chrome Web Store!

## 👤 Tác Giả
- **Tên**: Ngọc Tú
- **Email**: ngoctu.dnkd@gmail.com

---
*Mã nguồn được viết theo chuẩn ES6+ và có chú thích (comment) rõ ràng bằng tiếng Việt để bạn dễ dàng tùy biến hoặc nâng cấp theo ý muốn.*