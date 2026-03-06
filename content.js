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

    // Ngăn chặn hành vi mặc định (xóa bôi đen) khi click chuột xuống nút trigger
    triggerBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
    });

    // Xử lý khi bấm vào nút
    triggerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Tránh kích hoạt mousedown ngoài ý muốn

        hideTriggerButton();
        showLoadingState();

        // Khởi tạo kết nối dài hạn để nhận stream data
        startGeminiStream(selectedText);
    });

    document.body.appendChild(triggerBtn);
}

// Gọi API Streaming qua Port
let currentStreamResult = '';
function startGeminiStream(text) {
    currentStreamResult = ''; // Xóa kết quả cũ
    const port = chrome.runtime.connect({ name: 'gemini-stream' });

    port.postMessage({ action: 'askGeminiStream', text: text });

    // Đặt timeout nếu sau 10 giây không có msg nào từ lúc gửi thì báo lỗi (tránh kẹt mãi loading)
    let isReceived = false;
    const timeoutId = setTimeout(() => {
        if (!isReceived) {
            const content = resultBox.querySelector('.gemini-result-content');
            handleStreamError('Không nhận được phản hồi từ máy chủ. Có thể do lỗi mạng hoặc Extension Service Worker bị ngủ đông. Hãy thử lại.', content);
            port.disconnect();
        }
    }, 10000);

    port.onMessage.addListener((msg) => {
        isReceived = true; // Đánh dấu đã nhận tín hiệu
        const content = resultBox.querySelector('.gemini-result-content');

        if (msg.error) {
            handleStreamError(msg.error, content);
            port.disconnect();
        } else if (msg.chunk) {
            // Khi có chunk mới, xóa trạng thái loading (nếu còn) và cộng dồn text
            const loadingDiv = content.querySelector('.gemini-loading');
            if (loadingDiv) loadingDiv.remove();

            currentStreamResult += msg.chunk;
            content.innerHTML = `<div>${parseMarkdownToHTML(currentStreamResult)}</div>`;

            // Tự động cuộn xuống dưới
            content.scrollTop = content.scrollHeight;
        } else if (msg.done) {
            port.disconnect();
        }
    });

    // Lắng nghe sự cố mất kết nối port (ví dụ khi background script bị ngắt ngẫu nhiên)
    port.onDisconnect.addListener(() => {
        if (!isReceived) {
             const content = resultBox.querySelector('.gemini-result-content');
             handleStreamError('Mất kết nối với Background Script. Hãy tải lại trang và thử lại.', content);
        }
    });
}

function handleStreamError(errorMsg, contentElement) {
    if (errorMsg === 'MISSING_API_KEY') {
        contentElement.innerHTML = `
            <div class="gemini-error">
                <p>⚠️ Bạn chưa cấu hình Google Gemini API Key.</p>
                <button class="gemini-settings-btn" id="openSettingsBtn">Đến trang Cài đặt</button>
            </div>
        `;
        // Gắn sự kiện để mở trang cài đặt
        const openSettingsBtn = contentElement.querySelector('#openSettingsBtn');
        if (openSettingsBtn) {
            openSettingsBtn.addEventListener('click', () => {
                chrome.runtime.sendMessage({ action: 'openOptionsPage' });
            });
        }
    } else {
        contentElement.innerHTML = `<div class="gemini-error">Lỗi: ${errorMsg}</div>`;
    }
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
    // Nếu click rơi vào khung kết quả hoặc nút trigger thì không làm gì (giữ nguyên trạng thái)
    if ((triggerBtn && triggerBtn.contains(e.target)) || (resultBox && resultBox.contains(e.target))) {
        return;
    }

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

// Chạy khởi tạo
init();
