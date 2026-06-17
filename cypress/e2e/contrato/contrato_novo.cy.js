import contratoActions from "../../actions/contratoActions"
import contratoPage from "../../pages/contratoPage"
import detrans from "../../fixtures/detrans.json"
import detransIgnorados from "../../fixtures/detransIgnorados.json"
import { UFS, gerarPessoaPorUf, gerarVeiculoNovoPorUf, validarPessoa, validarVeiculo } from "../../support/massaDados"

describe('Contrato - Veiculo Novo', () => {
    const detranFiltro = Cypress.env('detran')
    const detransIgnoradosNaSuite = Object.values(detransIgnorados).flat()
    const detransElegiveis = detrans.detrans
        .filter((detran) => !detransIgnoradosNaSuite.includes(detran))
        .filter((detran) => !detranFiltro || detran === detranFiltro)

    context('Massa valida por UF', () => {
        Object.keys(UFS).forEach((uf) => {
            it(`gera massa valida e unica para ${uf}`, () => {
                const pessoa = gerarPessoaPorUf(uf)

                validarPessoa(pessoa, uf)

                expect(pessoa.uf, 'UF da massa').to.eq(uf)
                expect(pessoa.estado, 'estado preenchido').to.eq(UFS[uf].estado)
                expect(pessoa.cidade, 'cidade coerente com a UF').to.eq(UFS[uf].cidade)
                expect(pessoa.cep, 'CEP coerente com a UF').to.eq(UFS[uf].cep)
                expect(pessoa.logradouro, 'logradouro preenchido').to.eq(UFS[uf].logradouro)
                expect(pessoa.bairro, 'bairro preenchido').to.eq(UFS[uf].bairro)
                expect(pessoa.numero, 'numero gerado').to.match(/^\d+$/)
                expect(pessoa.cpfCnpj, 'documento numerico gerado').to.match(/^\d{11}$/)
                expect(pessoa.email, 'email unico da massa').to.include(`.${uf.toLowerCase()}.`)

                const veiculo = gerarVeiculoNovoPorUf(uf)
                validarVeiculo(veiculo, 'novo')
                expect(veiculo.chassi, 'chassi unico por UF').to.match(/^[0-9A-HJ-NPR-Z]{17}$/)
            })
        })
    })

    detransElegiveis.forEach((detran) => {
        it(`Registrar contrato NOVO para ${detran}`, () => {
            expect(detransIgnoradosNaSuite, `${detran} nao deve exigir WebPKI ou estar indisponivel`).not.to.include(detran)

            cy.login(Cypress.env('username'), Cypress.env('password'))
            contratoPage.aguardarCarregamento()

            const veiculo = gerarVeiculoNovoPorUf(detran)

            contratoActions.iniciarFluxoContrato(detran)
            contratoActions.preencherDadosContrato(detran)
            contratoActions.adicionarVeiculoNovo(veiculo)

            contratoPage.assertBotaoSalvarHabilitado()
            contratoActions.enviarContrato()
        })
    })
})
