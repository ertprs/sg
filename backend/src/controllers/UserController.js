const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {
  async getAll(request, response) {
    const users = await connection('users').select('*');
  
    return response.json(users);
  },

  async new(request, response) {
    const { name, username, password } = request.body;

    const id = crypto.randomBytes(4).toString('HEX');
    password = 
    
    await connection('users').insert({
      id,
      name,
      username,
      password,
    })

    return response.json({ id });
  },

  async login(request, response) {
    const { username, password } = request.body;
    console.log(username, password)
    const users = await connection('users')
    .where({
      username: username,
      password: password
    })  
    .select('*');

    return response.json(users[0]);
    
  
    
  },
};