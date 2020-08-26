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
      await connection('companies').insert({
        name,
      })
      return response.json({ id });
    } catch (error) {
      return response.json({ error });
    }
  }

  const getById = async (id) => {
    try {
      const result = await connection('companies')
      .where('id', '=', id )
      .select('*');
      return result[0];
    } catch (error) {
      return error.message;
    }
  }

module.exports = {
  getAll,
  newRegister,
  getById
}
