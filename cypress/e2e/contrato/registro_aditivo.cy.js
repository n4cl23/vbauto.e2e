import contratoActions from "../../actions/contratoActions"
import detransIgnorados from "../../fixtures/detransIgnorados.json"

const detranPrincipal = Cypress.env('detran') || 'DETRAN-AC'
const detransIgnoradosNaSuite = Object.values(detransIgnorados).flat()

describe('Registro de aditivo', () => {
    beforeEach(() => {
        cy.login({ escopoSessao: 'contratos', cacheAcrossSpecs: true })
    })

    it(`registra novo aditivo a partir de contrato recem-gerado para ${detranPrincipal}`, () => {
        expect(detransIgnoradosNaSuite, `${detranPrincipal} nao deve exigir WebPKI ou estar indisponivel`).not.to.include(detranPrincipal)

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
