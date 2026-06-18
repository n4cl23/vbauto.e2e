import contratoActions from "../../actions/contratoActions"
import contratoPage from "../../pages/contratoPage"
import detrans from "../../fixtures/detrans.json"
import detransIgnorados from "../../fixtures/detransIgnorados.json"
import { gerarVeiculoNovoPorUf } from "../../support/massaDados"

describe('Contrato - Veiculo Novo', () => {
    const detranFiltro = Cypress.env('detran')
    const detransIgnoradosNaSuite = Object.values(detransIgnorados).flat()
    const detransElegiveis = detrans.detrans
        .filter((detran) => !detransIgnoradosNaSuite.includes(detran))
        .filter((detran) => !detranFiltro || detran === detranFiltro)

    detransElegiveis.forEach((detran) => {
        it(`Registrar contrato NOVO para ${detran}`, () => {
            expect(detransIgnoradosNaSuite, `${detran} nao deve exigir WebPKI ou estar indisponivel`).not.to.include(detran)

            cy.login({ escopoSessao: 'contratos', cacheAcrossSpecs: true })
            contratoPage.aguardarCarregamento()

            const veiculo = gerarVeiculoNovoPorUf(detran)

            contratoActions.iniciarFluxoContrato(detran)
            contratoActions.preencherDadosContrato(detran)
            contratoActions.adicionarVeiculoNovo(veiculo)

            contratoPage.assertBotaoSalvarHabilitado()
            contratoActions.enviarContrato()
        })
    })
})
