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
    console.log(error)
    return response.json({ error: error.message });
  }
}

const newRegister = async (request, response) => {
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });

    var firstAsaasRes;

    const parcels = request.body.parcels;

    const register = {
      attendance: request.body.attendance,
      companie: request.body.companie,
      client: request.body.client,
      dt_generation: request.body.dt_generation,
      dt_due: request.body.dt_due,
      status: request.body.status,
      billet_total: request.body.billet_total,
      negotiated_value: request.body.negotiated_value,
      asaas_url: request.body.asaas_url,
      obs: request.body.obs,
    };

    for (parcel of parcels) {
      const newRegister = {
        attendance: request.body.attendance,
        companie: request.body.companie,
        client: request.body.client,
        dt_generation: request.body.dt_generation,
        status: request.body.status,
        negotiated_value: request.body.negotiated_value,
        asaas_url: request.body.asaas_url,
        obs: request.body.obs,
        dt_due: parcel.dt_due,
        billet_total: parcel.billet_total,
      }
      const res = await connection('billets').insert(newRegister);

      const asaasRes = await BilletHelper.emitBillet(res[0], newRegister.client, newRegister.billet_total, newRegister.attendance, newRegister.dt_due);

      if (parcels.indexOf(parcel) === 0) {
        firstAsaasRes = asaasRes;
      }

      const billetRes = await connection('billets')
        .where({ id: res[0] })
        .update({
          asaas_id: asaasRes.id,
          asaas_url: asaasRes.bankSlipUrl,
          status: 'AGUARDANDO PAGAMENTO'
        });

    }

    return response.json(firstAsaasRes);
  } catch (error) {
    console.log(error)
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
    const billetsRes = await connection('billets').where('id', '=', request.params.id).select('*').first();
    const asaasRes = await BilletHelper.deleteBillet(billetsRes.asaas_id);
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