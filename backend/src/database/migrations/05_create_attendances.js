exports.up = function(knex) {
    return knex.schema.createTable('attendances', function (table) {
      table.increments();
      table.decimal('client');
      table.decimal('user');
      table.string('dt_begin');
      table.string('dt_end');
      table.string('description');
      
      table.string('obs');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('attendances');
  };
  