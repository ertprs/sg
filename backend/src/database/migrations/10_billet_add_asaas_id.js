exports.up = function(knex) {
  return knex.schema.table('billets', function (table) {
    table.string('asaas_id');
  });
};

exports.down = function(knex) {
  return knex.schema.table('billets', function (table) {
    table.dropColumn('asaas_id');
  });
};