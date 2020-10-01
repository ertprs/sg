const connection = require('../database/connection');
const ClientHelper = require('../helpers/ClientHelper');
const CompanieHelper = require('../helpers/CompanieHelper');
const UserHelper = require('../helpers/UserHelper');

const getAll = async (request, response) => {
  try {
    const res = await connection('attendances').select('*');
    attendances = [];
    for (attendance of res) {
      const user = await UserHelper.getById(attendance.user);
      const client = await ClientHelper.getById(attendance.client);
      const companie = await CompanieHelper.getById(attendance.companie);
      attendances.push({
        ...attendance,
        user_name: user ? user.name : '',
        client_name: client ? client.name : '',
        client_document: client ? client.document : '',
        companie_name: companie && companie ? companie.name : '',
      })
    }
    return response.json(attendances);
  } catch (error) {
    return response.json(error);
  }
}

const newRegister = async (request, response) => {
  const reg = {
    client: request.body.client,
    user: request.body.user,
    dt_begin: request.body.dt_begin,
    dt_end: request.body.dt_end,
    description: request.body.description,
    negotiated_value: request.body.negotiated_value,
    grand_value:request.body.grand_value,
    obs: request.body.obs
  };
  try {
    const res = await connection('attendances').insert(reg)
    return response.json(res);
  } catch (error) {
    return response.json(error);
  }
}

const update = async (request, response) => {
  const reg = {
    client: request.body.client,
    user: request.body.user,
    dt_begin: request.body.dt_begin,
    dt_end: request.body.dt_end,
    description: request.body.description,
    negotiated_value: request.body.negotiated_value,
    grand_value:request.body.grand_value,
    obs: request.body.obs
  };
  try {
    const res = await connection('attendances').where('id', '=', request.params.id).update(reg)
    return response.json(res);
  } catch (error) {
    return response.json(error);
  }
}

const deleteRegister = async (request, response) => {
  try {
    const res = await connection('attendances').where('id', '=', request.params.id).del();
    return response.json(res);
  } catch (error) {
    return response.json(error);
  }
}


const getById = async (request, response) => {
  try {
    const res = await connection('attendances')
      .where('id', '=', request.params.id)
      .select('*')
      .first();
    attendance = {};
    const user = await UserHelper.getById(attendance.user);
    const client = await ClientHelper.getById(attendance.client);
    const attendance = {
      ...res,
      user_name: user ? user.name : '',
      client_name: client ? client.name : '',
      client_document: client ? client.document : '',
    }

    return response.json(res[0]);
  } catch (error) {
    return response.json(error);
  }
}

const findByName = async (request, response) => {
  try {
    const res = await connection('attendances')
      .where('name', 'like', '%' + request.params.name + '%')
      .select('*');
    return response.json(res);
  } catch (error) {
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
