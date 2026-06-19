import contratoActions from "../../actions/contratoActions"
import contratoPage from "../../pages/contratoPage"
import { listarDetransElegiveis, obterDetransIgnorados, validarDetranElegivel } from "../../config/detransConfig"

describe('Contrato - Veiculo Usado', () => {
    const detransIgnoradosNaSuite = obterDetransIgnorados()
    const detransElegiveis = listarDetransElegiveis({ ignorados: detransIgnoradosNaSuite })

    detransElegiveis.forEach((detran) => {
        it(`Registrar contrato USADO para ${detran}`, () => {
            validarDetranElegivel(detran, detransIgnoradosNaSuite)

            cy.login({ escopoSessao: 'contratos', cacheAcrossSpecs: true })
            contratoPage.aguardarCarregamento()

            contratoActions.registrarContratoPorTipo(detran, 'usado').then(({ protocolo }) => {
                expect(protocolo, `protocolo contrato usado ${detran}`).to.match(/\d{4,}/)
            })
        })
    })
})
