// Hàm gọi Gemini API bất đồng bộ
async function callGeminiAPI(apiKey, text, model = 'gemini-flash-latest') {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const prompt = `Bạn là một chuyên gia giải đề thi. Dưới đây là một câu hỏi trắc nghiệm (hoặc tự luận). Hãy chọn đáp án đúng nhất và giải thích ngắn gọn, dễ hiểu tại sao. Câu hỏi: ${text}`;

  const payload = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      // Bắt lỗi HTTP từ Google API (VD: 400, 403, 500)
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Lỗi HTTP: ${response.status}`);
    }

    const data = await response.json();

    // Lấy nội dung text từ cấu trúc JSON trả về của Gemini
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts.length > 0) {
      return { result: data.candidates[0].content.parts[0].text };
    } else {
      throw new Error("API trả về định dạng không mong đợi hoặc bị chặn (blocked).");
    }

  } catch (error) {
    console.error('Lỗi khi gọi Gemini API:', error);
    // Bắt lỗi mất mạng hoặc timeout
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
       return { error: 'Lỗi mạng hoặc không thể kết nối tới Google Gemini API.' };
    }
    return { error: error.message || 'Đã xảy ra lỗi không xác định.' };
  }
}

// Lắng nghe sự kiện click vào icon extension trên thanh công cụ để mở trang Options
chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

// Lắng nghe Message từ Content Script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Action 1: Mở trang Options
  if (request.action === 'openOptionsPage') {
    chrome.runtime.openOptionsPage();
    return true; // Báo hiệu đã xử lý xong
  }

  // Action 2: Gọi Gemini API
  if (request.action === 'askGemini') {
    const questionText = request.text;

    // 1. Lấy API Key và Model từ chrome.storage.local
    chrome.storage.local.get(['geminiApiKey', 'geminiModel'], async (result) => {
      const apiKey = result.geminiApiKey;
      const model = result.geminiModel || 'gemini-flash-latest'; // Fallback về model mặc định nếu chưa chọn

      if (!apiKey || apiKey.trim() === '') {
        // Trả lỗi yêu cầu cài đặt API Key
        sendResponse({ error: 'MISSING_API_KEY' });
        return;
      }

      // 2. Gọi API nếu có Key
      const response = await callGeminiAPI(apiKey, questionText, model);
      sendResponse(response);
    });

    // Bắt buộc trả về `true` để giữ cổng Message mở (Async Response)
    return true;
  }
});
