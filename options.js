// Chờ DOM load xong mới thực thi
document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById('saveBtn');
    const apiKeyInput = document.getElementById('apiKey');
    const modelSelect = document.getElementById('geminiModel');
    const statusMsg = document.getElementById('statusMsg');

    // Lấy API Key và Model đã lưu từ storage (nếu có)
    chrome.storage.local.get(['geminiApiKey', 'geminiModel'], (result) => {
        if (result.geminiApiKey) {
            apiKeyInput.value = result.geminiApiKey;
        }
        if (result.geminiModel) {
            modelSelect.value = result.geminiModel;
        }
    });

    // Lắng nghe sự kiện click vào nút Lưu
    saveBtn.addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();
        const model = modelSelect.value;

        if (apiKey === '') {
            statusMsg.textContent = 'Vui lòng nhập API Key!';
            statusMsg.style.color = 'red';
            statusMsg.style.display = 'block';
            setTimeout(() => {
                statusMsg.style.display = 'none';
            }, 3000);
            return;
        }

        // Lưu API Key và Model vào chrome.storage.local
        chrome.storage.local.set({ geminiApiKey: apiKey, geminiModel: model }, () => {
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
