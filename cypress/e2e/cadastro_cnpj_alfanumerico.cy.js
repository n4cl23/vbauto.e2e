import contratoActions from "../actions/contratoActions"
import contratoPage from "../pages/contratoPage"
import detransIgnorados from "../fixtures/detransIgnorados.json"
import { gerarCnpjAlfanumerico, gerarVeiculoNovoPorUf } from "../support/massaDados"

const normalizarDocumento = (valor) => String(valor || '').replace(/[^0-9A-Z]/gi, '').toUpperCase()

describe('Cadastro com CNPJ alfanumerico', () => {
    const detranPrincipal = Cypress.env('detran') || Cypress.env('detranPrincipal') || 'DETRAN-DF'
    const detransIgnoradosNaSuite = Object.values(detransIgnorados).flat()

    beforeEach(() => {
        cy.login({ usarSessao: false })
    })

    it('permite cadastrar contrato com CNPJ alfanumerico', () => {
        expect(detransIgnoradosNaSuite, `${detranPrincipal} nao deve exigir WebPKI ou estar indisponivel`).not.to.include(detranPrincipal)

        const cnpjAlfanumerico = gerarCnpjAlfanumerico()
        const nomeEmpresa = `Empresa Alfa ${Date.now()}`

        contratoPage.aguardarCarregamento()

        contratoActions.iniciarFluxoContrato(detranPrincipal)
        contratoActions.preencherDadosContrato(detranPrincipal, {
            devedor: {
                cpfCnpj: cnpjAlfanumerico,
                nomeCompleto: nomeEmpresa
            }
        })

        cy.get('input[placeholder="CPF / CNPJ"], input[placeholder="CPF/CNPJ"]')
            .filter(':visible')
            .first()
            .should(($input) => {
                expect(normalizarDocumento($input.val()), 'CNPJ alfanumerico exibido no campo').to.eq(cnpjAlfanumerico)
                expect($input, 'campo CNPJ nao deve ficar invalido').not.to.have.class('ng-invalid')
            })

        cy.get('#contratoForm')
            .should('not.contain.text', 'CNPJ invalido')
            .and('not.contain.text', 'CNPJ inválido')
            .and('not.contain.text', 'mascara')
            .and('not.contain.text', 'máscara')
            .and('not.contain.text', 'formato invalido')
            .and('not.contain.text', 'formato inválido')

        contratoActions.adicionarVeiculoNovo(gerarVeiculoNovoPorUf(detranPrincipal))
        contratoPage.assertBotaoSalvarHabilitado()
        contratoActions.enviarContrato()
    })
})
