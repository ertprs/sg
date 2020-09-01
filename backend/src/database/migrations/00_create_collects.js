exports.up = function(knex) {
  return knex.schema.createTable('collects', function (table) {
    table.increments();
    table.timestamps();
    table.string('code');
    table.string('account');
    table.string('status');
    table.string('document');
    table.string('type_maturity');
    table.string('dt_emission');
    table.string('dt_begin');
    table.string('dt_end');
    table.string('dt_maturity');
    table.decimal('client');
    table.decimal('companie');
    table.decimal('days');
    table.decimal('value');
    table.decimal('amount');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('collects');
};
