export async function seed(knex) {
  await knex('chat_participants').del();

  await knex('chat_participants').insert([
    { chat_id: 1, user_id: 1 },
    { chat_id: 1, user_id: 2 },
    { chat_id: 2, user_id: 1 },
    { chat_id: 2, user_id: 2 },
    { chat_id: 2, user_id: 3 }
  ]);
}
