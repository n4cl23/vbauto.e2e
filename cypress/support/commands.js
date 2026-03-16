Cypress.Commands.add('login', (usuario, senha) => {

    cy.session([usuario, senha], () => {

        cy.visit('/')

        cy.contains('button','Acessar').click()

        cy.get('#username').type(usuario)

        cy.get('#password').type(senha)

        cy.get('button[type="submit"][form="loginForm"]').click()

        cy.url().should('include','/vbconnection/vbauto/home')

    })

})