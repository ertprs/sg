const connection = require('../database/connection');

module.exports = {
  async getAll(request, response) {
    try {
      const result = await connection('collects').select('*');
      return response.json(result);
    } catch (error) {
      return response.json({ error });
    }

  },

  async new(request, response) {
    const { name, cellphone, phone } = request.body;
    try {
      await connection('collects').insert({
        name,
        cellphone,
        phone,
      });
      return response.json({ id });
    } catch (error) {
      return response.json({ error });
    }
  },



};