const connection = require('../database/connection');

const getById = async (id) => {
  try {
    const res = await connection('users')
      .where('id', '=', id)
      .select('*');
    return res[0];
  } catch (error) {
    return error.message;
  }
}

const validUser = async (hash) => {
  try {
    if (!hash)
      return false

    const res = await connection('users')
      .where('hash', '=', 'DEFA')
      .select('*');

    if (res.length > 0)
      return true
    else
      return false;

  } catch (error) {
    console.log(error)
    return false;
  }
}


module.exports = {
  getById,
  validUser
}