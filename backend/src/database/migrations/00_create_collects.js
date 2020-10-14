exports.up = function(knex) {
  return knex.schema.createTable('collects', function (table) {
    table.increments();
    table.timestamps();
    table.string('account');
    table.string('status');
    table.string('document');
    table.string('dt_maturity');
    table.decimal('client');
    table.decimal('companie');
    table.string('days');
    table.string('value');
    table.string('updated_debt');
    table.string('honorary');
    table.string('honorary_per');
    table.string('maximum_discount');
    table.string('negotiated_value');
    table.decimal('attendance');

    table.string('obs');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('collects');
};