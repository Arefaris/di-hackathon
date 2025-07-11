export function up(knex) {
  return knex.schema.createTable('chat_participants', (table) => {
    table.integer('chat_id').unsigned().notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.timestamp('joined_at').defaultTo(knex.fn.now());

    table.primary(['chat_id', 'user_id']); // composite PK
    table.foreign('chat_id').references('id').inTable('chats').onDelete('CASCADE');
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
  });
}

export function down(knex) {
  return knex.schema.dropTable('chat_participants');
}