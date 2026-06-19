import contratoActions from "../../actions/contratoActions"
import contratoPage from "../../pages/contratoPage"
import { listarDetransElegiveis, obterDetransIgnorados, validarDetranElegivel } from "../../config/detransConfig"

describe('Contrato - Veiculo Novo', () => {
    const detransIgnoradosNaSuite = obterDetransIgnorados()
    const detransElegiveis = listarDetransElegiveis({ ignorados: detransIgnoradosNaSuite })

    detransElegiveis.forEach((detran) => {
        it(`Registrar contrato NOVO para ${detran}`, () => {
            validarDetranElegivel(detran, detransIgnoradosNaSuite)

            cy.login({ escopoSessao: 'contratos', cacheAcrossSpecs: true })
            contratoPage.aguardarCarregamento()

            contratoActions.registrarContratoPorTipo(detran, 'novo').then(({ protocolo }) => {
                expect(protocolo, `protocolo contrato novo ${detran}`).to.match(/\d{4,}/)
            })
        })
    })
})
