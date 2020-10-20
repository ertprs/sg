const connection = require('../database/connection');
const crypto = require('crypto');
const UserHelper = require('../helpers/UserHelper');

module.exports = {
  async getAll(request, response) {
    try {
      if (! await UserHelper.validUser(request.headers.hash))
        return response.json({ error: 'Access denied' });


      const result = await connection('users').select('*');
      return response.json(result);
    } catch (error) {
      return response.json({ error: error.message });
    }

  },

  async newRegister(request, response) {
    try {
      if (! await UserHelper.validUser(request.headers.hash))
        return response.json({ error: 'Access denied' });

      const reg = {
        hash: crypto.randomBytes(4).toString('HEX'),
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

      await connection('users').insert(reg);
      return response.json({ id });
    } catch (error) {
      return response.json({ error: error.message });
    }
  },

  async update(request, response) {
    try {
      if (! await UserHelper.validUser(request.headers.hash))
        return response.json({ error: 'Access denied' });

      const reg = {
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
      const res = await connection('users').where('id', '=', request.params.id).update(reg)
      return response.json(res);
    } catch (error) {
      return response.json(error);
    }
  },

  async login(request, response) {
    try {
      const { username, password } = request.body;
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