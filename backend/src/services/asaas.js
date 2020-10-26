const axios = require('axios');

var baseURL = 'https://www.asaas.com/api/v3'; //PRODUÇÃO
//var baseURL = 'https://sandbox.asaas.com/api/v3'; //TESTE


const api = axios.create({
  baseURL: baseURL,
})


module.exports = {
  api
}