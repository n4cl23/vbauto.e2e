import contratoPage from "../pages/contratoPage"

const AGENTE_FINANCEIRO = 'Banco Piloto'

export default {

    iniciarFluxoContrato(detran){

        contratoPage.acessarMenuRegistrar()

        contratoPage.acessarRegistroContratoAditivo()

        contratoPage.acessarRegistroContratoTela()

        contratoPage.selecionarDetran(detran)

        contratoPage.selecionarAgenteFinanceiro(AGENTE_FINANCEIRO)

        // validação básica
        cy.get('.ant-select-selection-item')
          .should('contain', AGENTE_FINANCEIRO)

    }

}