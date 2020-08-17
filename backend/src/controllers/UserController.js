const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {
  async getAll(request, response) {
    const ongs = await connection('users').select('*');
  
    return response.json(ongs);
  },

  async new(request, response) {
    const { name, username, password } = request.body;

    const id = crypto.randomBytes(4).toString('HEX');
    
    await connection('users').insert({
      id,
      name,
      username,
      password,
    })

    return response.json({ id });
  }
};