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
  const reg = {
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
  try {
    const res = await connection('companies').insert(reg)
    return response.json(res);
  } catch (error) {
    return response.json(error);
  }
}

const update = async (request, response) => {
  const reg = {
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


const getById = async (request, response) => {
  try {
    const res = await connection('companies')
      .where('id', '=', request.params.id)
      .select('*')
      .first();
      return response.json(res);
  } catch (error) {
    return response.json({error: error.message});
  }
}


const findByName = async (request, response) => {
  try {
    const res = await connection('companies')
      .where('name', 'like', '%'+request.params.name+'%')
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
