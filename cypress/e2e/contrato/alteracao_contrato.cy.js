import contratoActions from "../../actions/contratoActions"
import detransIgnorados from "../../fixtures/detransIgnorados.json"

const detranPrincipal = Cypress.env('detran') || 'DETRAN-AC'
const detransIgnoradosNaSuite = Object.values(detransIgnorados).flat()

describe('Alteracao de contrato', () => {
    beforeEach(() => {
        cy.login({ escopoSessao: 'contratos', cacheAcrossSpecs: true })
    })

    it(`altera contrato finalizado com sucesso para ${detranPrincipal}`, () => {
        expect(detransIgnoradosNaSuite, `${detranPrincipal} nao deve exigir WebPKI ou estar indisponivel`).not.to.include(detranPrincipal)

        contratoActions.alterarContratoComProtocolo(detranPrincipal).then(({ protocoloContrato, protocoloAlteracao }) => {
            expect(protocoloContrato, 'protocolo do contrato original').to.match(/\d{4,}/)
            expect(protocoloAlteracao, 'protocolo da alteracao do contrato').to.match(/\d{4,}/)
        })
    })
})
