import { v4 as uuidv4 } from 'uuid';
import { createChat, getChatByGUID } from '../models/chatModel.js';
import { addParticipant } from '../models/chatParticipantModel.js'
import { getMessagesForChat } from '../models/messageModel.js'
import { createUser, findUserByUsername } from '../models/userModel.js'

export function handleRoomEvents(io, socket) {
  socket.on('create', async ({ nickname, roomname }) => {
    try {
      const roomID = uuidv4();
      const [chat] = await createChat({ name: roomname, type: 'group', guid: roomID });

      //Create user by nickname

      const user = await createUser({ username: nickname, password_hash: 'passHash#1' });
      const user_id = user.id;// TODO: rebuild getting user_id as socket.handshake.auth.user_id;
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

  socket.on('join', async ({ roomID, nickname }) => {
    const chat = await getChatByGUID(roomID);
    if (!chat) {
      socket.emit('error', { message: 'Chat not found' });
      return;
    }

    let user = await findUserByUsername(nickname);
    if (!user) {
      [user] = await createUser({ username: nickname, password_hash: "passHash2" });
    }
    await addParticipant({ chat_id: chat.id, user_id: user.id });

    const messages = await getMessagesForChat(chat.id);
    console.log(messages);

    socket.join(roomID);
    socket.emit('joined', { roomID, nickname, messages });
  });

  socket.on('chatCheck', async ({ roomID }) => {
    try {
      const chat = await getChatByGUID(roomID);
      const chatFlag = Boolean(chat);
      socket.emit('chatCheck', { chatFlag });
    } catch (error) {
      console.error('Error in chatCheck:', error);
      socket.emit('chatCheck', { chatFlag: false });
    }
  });
}