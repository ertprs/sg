const strValueToFloat = (str) => {
    var r = str + '';
    r = r.replace(' ','')
    r = r.replace('R$','')
    r = r.replace('.','')
    r = r.replace(',','.')
    return r ? parseFloat(r) : 0
}

const floatValueToStr = (flt) => {
    r = parseFloat(flt?flt:0);
    var r = parseFloat(r.toFixed(2)) + '';
    r = r.replace('.',',')
    return r ? r : '0,00'
}

const configSheetStr = (str) => {
    var r =  str + ''
    r =  r.replace(' ','')
    r =  r.replace('R$','')
    r =  r.replace('.','+')
    r =  r.replace(',','.')
    r =  r.replace('+',',')
    return  r ? r : '0,00'
}



module.exports = {
    strValueToFloat,
    floatValueToStr,
    configSheetStr
}