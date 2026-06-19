import { CEP_PREFIXOS_POR_UF, DDD_POR_UF, UFS } from "../config/ufsConfig"

const nomes = ['Ana', 'Bruno', 'Carla', 'Daniel', 'Eduardo', 'Fernanda', 'Gustavo', 'Helena', 'Igor', 'Juliana', 'Lucas', 'Marina', 'Nicolas', 'Patricia', 'Rafael', 'Sofia']
const sobrenomes = ['Almeida', 'Barbosa', 'Cardoso', 'Dias', 'Ferreira', 'Gomes', 'Lima', 'Martins', 'Oliveira', 'Pereira', 'Ribeiro', 'Santos', 'Silva', 'Souza']
const usados = new Set()
let sequencialPessoa = 0

const somenteDigitos = (valor) => String(valor || '').replace(/\D/g, '')
const normalizarUf = (ufOuDetran) => String(ufOuDetran || '').replace('DETRAN-', '').toUpperCase()

const random = (min, max) => {
    if (typeof Cypress !== 'undefined' && Cypress._) {
        return Cypress._.random(min, max)
    }

    return Math.floor(Math.random() * (max - min + 1)) + min
}

function logMassa(mensagem) {
    if (typeof Cypress !== 'undefined' && Cypress.log) {
        Cypress.log({ name: 'massa', message: mensagem })
        return
    }

    console.info(`[massa] ${mensagem}`)
}

function calcularDigitoCpf(cpfParcial) {
    let soma = 0
    for (let i = 0; i < cpfParcial.length; i += 1) {
        soma += Number(cpfParcial[i]) * (cpfParcial.length + 1 - i)
    }

    const resto = soma % 11
    return resto < 2 ? 0 : 11 - resto
}

function gerarCpfValido() {
    const base = Array.from({ length: 9 }, () => random(0, 9)).join('')
    const digito1 = calcularDigitoCpf(base)
    const digito2 = calcularDigitoCpf(`${base}${digito1}`)

    return `${base}${digito1}${digito2}`
}

function valorCaracterCnpj(caracter) {
    return caracter.charCodeAt(0) - 48
}

function calcularDigitoCnpjAlfanumerico(base, pesos) {
    const soma = base
        .split('')
        .reduce((total, caracter, indice) => total + valorCaracterCnpj(caracter) * pesos[indice], 0)
    const resto = soma % 11

    return resto < 2 ? '0' : String(11 - resto)
}

function gerarCnpjAlfanumerico() {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const alfanumericos = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    for (let tentativa = 0; tentativa < 10; tentativa += 1) {
        const sufixo = String(sequencialPessoa + tentativa).padStart(4, '0').slice(-4)
        const base = [
            letras[random(0, letras.length - 1)],
            letras[random(0, letras.length - 1)],
            ...Array.from({ length: 6 }, () => alfanumericos[random(0, alfanumericos.length - 1)]),
            ...sufixo
        ].join('')
        const digito1 = calcularDigitoCnpjAlfanumerico(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
        const digito2 = calcularDigitoCnpjAlfanumerico(`${base}${digito1}`, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
        const cnpj = `${base}${digito1}${digito2}`

        if (!usados.has(cnpj)) {
            usados.add(cnpj)
            sequencialPessoa += tentativa + 1
            return cnpj
        }
    }

    throw new Error('Nao foi possivel gerar CNPJ alfanumerico unico')
}

function formatarCnpj(cnpj) {
    const valor = String(cnpj || '').replace(/[^0-9A-Z]/gi, '').toUpperCase()
    return `${valor.slice(0, 2)}.${valor.slice(2, 5)}.${valor.slice(5, 8)}/${valor.slice(8, 12)}-${valor.slice(12, 14)}`
}

function gerarValorUnico(prefixo, tamanho, caracteres = '0123456789ABCDEFGHJKLMNPRSTUVWXYZ') {
    for (let tentativa = 0; tentativa < 20; tentativa += 1) {
        const semente = `${prefixo}${Date.now().toString(36)}${random(100000, 999999)}${tentativa}`.toUpperCase()
        const valor = semente
            .replace(/[^0-9A-Z]/g, '')
            .split('')
            .map((caracter) => caracteres.includes(caracter) ? caracter : caracteres[random(0, caracteres.length - 1)])
            .join('')
            .padEnd(tamanho, caracteres[random(0, caracteres.length - 1)])
            .slice(0, tamanho)

        if (!usados.has(valor)) {
            usados.add(valor)
            return valor
        }
    }

    throw new Error(`Nao foi possivel gerar valor unico para ${prefixo}`)
}

const transliteracaoChassi = {
    A: 1,
    B: 2,
    C: 3,
    D: 4,
    E: 5,
    F: 6,
    G: 7,
    H: 8,
    J: 1,
    K: 2,
    L: 3,
    M: 4,
    N: 5,
    P: 7,
    R: 9,
    S: 2,
    T: 3,
    U: 4,
    V: 5,
    W: 6,
    X: 7,
    Y: 8,
    Z: 9
}

function calcularDigitoChassi(chassiSemDigito) {
    const pesos = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2]
    const soma = chassiSemDigito
        .split('')
        .reduce((total, caracter, indice) => {
            const valor = /\d/.test(caracter) ? Number(caracter) : transliteracaoChassi[caracter]
            return total + valor * pesos[indice]
        }, 0)
    const resto = soma % 11

    return resto === 10 ? 'X' : String(resto)
}

function gerarChassiUnico(ufOuDetran) {
    const uf = normalizarUf(ufOuDetran)
    const caracteres = '0123456789ABCDEFGHJKLMNPRSTUVWXYZ'

    for (let tentativa = 0; tentativa < 20; tentativa += 1) {
        const base = gerarValorUnico(`9BW${uf}`, 17, caracteres)
            .split('')

        base[8] = calcularDigitoChassi(base.join(''))

        const chassi = base.join('')
        if (!usados.has(chassi)) {
            usados.add(chassi)
            return chassi
        }
    }

    throw new Error(`Nao foi possivel gerar chassi unico para ${uf}`)
}

function gerarGravameUnico() {
    return gerarValorUnico('GRV', 13, '0123456789')
}

function gerarRenavamUnico() {
    for (let tentativa = 0; tentativa < 20; tentativa += 1) {
        const base = gerarValorUnico('', 10, '0123456789').padStart(10, '0')
        const pesos = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        const soma = base
            .split('')
            .reduce((total, digito, indice) => total + Number(digito) * pesos[indice], 0)
        const resto = soma % 11
        const digito = resto < 2 ? 0 : 11 - resto
        const renavam = `${base}${digito}`

        if (!usados.has(renavam)) {
            usados.add(renavam)
            return renavam
        }
    }

    throw new Error('Nao foi possivel gerar RENAVAM unico')
}

function gerarPlacaUnica() {
    const letras = 'ABCDEFGHJKLMNPRSTUVWXYZ'
    const placa = [
        letras[random(0, letras.length - 1)],
        letras[random(0, letras.length - 1)],
        letras[random(0, letras.length - 1)],
        random(0, 9),
        letras[random(0, letras.length - 1)],
        random(0, 9),
        random(0, 9)
    ].join('')

    if (usados.has(placa)) {
        return gerarPlacaUnica()
    }

    usados.add(placa)
    return placa
}

function gerarVeiculoNovoPorUf(ufOuDetran) {
    const uf = normalizarUf(ufOuDetran)

    return {
        chassi: gerarChassiUnico(uf),
        ano: '2024',
        modelo: '2025',
        gravame: gerarGravameUnico(),
        cor: 'Prata'
    }
}

function gerarVeiculoUsadoPorUf(ufOuDetran) {
    const uf = normalizarUf(ufOuDetran)
    const endereco = obterEnderecoPorUf(uf)

    return {
        chassi: gerarChassiUnico(uf),
        renavam: gerarRenavamUnico(),
        placa: gerarPlacaUnica(),
        ufPlaca: endereco.estado,
        ano: '2020',
        modelo: '2021',
        gravame: gerarGravameUnico(),
        cor: 'Prata'
    }
}

function validarVeiculo(veiculo, tipo = 'novo') {
    const camposObrigatorios = ['chassi', 'ano', 'modelo', 'gravame']
    const campoVazio = camposObrigatorios.find((campo) => !veiculo[campo])

    if (campoVazio) {
        throw new Error(`Veiculo sem campo obrigatorio: ${campoVazio}`)
    }

    if (!/^[0-9A-HJ-NPR-Z]{17}$/.test(veiculo.chassi)) {
        throw new Error(`Chassi invalido para teste: ${veiculo.chassi}`)
    }

    if (tipo === 'usado') {
        const camposUsado = ['renavam', 'placa', 'ufPlaca']
        const campoUsadoVazio = camposUsado.find((campo) => !veiculo[campo])

        if (campoUsadoVazio) {
            throw new Error(`Veiculo usado sem campo obrigatorio: ${campoUsadoVazio}`)
        }
    }
}

function gerarTelefone(uf) {
    return `${DDD_POR_UF[uf] || '11'}9${random(10000000, 99999999)}`
}
function gerarNomeUnico() {
    for (let tentativa = 0; tentativa < 100; tentativa += 1) {
        const indice = sequencialPessoa + tentativa
        const nomeCompleto = [
            nomes[indice % nomes.length],
            sobrenomes[Math.floor(indice / nomes.length) % sobrenomes.length],
            sobrenomes[Math.floor(indice / (nomes.length * sobrenomes.length)) % sobrenomes.length]
        ].join(' ')

        if (!usados.has(nomeCompleto)) {
            sequencialPessoa = indice + 1
            return nomeCompleto
        }
    }

    throw new Error('Não foi possível gerar nome único para a massa de teste')
}

function validarCepPorUf(cep, uf) {
    const cepLimpo = somenteDigitos(cep)
    const prefixos = CEP_PREFIXOS_POR_UF[uf]

    if (!prefixos) {
        throw new Error(`UF sem configuração de CEP: ${uf}`)
    }

    if (!prefixos.some((prefixo) => cepLimpo.startsWith(prefixo))) {
        throw new Error(`CEP ${cep} não é compatível com a UF ${uf}`)
    }
}

function validarEndereco(endereco, uf) {
    const camposObrigatorios = ['cep', 'logradouro', 'bairro', 'cidade', 'uf']
    const campoVazio = camposObrigatorios.find((campo) => !endereco[campo])

    if (campoVazio) {
        throw new Error(`Endereço da UF ${uf} sem campo obrigatório: ${campoVazio}`)
    }

    if (endereco.uf !== uf) {
        throw new Error(`Endereço com UF ${endereco.uf}, esperado ${uf}`)
    }

    validarCepPorUf(endereco.cep, uf)
}

function validarPessoa(pessoa, uf) {
    const camposObrigatorios = ['cpfCnpj', 'nomeCompleto', 'telefone', 'email']
    const campoVazio = camposObrigatorios.find((campo) => !pessoa[campo])

    if (campoVazio) {
        throw new Error(`Pessoa da UF ${uf} sem campo obrigatorio: ${campoVazio}`)
    }

    validarEndereco(pessoa, uf)
}

function gerarPessoaPorUf(ufOuDetran) {
    const uf = normalizarUf(ufOuDetran)
    const baseEndereco = UFS[uf]

    if (!baseEndereco) {
        throw new Error(`Não existe massa configurada para a UF ${uf}`)
    }

    for (let tentativa = 0; tentativa < 10; tentativa += 1) {
        logMassa(`UF ${uf}: gerando pessoa, tentativa ${tentativa + 1}`)

        const sufixo = `${Date.now()}${random(1000, 9999)}${tentativa}`
        const nomeCompleto = gerarNomeUnico()
        const cpfCnpj = gerarCpfValido()
        const numero = String(random(10, 9999))
        const email = `teste.${uf.toLowerCase()}.${sufixo}@vbauto.test`
        const telefone = gerarTelefone(uf)
        const endereco = {
            cep: baseEndereco.cep,
            logradouro: baseEndereco.logradouro,
            bairro: baseEndereco.bairro,
            cidade: baseEndereco.cidade,
            uf,
            estado: baseEndereco.estado,
            numero,
            complemento: `Compl ${random(1, 99)}`
        }

        validarEndereco(endereco, uf)

        const chaves = [cpfCnpj, nomeCompleto, telefone, email, `${endereco.cep}-${endereco.numero}-${endereco.complemento}`]
        if (chaves.some((chave) => usados.has(chave))) {
            logMassa(`UF ${uf}: duplicidade detectada na tentativa ${tentativa + 1}`)
            continue
        }

        chaves.forEach((chave) => usados.add(chave))

        const pessoa = {
            cpfCnpj,
            nomeCompleto,
            telefone,
            email,
            ...endereco
        }

        validarPessoa(pessoa, uf)
        logMassa(`UF ${uf}: pessoa gerada com CEP ${pessoa.cep}, cidade ${pessoa.cidade}`)
        return pessoa
    }

    throw new Error(`Não foi possível gerar massa única para a UF ${uf}`)
}

function obterEnderecoPorUf(ufOuDetran) {
    const uf = normalizarUf(ufOuDetran)
    const endereco = UFS[uf]

    if (!endereco) {
        throw new Error(`Não existe endereço configurado para a UF ${uf}`)
    }

    validarEndereco({ ...endereco, uf }, uf)
    return { ...endereco, uf }
}

export {
    UFS,
    gerarPessoaPorUf,
    obterEnderecoPorUf,
    validarCepPorUf,
    validarEndereco,
    validarPessoa,
    gerarCnpjAlfanumerico,
    formatarCnpj,
    gerarVeiculoNovoPorUf,
    gerarVeiculoUsadoPorUf,
    validarVeiculo
}
