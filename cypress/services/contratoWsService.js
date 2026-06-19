import detransIgnorados from "../fixtures/detransIgnorados.json"
import {
    gerarPessoaPorUf,
    gerarVeiculoUsadoPorUf,
    validarVeiculo
} from "../factories/massaDadosFactory"
import {
    AGENTE_WS,
    DETRANS_IGNORADOS_WS,
    MAX_TENTATIVAS_REGISTRO_WS,
    MUNICIPIOS_WS_POR_UF,
    WS_AUTH_URL,
    WS_CONTRATOS_URL
} from "../config/webserviceConfig"
import { formatarDataWs, somarMesesHoje } from "../utils/dateUtils"

const somenteDigitos = (valor) => String(valor || '').replace(/\D/g, '')
const normalizarUf = (detran) => detran.replace('DETRAN-', '')

const obterDetransIgnoradosWs = (extras = []) => [
    ...Object.values(detransIgnorados).flat(),
    ...Object.values(DETRANS_IGNORADOS_WS).flat(),
    ...extras
]

const gerarNumeroContratoWs = (uf) => {
    const timestamp = Date.now().toString().slice(-10)
    const randomico = Cypress._.random(100, 999)

    return `WS${uf}${timestamp}${randomico}`
}

const gerarPessoaNumericaPorUf = (uf) => {
    for (let tentativa = 0; tentativa < 10; tentativa += 1) {
        const pessoa = gerarPessoaPorUf(uf)

        if (!pessoa.cpfCnpj.startsWith('0')) {
            return pessoa
        }
    }

    throw new Error(`Nao foi possivel gerar CPF numerico valido para WS na UF ${uf}`)
}

const gerarBodyContratoWs = (detran) => {
    const uf = normalizarUf(detran)
    const municipio = MUNICIPIOS_WS_POR_UF[uf]

    if (!municipio) {
        throw new Error(`UF ${uf} sem codigo de municipio WS configurado`)
    }

    const devedor = gerarPessoaNumericaPorUf(uf)
    const credor = gerarPessoaNumericaPorUf(uf)
    const veiculo = gerarVeiculoUsadoPorUf(uf)
    const dataAtual = formatarDataWs()
    const primeiraParcela = formatarDataWs(somarMesesHoje(1))
    const ultimaParcela = formatarDataWs(somarMesesHoje(48))

    validarVeiculo(veiculo, 'usado')

    return {
        chassi: veiculo.chassi,
        numeroContrato: gerarNumeroContratoWs(uf),
        numeroRestricao: Number(somenteDigitos(veiculo.gravame).slice(-8)),
        dataContrato: dataAtual,
        flag: 1,
        quantidadeParcelas: 48,
        tipoRestricao: 3,
        numeroAditivo: null,
        tipoAditivo: null,
        dataAditivo: null,
        valorTaxaJurosMes: 1.49,
        valorTaxaJurosAno: 19.42,
        valorTaxaMulta: 0,
        valorTaxaMora: 0,
        valorTaxaContrato: 0,
        valorIOF: 1250.75,
        indice: 'Pre fixada',
        valorComissao: 850.0,
        penalidade: 'Em caso de inadimplemento, encargos moratorios',
        valorTotalFinanciamento: 85000.0,
        valorParcela: 2195.80,
        dataVencimentoPrimeiraParcela: primeiraParcela,
        dataVencimentoUltimaParcela: ultimaParcela,
        dataLiberacaoCredito: dataAtual,
        codigoMunicipioLiberacaoCredito: municipio.contrato,
        codigoMunicipioPagamento: municipio.contrato,
        dataPagamento: primeiraParcela,
        grupoConsorcio: '0',
        cotaConsorcio: 0,
        nomeAgenteFinanceiro: AGENTE_WS.nome,
        cnpjAgenteFinanceiro: AGENTE_WS.cnpj,
        bairroCredor: credor.bairro,
        bairroDevedor: devedor.bairro,
        cepCredor: Number(somenteDigitos(credor.cep)),
        cepDevedor: Number(somenteDigitos(devedor.cep)),
        complementoEnderecoCredor: credor.complemento,
        complementoEnderecoDevedor: devedor.complemento,
        dddCredor: Number(somenteDigitos(credor.telefone).slice(0, 2)),
        dddDevedor: Number(somenteDigitos(devedor.telefone).slice(0, 2)),
        logradouroCredor: credor.logradouro,
        logradouroDevedor: devedor.logradouro,
        municipioCredor: municipio.contrato,
        municipioDevedor: municipio.contrato,
        numeroEnderecoCredor: credor.numero,
        numeroEnderecoDevedor: devedor.numero,
        remarcacao: 1,
        telefoneCredor: Number(somenteDigitos(credor.telefone).slice(2)),
        telefoneDevedor: Number(somenteDigitos(devedor.telefone).slice(2)),
        ufCredor: uf,
        ufDevedor: uf,
        ufLicenciamento: uf,
        ufDestino: uf,
        ufLiberecaoCredito: uf,
        codigoAgenteFinanceiro: null,
        emailCredor: null,
        emailDevedor: null,
        marcaModelo: 1,
        correcaoMonetaria: null,
        logradouroTerceiroGarantidor: null,
        numeroEnderecoTerceiroGarantidor: null,
        complementoEnderecoTerceiroGarantidor: null,
        bairroTerceiroGarantidor: null,
        municipioTerceiroGarantidor: null,
        ufTerceiroGarantidor: null,
        nomeTerceiroGarantidor: null,
        cpfCnpjTerceiroGarantidor: null,
        dddTerceiroGarantidor: null,
        telefoneTerceiroGarantidor: null,
        cpfCnpjAntigoDevedor: null,
        indicaNovoUsado: null,
        placa: veiculo.placa,
        ufPlaca: uf,
        renavam: veiculo.renavam,
        anoFabricacao: Number(veiculo.ano),
        anoModelo: Number(veiculo.modelo),
        cpfCnpjDevedor: Number(devedor.cpfCnpj),
        nomeDevedor: devedor.nomeCompleto
    }
}

const extrairToken = (body) => {
    return body?.token ||
        body?.accessToken ||
        body?.access_token ||
        body?.data?.token ||
        body?.data?.accessToken
}

const normalizarProtocolo = (valor) => {
    const protocolo = String(valor || '')
        .match(/[A-Z0-9.-]*\d{4,}[A-Z0-9.-]*/i)?.[0]

    return String(protocolo || '').replace(/[^\dA-Z.-]/gi, '')
}

const buscarProtocoloEmObjeto = (valor) => {
    if (!valor || typeof valor !== 'object') {
        return normalizarProtocolo(valor)
    }

    const chaveProtocolo = Object.keys(valor)
        .find((chave) => /protocolo|protocol/i.test(chave))

    if (chaveProtocolo) {
        return normalizarProtocolo(valor[chaveProtocolo])
    }

    return Object.values(valor)
        .map((item) => buscarProtocoloEmObjeto(item))
        .find(Boolean) || ''
}

const extrairProtocolo = (response) => {
    return buscarProtocoloEmObjeto(response.body) ||
        normalizarProtocolo(response.headers?.location) ||
        normalizarProtocolo(response.headers?.Location)
}

const obterTokenWs = () => {
    const usuario = Cypress.env('username')
    const senha = Cypress.env('password')

    expect(usuario, 'usuario do .env').to.not.be.empty
    expect(senha, 'senha do .env').to.not.be.empty

    return cy.request({
        method: 'POST',
        url: WS_AUTH_URL,
        body: {
            username: usuario,
            password: senha
        },
        log: false
    }).then((authResponse) => {
        expect(authResponse.status, 'status login WS').to.be.oneOf([200, 201])

        const token = extrairToken(authResponse.body)
        cy.task('log', `[ws-auth] status=${authResponse.status} keys=${Object.keys(authResponse.body || {}).join(',')}`)
        expect(token, 'token WS').to.not.be.empty

        return cy.wrap(token, { log: false })
    })
}

const registrarContratoWsComRetry = (detran, tokenWs, tentativa = 1) => {
    const bodyContrato = gerarBodyContratoWs(detran)

    return cy.request({
        method: 'POST',
        url: WS_CONTRATOS_URL,
        headers: {
            'Content-Type': 'application/json',
            Authorization: tokenWs
        },
        body: bodyContrato,
        failOnStatusCode: false
    }).then((contratoResponse) => {
        expect(contratoResponse.status, `status registro contrato WS ${detran}`).to.be.oneOf([200, 201, 202])

        const protocolo = extrairProtocolo(contratoResponse)
        const bodyResumo = JSON.stringify(contratoResponse.body).slice(0, 1000)
        const erros = contratoResponse.body?.errors || []

        return cy.task('log', `[ws-contrato] ${detran} tentativa=${tentativa} status=${contratoResponse.status} contrato=${bodyContrato.numeroContrato} chassi=${bodyContrato.chassi} protocolo=${protocolo || 'nao identificado'} erros=${JSON.stringify(erros).slice(0, 500)} body=${bodyResumo}`)
            .then(() => {
                if (protocolo) {
                    return cy.wrap({ protocolo, bodyContrato, contratoResponse }, { log: false })
                }

                if (tentativa < MAX_TENTATIVAS_REGISTRO_WS) {
                    return cy.task('log', `[ws-retry] ${detran} sem protocolo na tentativa ${tentativa}; gerando nova massa`)
                        .then(() => registrarContratoWsComRetry(detran, tokenWs, tentativa + 1))
                }

                expect(protocolo, `protocolo contrato WS ${detran}; body=${bodyResumo}`).to.match(/\d{4,}/)
                return null
            })
    })
}

export {
    DETRANS_IGNORADOS_WS,
    MUNICIPIOS_WS_POR_UF,
    WS_CONTRATOS_URL,
    extrairProtocolo,
    gerarBodyContratoWs,
    normalizarUf,
    obterDetransIgnoradosWs,
    obterTokenWs,
    registrarContratoWsComRetry
}
