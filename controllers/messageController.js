import { createMessage } from '../models/messageModel.js'
import { findUserByUsername } from '../models/userModel.js'
import { getChatByGUID } from '../models/chatModel.js'

export function handleChatEvents(io, socket) {
    socket.on('message', async ({ sender, message, roomID }) => {

        if (!roomID || !message || !sender) return;
        console.log(`${sender} is writing in room ${roomID}: ${message}`); //TODO delete in prod
        const chat =  await getChatByGUID(roomID);;
        const user = await findUserByUsername(sender);
        await createMessage({chat_id: chat.id, sender_id: user.id ,content: message})
        socket.join(roomID);
        io.to(roomID).emit('message', {
            sender,
            message,
            from: socket.id
        });
    });
}
