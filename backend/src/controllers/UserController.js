const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {
  async getAll(request, response) {
    try {
      const result = await connection('users').select('*');
      return response.json(result);
    } catch (error) {
      return response.json({ error: error.message });
    }

  },

  async newRegister(request, response) {
    const reg =  { 
      name: request.body.name,
      username: request.body.username,
      password: request.body.password,
      adress: request.body.password,
      document: request.body.document,
      email: request.body.email,
      phone: request.body.phone,
      identitet: request.body.identitet,
      obs: request.body.obs 
    };
    try {
      await connection('users').insert(reg);
      return response.json({ id });
    } catch (error) {
      return response.json({ error: error.message });
    }
  },

  async update (request, response) {
    const reg =  { 
      name: request.body.name,
      username: request.body.username,
      password: request.body.password,
      adress: request.body.password,
      document: request.body.document,
      email: request.body.email,
      phone: request.body.phone,
      identitet: request.body.identitet,
      obs: request.body.obs 
    };
    try {
      const res =  await connection('users').where('id', '=', request.params.id).update(reg)
      return response.json(res);
    } catch (error) {
      return response.json(error);
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
        .select('*')
        .first();
      return response.json(result);
    } catch (error) {
      return response.json({ error: error.message });
    }
  },
};