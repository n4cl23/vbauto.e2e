import contratoActions from "../../actions/contratoActions"
import detransIgnorados from "../../fixtures/detransIgnorados.json"

const detranPrincipal = Cypress.env('detran') || 'DETRAN-AC'
const detransIgnoradosNaSuite = Object.values(detransIgnorados).flat()

describe('Alteracao de aditivo', () => {
    beforeEach(() => {
        cy.login({ escopoSessao: 'contratos', cacheAcrossSpecs: true })
    })

    it(`altera aditivo existente e reenvia para ${detranPrincipal}`, () => {
        expect(detransIgnoradosNaSuite, `${detranPrincipal} nao deve exigir WebPKI ou estar indisponivel`).not.to.include(detranPrincipal)

        contratoActions.registrarAditivoComProtocolo(detranPrincipal).then(({ protocoloAditivo }) => {
            expect(protocoloAditivo, 'protocolo do aditivo original').to.match(/\d{4,}/)

            cy.wrap(protocoloAditivo).as('protocoloAditivoOriginal')

            contratoActions.alterarAditivoAtual(protocoloAditivo, {}, detranPrincipal).then(({ protocoloAlteracao }) => {
                expect(protocoloAlteracao, 'protocolo da alteracao do aditivo').to.match(/\d{4,}/)
                contratoActions.validarTipoAditivoPersistido(protocoloAlteracao)
            })
        })
    })
})
