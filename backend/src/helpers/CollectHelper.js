const connection = require('../database/connection');

const getById = async (id) => {
  try {
    const res = await connection('collects')
      .where('id', '=', id)
      .select('*');
    return res[0];
  } catch (error) {
    return error.message;
  }
}

const newIfNotExists = async (collect) => {
  try {
    var existent = [];
    existent = await findCollect(collect);
    if (existent) {
      return existent.id
    } else {
      const res = await connection('collects').insert(collect);
      return res[0]
    }
  } catch (error) {
    console.log(error)
    return error;
  }
}

const findCollect = async (collect) => {
  if (!collect)
    return
  try {
    const res = await connection('collects')
      .where({
        companie: collect.companie, 
        client: collect.client,
        dt_maturity: collect.dt_maturity,
        value: collect.value,
        maximum_discount: collect.maximum_discount,
        status: collect.status
      })
      .select('*')
      .first();
    return res;
  } catch (error) {
    return error;
  }
}


module.exports = {
  getById,
  newIfNotExists
}