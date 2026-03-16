import contratoPage from "../pages/contratoPage"

class ContratoActions {

    acessarMenuRegistrar(){

        contratoPage.btnRegistrar()
            .should('be.visible')
            .click()

    }

    acessarRegistroContratoAditivo(){

        contratoPage.btnRegistroContratoAditivo()
            .should('be.visible')
            .click()

    }

    acessarRegistroContratoTela(){

        contratoPage.btnRegistroContratoTela()
            .should('be.visible')
            .click()

    }

    selecionarDetran(detran){

        contratoPage.selectDetran()
            .click()

        contratoPage.inputBuscaDetran()
            .type(detran)

        cy.contains('.ant-select-item-option', detran)
            .click()

    }

    iniciarFluxoContrato(detran){

        this.acessarMenuRegistrar()

        this.acessarRegistroContratoAditivo()

        this.acessarRegistroContratoTela()

        this.selecionarDetran(detran)

    }

}

export default new ContratoActions()