const UFS = {
    AC: {
        estado: 'Acre',
        cidade: 'Rio Branco',
        cep: '69900078',
        logradouro: 'Avenida Brasil',
        bairro: 'Centro'
    },
    AL: {
        estado: 'Alagoas',
        cidade: 'Maceió',
        cep: '57020000',
        logradouro: 'Rua do Comercio',
        bairro: 'Centro'
    },
    AM: {
        estado: 'Amazonas',
        cidade: 'Manaus',
        cep: '69005040',
        logradouro: 'Avenida Eduardo Ribeiro',
        bairro: 'Centro'
    },
    AP: {
        estado: 'Amapá',
        cidade: 'Macapá',
        cep: '68900073',
        logradouro: 'Avenida FAB',
        bairro: 'Central'
    },
    BA: {
        estado: 'Bahia',
        cidade: 'Salvador',
        cep: '40020000',
        logradouro: 'Avenida Sete de Setembro',
        bairro: 'Centro'
    },
    CE: {
        estado: 'Ceará',
        cidade: 'Fortaleza',
        cep: '60025060',
        logradouro: 'Rua Senador Pompeu',
        bairro: 'Centro'
    },
    DF: {
        estado: 'Distrito Federal',
        cidade: 'Brasília',
        cep: '70040900',
        logradouro: 'Setor Bancário Sul Quadra 1',
        bairro: 'Asa Sul'
    },
    ES: {
        estado: 'Espírito Santo',
        cidade: 'Vitória',
        cep: '29010001',
        logradouro: 'Avenida Jerônimo Monteiro',
        bairro: 'Centro'
    },
    GO: {
        estado: 'Goiás',
        cidade: 'Goiânia',
        cep: '74003010',
        logradouro: 'Avenida Goiás',
        bairro: 'Setor Central'
    },
    MA: {
        estado: 'Maranhão',
        cidade: 'São Luís',
        cep: '65010000',
        logradouro: 'Rua Grande',
        bairro: 'Centro'
    },
    MG: {
        estado: 'Minas Gerais',
        cidade: 'Belo Horizonte',
        cep: '30140071',
        logradouro: 'Avenida Afonso Pena',
        bairro: 'Centro'
    },
    MS: {
        estado: 'Mato Grosso do Sul',
        cidade: 'Campo Grande',
        cep: '79002071',
        logradouro: 'Avenida Afonso Pena',
        bairro: 'Centro'
    },
    MT: {
        estado: 'Mato Grosso',
        cidade: 'Cuiabá',
        cep: '78005000',
        logradouro: 'Avenida Getúlio Vargas',
        bairro: 'Centro'
    },
    PA: {
        estado: 'Pará',
        cidade: 'Belém',
        cep: '66010000',
        logradouro: 'Avenida Presidente Vargas',
        bairro: 'Campina'
    },
    PB: {
        estado: 'Paraíba',
        cidade: 'João Pessoa',
        cep: '58010000',
        logradouro: 'Avenida General Osório',
        bairro: 'Centro'
    },
    PE: {
        estado: 'Pernambuco',
        cidade: 'Recife',
        cep: '50030000',
        logradouro: 'Avenida Dantas Barreto',
        bairro: 'Santo Antônio'
    },
    PI: {
        estado: 'Piauí',
        cidade: 'Teresina',
        cep: '64000040',
        logradouro: 'Rua Coelho Rodrigues',
        bairro: 'Centro'
    },
    PR: {
        estado: 'Paraná',
        cidade: 'Curitiba',
        cep: '80010000',
        logradouro: 'Rua XV de Novembro',
        bairro: 'Centro'
    },
    RJ: {
        estado: 'Rio de Janeiro',
        cidade: 'Rio de Janeiro',
        cep: '20040002',
        logradouro: 'Avenida Rio Branco',
        bairro: 'Centro'
    },
    RN: {
        estado: 'Rio Grande do Norte',
        cidade: 'Natal',
        cep: '59020000',
        logradouro: 'Avenida Rio Branco',
        bairro: 'Cidade Alta'
    },
    RO: {
        estado: 'Rondônia',
        cidade: 'Porto Velho',
        cep: '76801020',
        logradouro: 'Avenida Sete de Setembro',
        bairro: 'Centro'
    },
    RR: {
        estado: 'Roraima',
        cidade: 'Boa Vista',
        cep: '69301000',
        logradouro: 'Avenida Capitão Ene Garcez',
        bairro: 'Centro'
    },
    RS: {
        estado: 'Rio Grande do Sul',
        cidade: 'Porto Alegre',
        cep: '90010000',
        logradouro: 'Rua dos Andradas',
        bairro: 'Centro Histórico'
    },
    SC: {
        estado: 'Santa Catarina',
        cidade: 'Florianópolis',
        cep: '88010000',
        logradouro: 'Rua Felipe Schmidt',
        bairro: 'Centro'
    },
    SE: {
        estado: 'Sergipe',
        cidade: 'Aracaju',
        cep: '49010000',
        logradouro: 'Rua João Pessoa',
        bairro: 'Centro'
    },
    SP: {
        estado: 'São Paulo',
        cidade: 'São Paulo',
        cep: '01001000',
        logradouro: 'Praça da Sé',
        bairro: 'Sé'
    },
    TO: {
        estado: 'Tocantins',
        cidade: 'Palmas',
        cep: '77001002',
        logradouro: 'Avenida Juscelino Kubitschek',
        bairro: 'Plano Diretor Sul'
    }
}

const CEP_PREFIXOS_POR_UF = {
    AC: ['699'],
    AL: ['570', '571', '572', '573', '574', '575', '576', '577', '578', '579'],
    AM: ['690', '691', '692', '693', '694', '695', '696', '697', '698'],
    AP: ['689'],
    BA: ['400', '401', '402', '403', '404', '405', '406', '407', '408', '409', '41', '42', '43', '44', '45', '46', '47', '48'],
    CE: ['600', '601', '602', '603', '604', '605', '606', '607', '608', '609', '61', '62', '63'],
    DF: ['700', '701', '702', '703', '704', '705', '706', '707', '708', '709', '71', '72', '73'],
    ES: ['290', '291', '292', '293', '294', '295', '296', '297', '298', '299'],
    GO: ['728', '729', '737', '738', '739', '74', '75', '76'],
    MA: ['650', '651', '652', '653', '654', '655', '656', '657', '658', '659'],
    MG: ['300', '301', '302', '303', '304', '305', '306', '307', '308', '309', '31', '32', '33', '34', '35', '36', '37', '38', '39'],
    MS: ['790', '791', '792', '793', '794', '795', '796', '797', '798', '799'],
    MT: ['780', '781', '782', '783', '784', '785', '786', '787', '788'],
    PA: ['660', '661', '662', '663', '664', '665', '666', '667', '668', '669', '67', '68'],
    PB: ['580', '581', '582', '583', '584', '585', '586', '587', '588', '589'],
    PE: ['500', '501', '502', '503', '504', '505', '506', '507', '508', '509', '51', '52', '53', '54', '55', '56'],
    PI: ['640', '641', '642', '643', '644', '645', '646', '647', '648', '649'],
    PR: ['800', '801', '802', '803', '804', '805', '806', '807', '808', '809', '81', '82', '83', '84', '85', '86', '87'],
    RJ: ['200', '201', '202', '203', '204', '205', '206', '207', '208', '209', '21', '22', '23', '24', '25', '26', '27', '28'],
    RN: ['590', '591', '592', '593', '594', '595', '596', '597', '598', '599'],
    RO: ['768', '769'],
    RR: ['693'],
    RS: ['900', '901', '902', '903', '904', '905', '906', '907', '908', '909', '91', '92', '93', '94', '95', '96', '97', '98', '99'],
    SC: ['880', '881', '882', '883', '884', '885', '886', '887', '888', '889', '89'],
    SE: ['490', '491', '492', '493', '494', '495', '496', '497', '498', '499'],
    SP: ['010', '011', '012', '013', '014', '015', '016', '017', '018', '019', '02', '03', '04', '05', '06', '07', '08', '09', '1'],
    TO: ['770', '771', '772', '773', '774', '775', '776', '777', '778', '779']
}

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
    const dddPorUf = {
        AC: '68', AL: '82', AM: '92', AP: '96', BA: '71', CE: '85', DF: '61', ES: '27',
        GO: '62', MA: '98', MG: '31', MS: '67', MT: '65', PA: '91', PB: '83', PE: '81',
        PI: '86', PR: '41', RJ: '21', RN: '84', RO: '69', RR: '95', RS: '51', SC: '48',
        SE: '79', SP: '11', TO: '63'
    }

    return `${dddPorUf[uf] || '11'}9${random(10000000, 99999999)}`
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
