// Trạng thái cục bộ lưu giữ đoạn text đang bôi đen
let selectedText = '';
let triggerBtn = null;
let resultBox = null;

// Khởi tạo các thành phần giao diện khi tải trang
function init() {
    createTriggerButton();
    createResultBox();

    // Bắt sự kiện khi người dùng bôi đen văn bản
    document.addEventListener('mouseup', handleSelection);
    // Bắt sự kiện mousedown để ẩn nút trigger nếu click ra ngoài
    document.addEventListener('mousedown', (e) => {
        if (triggerBtn && !triggerBtn.contains(e.target)) {
            hideTriggerButton();
        }
    });
}

// 1. Tạo nút nổi (Trigger Button) nhưng ẩn đi
function createTriggerButton() {
    triggerBtn = document.createElement('button');
    triggerBtn.className = 'gemini-trigger-btn';
    triggerBtn.innerHTML = '🤖'; // Biểu tượng Gemini hoặc Robot
    triggerBtn.title = 'Hỏi Gemini';
    triggerBtn.style.display = 'none';

    // Xử lý khi bấm vào nút
    triggerBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Tránh kích hoạt mousedown ngoài ý muốn
        hideTriggerButton();
        showLoadingState();

        // Gửi nội dung bôi đen tới Background Script để gọi API
        chrome.runtime.sendMessage({ action: 'askGemini', text: selectedText }, handleBackgroundResponse);
    });

    document.body.appendChild(triggerBtn);
}

// 2. Tạo khung kết quả nổi (Floating Box) ẩn ở góc dưới bên phải
function createResultBox() {
    resultBox = document.createElement('div');
    resultBox.className = 'gemini-result-box hidden';

    // Cấu trúc HTML của khung kết quả
    resultBox.innerHTML = `
        <div class="gemini-result-header">
            <h3>🤖 Gemini Quiz Helper</h3>
            <button class="gemini-close-btn">&times;</button>
        </div>
        <div class="gemini-result-content"></div>
    `;

    // Sự kiện đóng khung kết quả
    const closeBtn = resultBox.querySelector('.gemini-close-btn');
    closeBtn.addEventListener('click', hideResultBox);

    document.body.appendChild(resultBox);
}

// 3. Xử lý khi bôi đen văn bản
function handleSelection(e) {
    const selection = window.getSelection();
    selectedText = selection.toString().trim();

    // Nếu văn bản bôi đen > 15 ký tự thì hiện nút
    if (selectedText.length > 15) {
        // Căn chỉnh vị trí nút nổi gần vị trí chuột nhả ra
        const posX = e.pageX + 10;
        const posY = e.pageY - 20;

        triggerBtn.style.left = `${posX}px`;
        triggerBtn.style.top = `${posY}px`;
        triggerBtn.style.display = 'flex';
    } else {
        hideTriggerButton();
    }
}

// Ẩn nút trigger
function hideTriggerButton() {
    if (triggerBtn) {
        triggerBtn.style.display = 'none';
    }
}

// Ẩn khung kết quả
function hideResultBox() {
    if (resultBox) {
        resultBox.classList.add('hidden');
    }
}

// Hiển thị trạng thái đang tải (Loading)
function showLoadingState() {
    resultBox.classList.remove('hidden');
    const content = resultBox.querySelector('.gemini-result-content');
    content.innerHTML = `<div class="gemini-loading">🤖 Đang nhờ Gemini phân tích câu hỏi...</div>`;
}

// 4. Hàm xử lý Markdown cơ bản sang HTML
function parseMarkdownToHTML(markdownText) {
    if (!markdownText) return '';

    // Thay thế các ký tự an toàn trước
    let html = markdownText.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Xử lý In đậm (**text**)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Xử lý In nghiêng (*text*)
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Xử lý Dòng mã ngắn (`code`)
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');

    // Xử lý Xuống dòng (\n -> <br>)
    html = html.replace(/\n/g, '<br>');

    return html;
}

// 5. Xử lý phản hồi từ Background Script
function handleBackgroundResponse(response) {
    const content = resultBox.querySelector('.gemini-result-content');

    if (response.error) {
        // Xử lý trường hợp thiếu API Key hoặc lỗi khác
        if (response.error === 'MISSING_API_KEY') {
            content.innerHTML = `
                <div class="gemini-error">
                    <p>⚠️ Bạn chưa cấu hình Google Gemini API Key.</p>
                    <button class="gemini-settings-btn" id="openSettingsBtn">Đến trang Cài đặt</button>
                </div>
            `;
            // Gắn sự kiện để mở trang cài đặt
            const openSettingsBtn = content.querySelector('#openSettingsBtn');
            if (openSettingsBtn) {
                openSettingsBtn.addEventListener('click', () => {
                    chrome.runtime.sendMessage({ action: 'openOptionsPage' });
                });
            }
        } else {
            content.innerHTML = `<div class="gemini-error">Lỗi: ${response.error}</div>`;
        }
    } else if (response.result) {
        // Render kết quả từ Gemini sau khi parse Markdown
        const htmlContent = parseMarkdownToHTML(response.result);
        content.innerHTML = `<div>${htmlContent}</div>`;
    } else {
        content.innerHTML = `<div class="gemini-error">Không nhận được phản hồi từ Gemini.</div>`;
    }
}

// Chạy khởi tạo
init();
