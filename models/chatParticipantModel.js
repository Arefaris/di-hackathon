import db from '../config/db.js';

export async function addParticipant({ chat_id, user_id }) {
  const exists = await db('chat_participants')
    .where({ chat_id, user_id })
    .first();

  if (!exists) {
    return db('chat_participants')
      .insert({ chat_id, user_id })
      .returning('*');
  }

  return exists;
}

export async function getParticipantsByChatId(chat_id) {
  return await db('chat_participants')
    .where({ chat_id })
    .join('users', 'chat_participants.user_id', 'users.id')
    .select('users.id', 'users.username', 'chat_participants.joined_at');
}

export async function isUserInChat({ chat_id, user_id }) {
  const record = await db('chat_participants')
    .where({ chat_id, user_id })
    .first();
  return Boolean(record);
}
