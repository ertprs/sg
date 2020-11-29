const updateTablesSafely = knex => tables => {
  const updateTables = tables.map(({ name, schema }) => {
    return knex.schema.table(name, schema)
  });

  return Promise.all(updateTables)
    .catch(e => {
      const dropTables = tables.map(({ name }) => {
        return knex.schema.dropColumn(name);
      });

      return Promise.all(dropTables).then(() => Promise.reject(e));
    });
}

exports.up = async knex => {
  return updateTablesSafely(knex)([
    {
      name: "attendances",
      schema(table) {
        table.string('created_at');
        table.string('updated_at');
        table.string('last_user');
      },
    },
    {
      name: "clients",
      schema(table) {
        table.string('created_at');
        table.string('updated_at');
        table.string('last_user');
      },
    },
    {
      name: "companies",
      schema(table) {
        table.string('created_at');
        table.string('updated_at');
        table.string('last_user');
      },
    },
    {
      name: "users",
      schema(table) {
        table.string('created_at');
        table.string('updated_at');
        table.string('last_user');
      },
    },
    {
      name: "billets",
      schema(table) {
        table.string('created_at');
        table.string('updated_at');
        table.string('last_user');
      },
    },
    {
      name: "collects",
      schema(table) {
        table.string('created_at');
        table.string('updated_at');
        table.string('last_user');
      },
    },
  ]);
}

exports.down = function (knex) {
  return updateTablesSafely(knex)([
    {
      name: "attendances",
      schema(table) {
        table.dropColumn('created_at');
        table.dropColumn('updated_at');
        table.dropColumn('last_user');
      },
    },
    {
      name: "clients",
      schema(table) {
        table.dropColumn('created_at');
        table.dropColumn('updated_at');
        table.dropColumn('last_user');
      },
    },
    {
      name: "companies",
      schema(table) {
        table.dropColumn('created_at');
        table.dropColumn('updated_at');
        table.dropColumn('last_user');
      },
    },
    {
      name: "users",
      schema(table) {
        table.dropColumn('created_at');
        table.dropColumn('updated_at');
        table.dropColumn('last_user');
      },
    },
    {
      name: "billets",
      schema(table) {
        table.dropColumn('created_at');
        table.dropColumn('updated_at');
        table.dropColumn('last_user');
      },
    },
    {
      name: "collects",
      schema(table) {
        table.dropColumn('created_at');
        table.dropColumn('updated_at');
        table.dropColumn('last_user');
      },
    },
  ]);
};