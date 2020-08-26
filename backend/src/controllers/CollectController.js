const connection = require('../database/connection');
const ClientController = require('../controllers/ClientController');


const getAll = async (request, response) => {
  try {
    const res = await connection('collects').select('*');
    collects = [];
    for (collect of res) {
      const client = await ClientController.getById(collect.client);
      if (client)
        collects = [...collects, { ...collect, client_name: client.name }]
    }
    return response.json(collects);
  } catch (error) {
    return response.json(error);
  }
}

const getByCode = async (collectCode) => {
  try {
    const resCollect = await connection('collects')
      .where('code', '=', collectCode)
      .select('*');
    return resCollect[0];
  } catch (error) {
    console.log(error)
    return {};
  }
}

const newRegister = async (request, response) => {
  const collect = {
    code: request.body.code,
    client: request.body.client,
    cellphone: request.body.cellphone,
    phone: request.body.phone,
    account: request.body.account,
    document: request.body.document,
    type_maturity: request.body.type_maturity,
    dt_emission: request.body.dt_emission,
    dt_begin: request.body.dt_begin,
    dt_end: request.body.dt_end,
    dt_maturity: request.body.dt_maturity,
    days: request.body.days,
    value: request.body.value,
    amount: request.body.amount,
  };
  try {
    const res = await connection('collects').insert(collect);
    return response.json({ id: res[0].id });
  } catch (error) {
    return response.json(error);
  }
}

const importCollect = async (request, response) => {
  try {
    const collect = await {
      code: request.body.code,
      client: await ClientController.newIfNotExists(request.body.client, request.body.companie),
      companie: request.body.companie,
      cellphone: request.body.cellphone,
      phone: request.body.phone,
      account: request.body.account,
      document: request.body.document,
      type_maturity: request.body.type_maturity,
      dt_emission: request.body.dt_emission,
      dt_begin: request.body.dt_begin,
      dt_end: request.body.dt_end,
      dt_maturity: request.body.dt_maturity,
      days: request.body.days,
      value: request.body.value,
      amount: request.body.amount,
    };
    var res;
    const existentCollect = await getByCode(request.body.code);
    if (existentCollect) {
      res = await connection('collects').where('code', '=', collect.code).update(collect);
      return response.json(res);
    }
    else {
      res = await connection('collects').insert(collect);
      return response.json(res);
    }
  } catch (error) {
    console.log(error)
    return response.json(error);
  }
}

module.exports = {
  getAll,
  newRegister,
  importCollect
}