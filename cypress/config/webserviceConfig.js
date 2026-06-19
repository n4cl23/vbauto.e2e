const WS_AUTH_URL = '/vbauto.api/auth/ws/tokens'
const WS_CONTRATOS_URL = '/vbauto.api/ws/rest/contratos/v2'
const MAX_TENTATIVAS_REGISTRO_WS = 3

const DETRANS_IGNORADOS_WS = {
    retornoSemProtocolo: [
        'DETRAN-RJ'
    ]
}

const MUNICIPIOS_WS_POR_UF = {
    AC: { contrato: 139, ibge: 1200401 },
    AP: { contrato: 605, ibge: 1600303 },
    BA: { contrato: 3849, ibge: 2927408 },
    CE: { contrato: 1389, ibge: 2304400 },
    DF: { contrato: 9701, ibge: 5300108 },
    ES: { contrato: 5705, ibge: 3205309 },
    MG: { contrato: 4123, ibge: 3106200 },
    MS: { contrato: 9051, ibge: 5002704 },
    MT: { contrato: 9067, ibge: 5103403 },
    PB: { contrato: 2051, ibge: 2507507 },
    PE: { contrato: 2531, ibge: 2611606 },
    PR: { contrato: 7601, ibge: 4106902 },
    RJ: { contrato: 6001, ibge: 3304557 },
    RN: { contrato: 1759, ibge: 2408102 },
    RR: { contrato: 301, ibge: 1400100 },
    RS: { contrato: 8801, ibge: 4314902 },
    SC: { contrato: 8105, ibge: 4205407 },
    SE: { contrato: 3105, ibge: 2800308 },
    SP: { contrato: 7107, ibge: 3550308 },
    TO: { contrato: 9733, ibge: 1721000 }
}

const AGENTE_WS = {
    nome: 'Banco Piloto',
    cnpj: 12650740000152
}

export {
    AGENTE_WS,
    DETRANS_IGNORADOS_WS,
    MAX_TENTATIVAS_REGISTRO_WS,
    MUNICIPIOS_WS_POR_UF,
    WS_AUTH_URL,
    WS_CONTRATOS_URL
}
