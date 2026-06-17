import contratoActions from "../../actions/contratoActions"
import contratoPage from "../../pages/contratoPage"
import detrans from "../../fixtures/detrans.json"
import detransIgnorados from "../../fixtures/detransIgnorados.json"
import { gerarVeiculoUsadoPorUf, validarVeiculo } from "../../support/massaDados"

describe('Contrato - Veiculo Usado', () => {
    const detranFiltro = Cypress.env('detran')
    const detransIgnoradosNaSuite = Object.values(detransIgnorados).flat()
    const detransElegiveis = detrans.detrans
        .filter((detran) => !detransIgnoradosNaSuite.includes(detran))
        .filter((detran) => !detranFiltro || detran === detranFiltro)

    detransElegiveis.forEach((detran) => {
        it(`Registrar contrato USADO para ${detran}`, () => {
            expect(detransIgnoradosNaSuite, `${detran} nao deve exigir WebPKI ou estar indisponivel`).not.to.include(detran)

            cy.login({ escopoSessao: 'contratos', cacheAcrossSpecs: true })
            contratoPage.aguardarCarregamento()

            const veiculo = gerarVeiculoUsadoPorUf(detran)
            validarVeiculo(veiculo, 'usado')

            contratoActions.iniciarFluxoContrato(detran)
            contratoActions.preencherDadosContrato(detran)
            contratoActions.adicionarVeiculoUsado(veiculo, detran)

            contratoPage.assertBotaoSalvarHabilitado()
            contratoActions.enviarContrato()
        })
    })
})
