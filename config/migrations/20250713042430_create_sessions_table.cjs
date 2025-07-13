exports.up = function(knex) {
  return knex.schema.createTable('session', function(table) {
    table.string('sid').notNullable().primary(); // Session ID
    table.jsonb('sess').notNullable(); // Session data as JSONB
    table.timestamp('expire').notNullable(); // Expiration timestamp
  })
  .then(() => knex.raw('CREATE INDEX "IDX_session_expire" ON "session" ("expire");'));
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('session');
};
