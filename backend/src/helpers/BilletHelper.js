const connection = require('../database/connection');
const asaas = require('../services/asaas');
const myFormat = require('../helpers/myFormat');
const moment = require('moment');



const emitBillet = async (billetId, client, billetTotal, attendance, dtDue) => {
  try {
    const asaasHeader = {
      headers: {
        "Content-Type": "application/json",
        "access_token": '97e802fc8baf605139013c728b6178ff5ff2c007fcac83305a442b9431ff57fb'
      }
    };
    const asaasBody = {
      "customer": await getAsaasCodeByClientId(client),
      "billingType": "BOLETO",
      "dueDate": moment(dtDue, 'DD/MM/YYYY').format('YYYY-DD-MM'),
      "value": myFormat.strValueToFloat(billetTotal),
      "description": "Atendimento " + String(attendance),
      "externalReference": String(billetId), //campo para busca
      "postalService": false
    }
    const res = await asaas.api.post('payments', asaasBody, asaasHeader);
    return res.data;
  } catch (error) {
    return error.message;
  }
}


const getAsaasCodeByClientId = async clientId => {
  try {
    const clientRes = await connection('clients')
      .where('id', '=', clientId)
      .select('*')
      .first();

    if (clientRes.asaas_code)
      return clientRes.asaas_code;

    const asaasHeader = {
      headers: {
        "Content-Type": "application/json",
        "access_token": '97e802fc8baf605139013c728b6178ff5ff2c007fcac83305a442b9431ff57fb'
      }
    };
    const asaasBody = {
      "name": clientRes.name,
      "cpfCnpj": clientRes.document,
      "email": clientRes.email_additional ? clientRes.email_additional : clientRes.email,
      "mobilePhone": clientRes.phone_additional ? phone_additional : clientRes.cellphone,
    }
    const asaasRes = await asaas.api.post('customers', asaasBody, asaasHeader);
    const updateClientRes = await connection('clients').where('id', '=', clientId).update({ asaas_code: asaasRes.data.id });
    return asaasRes.data.id;
  } catch (error) {
    return error.message;
  }

}


module.exports = {
  emitBillet,
  getAsaasCodeByClientId
}