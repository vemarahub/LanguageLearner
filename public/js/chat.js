document.addEventListener('DOMContentLoaded', () => {
  const chatBox = document.getElementById('chatBox');
  const userInput = document.getElementById('userInput');
  const sendButton = document.getElementById('sendButton');
  const nativeLangSelect = document.getElementById('nativeLang');
  const targetLangSelect = document.getElementById('targetLang');
  const chitChatToggle = document.getElementById('chitChatToggle');

  // Function to render the chat history
  function renderChatHistory(history) {
    chatBox.innerHTML = '';
    if (!history || history.length === 0) {
      chatBox.innerHTML = '<p class="text-center text-gray-500">No messages yet.</p>';
      return;
    }

    history.forEach(message => {
      if (message.role === 'user') {
        // User message (right-aligned)
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'flex justify-end';
        userMessageDiv.innerHTML = `
          <div class="max-w-xs bg-indigo-500 text-white rounded-lg p-3 shadow-md">
            <p>${message.content.native}</p>
            ${message.content.target ? `<p><strong>Target:</strong> ${message.content.target}</p>` : ''}
          </div>
        `;
        chatBox.appendChild(userMessageDiv);
      } else {
        // Assistant message (left-aligned)
        const assistantMessageDiv = document.createElement('div');
        assistantMessageDiv.className = 'flex justify-start';
        assistantMessageDiv.innerHTML = `
          <div class="max-w-xs bg-gray-200 text-gray-800 rounded-lg p-3 shadow-md">
            <p><strong>Native:</strong> ${message.content.native}</p>
            <p><strong>Target:</strong> ${message.content.target}</p>
          </div>
        `;
        chatBox.appendChild(assistantMessageDiv);
      }
    });

    // Scroll to the bottom of the chat box
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Function to send a message
  async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    const nativeLang = nativeLangSelect.value;
    const targetLang = targetLangSelect.value;
    const chitChatEnabled = chitChatToggle.checked;

    try {
      const response = await fetch('/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          message,
          nativeLang,
          targetLang,
          chitChatEnabled,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      renderChatHistory(data.history);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message: ' + error.message);
    }

    // Clear the input field
    userInput.value = '';
  }

  // Event listeners
  sendButton.addEventListener('click', sendMessage);
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // Persist toggle state in localStorage
  chitChatToggle.checked = localStorage.getItem('chitChatEnabled') === 'true' || true;
  chitChatToggle.addEventListener('change', () => {
    localStorage.setItem('chitChatEnabled', chitChatToggle.checked);
  });
});
