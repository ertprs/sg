const connection = require('../database/connection');
const CompanieHelper = require('../helpers/CompanieHelper');


const getAll = async (request, response) => {
  try {
    const res = await connection('clients').select('*');
    clients = [];
    for (client of res) {
      const companie = await CompanieHelper.getById(client.companie);
      clients.push({ ...client, companie_name: companie ? companie.name : '' })
    }
    return response.json(clients);
  } catch (error) {
    return response.json({ error: error.message });
  }
}

const newRegister = async (request, response) => {
  const register = {
    code: request.body.code,
    name: request.body.name,
    companie: request.body.companie,
    phone: request.body.phone,
    phone_additional: request.body.phone_additional,
    cellphone: request.body.cellphone,
    edress: request.body.edress,
    edress_additional: request.body.edress_additional,
    email: request.body.email,
    email_additional: request.body.email_additional,
    document: request.body.document,
    obs: request.body.obs,
  };
  try {
    const res = await connection('clients').insert(register);
    return response.json(res);
  } catch (error) {
    return response.json(error);
  }
}

const update = async (request, response) => {
  const register = {
    code: request.body.code,
    name: request.body.name,
    companie: request.body.companie,
    phone: request.body.phone,
    phone_additional: request.phone_additional,
    cellphone: request.body.cellphone,
    edress: request.body.edress,
    edress_additional: request.body.edress_additional,
    email: request.body.email,
    email_additional: request.body.email_additional,
    document: request.body.document,
    obs: request.body.obs,
  };
  try {
    const res = await connection('clients').where('id', '=', request.params.id).update(register)
    return response.json(res);
  } catch (error) {
    return response.json(error);
  }
}


const deleteRegister = async (request, response) => {
  try {
    const res = await connection('clients').where('id', '=', request.params.id).del();
    return response.json(res);
  } catch (error) {
    return response.json(error);
  }
}

const getById = async (request, response) => {
  try {
    const res = await connection('clients')
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
    const res = await connection('clients')
      .where('name', 'like', '%' + request.params.name + '%')
      .select('*');
    clients = [];
    for (client of res) {
      const companie = await CompanieHelper.getById(client.companie);
      clients.push({ ...client, companie_name: companie ? companie.name : '' })
    }
    return response.json(clients);
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