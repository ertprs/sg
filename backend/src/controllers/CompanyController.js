const connection = require('../database/connection');
const UserHelper = require('../helpers/UserHelper');

const moment = require('moment');

const getAll = async (request, response) => {
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });

    const res = await connection('companies').select('*');
    companies = [];
    for (companie of res) {
      const lastUser = await UserHelper.getById(companie.last_user);
      companies.push({
        ...companie,
        last_user_name: lastUser ? lastUser.name : ''
      })
    }

    return response.json(companies);
  } catch (error) {
    console.log(error)
    return response.json(error);
  }
}

const newRegister = async (request, response) => {
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });

    const reg = {
      last_user: request.headers.user_id,
      created_at: moment().format('L LT'),
      name: request.body.name,
      cnpj: request.body.cnpj,
      edress: request.body.edress,
      phone: request.body.phone,
      responsible_staff: request.body.responsible_staff,
      dt_contract: request.body.dt_contract,
      dt_renovation: request.body.dt_renovation,
      default_interest: request.body.default_interest,
      default_honorary: request.body.default_honorary,
      default_penalty: request.body.default_penalty,
      monthly_value: request.body.monthly_value,
      payday: request.body.payday,
      payment_type: request.body.payment_type,
      obs: request.body.obs,
    };

    const res = await connection('companies').insert(reg)
    return response.json(res);
  } catch (error) {
    console.log(error)
    return response.json(error);

  }
}

const update = async (request, response) => {
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });

    const reg = {
      last_user: request.headers.user_id,
      updated_at: moment().format('L LT'),
      name: request.body.name,
      cnpj: request.body.cnpj,
      edress: request.body.edress,
      phone: request.body.phone,
      responsible_staff: request.body.responsible_staff,
      dt_contract: request.body.dt_contract,
      dt_renovation: request.body.dt_renovation,
      default_interest: request.body.default_interest,
      default_honorary: request.body.default_honorary,
      default_penalty: request.body.default_penalty,
      monthly_value: request.body.monthly_value,
      payday: request.body.payday,
      payment_type: request.body.payment_type,
      obs: request.body.obs,
    };
    const res = await connection('companies').where('id', '=', request.params.id).update(reg)
    return response.json(res);
  } catch (error) {
    console.log(error)
    return response.json(error);
  }
}

const deleteRegister = async (request, response) => {
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });

    const res = await connection('companies').where('id', '=', request.params.id).del();
    return response.json(res);
  } catch (error) {
    console.log(error)
    return response.json(error);
  }
}


const getById = async (request, response) => {
  try {    
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });

    const res = await connection('companies')
      .where('id', '=', request.params.id)
      .select('*')
      .first();
    return response.json(res);
  } catch (error) {
    console.log(error)
    return response.json(error);
  }
}


const findByName = async (request, response) => {
  try {
    const res = await connection('companies')
      .where('name', 'like', '%' + request.params.name + '%')
      .select('*');
    return response.json(res);
  } catch (error) {
    console.log(error)
    return response.json(error);
  }
}

module.exports = {
  getAll,
  newRegister,
  getById,
  findByName,
  update,
  deleteRegister
}
