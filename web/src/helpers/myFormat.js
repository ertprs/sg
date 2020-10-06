const strValueToFloat = (str) => {
    var r = str + '';
    r = r.replace('.','')
    r = r.replace(',','.')
    return r ? parseFloat(r) : 0
}

const floatValueToStr = (flt) => {
    var r = flt + '';
    r = r.replace('.',',')
    return r ? r : '0,00'
}



module.exports = {
    strValueToFloat,
    floatValueToStr
}