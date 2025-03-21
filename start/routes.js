const Route = use('Route');

Route.get('/chat', 'ChatsController.index'); // Render the chat page
//Route.post('/chat', 'ChatsController.sendMessage'); // Handle chat messages
// Route for sending messages (POST /chat/send)
Route.post('/chat/send', 'ChatsController.sendMessage')

// Optional: Route for resetting the chat history (POST /chat/reset)
Route.post('/chat/reset', 'ChatsController.reset')
