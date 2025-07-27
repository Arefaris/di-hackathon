/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  console.log('RUNNING REFRESH TOKEN MIGRATION');

  return Promise.resolve().then(() => {
    return knex.schema.createTable('refresh_tokens', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable()
        .references('id').inTable('users')
        .onDelete('CASCADE');
      table.text('token').notNullable().unique();
      table.timestamp('expires_at').notNullable();
      table.text('user_agent');
      table.text('ip_address');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  });
};

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('refresh_tokens');
};
