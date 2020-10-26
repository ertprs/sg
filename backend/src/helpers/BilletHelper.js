const connection = require('../database/connection');
const asaas = require('../services/asaas');


const emitBillet = async (id) => {
  try {
    const asaasHeader = {
      headers: {
        "Content-Type": "application/json",
        "access_token": '97e802fc8baf605139013c728b6178ff5ff2c007fcac83305a442b9431ff57fb'
      }
    };

    const asaasBody = {
      "customer": "16317475",
      "billingType": "BOLETO",
      "dueDate": "2017-06-10",
      "value": 1,
      "description": "Pedido 056984",
      "externalReference": "056984", //campo para busca
      "postalService": false
    }

    const res = await asaas.api.post('payments', asaasBody, asaasHeader);

    console.log(res)

    return res;
  } catch (error) {
    return error.message;
  }
}


module.exports = {
  emitBillet
}