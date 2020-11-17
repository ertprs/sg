const connection = require('../database/connection');
const UserHelper = require('../helpers/UserHelper');

const crypto = require('crypto');
const moment = require('moment');

module.exports = {
  async getAll(request, response) {
    try {
      if (! await UserHelper.validUser(request.headers.hash))
        return response.json({ error: 'Access denied' });

      const res = await connection('users').select('*');
      users = [];
      for (user of res) {
        const lastUser = await UserHelper.getById(user.last_user);
        users.push({
          ...user,
          last_user_name: lastUser ? lastUser.name : '', 
        });
      }
      
      return response.json(users);
    } catch (error) {
      return response.json({ error: error.message });
    }

  },

  async newRegister(request, response) {
    try {
      if (! await UserHelper.validUser(request.headers.hash))
        return response.json({ error: 'Access denied' });

      const reg = {
        last_user: request.headers.user_id,
        created_at: moment().format('L LT'),
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
        last_user: request.headers.user_id,
        updated_at: moment().format('L LT'),
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