exports.up = function(knex) {
  return knex.schema.createTable('users', function (table) {
    table.increments();
    table.string('name').notNullable();
    table.string('username').notNullable();
    table.string('password').notNullable();
    
    table.string('obs');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
