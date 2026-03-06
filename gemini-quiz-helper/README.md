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
   - Tải toàn bộ thư mục `gemini-quiz-helper` về máy tính của bạn.
2. **Mở trang Tiện ích (Extensions)**:
   - Trên Google Chrome hoặc Microsoft Edge, truy cập vào đường dẫn: `chrome://extensions/` (hoặc `edge://extensions/`).
3. **Bật chế độ Nhà phát triển**:
   - Nhìn lên góc trên bên phải màn hình, bật công tắc **"Chế độ dành cho nhà phát triển"** (Developer mode).
4. **Tải Tiện ích đã giải nén**:
   - Nhấn vào nút **"Tải tiện ích đã giải nén"** (Load unpacked) ở góc trên bên trái.
   - Chọn thư mục `gemini-quiz-helper` mà bạn vừa tải về.
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

---
*Mã nguồn được viết theo chuẩn ES6+ và có chú thích (comment) rõ ràng bằng tiếng Việt để bạn dễ dàng tùy biến hoặc nâng cấp theo ý muốn.*