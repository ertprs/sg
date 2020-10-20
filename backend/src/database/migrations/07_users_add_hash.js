exports.up = function(knex) {
  return knex.schema.table('users', function (table) {
    table.string('hash').notNull().defaultTo('DEFA');
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', function (table) {
    table.dropColumn('hash');
  });
};