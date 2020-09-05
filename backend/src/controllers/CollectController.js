const connection = require('../database/connection');
const ClientHelper = require('../helpers/ClientHelper');
const CompanieHelper = require('../helpers/CompanieHelper');


const getAll = async (request, response) => {
  try {
    const res = await connection('collects').select('*');
    collects = [];
    for (collect of res) {
      const client = await ClientHelper.getById(collect.client);
      const companie = await CompanieHelper.getById(collect.companie);
      collects.push({
        ...collect,
        client_name: client ? client.name : '',
        client_document: client ? client.document : '',
        companie_name: companie && companie ? companie.name : '',
      })
    }
    return response.json(collects);
  } catch (error) {
    return response.json({ error: error.message });
  }
}

const update = async (request, response) => {
  const register = {
    code: request.body.code,
    client: request.body.client,
    status: request.body.status,
    companie: request.body.companie,
    account: request.body.account,
    document: request.body.document,
    dt_maturity: request.body.dt_maturity,
    days: request.body.days,
    value: request.body.value,
    amount: request.body.amount,
    penalty: request.body.penalty,
    interest: request.body.interest,
    updated_debt: request.body.updated_debt,
    honorary: request.body.honorary,
    maximum_discount: request.body.maximum_discount,
    negotiated_value: request.body.negotiated_value,
    obs: request.body.obs
  };
  try {
    const res = await connection('collects').where('id', '=', request.params.id).update(register)
    return response.json(res);
  } catch (error) {
    return response.json({ error: error.message });
  }
}

const deleteRegister = async (request, response) => {
  try {
    const res = await connection('collects').where('id', '=', request.params.id).del();
    return response.json(res);
  } catch (error) {
    return response.json({ error: error.message });
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
    return { error: error.message };
  }
}

const newRegister = async (request, response) => {
  const register = {
    code: request.body.code,
    client: request.body.client,
    status: request.body.status,
    companie: request.body.companie,
    account: request.body.account,
    document: request.body.document,
    dt_maturity: request.body.dt_maturity,
    days: request.body.days,
    value: request.body.value,
    amount: request.body.amount,
    penalty: request.body.penalty,
    interest: request.body.interest,
    updated_debt: request.body.updated_debt,
    honorary: request.body.honorary,
    maximum_discount: request.body.maximum_discount,
    negotiated_value: request.body.negotiated_value,
    obs: request.body.obs
  };
  try {
    const res = await connection('collects').insert(register);
    return response.json(res[0]);
  } catch (error) {
    console.log(error.message)
    return response.json({ error: error.message });
  }
}

const importCollect = async (request, response) => {
  try {
    const collect = await {
      code: request.body.code,
      client: await ClientController.newIfNotExists({
        name: request.body.client,
        companie: request.body.companie,
        phone: request.body.phone,
        cellphone: request.body.cellphone
      }),
      status: request.body.status,
      companie: request.body.companie,
      account: request.body.account,
      document: request.body.document,
      dt_maturity: request.body.dt_maturity,
      days: request.body.days,
      value: request.body.value,
      amount: request.body.amount,
      obs: 'importado'
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
    return response.json({ error: error.message });
  }
}

module.exports = {
  getAll,
  newRegister,
  importCollect,
  update,
  deleteRegister
}