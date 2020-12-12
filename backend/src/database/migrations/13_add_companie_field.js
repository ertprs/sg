exports.up = function(knex) {
  return knex.schema.table('users', function (table) {
    table.decimal('companie');
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', function (table) {
    table.dropColumn('companie');
  });
};