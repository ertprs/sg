exports.up = function(knex) {
  return knex.schema.table('clients', function (table) {
    table.string('asaas_code');
  });
};

exports.down = function(knex) {
  return knex.schema.table('clients', function (table) {
    table.dropColumn('asaas_code');
  });
};