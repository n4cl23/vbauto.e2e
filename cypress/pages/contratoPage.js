class ContratoPage {

    btnRegistrar(){
        return cy.contains('span','Registrar')
    }

    btnRegistroContratoAditivo(){
        return cy.get(':nth-child(1) > .col > .card-icon')
    }

    btnRegistroContratoTela(){
        return cy.get(':nth-child(2) > app-menu-card-icon > .col > .card-icon')
    }

    selectDetran(){
        return cy.get('nz-select[formcontrolname="destino"]')
    }

    inputBuscaDetran(){
        return cy.get('.ant-select-selection-search-input')
    }

}

export default new ContratoPage()