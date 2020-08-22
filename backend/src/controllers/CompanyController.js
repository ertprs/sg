const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {
  async getAll(request, response) {
    try {
      const result = await connection('companies').select('*');
      return response.json(result);
    } catch (error) {
      return response.json(error);
    }

  },

  async new(request, response) {
    const { name } = request.body;
    try {
      await connection('companies').insert({
        name,
      })
      return response.json({ id });
    } catch (error) {
      return response.json({ error });
    }
  },

};