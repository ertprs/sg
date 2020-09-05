exports.up = function(knex) {
  return knex.schema.createTable('companies', function (table) {
    table.increments();
    table.string('name').notNullable();
    
    table.string('obs');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('companies');
};
