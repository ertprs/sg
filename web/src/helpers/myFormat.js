const strValueToFloat = (str) => {
    var r = str + '';
    r = r.replace(' ', '')
    r = r.replace('R$', '')
    r = r.replace('.', '')
    r = r.replace(',', '.')
    return r ? parseFloat(r) : 0
}

const formatCep = e => {
    e.currentTarget.maxLength = 9;
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{5})(\d)/, "$1-$2");
    e.currentTarget.value = value;
    return e;
}

const formatDate = e => {
    e.currentTarget.maxLength = 9;
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{5})(\d)/, "$1-$2");
    e.currentTarget.value = value;
    return e;
}

const formatMoney = e => {
    let value = e.target.value;

    const v = ((value.replace(/\D/g, '') / 100).toFixed(2) + '').split('.');

    const m = v[0].split('').reverse().join('').match(/.{1,3}/g);

    for (let i = 0; i < m.length; i++)
        m[i] = m[i].split('').reverse().join('') + '.';

    const r = m.reverse().join('');

    e.currentTarget.value = r.substring(0, r.lastIndexOf('.')) + ',' + v[1];
    return e;
}

const moneyToFloat = value => {
    return parseFloat(value.replace(/[^0-9,.]/g, '').replace(/[.]/g, '').replace(',', '.'));
}


const floatValueToStr = (flt) => {
    r = parseFloat(flt ? flt : 0);
    var r = parseFloat(r.toFixed(2)) + '';
    r = r.replace('.', ',')
    return r ? r : '0,00'
}

const configSheetStr = (str) => {
    var r = str + ''
    r = r.replace(' ', '')
    r = r.replace('R$', '')
    r = r.replace('.', '+')
    r = r.replace(',', '.')
    r = r.replace('+', ',')
    return r ? r : '0,00'
}



module.exports = {
    strValueToFloat,
    floatValueToStr,
    configSheetStr,
    formatCep,
    formatMoney,
    moneyToFloat,
    formatDate
}