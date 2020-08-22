const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {
  async getAll(request, response) {
    try {
      const users = await connection('clients').select('*');
      return response.json(users);
    } catch (error) {
      return response.json({ error });
    }

  },

  async new(request, response) {
    const { name, username, password } = request.body;
    try {
      await connection('clients').insert({
        name,
      });
      return response.json({ id });
    } catch (error) {
      return response.json({ error });
    }

  },
};