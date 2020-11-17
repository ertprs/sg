exports.up = async knex => {
  await knex.schema.table('attendances', async table => {
    table.string('created_at');
    table.string('updated_at');
    table.string('last_user');
  });
  await knex.schema.table('clients', async table => {
    table.string('created_at');
    table.string('updated_at');
    table.string('last_user');
  });
  await knex.schema.table('companies', async table => {
    table.string('created_at');
    table.string('updated_at');
    table.string('last_user');
  });
  await knex.schema.table('users', async table => {
    table.string('created_at');
    table.string('updated_at');
    table.string('last_user');
  });
  await knex.schema.table('billets', async table => {
    table.dropColumn('created_at');
    table.dropColumn('updated_at');
  });
  await knex.schema.table('billets', async table => {
    table.string('created_at');
    table.string('updated_at');
    table.string('last_user');
  });
  await knex.schema.table('collects', async table => {
    table.dropColumn('created_at');
    table.dropColumn('updated_at');
  });
  await knex.schema.table('collects', async table => {
    table.string('created_at');
    table.string('updated_at');
    table.string('last_user');
  });
};

exports.down = function (knex) {
  await knex.schema.table('attendances', async table => {
    table.dropColumn('created_at');
    table.dropColumn('updated_at');
    table.dropColumn('last_user');
  });
  await knex.schema.table('clients', async table => {
    table.dropColumn('created_at');
    table.dropColumn('updated_at');
    table.dropColumn('last_user');
  });
  await knex.schema.table('companies', async table => {
    table.dropColumn('created_at');
    table.dropColumn('updated_at');
    table.dropColumn('last_user');
  });
  await knex.schema.table('users', async table => {
    table.dropColumn('created_at');
    table.dropColumn('updated_at');
    table.dropColumn('last_user');
  });
  await knex.schema.table('billets', async table => {
    table.dropColumn('created_at');
    table.dropColumn('updated_at');
    table.dropColumn('last_user');
  });
  await knex.schema.table('collects', async table => {
    table.dropColumn('created_at');
    table.dropColumn('updated_at');
    table.dropColumn('last_user');
  });
};