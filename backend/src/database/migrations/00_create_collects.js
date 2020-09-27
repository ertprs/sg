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
    table.float('days');
    table.float('value');
    table.float('updated_debt');
    table.float('honorary');
    table.float('honorary_per');
    table.float('maximum_discount');
    table.float('negotiated_value');
    
    table.string('obs');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('collects');
};