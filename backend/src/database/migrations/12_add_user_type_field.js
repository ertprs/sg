exports.up = function(knex) {
  return knex.schema.table('users', function (table) {
    table.integer('user_type').notNull().defaultTo(1);
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', function (table) {
    table.dropColumn('user_type');
  });
};