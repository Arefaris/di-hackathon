import knex from '../config/db.js';

export async function createChat({ name, type, guid }) {
  return await knex('chats')
    .insert({ name, type, guid })
    .returning('*');
}

export async function getChatById(id) {
  return await knex('chats')
    .where({ id })
    .first();
}

export async function getChatByGUID(guid) {
  return await knex('chats')
    .where({ guid })
    .first();
}

export async function getAllChats() {
  return await knex('chats').select('*');
}
