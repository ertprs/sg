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
      "customer": "16317475", //generate or create Assas code by client id
      "billingType": "BOLETO",
      "dueDate": moment(dtDue).format('yyyy-DD-mm'),
      "value": myFormat.strValueToFloat(billetTotal),
      "description": "Cobranca " + String(attendance),
      "externalReference": String(billetId), //campo para busca
      "postalService": false
    }

    console.log(asaasBody)

    const res = {}//await asaas.api.post('payments', asaasBody, asaasHeader);

    return res.data;
  } catch (error) {
    return error.message;
  }
}


module.exports = {
  emitBillet
}