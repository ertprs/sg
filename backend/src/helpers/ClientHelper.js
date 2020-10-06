const connection = require('../database/connection');

const getById = async (id) => {
  try {
    const res = await connection('clients')
      .where('id', '=', id)
      .select('*');
    return res[0];
  } catch (error) {
    return error.message;
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


const getOneByCode = async (code) => {
  if (!code) 
    return 
  try {
    const res = await connection('clients')
      .where('code', '=', code)
      .select('*')
      .first();
    return res;
  } catch (error) {
    return error;
  }
}


const getOneByName = async (name) => {
  if (!name) 
    return 
  try {
    const res = await connection('clients')
      .where('name', '=', name)
      .select('*')
      .first();
    return res;
  } catch (error) {
    return error;
  }
}
module.exports = {
  getById,
  getOneByCode,
  newIfNotExists
}