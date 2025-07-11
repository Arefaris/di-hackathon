export async function seed(knex) {
  await knex('chat_participants').del();
  await knex('messages').del();
  await knex('chats').del();
  await knex('users').del();

  await knex('users').insert([
    { username: 'alice', password_hash: 'hash1' },
    { username: 'bob', password_hash: 'hash2' },
    { username: 'carol', password_hash: 'hash3' }
  ]);
}
