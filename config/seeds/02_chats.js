export async function seed(knex) {
  await knex('chat_participants').del();
  await knex('messages').del();
  await knex('chats').del();

  await knex('chats').insert([
    { name: 'Private Chat', type: 'private', guid: 'room-123' },
    { name: 'Group Chat', type: 'group', guid: 'room-456' }
  ]);
}
