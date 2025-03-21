const { translate } = require('bing-translate-api');
const axios = require('axios');

// In-memory conversation history (replace with a database for production)
let conversationHistory = [];

const ChatsController = {
  // Render the chat page
  index: async function ({ view, response }) {
    try {
      console.log('Rendering view with history:', conversationHistory);
      const hasMessages = conversationHistory.length > 0;
      return view.render('chat', { history: conversationHistory, hasMessages });
    } catch (error) {
      console.error('Error rendering view:', error);
      return response.status(500).send('Error rendering view: ' + error.message);
    }
  },

  // Handle chat messages
  sendMessage: async function ({ request, response }) {
    const { message, nativeLang, targetLang, chitChatEnabled } = request.only(['message', 'nativeLang', 'targetLang', 'chitChatEnabled']);

    try {
      // Translate the user's message to the target language
      const userMessageTarget = await translate(message, nativeLang, targetLang);

      // Add user's message to conversation history
      conversationHistory.push({
        role: 'user',
        content: {
          native: message,
          target: userMessageTarget.translation
        }
      });

      // Check if chit-chat is enabled
      if (chitChatEnabled === 'false' || chitChatEnabled === false) {
        // Chit-chat is disabled: Return only the translated message
        return response.json({
          history: conversationHistory,
          native: message,
          target: userMessageTarget.translation
        });
      }

      // Chit-chat is enabled: Proceed with the assistant's response
      // Generate assistant's response using Hugging Face API
      const assistantResponseNative = await generateAIResponse(message);

      // Translate the assistant's response to the target language
      const assistantResponseTarget = await translate(assistantResponseNative, nativeLang, targetLang);

      // Add assistant's response to conversation history
      conversationHistory.push({
        role: 'assistant',
        content: {
          native: assistantResponseNative,
          target: assistantResponseTarget.translation
        }
      });

      // Return the updated history
      return response.json({
        history: conversationHistory,
        native: assistantResponseNative,
        target: assistantResponseTarget.translation
      });
    } catch (error) {
      console.error('Error in sendMessage:', error);
      return response.status(500).json({ error: error.message });
    }
  },

  // Reset conversation history (optional for testing)
  reset: async function ({ response }) {
    conversationHistory = [];
    return response.json({ message: 'Conversation history reset' });
  }
};

// Function to call Hugging Face Inference API for AI response
async function generateAIResponse(message) {
  const API_TOKEN = 'test'; // Replace with your token
  const model = 'facebook/blenderbot-400M-distill';

  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        inputs: message,
        parameters: { max_length: 100 }
      },
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Extract the generated response
    const generatedText = response.data[0]?.generated_text || 'I don’t understand, can you say that again?';
    return generatedText;
  } catch (error) {
    console.error('Error calling Hugging Face API:', error.message);
    return 'Sorry, I couldn’t generate a response right now.';
  }
}

module.exports = ChatsController;
