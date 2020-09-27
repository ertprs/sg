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
    table.float('default_interest');
    table.float('default_honorary');
    table.float('default_penalty');
    table.float('monthly_value');
    table.string('payday');
    table.string('payment_type');
    
    table.string('obs');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('companies');
};
