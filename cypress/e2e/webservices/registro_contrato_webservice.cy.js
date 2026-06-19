import detrans from "../../fixtures/detrans.json"
import {
    MUNICIPIOS_WS_POR_UF,
    normalizarUf,
    obterDetransIgnoradosWs,
    obterTokenWs,
    registrarContratoWsComRetry
} from "../../services/contratoWsService"

describe('API Webservice - Registro de contrato', () => {
    const detranFiltro = Cypress.env('detran')
    const detransIgnoradosNaSuite = obterDetransIgnoradosWs()
    const detransElegiveis = detrans.detrans
        .filter((detran) => !detransIgnoradosNaSuite.includes(detran))
        .filter((detran) => MUNICIPIOS_WS_POR_UF[normalizarUf(detran)])
        .filter((detran) => !detranFiltro || detran === detranFiltro)

    let tokenWs

    before(() => {
        obterTokenWs().then((token) => {
            tokenWs = token
        })
    })

    detransElegiveis.forEach((detran) => {
        it(`registra contrato via WS para ${detran}`, () => {
            registrarContratoWsComRetry(detran, tokenWs)
        })
    })
})
