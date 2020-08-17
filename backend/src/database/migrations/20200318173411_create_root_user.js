exports.up = function(knex) {
  return knex('users').insert({
      id: 1,
      name: 'root',
      username: 'root',
      password: 'root'
  });
};

exports.down = function(knex) {
  return knex('users').del();
};
