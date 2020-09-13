exports.up = function(knex) {
    return knex.schema.createTable('clients', function (table) {
      table.increments();
      table.string('code');
      table.string('name');
      table.decimal('companie');
      table.string('phone');
      table.string('phone_additional');
      table.string('cellphone');
      table.string('email');
      table.string('email_additional');
      table.string('document');
      table.string('edress');
      table.string('edress_additional');

      table.string('obs');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('clients');
  };
  