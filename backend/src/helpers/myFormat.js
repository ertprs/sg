const strValueToFloat = (str) => {
    var r = str + '';
    r = r.replace('.','')
    r = r.replace(',','.')
    return parseFloat(r)
}

const floatValueToStr = (flt) => {
    var r = flt + '';
    r = r.replace('.',',')
    return r
}



module.exports = {
    strValueToFloat,
    floatValueToStr
}