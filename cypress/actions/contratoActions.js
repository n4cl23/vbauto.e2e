import contratoPage from "../pages/contratoPage"

const AGENTE_FINANCEIRO = 'Banco Piloto'

class ContratoActions {

    iniciarFluxoContrato(detran){

        contratoPage.acessarMenuRegistrar()

        cy.get('app-menu-card-icon')
            .should('be.visible')

        contratoPage.acessarRegistroContratoAditivo()

        cy.get('app-menu-card-icon')
            .should('have.length.at.least', 2)

        contratoPage.acessarRegistroContratoTela()

        cy.get('nz-select[formcontrolname="destino"]')
            .should('be.visible')

        contratoPage.selecionarDetran(detran)

        contratoPage.selecionarAgenteFinanceiro(AGENTE_FINANCEIRO)

        cy.get('nz-select[formcontrolname="agenteFinanceiro"]')
            .should('contain', AGENTE_FINANCEIRO)
    }

    adicionarVeiculoNovo(dados){

    contratoPage.clicarAdicionarVeiculo()

    
    contratoPage.selecionarTipoVeiculo('novo')

    
    contratoPage.preencherChassi(dados.chassi)

    contratoPage.selecionarMarcaModelo()
    contratoPage.selecionarRestricao()

    contratoPage.preencherPlaca(dados.placa)
    contratoPage.preencherAno(dados.ano)
    contratoPage.preencherModelo(dados.modelo)
}

    adicionarVeiculoUsado(dados){

        contratoPage.clicarAdicionarVeiculo()

        contratoPage.selecionarTipoVeiculo('usado')

        contratoPage.preencherChassi(dados.chassi)
        contratoPage.preencherRenavam(dados.renavam)

        contratoPage.selecionarMarcaModelo()
        contratoPage.selecionarGravame(dados.gravame)
        contratoPage.selecionarRestricao()

        contratoPage.preencherPlaca(dados.placa)
        contratoPage.preencherAno(dados.ano)
        contratoPage.preencherModelo(dados.modelo)
    }

}

export default new ContratoActions()