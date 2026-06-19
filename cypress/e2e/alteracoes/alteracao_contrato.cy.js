import contratoActions from "../../actions/contratoActions"
import { obterDetransIgnorados, validarDetranElegivel } from "../../config/detransConfig"

const detranPrincipal = Cypress.env('detran') || 'DETRAN-AC'
const detransIgnoradosNaSuite = obterDetransIgnorados()

describe('Alteracao de contrato', () => {
    beforeEach(() => {
        cy.login({ escopoSessao: 'contratos', cacheAcrossSpecs: true })
    })

    it(`altera contrato finalizado com sucesso para ${detranPrincipal}`, () => {
        validarDetranElegivel(detranPrincipal, detransIgnoradosNaSuite)

        contratoActions.alterarContratoComProtocolo(detranPrincipal).then(({ protocoloContrato, protocoloAlteracao }) => {
            expect(protocoloContrato, 'protocolo do contrato original').to.match(/\d{4,}/)
            expect(protocoloAlteracao, 'protocolo da alteracao do contrato').to.match(/\d{4,}/)
        })
    })
})
