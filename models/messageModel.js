import knex from '../config/db.js';

export async function createMessage({ chat_id, sender_id, content }) {
  return await knex('messages')
    .insert({ chat_id, sender_id, content })
    .returning('*');
}

export async function getMessagesForChat(chat_id) {
  return await knex('messages')
    .where({ chat_id })
    .orderBy('timestamp', 'asc');
}

export async function getMessageById(id) {
  return await knex('messages')
    .where({ id })
    .first();
}
