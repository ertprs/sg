const moment = require('moment')
const connection = require('../database/connection');
const ClientHelper = require('../helpers/ClientHelper');
const CompanieHelper = require('../helpers/CompanieHelper');
const UserHelper = require('../helpers/UserHelper');

const getAll = async (request, response) => {
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });

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
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });

    const reg = {
      client: request.body.client,
      user: request.body.user,
      dt_begin: request.body.dt_begin,
      dt_end: request.body.dt_end,
      description: request.body.description,
      negotiated_value: request.body.negotiated_value,
      grand_value: request.body.grand_value,
      status: request.body.status,
      obs: request.body.obs
    };

    const res = await connection('attendances').insert(reg)
    return response.json(res);
  } catch (error) {
    return response.json(error);
  }
}

const update = async (request, response) => {
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });

    const reg = {
      client: request.body.client,
      user: request.body.user,
      dt_begin: request.body.dt_begin,
      dt_end: request.body.dt_end,
      description: request.body.description,
      negotiated_value: request.body.negotiated_value,
      grand_value: request.body.grand_value,
      status: request.body.status,
      obs: request.body.obs
    };
    const res = await connection('attendances').where('id', '=', request.params.id).update(reg)
    return response.json(res);
  } catch (error) {
    return response.json(error);
  }
}

const deleteRegister = async (request, response) => {
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });

    const res = await connection('attendances').where('id', '=', request.params.id).del();
    return response.json(res);
  } catch (error) {
    return response.json(error);
  }
}


const getById = async (request, response) => {
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });

    const res = await connection('attendances')
      .where('id', '=', request.params.id)
      .select('*')
      .first();
    var attendance = {};
    const user = await UserHelper.getById(res.user);
    const client = await ClientHelper.getById(res.client);
    const companie = await CompanieHelper.getById(client.companie);
    attendance = {
      ...res,
      user_name: user ? user.name : '',
      companie: client ? client.companie : '',
      companie_name: companie ? companie.name : '',
      client_name: client ? client.name : '',
      client_document: client ? client.document : '',
    }

    return response.json(attendance);
  } catch (error) {
    return response.json(error);
  }
}

const findByName = async (request, response) => {
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });

    const res = await connection('attendances')
      .where('name', 'like', '%' + request.params.name + '%')
      .select('*');
    return response.json(res);
  } catch (error) {
    return response.json(error);
  }
}


const chartActualMonth = async (request, response) => {
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });
    const res = await connection('attendances')
      .select(
        connection.raw('SUM(CAST(REPLACE(REPLACE(negotiated_value, ".", ""), ",", ".") as float)) as negotiated_value'),
        connection.raw('substr(dt_begin, 4, 7 ) as "period"'),
        connection.raw('substr(dt_begin, 0, 11 ) as "date"')
        )
      .where({
        status: 'Negociado',
        period: moment().format('MM/YYYY')
      })
      .groupBy('date');
    return response.json(res);
  } catch (error) {
    console.log(error.message)
    return response.json(error);
  }

}

module.exports = {
  getAll,
  newRegister,
  getById,
  findByName,
  update,
  deleteRegister,
  chartActualMonth
}
