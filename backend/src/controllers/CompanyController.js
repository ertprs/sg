const connection = require('../database/connection');


const getAll = async (request, response) => {
  try {
    const result = await connection('companies').select('*');
    return response.json(result);
  } catch (error) {
    return response.json(error);
  }
}

const newRegister = async (request, response) => {
  const { name } = request.body;
  try {
    const res = await connection('companies').insert({
      name,
    })
    return response.json(res);
  } catch (error) {
    return response.json(error);
  }
}

const update = async (request, response) => {
  const reg = {
    name: request.body.name,
  }
  try {
    const res =  await connection('companies').where('id', '=', request.params.id).update(reg)
    return response.json(res);
  } catch (error) {
    return response.json(error);
  }
}

const deleteRegister = async (request, response) => {
  try {
    const res = await connection('companies').where('id', '=', request.params.id).del();
    return response.json(res);
  } catch (error) {
    return response.json(error);
  }
}

const getById = async (id) => {
  try {
    const res = await connection('companies')
      .where('id', '=', id)
      .select('*');
    return res[0];
  } catch (error) {
    return error.message;
  }
}

module.exports = {
  getAll,
  newRegister,
  getById,
  update,
  deleteRegister
}
