import db from '../config/db.js';

export async function createMessage({ chat_id, sender_id, content }) {
  return await db('messages')
    .insert({ chat_id, sender_id, content })
    .returning('*');
}

export async function getMessagesForChat(chat_id) {
  return await db('messages')
    .where({ chat_id })
    .orderBy('timestamp', 'asc');
}

export async function getMessageById(id) {
  return await db('messages')
    .where({ id })
    .first();
}
