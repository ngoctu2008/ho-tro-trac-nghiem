// Hàm gọi Gemini API theo dạng Streaming (SSE)
async function callGeminiAPIStream(apiKey, text, model, port) {
  // Sử dụng endpoint `streamGenerateContent?alt=sse` cho Server-Sent Events
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

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
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Lỗi HTTP: ${response.status}`);
    }

    // Đọc luồng dữ liệu liên tục từ Gemini
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // SSE (Server-Sent Events) chia các block data bằng 2 dấu xuống dòng
      const lines = buffer.split('\n\n');
      // Giữ lại phần tử cuối cùng vì có thể nó chưa đầy đủ block (chưa có \n\n)
      buffer = lines.pop();

      for (let line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.replace('data: ', '').trim();
          if (jsonStr === '') continue;

          try {
            const data = JSON.parse(jsonStr);
            // Lấy text chunk từ luồng
            if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts.length > 0) {
              const textChunk = data.candidates[0].content.parts[0].text;
              // Gửi chunk text ngay lập tức qua port tới Content Script
              port.postMessage({ chunk: textChunk });
            }
          } catch (e) {
            console.error('Lỗi khi parse JSON chunk:', e);
          }
        }
      }
    }

    // Gửi tín hiệu hoàn tất
    port.postMessage({ done: true });

  } catch (error) {
    console.error('Lỗi khi gọi Gemini API Stream:', error);
    let errorMessage = error.message || 'Đã xảy ra lỗi không xác định.';
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
       errorMessage = 'Lỗi mạng hoặc không thể kết nối tới Google Gemini API.';
    }
    // Gửi lỗi qua port
    port.postMessage({ error: errorMessage });
  }
}

// Lắng nghe sự kiện click vào icon extension trên thanh công cụ để mở trang Options
chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

// Lắng nghe Message một lần (cho việc mở trang Options)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openOptionsPage') {
    chrome.runtime.openOptionsPage();
    return true;
  }
});

// Lắng nghe Kết nối dài hạn (Long-lived connection) cho Streaming từ Content Script
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'gemini-stream') {
    port.onMessage.addListener(async (msg) => {
      if (msg.action === 'askGeminiStream') {
        const questionText = msg.text;

        // 1. Lấy API Key và Model từ chrome.storage.local
        chrome.storage.local.get(['geminiApiKey', 'geminiModel'], async (result) => {
          const apiKey = result.geminiApiKey;
          const model = result.geminiModel || 'gemini-flash-latest';

          if (!apiKey || apiKey.trim() === '') {
            port.postMessage({ error: 'MISSING_API_KEY' });
            port.disconnect();
            return;
          }

          // 2. Gọi hàm Streaming và truyền port vào để nó gửi data liên tục
          await callGeminiAPIStream(apiKey, questionText, model, port);
        });
      }
    });
  }
});
