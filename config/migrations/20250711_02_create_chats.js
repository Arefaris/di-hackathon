export function up(knex) {
  return knex.schema.createTable('chats', (table) => {
    table.increments('id').primary();
    table.string('name', 100).notNullable(); // group chat name
    table.enu('type', ['private', 'group']).notNullable(); // chat type
    table.string('guid', 100).notNullable(); // for Socket.IO room ID
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTable('chats');
}