class ContratoPage {

    acessarMenuRegistrar() {
        cy.contains('Registrar')
            .should('be.visible')
            .click()
    }

    acessarRegistroContratoAditivo() {
        cy.get('app-menu-card-icon')
            .should('exist')

        cy.get(':nth-child(1) > .col > .card-icon')
            .should('be.visible')
            .click()
    }

    acessarRegistroContratoTela() {
        cy.get('app-menu-card-icon')
            .should('have.length.at.least', 2)

        cy.get(':nth-child(2) > app-menu-card-icon > .col > .card-icon')
            .should('be.visible')
            .click()
    }

    selecionarDetran(detran) {
        cy.get('nz-select[formcontrolname="destino"]')
            .should('be.visible')
            .click()

        cy.get('.ant-select-open .ant-select-selection-search-input')
            .type(detran)

        cy.contains('.ant-select-item-option', detran)
            .click()
    }

    selecionarAgenteFinanceiro(nomeBanco) {
        cy.get('nz-select[formcontrolname="agenteFinanceiro"]')
            .should('be.visible')
            .click()

        cy.get('.ant-select-open .ant-select-selection-search-input')
            .type(nomeBanco)

        cy.contains('.ant-select-item-option', nomeBanco)
            .click()

        cy.get('nz-select[formcontrolname="agenteFinanceiro"]')
            .should('contain', nomeBanco)
    }

    // =========================
    // 🚗 VEÍCULO
    // =========================

    clicarAdicionarVeiculo() {
        cy.get('#contratoForm')
            .contains('button', 'Adicionar')
            .should('be.visible')
            .click()
    }

    selecionarTipoVeiculo(tipo) {

        const opcao = tipo === 'novo' ? 'Sim' : 'Não'

        cy.get('nz-radio-group[formcontrolname="veiculoZeroKm"]')
            .should('be.visible')
            .within(() => {
                cy.contains('label', opcao)
                    .should('be.visible')
                    .click()
            })


        cy.get('nz-radio-group[formcontrolname="veiculoZeroKm"]')
            .should('not.have.class', 'ng-invalid')
    }

    preencherChassi(chassi) {
        cy.get('#chassi')
            .should('be.visible')
            .clear()
            .type(chassi)
    }

    preencherRenavam(renavam) {
        cy.get('[name="renavam"]')
            .should('be.visible')
            .type(renavam)
    }

    selecionarMarcaModelo() {


        cy.get('#formVeiculo_0 nz-select')
            .first()
            .click()


        cy.get('.ant-select-open')
            .should('exist')


        cy.get('.cdk-overlay-pane .ant-select-item-option')
            .should('be.visible')
            .first()
            .click()
    }
    selecionarGravame(gravame) {

        cy.get('[name="restricao"]')
            .click()
            .type(gravame)
    }
    selecionarRestricao() {

        cy.get('[nzplaceholder="Situação do Chassi"]').click()

        cy.get('.cdk-overlay-pane')
            .should('be.visible')

        cy.contains('.ant-select-item-option', 'Não remarcado')
            .click()
    }

    preencherPlaca(placa) {
        cy.get('#placa')
            .type(placa)
    }

    preencherAno(ano) {
        cy.get('#ano')
            .type(ano)
    }

    preencherModelo(modelo) {
        cy.get('#modelo')
            .type(modelo)
    }

}

export default new ContratoPage()