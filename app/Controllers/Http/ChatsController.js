const { translate } = require('bing-translate-api');

// In-memory conversation history (you can later use a database)
let conversationHistory = [];

const ChatsController = {
  // Render the chat page
  index: async function ({ view, response }) {
    try {
      console.log('Rendering view with history:', conversationHistory);
      // Pass a flag to indicate if there are messages
      const hasMessages = conversationHistory.length > 0;
      return view.render('chat', { history: conversationHistory, hasMessages });
    } catch (error) {
      console.error('Error rendering view:', error);
      return response.status(500).send('Error rendering view: ' + error.message);
    }
  },

  // Handle chat messages
  sendMessage: async function ({ request, response }) {
    const { message, nativeLang, targetLang } = request.only(['message', 'nativeLang', 'targetLang']);

    try {
      // Add user's message to conversation history
      conversationHistory.push({ role: 'user', content: message });

      // Simple response logic (you can expand this)
      let assistantResponseNative;


      // Translate the assistant's response to the target language
      const assistantResponseTarget = await translate(message, nativeLang, targetLang);

      // Add assistant's response to conversation history
      conversationHistory.push({
        role: 'assistant',
        content: { native: message, target: assistantResponseTarget.translation }
      });

      // Return the updated history
      return response.json({
        history: conversationHistory,
        native: message,
        target: assistantResponseTarget.translation
      });
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }
};

module.exports = ChatsController;
