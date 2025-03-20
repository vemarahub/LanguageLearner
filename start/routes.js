const Route = use('Route');

Route.get('/', 'ChatsController.index'); // Render the chat page
Route.post('/chat', 'ChatsController.sendMessage'); // Handle chat messages
