const connection = require('../database/connection');

module.exports = {
  async getAll(request, response) {
    const res = await connection('clients').select('*');
    return response.json(res);
  },

  async new(request, response) {
    const { name, cellphone, phone } = request.body;
    try {
      await connection('clients').insert({
        name,
        cellphone,
        phone,
      });
      return response.json({id});
    } catch (error) {
      console.log(error)
      return response.json({error: error});
    }    
  },

  async batchImport(request, response) {
    await connection('clients').insert({
      name,
      username,
      password,
    })
    return response.json({ id });
  },



};