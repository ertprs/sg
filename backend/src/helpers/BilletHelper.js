const connection = require('../database/connection');
const asaas = require('../services/asaas');
const CollectHelper = require('../helpers/CollectHelper')
const myFormat = require('../helpers/myFormat');
const moment = require('moment');



const emitBillet = async (billetId, client, billetTotal, detail, dtDue) => {
  try {
    const asaasHeader = {
      headers: {
        "Content-Type": "application/json",
        "access_token": '97e802fc8baf605139013c728b6178ff5ff2c007fcac83305a442b9431ff57fb'
      }
    };
    console.log(detail)

    const asaasBody = await {
      "customer": await getAsaasCodeByClientId(client),
      "billingType": "BOLETO",
      "dueDate": moment(dtDue, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      "value": myFormat.strValueToFloat(billetTotal),
      "description": detail,
      "externalReference": String(billetId), //campo para busca
      "postalService": false
    }
    const res = await asaas.api.post('payments', asaasBody, asaasHeader);
    return res.data;
  } catch (error) {
    console.log(error.message)
    return error.message;
  }
}

const getAsaasCodeByClientId = async clientId => {
  try {
    const clientRes = await connection('clients')
      .where('id', '=', clientId)
      .select('*')
      .first();

    if (clientRes.asaas_code) {
      return clientRes.asaas_code;
    }

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
      "mobilePhone": clientRes.phone_additional ? clientRes.phone_additional : clientRes.cellphone,
    }
    const asaasRes = await asaas.api.post('customers', asaasBody, asaasHeader);
    const updateClientRes = await connection('clients').where('id', '=', clientId).update({ asaas_code: asaasRes.data.id });
    return asaasRes.data.id;
  } catch (error) {
    console.log(error.message)
    return error.message;
  }

}


const deleteBillet = async assasId => {
  const asaasHeader = {
    headers: {
      "Content-Type": "application/json",
      "access_token": '97e802fc8baf605139013c728b6178ff5ff2c007fcac83305a442b9431ff57fb'
    }
  };
  const asaasRes = await asaas.api.delete('payments/' + assasId, asaasHeader);
}


const getAtAssasById = async assasId => {
  if (!assasId)
    return 'Não gerado'
  const asaasHeader = {
    headers: {
      "Content-Type": "application/json",
      "access_token": '97e802fc8baf605139013c728b6178ff5ff2c007fcac83305a442b9431ff57fb'
    }
  };
  const asaasRes = await asaas.api.get('payments/' + assasId, asaasHeader);
  const status = asaasRes.data.status;
  if (status === 'PENDING') return 'Aguardando pagamento'
  else if (status === 'RECEIVED') return 'Recebida'
  else if (status === 'CONFIRMED') return 'Pagamento confirmado (saldo ainda não creditado)'
  else if (status === 'OVERDUE') return 'Vencida'
  else if (status === 'REFUNDED') return 'Estornada'
  else if (status === 'RECEIVED_IN_CASH') return 'Recebida'
  else if (status === 'REFUND_REQUESTED') return 'Estorno Solicitado'
  else if (status === 'CHARGEBACK_REQUESTED') return 'Recebido chargeback'
  else if (status === 'CHARGEBACK_DISPUTE') return 'Em disputa de chargeback (caso sejam apresentados documentos para contestação)'
  else if (status === 'AWAITING_CHARGEBACK_REVERSAL') return 'Disputa vencida, aguardando repasse da adquirente'
  else if (status === 'DUNNING_REQUESTED') return 'Em processo de recuperação'
  else if (status === 'DUNNING_RECEIVED') return 'Recebida'
  else if (status === 'AWAITING_RISK_ANALYSIS') return 'Pagamento em análise'
  else return 'Status não identificado.'
}


const getBilletDetail = async attendeceId => {
  //get colletcs by attendance
  const res = await CollectHelper.getByAttendanceId(attendeceId);
  textDetail = 'Referente à: \n';
  for (collect of res) {
    textDetail = textDetail + 'Documento ' + collect.document + ' com vencimento em ' + collect.dt_maturity + ' no valor de  R$ ' + collect.updated_debt + 'c';
  }
  console.log(textDetail);
  return textDetail;
}


module.exports = {
  emitBillet,
  getAsaasCodeByClientId,
  deleteBillet,
  getAtAssasById,
  getBilletDetail
}