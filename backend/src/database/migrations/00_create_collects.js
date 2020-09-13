exports.up = function(knex) {
  return knex.schema.createTable('collects', function (table) {
    table.increments();
    table.timestamps();
    table.string('account');
    table.string('status');
    table.string('document');
    table.string('dt_maturity');
    table.string('dt_closure');
    table.decimal('client');
    table.decimal('companie');
    table.decimal('days');
    table.decimal('value');
    table.decimal('penalty');
    table.decimal('interest');
    table.decimal('updated_debt');
    table.decimal('honorary');
    table.decimal('maximum_discount');
    table.decimal('negotiated_value');
    
    table.string('obs');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('collects');
};