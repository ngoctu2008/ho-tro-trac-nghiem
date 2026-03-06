// Chờ DOM load xong mới thực thi
document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById('saveBtn');
    const apiKeyInput = document.getElementById('apiKey');
    const statusMsg = document.getElementById('statusMsg');

    // Lấy API Key đã lưu từ storage (nếu có)
    chrome.storage.local.get(['geminiApiKey'], (result) => {
        if (result.geminiApiKey) {
            apiKeyInput.value = result.geminiApiKey;
        }
    });

    // Lắng nghe sự kiện click vào nút Lưu
    saveBtn.addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();

        if (apiKey === '') {
            statusMsg.textContent = 'Vui lòng nhập API Key!';
            statusMsg.style.color = 'red';
            statusMsg.style.display = 'block';
            setTimeout(() => {
                statusMsg.style.display = 'none';
            }, 3000);
            return;
        }

        // Lưu API Key vào chrome.storage.local
        chrome.storage.local.set({ geminiApiKey: apiKey }, () => {
            statusMsg.textContent = 'Đã lưu thành công!';
            statusMsg.style.color = 'green';
            statusMsg.style.display = 'block';

            // Ẩn thông báo sau 3 giây
            setTimeout(() => {
                statusMsg.style.display = 'none';
            }, 3000);
        });
    });
});
