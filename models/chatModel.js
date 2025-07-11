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
