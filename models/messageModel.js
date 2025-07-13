import db from '../config/db.js';

export async function createMessage({ chat_id, sender_id, content }) {
  return await db('messages')
    .insert({ chat_id, sender_id, content })
    .returning('*');
}

export async function getMessagesForChat(chat_id) {
  return await db('messages')
    .join('users', 'messages.sender_id', '=', 'users.id')
    .select(
      'messages.id',
      'messages.content as message',
      'messages.timestamp',
      'messages.chat_id',
      'users.username as sender'
    )
    .where('messages.chat_id', chat_id)
    .orderBy('messages.timestamp', 'asc');
}

export async function getMessageById(id) {
  return await db('messages')
    .where({ id })
    .first();
}
