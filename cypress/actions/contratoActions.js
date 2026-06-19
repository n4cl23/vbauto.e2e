import contratoPage from "../pages/contratoPage"
import {
    gerarPessoaPorUf,
    gerarVeiculoNovoPorUf,
    gerarVeiculoUsadoPorUf,
    obterEnderecoPorUf,
    validarPessoa,
    validarVeiculo
} from "../factories/massaDadosFactory"

const AGENTE_FINANCEIRO = 'Banco Piloto'

const formatarDataPtBr = (data) => data.toLocaleDateString('pt-BR')

const somarDias = (dataBase, dias) => {
    const data = new Date(dataBase)
    data.setDate(data.getDate() + dias)
    return data
}

const somarMeses = (dataBase, meses) => {
    const data = new Date(dataBase)
    data.setMonth(data.getMonth() + meses)
    return data
}

class ContratoActions {
    logMassa(mensagem) {
        cy.log(`[massa] ${mensagem}`)
    }

    gerarPessoasContratoComRetry(uf, limiteTentativas = 3) {
        let ultimoErro

        for (let tentativa = 1; tentativa <= limiteTentativas; tentativa += 1) {
            try {
                this.logMassa(`UF ${uf}: gerando massa do contrato, tentativa ${tentativa}`)
                const devedor = gerarPessoaPorUf(uf)
                const credor = gerarPessoaPorUf(uf)

                validarPessoa(devedor, uf)
                validarPessoa(credor, uf)

                this.logMassa(`UF ${uf}: massa valida - devedor ${devedor.cpfCnpj}, credor ${credor.cpfCnpj}`)
                return { devedor, credor }
            } catch (erro) {
                ultimoErro = erro
                this.logMassa(`UF ${uf}: tentativa ${tentativa} falhou - ${erro.message}`)
            }
        }

        throw new Error(`UF ${uf}: falha ao gerar massa valida apos ${limiteTentativas} tentativas. Motivo: ${ultimoErro?.message}`)
    }

    gerarDadosContrato(detran, overrides = {}) {
        const hoje = new Date()
        const dataAtual = formatarDataPtBr(hoje)
        const dataPrimeiraParcela = formatarDataPtBr(somarDias(hoje, 30))
        const dataUltimaParcela = formatarDataPtBr(somarMeses(hoje, 12))
        const dataFimVigencia = formatarDataPtBr(somarMeses(hoje, 12))
        const timestamp = Date.now().toString().slice(-10)
        const randomico = Cypress._.random(10, 99)
        const uf = detran.replace('DETRAN-', '')
        const pessoas = this.gerarPessoasContratoComRetry(uf)
        const devedor = { ...pessoas.devedor, ...overrides.devedor }
        const credor = { ...pessoas.credor, ...overrides.credor }

        validarPessoa(devedor, uf)
        validarPessoa(credor, uf)

        return {
            numeroContrato: `${timestamp}${randomico}`,
            dataAtual,
            dataLiberacaoCredito: dataAtual,
            dataPrimeiraParcela,
            dataUltimaParcela,
            dataInicioVigencia: dataAtual,
            dataFimVigencia,
            dataPagamento: dataPrimeiraParcela,
            parcela: '1',
            quantidadeParcelas: '12',
            totalFinanciamento: '25000',
            tipoGravame: 'Alienação Fiduciária',
            taxaJurosMes: '1',
            taxaJurosAno: '12',
            iof: '100',
            descricaoPenalidade: 'Sem penalidade',
            comissaoValor: '0',
            numeroCotaConsorcio: '1',
            numeroGrupoConsorcio: '1',
            taxaMora: '1',
            taxaMulta: '1',
            taxaContrato: '1',
            multa: '100',
            indice: 'IGPM',
            correcaoMonetaria: 'IGPM',
            uf: devedor.estado,
            cidade: devedor.cidade,
            devedor,
            credor
        }
    }

    gerarDadosNovoAditivo(overrides = {}) {
        const hoje = new Date()
        const dataAditivo = hoje.toLocaleDateString('pt-BR')
        const timestamp = Date.now().toString().slice(-10)
        const randomico = Cypress._.random(100, 999)

        return {
            dataAditivo,
            numeroAditivo: `AD${timestamp}${randomico}`,
            numeroRegistro: `${timestamp}${randomico}`,
            registroAditivoSircof: `${timestamp}`,
            ...overrides
        }
    }

    iniciarFluxoContrato(detran) {
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

    preencherDadosContrato(detran, overrides = {}) {
        const dadosContrato = this.gerarDadosContrato(detran, overrides)

        contratoPage.preencherDadosContrato(dadosContrato)
        contratoPage.assertCamposObrigatoriosContratoPreenchidos(dadosContrato)

        return dadosContrato
    }

    registrarContratoNovoComProtocolo(detran, overrides = {}) {
        return this.registrarContratoPorTipo(detran, 'novo', overrides)
    }

    registrarContratoPorTipo(detran, tipoVeiculo = 'novo', overrides = {}) {
        const veiculo = tipoVeiculo === 'usado'
            ? gerarVeiculoUsadoPorUf(detran)
            : gerarVeiculoNovoPorUf(detran)

        validarVeiculo(veiculo, tipoVeiculo)

        this.iniciarFluxoContrato(detran)
        const dadosContrato = this.preencherDadosContrato(detran, overrides)

        if (tipoVeiculo === 'usado') {
            this.adicionarVeiculoUsado(veiculo, detran)
        } else {
            this.adicionarVeiculoNovo(veiculo)
        }

        contratoPage.assertBotaoSalvarHabilitado()
        return this.enviarContrato().then((protocolo) => ({
            protocolo,
            dadosContrato,
            veiculo,
            tipoVeiculo
        }))
    }

    alterarContratoComProtocolo(detran, overrides = {}) {
        return this.registrarContratoNovoComProtocolo(detran).then(({ protocolo, dadosContrato, veiculo }) => {
            expect(protocolo, 'protocolo do contrato original').to.match(/\d{4,}/)

            contratoPage.abrirAlteracaoContrato(protocolo)
            const dadosAlteracao = this.gerarDadosContrato(detran, overrides)

            contratoPage.preencherDadosAlteracaoContrato(dadosAlteracao)

            return contratoPage.enviarAlteracaoContrato().then((protocoloAlteracao) => {
                return {
                    protocoloContrato: protocolo,
                    protocoloAlteracao,
                    dadosContrato,
                    dadosAlteracao,
                    veiculo
                }
            })
        })
    }

    iniciarFluxoNovoAditivo(detran) {
        cy.visit('/vbconnection/vbauto/home')
        contratoPage.aguardarCarregamento()

        contratoPage.acessarMenuRegistrar()
        contratoPage.acessarRegistroContratoAditivo()
        contratoPage.acessarRegistroContratoTela()
        contratoPage.selecionarDetran(detran)
        contratoPage.selecionarAgenteFinanceiro(AGENTE_FINANCEIRO)
        contratoPage.selecionarNovoAditivo()
    }

    preencherProtocoloNovoAditivo(protocolo) {
        contratoPage.preencherProtocoloAditivo(protocolo)
        contratoPage.assertContratoBaseAditivoCarregado(protocolo)
        contratoPage.abrirFormularioNovoAditivo()
    }

    preencherDadosNovoAditivo(overrides = {}) {
        const dadosAditivo = this.gerarDadosNovoAditivo(overrides)

        contratoPage.preencherDadosNovoAditivo(dadosAditivo)
        contratoPage.assertDadosNovoAditivoPreenchidos(dadosAditivo)

        return dadosAditivo
    }

    enviarNovoAditivo() {
        return contratoPage.enviarNovoAditivo()
    }

    registrarAditivoComProtocolo(detran, overridesAditivo = {}) {
        return this.registrarContratoNovoComProtocolo(detran).then(({ protocolo, dadosContrato, veiculo }) => {
            expect(protocolo, 'protocolo do contrato base').to.match(/\d{4,}/)

            this.iniciarFluxoNovoAditivo(detran)
            this.preencherProtocoloNovoAditivo(protocolo)
            const dadosAditivo = this.preencherDadosNovoAditivo(overridesAditivo)

            return this.enviarNovoAditivo().then((protocoloAditivo) => {
                return {
                    protocoloContrato: protocolo,
                    protocoloAditivo,
                    dadosContrato,
                    dadosAditivo,
                    veiculo
                }
            })
        })
    }

    abrirAditivoExistenteParaAlteracao() {
        return contratoPage.abrirPrimeiroAditivoElegivelParaAlteracao()
    }

    alterarAditivoAtual(protocoloAditivo, overrides = {}, detran = null) {
        const dadosAlteracao = this.gerarDadosNovoAditivo(overrides)

        if (protocoloAditivo) {
            contratoPage.abrirAlteracaoAditivo(protocoloAditivo)
        }

        if (detran) {
            contratoPage.preencherDestinoAgenteAditivoSeNecessario(detran, AGENTE_FINANCEIRO)
        }

        contratoPage.preencherDadosAlteracaoAditivo(dadosAlteracao)
        contratoPage.assertDadosAlteracaoAditivoPreenchidos(dadosAlteracao)

        return contratoPage.enviarAlteracaoAditivo().then((protocoloAlteracao) => {
            return {
                protocoloAlteracao,
                dadosAlteracao
            }
        })
    }

    validarTipoAditivoPersistido(protocoloAditivo) {
        contratoPage.validarTipoAditivoPersistido(protocoloAditivo)
    }

    adicionarVeiculoNovo(dados) {
        contratoPage.clicarAdicionarVeiculo()

        contratoPage.selecionarTipoVeiculo('novo')

        contratoPage.preencherChassi(dados.chassi)

        contratoPage.selecionarSituacaoChassi()

        contratoPage.preencherNumeroGravame(dados.gravame)

        contratoPage.preencherAnoFabricacao(dados.ano)

        contratoPage.preencherAnoModelo(dados.modelo)

        contratoPage.preencherDescricaoCorVeiculo(dados.cor || 'Prata')

        contratoPage.selecionarMarcaModelo()
    }

    adicionarVeiculoUsado(dados, detran = 'DETRAN-DF') {
        const enderecoUf = obterEnderecoPorUf(detran)

        contratoPage.clicarAdicionarVeiculo()

        contratoPage.selecionarTipoVeiculo('usado')

        contratoPage.preencherChassi(dados.chassi)

        contratoPage.preencherRenavam(dados.renavam)

        contratoPage.selecionarSituacaoChassi()

        contratoPage.preencherNumeroGravame(dados.gravame)

        contratoPage.preencherAnoFabricacao(dados.ano)

        contratoPage.preencherAnoModelo(dados.modelo)

        contratoPage.preencherPlaca(dados.placa)

        contratoPage.selecionarUfPlaca(dados.ufPlaca || enderecoUf.estado)

        contratoPage.preencherDescricaoCorVeiculo(dados.cor || 'Prata')

        contratoPage.selecionarMarcaModelo()
    }

    enviarContrato() {
        return contratoPage.enviarContrato()
    }

    // =========================
    // 🔍 VALIDAÇÕES
    // =========================

    tentarSubmeterSemChassi(dados, tipo = 'novo') {
        contratoPage.clicarAdicionarVeiculo()
        contratoPage.selecionarTipoVeiculo(tipo)
        // omite chassi — preenche o restante
        contratoPage.selecionarSituacaoChassi()
        contratoPage.preencherNumeroGravame(dados.gravame)
        contratoPage.preencherAnoFabricacao(dados.ano)
        contratoPage.preencherAnoModelo(dados.modelo)
        if (tipo === 'usado') {
            contratoPage.preencherPlaca(dados.placa)
            contratoPage.preencherRenavam(dados.renavam)
        }
    }

    tentarSubmeterSemGravame(dados, tipo = 'novo') {
        contratoPage.clicarAdicionarVeiculo()
        contratoPage.selecionarTipoVeiculo(tipo)
        contratoPage.preencherChassi(dados.chassi)
        contratoPage.selecionarSituacaoChassi()
        // omite gravame
        contratoPage.preencherAnoFabricacao(dados.ano)
        contratoPage.preencherAnoModelo(dados.modelo)
        if (tipo === 'usado') {
            contratoPage.preencherPlaca(dados.placa)
            contratoPage.preencherRenavam(dados.renavam)
        }
    }

    tentarSubmeterSemAnoFabricacao(dados, tipo = 'novo') {
        contratoPage.clicarAdicionarVeiculo()
        contratoPage.selecionarTipoVeiculo(tipo)
        contratoPage.preencherChassi(dados.chassi)
        contratoPage.selecionarSituacaoChassi()
        contratoPage.preencherNumeroGravame(dados.gravame)
        // omite ano fabricação
        contratoPage.preencherAnoModelo(dados.modelo)
        if (tipo === 'usado') {
            contratoPage.preencherPlaca(dados.placa)
            contratoPage.preencherRenavam(dados.renavam)
        }
    }

    tentarSubmeterSemAnoModelo(dados, tipo = 'novo') {
        contratoPage.clicarAdicionarVeiculo()
        contratoPage.selecionarTipoVeiculo(tipo)
        contratoPage.preencherChassi(dados.chassi)
        contratoPage.selecionarSituacaoChassi()
        contratoPage.preencherNumeroGravame(dados.gravame)
        contratoPage.preencherAnoFabricacao(dados.ano)
        // omite ano modelo
        if (tipo === 'usado') {
            contratoPage.preencherPlaca(dados.placa)
            contratoPage.preencherRenavam(dados.renavam)
        }
    }

    tentarSubmeterSemPlaca(dados) {
        contratoPage.clicarAdicionarVeiculo()
        contratoPage.selecionarTipoVeiculo('usado')
        contratoPage.preencherChassi(dados.chassi)
        contratoPage.preencherRenavam(dados.renavam)
        contratoPage.selecionarSituacaoChassi()
        contratoPage.preencherNumeroGravame(dados.gravame)
        contratoPage.preencherAnoFabricacao(dados.ano)
        contratoPage.preencherAnoModelo(dados.modelo)
        // omite placa
    }

    tentarSubmeterSemRenavam(dados) {
        contratoPage.clicarAdicionarVeiculo()
        contratoPage.selecionarTipoVeiculo('usado')
        contratoPage.preencherChassi(dados.chassi)
        // omite renavam
        contratoPage.selecionarSituacaoChassi()
        contratoPage.preencherNumeroGravame(dados.gravame)
        contratoPage.preencherAnoFabricacao(dados.ano)
        contratoPage.preencherAnoModelo(dados.modelo)
        contratoPage.preencherPlaca(dados.placa)
    }

}

export default new ContratoActions()
