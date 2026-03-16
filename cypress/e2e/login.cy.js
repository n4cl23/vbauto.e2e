import loginActions from "../actions/loginActions"

describe('Login VBConnection', () => {

  beforeEach(() => {
    loginActions.acessarSite()
  })

  it('Deve realizar login com sucesso', () => {

    cy.fixture('loginData').then((dados) => {

      loginActions.realizarLogin(
        dados.usuario,
        dados.senha
      )

    })

  })

})