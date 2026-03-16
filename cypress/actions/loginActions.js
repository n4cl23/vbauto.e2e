import loginPage from "../pages/loginPage"

class LoginActions {

    acessarSite(){
        cy.visit("/")
    }

    clicarAcessar(){
        loginPage.btnAcessarSistema().click()
    }

    preencherUsuario(usuario){
        loginPage.inputUsuario().type(usuario)
    }

    preencherSenha(senha){
        loginPage.inputSenha().type(senha)
    }

    clicarEntrar(){
        loginPage.btnEntrar()
            .should('be.visible')
            .and('not.be.disabled')
            .click()
    }

    validarLoginSucesso(){
        cy.url().should('include','/vbconnection/vbauto/home')
    }

    realizarLogin(usuario, senha){

        this.clicarAcessar()

        this.preencherUsuario(usuario)

        this.preencherSenha(senha)

        this.clicarEntrar()

        this.validarLoginSucesso()

    }

}

export default new LoginActions()