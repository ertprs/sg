const connection = require('../database/connection');
const CompanyController = require('../controllers/CompanyController')


const getAll = async (request, response) => {
  try {
    const res = await connection('clients').select('*');
    clients = [];
    for (client of res) {
      const companie = await CompanyController.getById(client.companie);
      clients.push({ ...client, companie_name: companie ? companie.name : '' })
    }
    return response.json(clients);
  } catch (error) {
    return response.json({ error: error.message });
  }
}

const getOneByName = async (name) => {
  if (!name) return {}
  try {
    const res = await connection('clients')
      .where('name', '=', name)
      .select('*');
    return res[0];
  } catch (error) {
    return error;
  }
}

const newIfNotExists = async (client) => {
  try {
    var existent = [];
    existent = await getOneByName(client.name);
    if (existent) {
      return existent.id
    } else {
      const res = await connection('clients').insert(client);
      return res[0]
    }
  } catch (error) {
    console.log(error)
    return error;
  }
}

const newRegister = async (request, response) => {
  const register = {
    name: request.body.name,
    companie: request.body.companie,
    phone: request.body.phone,
    cellphone: request.body.cellphone
  };
  try {
    const res = await connection('clients').insert(register);
    return response.json({ id: res.id });
  } catch (error) {
    return response.json(error);
  }
}

const update = async (request, response) => {
  const register = {
    name: request.body.name,
    companie: request.body.companie,
    phone: request.body.phone,
    cellphone: request.body.cellphone
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

const getById = async (id) => {
  try {
    const result = await connection('clients')
      .where('id', '=', id)
      .select('*');
    return result[0];
  } catch (error) {
    console.log(error)
    return error;
  }
}



module.exports = {
  getAll,
  newRegister,
  newIfNotExists,
  getById,
  update,
  deleteRegister
}