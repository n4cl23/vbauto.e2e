import contratoActions from "../../actions/contratoActions"
import detrans from "../../fixtures/detrans.json"
import usado from "../../fixtures/veiculos/usado.json"

describe('Contrato - Veículo Usado', () => {

    beforeEach(() => {
        cy.login(Cypress.env('username'), Cypress.env('password'))
    })

    detrans.detrans.forEach((detran) => {

        it(`Registrar contrato USADO para ${detran}`, () => {

            cy.visit('/vbconnection/vbauto/home')

            contratoActions.iniciarFluxoContrato(detran)

            contratoActions.adicionarVeiculoUsado(usado)

        })

    })

})