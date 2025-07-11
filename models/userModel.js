import knex from '../config/db.js';

export async function createUser({ username, password_hash }) {
  return await knex('users')
    .insert({ username, password_hash })
    .returning('*');
}

export async function findUserByUsername(username) {
  return await knex('users')
    .where({ username })
    .first();
}

export async function getUserById(id) {
  return await knex('users')
    .where({ id })
    .first();
}

export async function getAllUsers() {
  return await knex('users').select('*');
}