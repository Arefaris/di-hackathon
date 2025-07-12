import db from '../config/db.js';

export async function createUser({ username, password_hash }) {
  return await db('users')
    .insert({ username, password_hash })
    .returning('*');
}

export async function getUserByUsername(username) {
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

export async function updateUserById(id, updates) {
  if (!updates || Object.keys(updates).length === 0) {
    return null;
  }

  try {
    const [updatedUser] = await db('users')
      .where({ id })
      .update(updates)
      .returning(['id', 'username']);
    return updatedUser;

  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}