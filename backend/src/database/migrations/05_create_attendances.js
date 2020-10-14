exports.up = function(knex) {
    return knex.schema.createTable('attendances', function (table) {
      table.increments();
      table.decimal('client');
      table.decimal('user');
      table.string('dt_begin');
      table.string('dt_end');
      table.string('grand_value');
      table.string('status');
      table.string('negotiated_value');
      table.string('description');
      
      table.string('obs');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('attendances');
  };
  