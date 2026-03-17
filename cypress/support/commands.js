Cypress.Commands.add('login', () => {

    const usuario = Cypress.env('username')
    const senha = Cypress.env('password')

    cy.session(usuario, () => {

        cy.visit('/')

        cy.contains('Acessar').click()

        cy.get('#username').type(usuario, { log: false })

        cy.get('#password').type(senha, { log: false })

        cy.get('button[type="submit"][form="loginForm"]').click()

        cy.url().should('include','/vbconnection/vbauto/home')

    })

})