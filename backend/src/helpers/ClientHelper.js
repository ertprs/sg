const connection = require('../database/connection');

const getById = async (id) => {
  if (!id)
    return {}
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
    const clientId = await getOneByName(client.name);
    if (clientId > 0) {
      return clientId
    } else {
      const res = await connection('clients').insert(client);
      return res[0]
    }
  } catch (error) {
    console.log(error)
    return error;
  }
}


const getOneByName = async (name) => {
  if (!name)
    return 0
  try {
    const res = await connection('clients')
      .where('name', '=', name)
      .select('*')
      .first();
    if (res)
      return res.id
    else
      return 0
  } catch (error) {
    return error;
  }
}
module.exports = {
  getById,
  newIfNotExists
}