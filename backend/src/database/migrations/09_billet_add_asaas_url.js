exports.up = function(knex) {
  return knex.schema.table('billets', function (table) {
    table.string('asaas_url');
  });
};

exports.down = function(knex) {
  return knex.schema.table('billets', function (table) {
    table.dropColumn('asaas_url');
  });
};