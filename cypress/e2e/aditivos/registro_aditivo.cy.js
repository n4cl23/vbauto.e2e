import contratoActions from "../../actions/contratoActions"
import { obterDetransIgnorados, validarDetranElegivel } from "../../config/detransConfig"

const detranPrincipal = Cypress.env('detran') || 'DETRAN-AC'
const detransIgnoradosNaSuite = obterDetransIgnorados()

describe('Registro de aditivo', () => {
    beforeEach(() => {
        cy.login({ escopoSessao: 'contratos', cacheAcrossSpecs: true })
    })

    it(`registra novo aditivo a partir de contrato recem-gerado para ${detranPrincipal}`, () => {
        validarDetranElegivel(detranPrincipal, detransIgnoradosNaSuite)

        contratoActions.registrarContratoNovoComProtocolo(detranPrincipal).then(({ protocolo }) => {
            expect(protocolo, 'protocolo do contrato base').to.match(/\d{4,}/)

            cy.wrap(protocolo).as('protocoloContratoBase')

            contratoActions.iniciarFluxoNovoAditivo(detranPrincipal)
            contratoActions.preencherProtocoloNovoAditivo(protocolo)
            contratoActions.preencherDadosNovoAditivo()
            contratoActions.enviarNovoAditivo().then((protocoloAditivo) => {
                expect(protocoloAditivo, 'protocolo do aditivo').to.match(/\d{4,}/)
            })
        })
    })
})
