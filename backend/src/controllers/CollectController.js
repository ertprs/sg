const connection = require('../database/connection');
const ClientHelper = require('../helpers/ClientHelper');
const CompanieHelper = require('../helpers/CompanieHelper');
const myFormat = require('../helpers/myFormat');
const UserHelper = require('../helpers/UserHelper');

const moment = require('moment');

const getAll = async (request, response) => {
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });

    const res = await connection('collects').select('*');
    collects = [];
    for (collect of res) {
      const client = await ClientHelper.getById(collect.client);
      const companie = await CompanieHelper.getById(collect.companie);
      const lastUser = await UserHelper.getById(collect.last_user);
      collects.push({
        ...collect,
        last_user_name: lastUser ? lastUser.name : '', 
        client_name: client ? client.name : '',
        client_document: client ? client.document : '',
        client_phoe: client ? client.phone : '',
        client_cellphone: client ? client.cellphone : '',
        companie_name: companie && companie ? companie.name : '',
        default_interest: companie && companie ? companie.default_interest : 0,
        default_honorary: companie && companie ? companie.default_honorary : 0,
        default_penalty: companie && companie ? companie.default_penalty : 0,
      })
    }
    return response.json(collects);
  } catch (error) {
    return response.json({ error: error.message });
  }
}

const update = async (request, response) => {
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });

    const register = {
      last_user: request.headers.user_id,
      updated_at: moment().format('L LT'),
      code: request.body.code,
      client: request.body.client,
      status: request.body.status,
      companie: request.body.companie,
      account: request.body.account,
      document: request.body.document,
      dt_maturity: request.body.dt_maturity,
      days: request.body.days,
      value: request.body.value,
      updated_debt: request.body.updated_debt,
      honorary: request.body.honorary,
      honorary_per: request.body.honorary_per,
      maximum_discount: request.body.maximum_discount,
      negotiated_value: request.body.negotiated_value,
      obs: request.body.obs
    };
    const res = await connection('collects').where('id', '=', request.params.id).update(register)
    return response.json(res);
  } catch (error) {
    return response.json({ error: error.message });
  }
}

const deleteRegister = async (request, response) => {
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });

    const res = await connection('collects').where('id', '=', request.params.id).del();
    return response.json(res);
  } catch (error) {
    return response.json({ error: error.message });
  }
}


const getByClient = async (request, response) => {
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });

    const res = await connection('collects')
      .where({
        client: request.params.client_id,
        status: 'Aberto'
      })
      .select('*');
    collects = [];
    for (collect of res) {
      const client = await ClientHelper.getById(collect.client);
      const companie = await CompanieHelper.getById(collect.companie);
      collects.push({
        ...collect,
        client_name: client ? client.name : '',
        client_document: client ? client.document : '',
        client_phoe: client ? client.phone : '',
        client_cellphone: client ? client.cellphone : '',
        companie_name: companie && companie ? companie.name : '',
      })
    }
    return response.json(collects);
  } catch (error) {
    return response.json({ error: error.message });
  }
}

const newRegister = async (request, response) => {
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });

    const register = {
      last_user: request.headers.user_id,
      created_at: moment().format('L LT'),
      client: request.body.client,
      status: request.body.status,
      companie: request.body.companie,
      account: request.body.account,
      document: request.body.document,
      dt_maturity: request.body.dt_maturity,
      days: request.body.days,
      value: request.body.value,
      updated_debt: request.body.updated_debt,
      honorary: request.body.honorary,
      maximum_discount: request.body.maximum_discount,
      negotiated_value: request.body.negotiated_value,
      obs: request.body.obs
    };
    const res = await connection('collects').insert(register);
    return response.json(res[0]);
  } catch (error) {
    console.log(error.message)
    return response.json({ error: error.message });
  }
}

const importCollect = async (request, response) => {
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });

    const collect = await {
      client: await ClientHelper.newIfNotExists({
        name: request.body.client,
        companie: request.body.companie,
        phone: request.body.phone,
        cellphone: request.body.cellphone
      }),
      status: request.body.status,
      companie: request.body.companie,
      dt_maturity: request.body.dt_maturity,
      value: request.body.value,
      maximum_discount: request.body.maximum_discount,
      obs: 'importado'
    };
    var res;

    res = await connection('collects').insert(collect);
    return response.json(res);

  } catch (error) {
    console.log(error)
    return response.json({ error: error.message });
  }
}

const recalc = async (request, response) => {
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });

    const res = await connection('collects')
      .select('*')
      .where({
        status: 'Aberto'
      })
    collects = [];
    for (collect of res) {
      const client = await ClientHelper.getById(collect.client);
      const companie = await CompanieHelper.getById(collect.companie);
      collects.push({
        ...collect,
        client_name: client ? client.name : '',
        client_document: client ? client.document : '',
        client_phoe: client ? client.phone : '',
        client_cellphone: client ? client.cellphone : '',
        companie_name: companie && companie ? companie.name : '',
        default_interest: companie && companie ? companie.default_interest : 0,
        default_honorary: companie && companie ? companie.default_honorary : 0,
        default_penalty: companie && companie ? companie.default_penalty : 0,
      })
    }

    for (reg of collects) {
      if (!moment(reg.dt_maturity, "DD/MM/YYYY")._isValid)
        reg.days = 0

      const calculedDays = await moment(reg.dt_maturity, "DD/MM/YYYY").diff(moment(), 'days')

      if (calculedDays > -1)
        reg.days = 0

      //DAYS
      reg.days = calculedDays * -1

      //INTEREST (JUROS)
      reg.interest = await myFormat.floatValueToStr(parseFloat((((myFormat.strValueToFloat(reg.default_interest) / 100) * myFormat.strValueToFloat(reg.value)) * myFormat.strValueToFloat(reg.days))))

      //PENALTY (MULTA)
      reg.penalty = await myFormat.floatValueToStr(parseFloat(((myFormat.strValueToFloat(reg.default_penalty) / 100) * myFormat.strValueToFloat(reg.value))))

      //HONORARY (HONORÁRIOS)
      reg.honorary = await myFormat.floatValueToStr(parseFloat(((myFormat.strValueToFloat(reg.value) + myFormat.strValueToFloat(reg.penalty) + myFormat.strValueToFloat(reg.interest)) * (myFormat.strValueToFloat(reg.default_honorary) / 100))))

      //DÉBITO ATUALIZADO 
      reg.debit = await myFormat.floatValueToStr(parseFloat(((myFormat.strValueToFloat(reg.interest) + myFormat.strValueToFloat(reg.penalty) + myFormat.strValueToFloat(reg.honorary) + myFormat.strValueToFloat(reg.value)))))


      const resUpdate = await connection('collects').where('id', '=', reg.id).update({
        days: reg.days,
        honorary: reg.honorary,
        updated_debt: reg.debit
      })
    };
    return response.json({ data: true });;
  } catch (error) {
    console.log(error)
    return response.json({ error: error.message });
  }
}

const closeByClient = async (request, response) => {
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });

    const resUpdate = await connection('collects')
      .where('client', '=', request.params.client)
      .update({
        status: 'Liquidado',
        attendance: request.params.attendance
      })
    return response.json({ data: true });
  } catch (error) {
    console.log(error)
    return response.json({ error: error.message });
  }
}

const getByAttendance = async (request, response) => {
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });
      
    const res = await connection('collects')
      .where({
        attendance: request.params.attendance_id
      })
      .select('*');
    collects = [];
    for (collect of res) {
      const client = await ClientHelper.getById(collect.client);
      const companie = await CompanieHelper.getById(collect.companie);
      collects.push({
        ...collect,
        client_name: client ? client.name : '',
        client_document: client ? client.document : '',
        client_phoe: client ? client.phone : '',
        client_cellphone: client ? client.cellphone : '',
        companie_name: companie && companie ? companie.name : '',
      })
    }
    return response.json(collects);
  } catch (error) {
    return response.json({ error: error.message });
  }
}

module.exports = {
  getAll,
  newRegister,
  importCollect,
  update,
  recalc,
  closeByClient,
  deleteRegister,
  getByClient,
  getByAttendance
}