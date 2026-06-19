import detrans from "../fixtures/detrans.json"
import detransIgnorados from "../fixtures/detransIgnorados.json"

const normalizarUf = (detranOuUf) => String(detranOuUf || '')
    .replace('DETRAN-', '')
    .toUpperCase()

const obterDetransIgnorados = (extras = []) => [
    ...Object.values(detransIgnorados).flat(),
    ...extras
]

const listarDetransElegiveis = ({ filtro = Cypress.env('detran'), ignorados = obterDetransIgnorados() } = {}) => {
    return detrans.detrans
        .filter((detran) => !ignorados.includes(detran))
        .filter((detran) => !filtro || detran === filtro)
}

const validarDetranElegivel = (detran, ignorados = obterDetransIgnorados()) => {
    expect(ignorados, `${detran} nao deve exigir WebPKI ou estar indisponivel`).not.to.include(detran)
}

export {
    detrans,
    detransIgnorados,
    listarDetransElegiveis,
    normalizarUf,
    obterDetransIgnorados,
    validarDetranElegivel
}
