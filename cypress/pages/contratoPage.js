class ContratoPage {

    acessarMenuRegistrar() {
        cy.contains('Registrar').click()
    }

    acessarRegistroContratoAditivo() {
        cy.get(':nth-child(1) > .col > .card-icon').click()
    }

    acessarRegistroContratoTela() {
        cy.get(':nth-child(2) > app-menu-card-icon > .col > .card-icon').click()
    }

    selecionarDetran(detran) {

        cy.get('nz-select[formcontrolname="destino"]').click()

        cy.get('.ant-select-selection-search-input')
            .type(detran, { force: true })

        cy.contains('.ant-select-item-option', detran)
            .click()

    }

    selecionarAgenteFinanceiro(nomeBanco) {


        cy.get('nz-select[formcontrolname="agenteFinanceiro"]')
            .click()

        cy.get('.ant-select')
            .should('have.class', 'ant-select-open')

        cy.get('.ant-select-open .ant-select-selection-search-input')
            .type(nomeBanco)

        cy.contains('.ant-select-item-option', nomeBanco)
            .click()

        cy.get('nz-select[formcontrolname="agenteFinanceiro"]')
            .should('contain', nomeBanco)

    }


}

export default new ContratoPage()