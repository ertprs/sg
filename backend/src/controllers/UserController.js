const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {
  async getAll(request, response) {
    try {
      const result = await connection('users').select('*');
      return response.json(result);
    } catch (error) {
      return response.json({ error });
    }

  },

  async new(request, response) {
    const { name, username, password } = request.body;
    try {
      await connection('users').insert({
        name,
        username,
        password,
      });
      return response.json({ id });
    } catch (error) {
      return response.json({ error });
    }

  },

  async login(request, response) {
    const { username, password } = request.body;
    try {
      const result = await connection('users')
        .where({
          username: username,
          password: password
        })
        .select('*');
      return response.json(result[0]);
    } catch (error) {
      return response.json({ error });
    }
  },
};