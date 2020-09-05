exports.up = function(knex) {
    return knex.schema.createTable('clients', function (table) {
      table.increments();
      table.string('name');
      table.decimal('companie');
      table.string('phone');
      table.string('cellphone');
      table.string('email');
      table.string('document');
      table.string('edress');

      table.string('obs');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('clients');
  };
  