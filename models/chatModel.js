import db from '../config/db.js';

export async function createChat({ name, type, guid }) {
  return await db('chats')
    .insert({ name, type, guid })
    .returning('*');
}

export async function getChatById(id) {
  return await db('chats')
    .where({ id })
    .first();
}

export async function getChatByGUID(guid) {
  return await db('chats')
    .where({ guid })
    .first();
}

export async function getAllChats() {
  return await db('chats').select('*');
}


export async function getAllChatsByUserId(user_id) {
  return await db('chats')
  .select('chats.id', 'chats.name', 'chats.guid', 'chats.created_at')
  .join('chat_participants', 'chats.id', 'chat_participants.chat_id')
  .where('chat_participants.user_id', user_id);
}