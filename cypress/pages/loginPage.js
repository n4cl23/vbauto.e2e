class LoginPage {

    btnAcessarSistema(){
        return cy.contains('button','Acessar')
    }

    inputUsuario(){
        return cy.get('#username')
    }

    inputSenha(){
        return cy.get('#password')
    }

    btnEntrar(){
        return cy.get('button[type="submit"][form="loginForm"]')
    }

}

export default new LoginPage()