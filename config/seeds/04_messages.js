export async function seed(knex) {
  await knex('messages').del();

  await knex('messages').insert([
    { chat_id: 1, sender_id: 1, content: 'Hi Bob!' },
    { chat_id: 1, sender_id: 2, content: 'Hey Alice!' },
    { chat_id: 2, sender_id: 3, content: 'Hello everyone!' }
  ]);
}
