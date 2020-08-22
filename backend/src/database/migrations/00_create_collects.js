exports.up = function(knex) {
  return knex.schema.createTable('collects', function (table) {
    table.increments();
    table.string('name').notNullable();
    table.string('cellphone').notNullable();
    table.string('phone').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('collects');
};
