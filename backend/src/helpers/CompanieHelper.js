const connection = require('../database/connection');

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
  getById
}