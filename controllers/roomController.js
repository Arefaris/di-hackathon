import { v4 as uuidv4 } from 'uuid';
import { createChat } from '../models/chatModel.js';
import { addParticipant } from '../models/chatParticipantModel.js'
import { getChatByGUID } from '../models/chatModel.js'
import { getMessagesForChat } from '../models/messageModel.js'

export function handleRoomEvents(io, socket) {
  socket.on('create', async ({ nickname, roomname }) => {
    try {
      const roomID = uuidv4();
      const [chat] = await createChat({ name: roomname, type: 'group', guid: roomID });
      const user_id = 1;// TODO: rebuild getting user_id as socket.handshake.auth.user_id;
      if (user_id) {
        await addParticipant({ chat_id: chat.id, user_id });
      }

      socket.join(roomID);
      io.to(roomID).emit('created', { chatID: roomID });

    } catch (error) {
      console.error('Error creating chat:', error);
      socket.emit('error', { message: 'Could not create chat.' });
    }
  });

  socket.on('join', async ({ roomID }) => {
    const chat = await getChatByGUID(roomID);
    if (!chat) {
      socket.emit('error', { message: 'Chat not found' });
      return;
    }
    const messages = await getMessagesForChat(chat.id);
    socket.join(roomID);
    socket.emit('joined', { roomID, messages });
  });
}