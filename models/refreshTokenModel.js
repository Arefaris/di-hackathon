import db from '../config/db.js';

// Function to create a new refresh token
// This function inserts a new refresh token into the database with user ID, token, expiration time, user agent (opt), and IP address (opt)
export async function createRefreshToken({ user_id, token, expires_at, user_agent = null, ip_address = null }) {
  return await db('refresh_tokens')
    .insert({
      user_id,
      token,
      expires_at,
      user_agent,
      ip_address,
    })
    .returning('*');
}

export async function findRefreshToken(token) {
  return await db('refresh_tokens')
    .select('user_id', 'expires_at')
    .where({ token })
    .first();
}

export async function deleteRefreshToken(token) {
  return await db('refresh_tokens')
    .where({ token })
    .del();
}

export async function deleteAllRefreshTokensForUser(user_id) {
  return await db('refresh_tokens')
    .where({ user_id })
    .del();
}

// Function to get a refresh token by user ID
// This function retrieves a refresh token for a specific user from the database
export async function getRefreshTokenByUserId(user_id) {
  return await db('refresh_tokens')
    .select('token', 'expires_at')
    .where({ user_id })
    .first();
}