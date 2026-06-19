const formatarDataPtBr = (data) => data.toLocaleDateString('pt-BR')

const formatarDataWs = (data = new Date()) => {
    const ano = data.getFullYear()
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const dia = String(data.getDate()).padStart(2, '0')

    return Number(`${ano}${mes}${dia}`)
}

const somarDias = (dataBase, dias) => {
    const data = new Date(dataBase)
    data.setDate(data.getDate() + dias)
    return data
}

const somarMeses = (dataBase, meses) => {
    const data = new Date(dataBase)
    data.setMonth(data.getMonth() + meses)
    return data
}

const somarMesesHoje = (quantidadeMeses) => somarMeses(new Date(), quantidadeMeses)

export {
    formatarDataPtBr,
    formatarDataWs,
    somarDias,
    somarMeses,
    somarMesesHoje
}
