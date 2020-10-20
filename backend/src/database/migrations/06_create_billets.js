exports.up = function(knex) {
  return knex.schema.createTable('billets', function (table) {
    table.increments();
    table.timestamps();
    table.decimal('attendance');
    table.decimal('companie');
    table.decimal('client');
    table.string('dt_generation');
    table.string('dt_due');
    table.decimal('qt_parcel');
    table.decimal('parcel');
    table.string('status');
    table.string('billet_total');
    table.string('negotiated_value');
    
    table.string('obs');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('billets');
};