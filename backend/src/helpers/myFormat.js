const strValueToFloat = (str) => {
    var r = str + '';
    r = r.replace('.','')
    r = r.replace(',','.')
    return parseFloat(r)
}

const floatValueToStr = (flt) => {
    var r = parseFloat(flt).toFixed(2) + '';
    r = r.replace('.',',')
    return r
}



module.exports = {
    strValueToFloat,
    floatValueToStr
}