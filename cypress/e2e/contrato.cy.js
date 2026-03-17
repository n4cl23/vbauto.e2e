import contratoActions from "../actions/contratoActions"
import detrans from "../fixtures/detrans.json"

describe('Registro de contrato por DETRAN', () => {

    beforeEach(() => {

        cy.fixture('loginData').then((dados)=>{
            cy.login(dados.usuario, dados.senha)
        })

    })

    detrans.detrans.forEach((detran) => {

        it(`Registrar contrato para ${detran}`, () => {

            cy.visit('/vbconnection/vbauto/home')

            contratoActions.iniciarFluxoContrato(detran)

        })

    })

})