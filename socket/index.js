import { handleChatEvents } from '../controllers/messageController.js';
import { handleRoomEvents } from '../controllers/roomController.js';

export function setupSocket(io) {
  io.on('connection', (socket) => {
    // Check if the user is authorized through Express-session
    if (!socket.request.session || !socket.request.session.isLoggedIn) {
      console.log('Unauthorized user Socket.IO is trying to connect:', socket.id);
      socket.emit('authError', { message: 'Unauthorized' });
      socket.disconnect(); // disconnect unauthorized user
      return;
    }

    const userId = socket.request.session.userId;
    const username = socket.request.session.username;

    console.log(`User ${username} (${userId}) connected via Socket.IO:`, socket.id);
    handleChatEvents(io, socket, userId, username);
    handleRoomEvents(io, socket, userId, username);
    socket.on('disconnect', () => {
      console.log(`User ${username} (${userId}) disconnected from Socket.IO:`, socket.id);
    });
  });
}