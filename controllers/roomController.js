import { v4 as uuidv4 } from 'uuid';
import { createChat, getChatByGUID } from '../models/chatModel.js';
import { addParticipant } from '../models/chatParticipantModel.js'
import { getMessagesForChat } from '../models/messageModel.js'
import { createUser, getUserByUsername } from '../models/userModel.js'

export function handleRoomEvents(io, socket, userId, username) {
  socket.on('create', async ({ nickname, roomname }) => { //TODO: Remove nickname on front and here
    if (!roomname) {
      return socket.emit('error', { message: 'Room name is required.' });
    }
    if (!userId) { // Authentication check
      return socket.emit('error', { message: 'Unauthorized: User not logged in.' });
    }

    try {
      const roomID = uuidv4();
      const [chat] = await createChat({ name: roomname, type: 'group', guid: roomID });

      // Legacy: Create user by nickname
      // const user = await createUser({ username: nickname, password_hash: 'passHash#1' });
      await addParticipant({ chat_id: chat.id, user_id: userId });

      socket.join(roomID);
      io.to(roomID).emit('created', { chatID: roomID, roomname: roomname });
    } catch (error) {
      console.error('Error creating chat:', error);
      socket.emit('error', { message: 'Could not create chat.' });
    }
  });

  socket.on('join', async ({ roomID, nickname }) => { //TODO: Remove nickname on front and here
    if (!roomID) {
      return socket.emit('error', { message: 'Room name is required.' });
    }
    if (!userId) { // Authentication check
      return socket.emit('error', { message: 'Unauthorized: User not logged in.' });
    }
    try {
      const chat = await getChatByGUID(roomID);
      if (!chat) {
        socket.emit('error', { message: 'Chat not found' });
        return;
      }

      // Legacy: Create user by nickname
      // let user = await getUserByUsername(nickname);
      // if (!user) {
      //   [user] = await createUser({ username: nickname, password_hash: "passHash2" });
      // }
      await addParticipant({ chat_id: chat.id, user_id: userId });

      const messages = await getMessagesForChat(chat.id);

      socket.join(roomID);
      // Response with the chat history and the chat name
      socket.emit('joined', { roomID, nickname: username, messages, chatName: chat.name });
      // Notify other users about a new participant
      socket.to(roomID).emit('userJoined', { username: username });
    } catch (error) {
      console.error('Error joining chat:', error);
      socket.emit('error', { message: 'Failed to join chat.' });
    }
  });

  socket.on('chatCheck', async ({ roomID }) => {
    if (!roomID) {
      return socket.emit('error', { message: 'Room name is required.' });
    }
    if (!userId) { // Authentication check
      return socket.emit('error', { message: 'Unauthorized: User not logged in.' });
    }
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