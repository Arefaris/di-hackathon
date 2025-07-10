import { handleChatEvents } from '../controllers/chatController.js';
import { handleRoomEvents } from '../controllers/roomController.js';

export function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    handleChatEvents(io, socket);
    handleRoomEvents(io, socket);
  });
}