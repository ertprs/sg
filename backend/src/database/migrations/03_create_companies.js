exports.up = function(knex) {
  return knex.schema.createTable('companies', function (table) {
    table.increments();
    table.string('name').notNullable();
    table.string('cnpj');
    table.string('edress');
    table.string('phone');
    table.string('responsible_staff');
    table.string('dt_contract');
    table.string('dt_renovation');
    table.string('default_interest');
    table.string('default_honorary');
    table.string('default_penalty');
    table.string('monthly_value');
    table.string('payday');
    table.string('payment_type');
    
    table.string('obs');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('companies');
};
