export function up(knex) {
  return knex.schema.createTable('messages', (table) => {
    table.increments('id').primary();
    table.integer('chat_id').unsigned().notNullable();
    table.integer('sender_id').unsigned().notNullable();
    table.text('content').notNullable();
    table.timestamp('timestamp').defaultTo(knex.fn.now());

    table.foreign('chat_id').references('id').inTable('chats').onDelete('CASCADE');
    table.foreign('sender_id').references('id').inTable('users').onDelete('CASCADE');
  });
}

export function down(knex) {
  return knex.schema.dropTable('messages');
}