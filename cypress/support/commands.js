Cypress.Commands.add('login', () => {

    const usuario = Cypress.env('username')
    const senha = Cypress.env('password')

    cy.session(usuario, () => {

        cy.intercept({ resourceType: 'image' }, { statusCode: 204, body: '' })
        cy.intercept({ resourceType: 'font' }, { statusCode: 204, body: '' })

        cy.visit('/')

        cy.contains('Acessar').click({ force: true, waitForAnimations: false })

        cy.get('#username').type(usuario, { log: false })

        cy.get('#password').type(senha, { log: false })

        cy.get('button[type="submit"][form="loginForm"]').click({ force: true, waitForAnimations: false })

        cy.location('pathname', { timeout: 60000 }).should('include', '/vbconnection/vbauto/home')

    }, {
        validate() {
            cy.visit('/vbconnection/vbauto/home')
            cy.location('pathname', { timeout: 15000 }).should('include', '/vbconnection/vbauto/home')
        }
    })

    cy.visit('/vbconnection/vbauto/home')
    cy.location('pathname', { timeout: 15000 }).should('include', '/vbconnection/vbauto/home')
    cy.contains('Registrar', { timeout: 20000 }).should('be.visible')

})
