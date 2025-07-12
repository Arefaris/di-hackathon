import db from '../config/db.js';

export async function createUser({ username, password_hash }) {
  return await db('users')
    .insert({ username, password_hash })
    .returning('*');
}

export async function findUserByUsername(username) {
  return await db('users')
    .where({ username })
    .first();
}

export async function getUserById(id) {
  return await db('users')
    .where({ id })
    .first();
}

export async function getAllUsers() {
  return await db('users').select('*');
}