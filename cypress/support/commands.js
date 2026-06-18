Cypress.Commands.add('login', (usuarioOuOpcoes, senhaOuOpcoes, opcoesLogin = {}) => {

    const usuario = typeof usuarioOuOpcoes === 'string' ? usuarioOuOpcoes : Cypress.env('username')
    const senha = typeof senhaOuOpcoes === 'string' ? senhaOuOpcoes : Cypress.env('password')
    const opcoes = typeof usuarioOuOpcoes === 'object'
        ? usuarioOuOpcoes
        : (typeof senhaOuOpcoes === 'object' ? senhaOuOpcoes : opcoesLogin)
    const escopoSessao = opcoes.escopoSessao || 'contratos'
    const cacheAcrossSpecs = opcoes.cacheAcrossSpecs !== false
    const usarSessao = opcoes.usarSessao !== false

    if (!usuario || !senha) {
        throw new Error('Credenciais Cypress ausentes. Configure CYPRESS_USERNAME e CYPRESS_PASSWORD.')
    }

    const executarLoginPelaUi = () => {

        cy.intercept({ resourceType: 'image' }, { statusCode: 204, body: '' })
        cy.intercept({ resourceType: 'font' }, { statusCode: 204, body: '' })

        cy.visit('/')

        cy.contains('Acessar').click({ force: true, waitForAnimations: false })

        cy.get('#username').type(usuario, { log: false })

        cy.get('#password').type(senha, { log: false })

        cy.get('button[type="submit"][form="loginForm"]').click({ force: true, waitForAnimations: false })

        cy.location('pathname', { timeout: 60000 }).should('include', '/vbconnection/vbauto/home')
    }

    if (!usarSessao) {
        executarLoginPelaUi()
    } else {
        cy.session([usuario, escopoSessao], executarLoginPelaUi, {
            cacheAcrossSpecs,
            validate() {
                cy.visit('/vbconnection/vbauto/home')
                cy.location('pathname', { timeout: 15000 }).should('include', '/vbconnection/vbauto/home')
            }
        })
    }

    cy.visit('/vbconnection/vbauto/home')
    cy.location('pathname', { timeout: 15000 }).should('include', '/vbconnection/vbauto/home')
    cy.contains('Registrar', { timeout: 20000 }).should('be.visible')

})
