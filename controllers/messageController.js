import { createMessage } from '../models/messageModel.js'
// legacy
// import { getUserByUsername } from '../models/userModel.js'
import { getChatByGUID } from '../models/chatModel.js'

export function handleChatEvents(io, socket, userId, username) {
    socket.on('message', async ({ message, roomID }) => {
        if (!roomID || !message) {
            return socket.emit('error', { message: 'Missing roomID or message' });
        }
        console.log(`User ${username} (${userId}) is writing in room ${roomID}: ${message}`);

        try {
            const chat = await getChatByGUID(roomID);
            if (!chat) {
                return socket.emit('error', { message: 'Chat not found' });
            }
            const [messageObj] = await createMessage({ chat_id: chat.id, sender_id: userId, content: message });            
            io.to(roomID).emit('message', {
                sender: username,
                message: messageObj.content,
                timestamp: messageObj.timestamp
            });
        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('error', { message: 'Failed to send message.' });
        }
    });
}
