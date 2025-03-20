async function sendMessage() {
  const nativeLang = document.getElementById('nativeLang').value;
  const targetLang = document.getElementById('targetLang').value;
  const userInput = document.getElementById('userInput').value;
  const sendButton = document.getElementById('sendButton');

  if (!userInput) return;

  // Disable the send button and show loading state
  sendButton.disabled = true;
  sendButton.textContent = 'Sending...';

  // Display user's message
  const chatBox = document.getElementById('chatBox');
  chatBox.innerHTML += `
    <div class="flex justify-end">
      <div class="max-w-xs bg-indigo-500 text-white rounded-lg p-3 shadow-md message user">
        ${userInput}
      </div>
    </div>
  `;
  chatBox.scrollTop = chatBox.scrollHeight;

  // Clear input
  document.getElementById('userInput').value = '';

  // Send message to backend
  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userInput, nativeLang, targetLang })
    });
    const data = await response.json();

    if (data.error) {
      chatBox.innerHTML += `
        <div class="flex justify-start">
          <div class="max-w-xs bg-gray-200 text-gray-800 rounded-lg p-3 shadow-md message assistant">
            Error: ${data.error}
          </div>
        </div>
      `;
    } else {
      // Display assistant's response in both languages
      chatBox.innerHTML += `
        <div class="flex justify-start">
          <div class="max-w-xs bg-gray-200 text-gray-800 rounded-lg p-3 shadow-md message assistant">
            <p><strong>Native:</strong> ${data.native}</p>
            <p><strong>Target:</strong> ${data.target}</p>
          </div>
        </div>
      `;
    }
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (error) {
    chatBox.innerHTML += `
      <div class="flex justify-start">
        <div class="max-w-xs bg-gray-200 text-gray-800 rounded-lg p-3 shadow-md message assistant">
        Error: ${error.message}
      </div>
    </div>
    `;
    chatBox.scrollTop = chatBox.scrollHeight;
  } finally {
    // Re-enable the send button
    sendButton.disabled = false;
    sendButton.textContent = 'Send';
  }
}

// Wait for the DOM to be fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Attach event listener for the Send button
  const sendButton = document.getElementById('sendButton');
  if (sendButton) {
    sendButton.addEventListener('click', sendMessage);
  } else {
    console.error('Send button not found');
  }

  // Attach event listener for the Enter key
  const userInput = document.getElementById('userInput');
  if (userInput) {
    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  } else {
    console.error('User input field not found');
  }
});
