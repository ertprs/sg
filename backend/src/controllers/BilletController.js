const connection = require('../database/connection');
const CompanieHelper = require('../helpers/CompanieHelper');
const ClientHelper = require('../helpers/ClientHelper');
const UserHelper = require('../helpers/UserHelper');
const BilletHelper = require('../helpers/BilletHelper');

const getAll = async (request, response) => {
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });


    const res = await connection('billets').select('*');
    billets = [];
    for (billet of res) {
      const companie = await CompanieHelper.getById(billet.companie);
      const client = await ClientHelper.getById(billet.client);
      billets.push({
        ...billet,
        companie_name: companie ? companie.name : '',
        client_name: client ? client.name : ''
      })
    }
    return response.json(billets);
  } catch (error) {
    return response.json({ error: error.message });
  }
}

const newRegister = async (request, response) => {
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });
    
    const register = {
      attendance: request.body.attendance,
      companie: request.body.companie,
      client: request.body.client,
      dt_generation: request.body.dt_generation,
      dt_due: request.body.dt_due,
      qt_parcel: request.body.qt_parcel,
      parcel: request.body.parcel,
      status: request.body.status,
      billet_total: request.body.billet_total,
      negotiated_value: request.body.negotiated_value,
      asaas_url: request.body.asaas_url,
      obs: request.body.obs,
    };

    const res = await connection('billets').insert(register);
    
    const asaasRes = await BilletHelper.emitBillet(res[0], register.client, register.billet_total, register.attendance, register.dt_due);

    const attendeRes = await connection('attendance')
      .put({asaas_url: asaasRes.bankSlipUrl})
      .where({ id: res[0]});
    return response.json(asaasRes);
  } catch (error) {
    return response.json(error);
  }
}

const update = async (request, response) => {
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });

    const register = {
      attendance: request.body.attendance,
      companie: request.body.companie,
      client: request.body.client,
      dt_generation: request.body.dt_generation,
      dt_due: request.body.dt_due,
      qt_parcel: request.body.qt_parcel,
      parcel: request.body.parcel,
      status: request.body.status,
      billet_total: request.body.billet_total,
      negotiated_value: request.body.negotiated_value,
      asaas_url: request.body.asaas_url,
      obs: request.body.obs,
    };

    const res = await connection('billets').where('id', '=', request.params.id).update(register)
    return response.json(res);
  } catch (error) {
    return response.json(error);
  }
}


const deleteRegister = async (request, response) => {
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });
    const res = await connection('billets').where('id', '=', request.params.id).del();
    return response.json(res);
  } catch (error) {
    return response.json(error);
  }
}

const getById = async (request, response) => {
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });

    const res = await connection('billets')
      .where('id', '=', request.params.id)
      .select('*')
      .first();
    const companie = await CompanieHelper.getById(res.companie);
    const client = await ClientHelper.getById(res.client);
    const billet = {
      ...res,
      companie_name: companie ? companie.name : '',
      client_name: client ? client.name : ''
    }
    return response.json(billet);
  } catch (error) {
    console.log(error)
    return response.json(error);
  }
}


module.exports = {
  getAll,
  newRegister,
  getById,
  update,
  deleteRegister
}