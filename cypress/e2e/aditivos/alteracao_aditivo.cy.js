import contratoActions from "../../actions/contratoActions"
import { obterDetransIgnorados, validarDetranElegivel } from "../../config/detransConfig"

const detranPrincipal = Cypress.env('detran') || 'DETRAN-AC'
const detransIgnoradosNaSuite = obterDetransIgnorados()

describe('Alteracao de aditivo', () => {
    beforeEach(() => {
        cy.login({ escopoSessao: 'contratos', cacheAcrossSpecs: true })
    })

    it(`altera aditivo existente e reenvia para ${detranPrincipal}`, () => {
        validarDetranElegivel(detranPrincipal, detransIgnoradosNaSuite)

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
