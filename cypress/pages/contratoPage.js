class ContratoPage {
    normalizarTexto(texto) {
        return String(texto || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    }

    normalizarValorCampo(valor) {
        return String(valor || '').replace(/\s+/g, ' ').trim()
    }

    valoresIguais(valorAtual, valorEsperado) {
        const atual = this.normalizarValorCampo(valorAtual)
        const esperado = this.normalizarValorCampo(valorEsperado)

        return atual === esperado ||
            this.normalizarTexto(atual).toLowerCase() === this.normalizarTexto(esperado).toLowerCase()
    }

    valorInput(campo) {
        return campo.val() || campo.attr('value') || ''
    }

    preencherCampoSeNecessario(campo, valor, contexto = 'input') {
        if (this.valoresIguais(this.valorInput(campo), valor)) {
            cy.log(`[massa] ${contexto} já preenchido: ${valor}`)
            return
        }

        cy.log(`[massa] preenchendo ${contexto}: ${valor}`)
        cy.wrap(campo).clear({ force: true })
        cy.wrap(campo).type(valor, { force: true })

        cy.get('body').click(0, 0, { force: true })
    }

    preencherInputSeExistir(selectors, valor) {
        return cy.get('body').then(($body) => {
            const campo = $body.find(selectors).filter(':visible').first()

            if (!campo.length) {
                return false
            }

            this.preencherCampoSeNecessario(campo, valor, selectors)
            return cy.wrap(true, { log: false })
        })
    }

    preencherTodosInputsSeExistirem(selectors, valor) {
        return cy.get('body').then(($body) => {
            const campos = $body.find(selectors).filter(':visible')

            if (!campos.length) {
                return false
            }

            cy.wrap(campos).each(($campo) => {
                this.preencherCampoSeNecessario($campo, valor, selectors)
            })

            return cy.wrap(true, { log: false })
        })
    }

    preencherInputPorIndiceSeExistir(selectors, indice, valor) {
        return cy.get('body').then(($body) => {
            const campo = $body.find(selectors).filter(':visible').eq(indice)

            if (!campo.length) {
                return false
            }

            this.preencherCampoSeNecessario(campo, valor, `${selectors}[${indice}]`)
            return cy.wrap(true, { log: false })
        })
    }

    selecionarSelectSeExistir(selectors, textoOpcao) {
        return cy.get('body').then(($body) => {
            const select = $body.find(selectors).filter(':visible').first()

            if (!select.length) {
                return false
            }

            if (this.valoresIguais(select.text(), textoOpcao)) {
                cy.log(`[massa] select já preenchido: ${textoOpcao}`)
                return cy.wrap(true, { log: false })
            }

            cy.wrap(select).click({ force: true, waitForAnimations: false })

            cy.get('body').then(($bodyAfterClick) => {
                const inputBusca = $bodyAfterClick.find('.ant-select-open .ant-select-selection-search-input')

                if (inputBusca.length && textoOpcao) {
                    cy.wrap(inputBusca.first()).clear({ force: true }).type(textoOpcao, { force: true })
                }
            })

            this.aguardarCarregamento()
            cy.get('body').then(($bodyAfterFirstSearch) => {
                const opcoes = $bodyAfterFirstSearch.find('.cdk-overlay-pane .ant-select-item-option:visible')
                const textoSemAcento = this.normalizarTexto(textoOpcao)
                const inputBusca = $bodyAfterFirstSearch.find('.ant-select-open .ant-select-selection-search-input')

                if (!opcoes.length && inputBusca.length && textoSemAcento !== textoOpcao) {
                    cy.wrap(inputBusca.first()).clear({ force: true }).type(textoSemAcento, { force: true })
                }
            })

            this.aguardarCarregamento()
            cy.get('body').then(($bodyAfterSearch) => {
                const opcoes = $bodyAfterSearch.find('.cdk-overlay-pane .ant-select-item-option:visible')

                if (!opcoes.length) {
                    const inputBusca = $bodyAfterSearch.find('.ant-select-open .ant-select-selection-search-input')

                    if (inputBusca.length) {
                        cy.wrap(inputBusca.first()).clear({ force: true })
                    }
                }
            })

            this.aguardarCarregamento()
            cy.get('body').then(($bodyAfterClear) => {
                const opcoes = $bodyAfterClear.find('.cdk-overlay-pane .ant-select-item-option:visible')

                if (!opcoes.length) {
                    cy.get('body').type('{esc}', { force: true })
                    return
                }

                cy.wrap(opcoes)
                    .should('exist')
                    .then(($opcoes) => {
                        const textoSemAcento = this.normalizarTexto(textoOpcao)
                        const opcaoExata = [...$opcoes].find((opcao) => {
                            return opcao.innerText.includes(textoOpcao) ||
                                this.normalizarTexto(opcao.innerText).includes(textoSemAcento)
                        })
                        cy.wrap(opcaoExata || $opcoes[0]).click({ force: true, waitForAnimations: false })
                    })
            })

            return cy.wrap(true, { log: false })
        })
    }

    selecionarSelectPorIndiceSeExistir(selectors, indice, textoOpcao) {
        return cy.get('body').then(($body) => {
            const select = $body.find(selectors).filter(':visible').eq(indice)

            if (!select.length) {
                return false
            }

            if (this.valoresIguais(select.text(), textoOpcao)) {
                cy.log(`[massa] select já preenchido: ${textoOpcao}`)
                return cy.wrap(true, { log: false })
            }

            cy.wrap(select).click({ force: true, waitForAnimations: false })

            cy.get('body').then(($bodyAfterClick) => {
                const inputBusca = $bodyAfterClick.find('.ant-select-open .ant-select-selection-search-input')

                if (inputBusca.length && textoOpcao) {
                    cy.wrap(inputBusca.first()).clear({ force: true }).type(textoOpcao, { force: true })
                }
            })

            this.aguardarCarregamento()
            cy.get('body').then(($bodyAfterFirstSearch) => {
                const opcoes = $bodyAfterFirstSearch.find('.cdk-overlay-pane .ant-select-item-option:visible')
                const textoSemAcento = this.normalizarTexto(textoOpcao)
                const inputBusca = $bodyAfterFirstSearch.find('.ant-select-open .ant-select-selection-search-input')

                if (!opcoes.length && inputBusca.length && textoSemAcento !== textoOpcao) {
                    cy.wrap(inputBusca.first()).clear({ force: true }).type(textoSemAcento, { force: true })
                }
            })

            this.aguardarCarregamento()
            cy.get('body').then(($bodyAfterSearch) => {
                const opcoes = $bodyAfterSearch.find('.cdk-overlay-pane .ant-select-item-option:visible')

                if (!opcoes.length) {
                    const inputBusca = $bodyAfterSearch.find('.ant-select-open .ant-select-selection-search-input')

                    if (inputBusca.length) {
                        cy.wrap(inputBusca.first()).clear({ force: true })
                    }
                }
            })

            this.aguardarCarregamento()
            cy.get('body').then(($bodyAfterClear) => {
                const opcoes = $bodyAfterClear.find('.cdk-overlay-pane .ant-select-item-option:visible')

                if (!opcoes.length) {
                    cy.get('body').type('{esc}', { force: true })
                    return
                }

                cy.wrap(opcoes).then(($opcoes) => {
                    const textoSemAcento = this.normalizarTexto(textoOpcao)
                    const opcaoExata = [...$opcoes].find((opcao) => {
                        return opcao.innerText.includes(textoOpcao) ||
                            this.normalizarTexto(opcao.innerText).includes(textoSemAcento)
                    })
                    cy.wrap(opcaoExata || $opcoes[0]).click({ force: true, waitForAnimations: false })
                })
            })

            return cy.wrap(true, { log: false })
        })
    }

    selecionarTodosSelectsSeExistirem(selectors, textoOpcao) {
        cy.get('body').then(($body) => {
            const selects = $body.find(selectors).filter(':visible')

            if (!selects.length) {
                return
            }

            cy.wrap(selects).each(($select) => {
                cy.wrap($select).click({ force: true, waitForAnimations: false })

                cy.get('body').then(($bodyAfterClick) => {
                    const inputBusca = $bodyAfterClick.find('.ant-select-open .ant-select-selection-search-input')

                    if (inputBusca.length && textoOpcao) {
                        cy.wrap(inputBusca.first()).clear({ force: true }).type(textoOpcao, { force: true })
                    }
                })

                cy.get('.cdk-overlay-pane .ant-select-item-option:visible', { timeout: 5000 })
                    .then(($opcoes) => {
                        const opcaoExata = [...$opcoes].find((opcao) => opcao.innerText.includes(textoOpcao))
                        cy.wrap(opcaoExata || $opcoes[0]).click({ force: true, waitForAnimations: false })
                    })
            })
        })
    }

    selecionarSelectPorRotuloSeExistir(rotulo, textoOpcao) {
        return cy.get('body').then(($body) => {
            const item = $body.find('.ant-form-item').filter((_, formItem) => {
                return formItem.innerText.includes(rotulo) && Cypress.$(formItem).find('nz-select').length
            }).first()

            if (!item.length) {
                return false
            }

            const select = item.find('nz-select').first()
            if (this.valoresIguais(select.text(), textoOpcao)) {
                cy.log(`[massa] select ${rotulo} já preenchido: ${textoOpcao}`)
                return cy.wrap(true, { log: false })
            }

            cy.wrap(select).click({ force: true, waitForAnimations: false })

            cy.get('body').then(($bodyAfterClick) => {
                const inputBusca = $bodyAfterClick.find('.ant-select-open .ant-select-selection-search-input')

                if (inputBusca.length && textoOpcao) {
                    cy.wrap(inputBusca.first()).clear({ force: true }).type(textoOpcao, { force: true })
                }
            })

            cy.get('body').then(($bodyAfterSearch) => {
                const opcoes = $bodyAfterSearch.find('.cdk-overlay-pane .ant-select-item-option:visible')

                if (!opcoes.length) {
                    cy.get('body').type('{esc}', { force: true })
                    return
                }

                cy.wrap(opcoes).then(($opcoes) => {
                    const opcaoExata = [...$opcoes].find((opcao) => opcao.innerText.includes(textoOpcao))
                    cy.wrap(opcaoExata || $opcoes[0]).click({ force: true, waitForAnimations: false })
                })
            })

            return cy.wrap(true, { log: false })
        })
    }

    preencherSelectsObrigatoriosPendentes() {
        cy.get('body').then(($body) => {
            const selectsInvalidos = $body.find('#contratoForm nz-select.ng-invalid:visible')

            if (!selectsInvalidos.length) {
                return
            }

            cy.wrap(selectsInvalidos).each(($select) => {
                cy.wrap($select).click({ force: true, waitForAnimations: false })

                cy.get('.cdk-overlay-pane .ant-select-item-option:visible', { timeout: 5000 })
                    .first()
                    .click({ force: true, waitForAnimations: false })
            })
        })
    }

    aguardarCarregamento() {
        cy.get('body', { timeout: 20000 }).should('exist').then(($body) => {
            const carregando = $body.find('.loader:visible, .ant-spin-spinning:visible').length

            if (carregando) {
                cy.wait(500, { log: false })
            }
        })
    }

    fecharModalCertificadoSeExibido() {
        cy.get('body').then(($body) => {
            const botaoAgoraNao = $body.find('button').filter((_, button) => {
                return button.innerText.includes('Agora não')
            })

            if (botaoAgoraNao.length) {
                cy.wrap(botaoAgoraNao.first()).click({ force: true })
            }
        })
    }


    acessarMenuRegistrar() {
        this.aguardarCarregamento()

        cy.contains('Registrar')
            .should('be.visible')
            .click({ force: true, waitForAnimations: false })

        this.aguardarCarregamento()
    }

    acessarRegistroContratoAditivo() {
        cy.get('app-menu-card-icon')
            .should('exist')

        cy.get(':nth-child(1) > .col > .card-icon')
            .should('be.visible')
            .click({ force: true, waitForAnimations: false })

        this.aguardarCarregamento()
    }

    acessarRegistroContratoTela() {
        cy.get('app-menu-card-icon')
            .should('have.length.at.least', 2)

        cy.contains(/Registro de Contrato por Tela/i)
            .should('be.visible')
            .click({ force: true, waitForAnimations: false })

        this.aguardarCarregamento()
    }

    selecionarDetran(detran) {
        this.aguardarCarregamento()

        cy.get('nz-select[formcontrolname="destino"]', { timeout: 20000 })
            .should('be.visible')
            .and('not.have.class', 'ant-select-disabled')
            .click({ force: true, waitForAnimations: false })

        cy.get('body').then(($body) => {
            if (!$body.find('.ant-select-open .ant-select-selection-search-input').length) {
                cy.get('nz-select[formcontrolname="destino"]')
                    .click({ force: true, waitForAnimations: false })
            }
        })

        cy.get('.ant-select-open .ant-select-selection-search-input', { timeout: 10000 })
            .clear({ force: true })
            .type(detran, { force: true })

        cy.contains('.ant-select-item-option', detran, { timeout: 10000 })
            .click({ force: true, waitForAnimations: false })

        cy.get('nz-select[formcontrolname="destino"]')
            .should('contain', detran)

        this.aguardarCarregamento()
    }

    selecionarAgenteFinanceiro(nomeBanco) {
        this.aguardarCarregamento()

        cy.get('nz-select[formcontrolname="agenteFinanceiro"]', { timeout: 20000 })
            .should('be.visible')
            .and('not.have.class', 'ant-select-disabled')
            .click({ force: true, waitForAnimations: false })

        cy.get('body').then(($body) => {
            if (!$body.find('.ant-select-open .ant-select-selection-search-input').length) {
                cy.get('nz-select[formcontrolname="agenteFinanceiro"]')
                    .click({ force: true, waitForAnimations: false })
            }
        })

        cy.get('.ant-select-open .ant-select-selection-search-input', { timeout: 10000 })
            .clear({ force: true })
            .type(nomeBanco, { force: true })

        cy.contains('.ant-select-item-option', nomeBanco, { timeout: 10000 })
            .click({ force: true, waitForAnimations: false })

        cy.get('nz-select[formcontrolname="agenteFinanceiro"]')
            .should('contain', nomeBanco)
    }

    preencherDadosContrato(dados) {
        this.ultimoDadosContrato = dados
        this.aguardarCarregamento()

        this.preencherInputSeExistir(
            'input[placeholder="Número do Contrato"], input[placeholder="Numero do Contrato"]',
            dados.numeroContrato
        )

        this.preencherTodosInputsSeExistirem(
            'input[placeholder="Liberação de Crédito"], input[placeholder="Liberacao de Credito"]',
            dados.dataAtual
        )

        this.preencherInputSeExistir(
            'input[placeholder="Parcela"]',
            dados.parcela
        )

        this.preencherInputSeExistir(
            'input[placeholder="Quantidade de parcelas"]',
            dados.quantidadeParcelas
        )

        this.preencherInputSeExistir(
            'input[placeholder="Dia da primeira parcela"]',
            dados.dataAtual
        )

        this.preencherInputSeExistir(
            'input[placeholder="Dia da última parcela"], input[placeholder="Dia da ultima parcela"]',
            dados.dataAtual
        )

        this.preencherTodosInputsSeExistirem(
            'input[placeholder="Data do contrato"]',
            dados.dataAtual
        )

        this.preencherTodosInputsSeExistirem(
            'input[placeholder="Data do Pagamento"], input[placeholder="Data do pagamento"], input#dataPagamento',
            dados.dataAtual
        )

        this.preencherInputSeExistir(
            'input[placeholder="Início de vigência"], input[placeholder="Inicio de vigencia"], input#inicioVigencia',
            dados.dataAtual
        )

        this.preencherInputSeExistir(
            'input[placeholder="Fim de vigência"], input[placeholder="Fim de vigencia"], input#finalVigencia',
            dados.dataAtual
        )

        this.preencherInputSeExistir(
            'input[placeholder="Total Financiamento"], input[placeholder="Total financiamento"]',
            dados.totalFinanciamento
        )

        this.preencherInputSeExistir(
            'input[placeholder="Taxa de juros ao mês"], input[placeholder="Taxa de juros ao mes"]',
            dados.taxaJurosMes
        )

        this.preencherInputSeExistir(
            'input[placeholder="Taxa de juros ao ano"]',
            dados.taxaJurosAno
        )

        this.preencherInputSeExistir(
            'input[placeholder="IOF"]',
            dados.iof
        )

        this.preencherInputSeExistir(
            'input[placeholder="Descrição penalidade"], input[placeholder="Descricao penalidade"]',
            dados.descricaoPenalidade
        )

        this.preencherInputSeExistir(
            'input[placeholder="Comissão do valor"], input[placeholder="Comissao do valor"]',
            dados.comissaoValor
        )

        this.preencherInputSeExistir(
            'input[placeholder="Número da cota de consórcio"], input[placeholder="Numero da cota de consorcio"]',
            dados.numeroCotaConsorcio
        )

        this.preencherInputSeExistir(
            'input[placeholder="Número do grupo de consórcio"], input[placeholder="Numero do grupo de consorcio"]',
            dados.numeroGrupoConsorcio
        )

        this.preencherInputSeExistir(
            'input[placeholder="Taxa mora"]',
            dados.taxaMora
        )

        this.preencherInputSeExistir(
            'input[placeholder="Taxa multa"]',
            dados.taxaMulta
        )

        this.preencherInputSeExistir(
            'input[placeholder="Taxa contrato"]',
            dados.taxaContrato
        )

        this.preencherInputSeExistir(
            'input[placeholder="Multa"]',
            dados.multa
        )

        this.preencherInputSeExistir(
            'input[placeholder="Índice"], input[placeholder="Indice"], input#indice',
            dados.indice
        )

        this.selecionarSelectSeExistir(
            'nz-select[nzplaceholder="Índice"], nz-select[nzplaceholder="Indice"]',
            dados.indice
        )

        this.selecionarSelectPorRotuloSeExistir('Índice', dados.indice)

        this.selecionarSelectSeExistir(
            'nz-select[nzplaceholder="Correção Monetária"], nz-select[nzplaceholder="Correcao Monetaria"]',
            dados.correcaoMonetaria
        )

        this.selecionarSelectPorRotuloSeExistir('Correção Monetária', dados.correcaoMonetaria)

        this.selecionarSelectSeExistir(
            'nz-select[nzplaceholder="Tipo de Gravame"], nz-select[formcontrolname="tipoGravame"]',
            dados.tipoGravame
        )

        this.selecionarSelectSeExistir(
            'nz-select[nzplaceholder="UF de liberação de crédito"], nz-select[nzplaceholder="UF de liberacao de credito"]',
            dados.uf
        )
        this.aguardarCarregamento()

        this.selecionarSelectSeExistir(
            'nz-select[nzplaceholder="Cidade de liberação de crédito"], nz-select[nzplaceholder="Cidade de liberacao de credito"]',
            dados.cidade
        )

        this.preencherDadosPessoa('Devedor', dados.devedor)
        this.preencherDadosPessoa('Credor', dados.credor)
        this.preencherSelectsObrigatoriosPendentes()
    }

    preencherDadosPessoa(tipo, dados) {
        const indicePessoa = tipo === 'Devedor' ? 0 : 1

        this.preencherInputSeExistir(
            `input#cpfCnpj${tipo}, input[name="cpfCnpj${tipo}"], input[formcontrolname="cpfCnpj${tipo}"]`,
            dados.cpfCnpj
        ).then((preencheu) => {
            if (!preencheu) {
                this.preencherInputPorIndiceSeExistir(
                    'input[placeholder="CPF / CNPJ"], input[placeholder="CPF/CNPJ"]',
                    indicePessoa,
                    dados.cpfCnpj
                )
            }
        })

        this.preencherInputSeExistir(
            `input#nome${tipo}, input[name="nome${tipo}"], input[formcontrolname="nome${tipo}"], input#nomeCompleto${tipo}, input[name="nomeCompleto${tipo}"], input[formcontrolname="nomeCompleto${tipo}"]`,
            dados.nomeCompleto
        ).then((preencheu) => {
            if (!preencheu) {
                this.preencherInputPorIndiceSeExistir(
                    'input[placeholder="Nome Completo"], input[placeholder="Nome completo"]',
                    indicePessoa,
                    dados.nomeCompleto
                )
            }
        })

        this.preencherInputSeExistir(
            `input#cep${tipo}, input[name="cep${tipo}"], input[formcontrolname="cep${tipo}"]`,
            dados.cep
        ).then((preencheu) => {
            if (!preencheu) {
                this.preencherInputPorIndiceSeExistir(
                    'input[placeholder="CEP"]',
                    indicePessoa,
                    dados.cep
                )
            }
        })

        this.aguardarCarregamento()

        this.preencherEnderecoPessoa(tipo, dados)
    }

    preencherEnderecoPessoa(tipo, dados) {
        const indicePessoa = tipo === 'Devedor' ? 0 : 1

        this.preencherInputSeExistir(
            `input#logradouro${tipo}, input[name="logradouro${tipo}"], input[formcontrolname="logradouro${tipo}"]`,
            dados.logradouro
        ).then((preencheu) => {
            if (!preencheu) {
                this.preencherInputPorIndiceSeExistir(
                    'input[placeholder="Logradouro"]',
                    indicePessoa,
                    dados.logradouro
                )
            }
        })

        this.preencherInputSeExistir(
            `input#numero${tipo}, input[name="numero${tipo}"], input[formcontrolname="numero${tipo}"]`,
            dados.numero
        )
        this.preencherInputPorIndiceSeExistir(
            'input[placeholder="Número"], input[placeholder="Numero"]',
            indicePessoa,
            dados.numero
        )

        this.preencherInputSeExistir(
            `input#complemento${tipo}, input[name="complemento${tipo}"], input[formcontrolname="complemento${tipo}"]`,
            dados.complemento
        )
        this.preencherInputPorIndiceSeExistir(
            'input[placeholder="Complemento"]',
            indicePessoa,
            dados.complemento
        )

        this.preencherInputSeExistir(
            `input#bairro${tipo}, input[name="bairro${tipo}"], input[formcontrolname="bairro${tipo}"]`,
            dados.bairro
        )
        this.preencherInputPorIndiceSeExistir(
            'input[placeholder="Bairro"]',
            indicePessoa,
            dados.bairro
        )

        this.selecionarSelectSeExistir(
            `nz-select#uf${tipo}, nz-select[name="uf${tipo}"], nz-select[formcontrolname="uf${tipo}"]`,
            dados.estado
        )
        this.selecionarSelectPorIndiceSeExistir(
            'nz-select[nzplaceholder="UF"], nz-select[formcontrolname="uf"]',
            indicePessoa,
            dados.estado
        )

        this.selecionarSelectSeExistir(
            `nz-select#cidade${tipo}, nz-select[name="cidade${tipo}"], nz-select[formcontrolname="cidade${tipo}"]`,
            dados.cidade
        )
        this.selecionarSelectPorIndiceSeExistir(
            'nz-select[nzplaceholder="Cidade"], nz-select[formcontrolname="cidade"]',
            indicePessoa,
            dados.cidade
        )

        this.preencherInputSeExistir(
            `input#telefone${tipo}, input[name="telefone${tipo}"], input[formcontrolname="telefone${tipo}"]`,
            dados.telefone
        )
        this.preencherInputPorIndiceSeExistir(
            'input[placeholder="Telefone"]',
            indicePessoa,
            dados.telefone
        )

        this.preencherInputSeExistir(
            `input#email${tipo}, input[name="email${tipo}"], input[formcontrolname="email${tipo}"]`,
            dados.email
        )
        this.preencherInputPorIndiceSeExistir(
            'input[placeholder="E-mail"], input[type="email"]',
            indicePessoa,
            dados.email
        )

        this.preencherInputSeExistir(
            `input#logradouro${tipo}, input[name="logradouro${tipo}"], input[formcontrolname="logradouro${tipo}"]`,
            dados.logradouro
        )
    }

    assertCamposObrigatoriosContratoPreenchidos(contextoMassa = {}) {
        cy.get('#contratoForm').within(() => {
            cy.contains('Contrato')
                .should('be.visible')
        })

        cy.get('#contratoForm').then(($formulario) => {
            const camposObrigatorios = [...$formulario.find('.ng-invalid:visible')].filter((campo) => {
                if (!campo.matches('input, textarea, select, nz-select, nz-radio-group')) {
                    return false
                }

                return campo.innerText.includes('Campo obrigatório') ||
                    campo.parentElement?.innerText.includes('Campo obrigatório')
            })
            const descricoes = camposObrigatorios
                .map((campo) => {
                    const texto = campo.closest('.ant-form-item')?.innerText || campo.parentElement?.innerText || ''
                    return `${texto} :: ${campo.outerHTML.slice(0, 300)}`
                })
                .join(' | ')
            const contexto = contextoMassa.uf
                ? `UF ${contextoMassa.uf}; devedor=${contextoMassa.devedor?.cpfCnpj}; credor=${contextoMassa.credor?.cpfCnpj}; `
                : ''

            if (camposObrigatorios.length) {
                cy.wrap(camposObrigatorios[0]).scrollIntoView()
            }

            expect(camposObrigatorios, `${contexto}campos obrigatorios invalidos no contrato: ${descricoes}`).to.have.length(0)
        })
    }

    // =========================
    // 🚗 VEÍCULO — COMUM
    // =========================

    clicarAdicionarVeiculo() {
        this.aguardarCarregamento()

        cy.get('#contratoForm')
            .contains('button', 'Adicionar')
            .should('be.visible')
            .click({ force: true, waitForAnimations: false })
    }

    selecionarTipoVeiculo(tipo) {
        const opcao = tipo === 'novo' ? 'Sim' : 'Não'
        const opcaoSelect = tipo === 'novo' ? 'Novo' : 'Usado'

        cy.get('nz-radio-group[formcontrolname="veiculoZeroKm"]')
            .should('be.visible')
            .within(() => {
                cy.contains('label', opcao)
                    .should('be.visible')
                    .click({ force: true, waitForAnimations: false })
            })

        cy.get('nz-radio-group[formcontrolname="veiculoZeroKm"]')
            .should('not.have.class', 'ng-invalid')

        this.selecionarSelectSeExistir(
            '#formVeiculo_0 nz-select[nzplaceholder="Novo / Usado"], #formVeiculo_0 nz-select[formcontrolname="indicaNovoUsado"]',
            opcaoSelect
        )
    }

    preencherChassi(chassi) {
        this.preencherInputSeExistir('#chassi', chassi)
    }

    preencherRenavam(renavam) {
        this.preencherInputSeExistir('[name="renavam"]', renavam)
    }

    selecionarMarcaModelo() {
        this.fecharModalCertificadoSeExibido()

        cy.get('body').then(($body) => {
            const marcaModelo = $body
                .find('#formVeiculo_0 nz-select')
                .filter((_, select) => {
                    return select.innerText.includes('Marca / Modelo')
                })

            if (!marcaModelo.length) {
                return
            }

            cy.wrap(marcaModelo.first()).click({ force: true, waitForAnimations: false })

            cy.get('body').then(($bodyAfterClick) => {
                const modalCertificado = $bodyAfterClick.find('.modal-certificado-digital-wrap')

                if (modalCertificado.length) {
                    this.fecharModalCertificadoSeExibido()
                    return
                }

                cy.get('.ant-select-open')
                    .should('exist')

                cy.get('.cdk-overlay-pane .ant-select-item-option')
                    .should('be.visible')
                    .first()
                    .click({ force: true, waitForAnimations: false })
            })
        })
    }

    selecionarRestricao() {
        cy.get('[nzplaceholder="Situação do Chassi"]').click({ force: true, waitForAnimations: false })

        cy.get('.cdk-overlay-pane')
            .should('be.visible')

        cy.contains('.ant-select-item-option', 'Não remarcado')
            .click({ force: true, waitForAnimations: false })
    }

    selecionarGravame(gravame) {
        this.preencherInputSeExistir('[name="restricao"]', gravame)
    }

    preencherPlaca(placa) {
        this.preencherInputSeExistir('#placa', placa)
    }

    selecionarUfPlaca(estado) {
        this.selecionarSelectSeExistir(
            '#formVeiculo_0 nz-select[nzplaceholder="UF da placa"], #formVeiculo_0 nz-select[formcontrolname="uf"]',
            estado
        )
    }

    preencherAno(ano) {
        this.preencherInputSeExistir('#ano', ano)
    }

    preencherModelo(modelo) {
        this.preencherInputSeExistir('#modelo', modelo)
    }

    // =========================
    // 🆕 VEÍCULO NOVO — AC
    // campos obrigatórios específicos
    // =========================

    preencherNumeroGravame(gravame) {
        this.preencherInputSeExistir('#restricao', gravame)
    }

    preencherAnoFabricacao(ano) {
        cy.get('body').then(($body) => {
            if (!$body.find('#ano').length) {
                return
            }

            this.preencherInputSeExistir('#ano', ano)
        })
    }

    preencherAnoModelo(modelo) {
        cy.get('body').then(($body) => {
            if (!$body.find('#modelo').length) {
                return
            }

            this.preencherInputSeExistir('#modelo', modelo)
        })
    }

    preencherDescricaoCorVeiculo(cor = 'Prata') {
        this.preencherInputSeExistir(
            'input#descricaoCorVeiculo, input[name="descricaoCorVeiculo"], input[formcontrolname="descricaoCorVeiculo"], input[placeholder="Descrição Cor Veículo"], input[placeholder="Descricao Cor Veiculo"]',
            cor
        )
    }

    selecionarSituacaoChassi() {
        const selector = '[nzplaceholder="Situação do Chassi"]'

        this.fecharModalCertificadoSeExibido()

        cy.get('body').then(($body) => {
            if (!$body.find(selector).length) {
                return
            }

            cy.get(selector).should('be.visible').click({ force: true, waitForAnimations: false })

            cy.get('.cdk-overlay-pane')
                .should('be.visible')

            cy.contains('.ant-select-item-option', 'Não remarcado')
                .click({ force: true, waitForAnimations: false })
        })
    }

    // =========================
    // 🔍 VALIDAÇÕES
    // =========================

    assertBotaoSalvarHabilitado() {
        cy.get('#formVeiculo_0 > div.w-100.d-flex.justify-content-end.mt-3.mb-2.ng-star-inserted > button')
            .should('be.visible')
            .and('not.be.disabled')
    }

    salvarVeiculo() {
        cy.get('#formVeiculo_0 > div.w-100.d-flex.justify-content-end.mt-3.mb-2.ng-star-inserted > button')
            .should('be.visible')
            .and('not.be.disabled')
            .click({ force: true, waitForAnimations: false })

        this.aguardarCarregamento()
    }

    enviarContrato() {
        this.assertCamposObrigatoriosContratoPreenchidos(this.ultimoDadosContrato)
        this.salvarVeiculo()

        cy.intercept({ method: 'POST', url: '**' }).as('postEnvioContrato')
        this.clicarBotaoEnviarContrato()
        this.registrarRespostaEnvio()

        this.aguardarCarregamento()
        this.confirmarEnvioSeNecessario()
        this.aguardarCarregamento()
        this.assertProtocoloGerado()
    }

    registrarRespostaEnvio() {
        cy.wait('@postEnvioContrato', { timeout: 60000 }).then((interception) => {
            const status = interception.response?.statusCode || 'sem-status'
            const corpo = JSON.stringify(interception.response?.body || {}).slice(0, 1000)

            cy.task('log', `[envio-contrato] ${interception.request.method} ${interception.request.url} -> ${status} ${corpo}`)
        })
    }

    clicarBotaoEnviarContrato() {
        cy.get('#contratoForm', { timeout: 15000 })
            .scrollTo('bottom', { ensureScrollable: false })

        cy.get('#contratoForm button:visible', { timeout: 15000 })
            .then(($botoes) => {
                const botoesEnvio = [...$botoes].filter((botao) => {
                    return /Enviar|Registrar Contrato|Finalizar/i.test(botao.innerText)
                })

                expect(
                    botoesEnvio.map((botao) => botao.innerText.trim()).join(' | '),
                    'botao de envio do contrato no formulario'
                ).not.to.eq('')

                cy.wrap(botoesEnvio[botoesEnvio.length - 1])
                    .scrollIntoView()
                    .should('be.visible')
                    .and('not.be.disabled')
                    .click({ force: true, waitForAnimations: false })
            })
    }

    confirmarEnvioSeNecessario() {
        cy.get('body').then(($body) => {
            if (/protocolo/i.test($body.text())) {
                return
            }

            const botaoConfirmar = $body.find('button').filter((_, button) => {
                return /Confirmar|Sim|Enviar/i.test(button.innerText)
            }).first()

            if (botaoConfirmar.length) {
                cy.wrap(botaoConfirmar).click({ force: true })
            }
        })
    }

    assertProtocoloGerado() {
        cy.contains(/protocolo/i, { timeout: 30000 })
            .should('be.visible')

        cy.get('body')
            .invoke('text')
            .should((texto) => {
                expect(texto, 'número de protocolo gerado').to.match(/protocolo[\s\S]{0,120}\d{4,}/i)
            })
    }

    assertBotaoSalvarDesabilitado() {
        cy.get('#formVeiculo_0 > div.w-100.d-flex.justify-content-end.mt-3.mb-2.ng-star-inserted > button')
            .should('be.disabled')
    }

    assertCampoInvalido(selector) {
        cy.get(selector)
            .should('have.class', 'ng-invalid')
    }

    assertFormularioSemErros() {
        cy.get('.ng-invalid').should('not.exist')
    }

    assertCamposUsadoVisiveis() {
        cy.get('#placa').should('be.visible')
        cy.get('[name="renavam"]').should('be.visible')
    }

    assertCamposUsadoOcultos() {
        cy.get('#placa').should('not.exist')
        cy.get('[name="renavam"]').should('not.exist')
    }

}

export default new ContratoPage()
