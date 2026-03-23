import contratoActions from "../../actions/contratoActions"
import detrans from "../../fixtures/detrans.json"

describe('Contrato - Veículo Novo', () => {

    beforeEach(() => {
        cy.login(Cypress.env('username'), Cypress.env('password'))
    })

    const veiculoNovo = {
        chassi: '12345678901234567',
        placa: 'ABC1234',
        ano: '2024',
        modelo: 'Modelo Novo'
    }

    detrans.detrans.forEach((detran) => {

        it(`Registrar contrato NOVO para ${detran}`, () => {

            cy.visit('/vbconnection/vbauto/home')

            contratoActions.iniciarFluxoContrato(detran)

            contratoActions.adicionarVeiculoNovo(veiculoNovo)

        })

    })

})