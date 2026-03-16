import loginActions from "../actions/loginActions"
import contratoActions from "../actions/contratoActions"
import detrans from "../fixtures/detrans.json"

describe('Registro de contrato por DETRAN', () => {

    detrans.detrans.forEach((detran) => {

        it(`Deve registrar contrato para ${detran}`, () => {

            loginActions.acessarSite()

            cy.fixture('loginData').then((dados)=>{

                loginActions.realizarLogin(
                    dados.usuario,
                    dados.senha
                )

            })

            contratoActions.iniciarFluxoContrato(detran)

        })

    })

})