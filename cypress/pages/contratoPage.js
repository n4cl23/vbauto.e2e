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

    preencherInputHabilitadoSeExistir(selectors, valor) {
        return cy.get('body').then(($body) => {
            const campo = $body.find(selectors).filter(':visible').first()

            if (!campo.length) {
                return false
            }

            if (campo.is(':disabled') || campo.attr('readonly')) {
                cy.log(`[massa] input desabilitado, mantendo valor atual: ${selectors}`)
                return cy.wrap(false, { log: false })
            }

            this.preencherCampoSeNecessario(campo, valor, selectors)
            return cy.wrap(true, { log: false })
        })
    }

    preencherInputPorRotuloSeHabilitado(rotulo, valor) {
        return cy.get('body').then(($body) => {
            const rotuloNormalizado = this.normalizarTexto(rotulo).toLowerCase()
            const item = $body.find('.ant-form-item, nz-form-item').filter((_, elemento) => {
                return this.normalizarTexto(elemento.innerText).toLowerCase().includes(rotuloNormalizado) &&
                    Cypress.$(elemento).find('input:visible').length
            }).first()

            if (!item.length) {
                return false
            }

            const campo = item.find('input:visible').first()

            if (campo.is(':disabled') || campo.attr('readonly')) {
                cy.log(`[massa] input ${rotulo} desabilitado, mantendo valor atual`)
                return cy.wrap(false, { log: false })
            }

            this.preencherCampoSeNecessario(campo, valor, rotulo)
            return cy.wrap(true, { log: false })
        })
    }

    preencherInputPorLabelContrato(rotulo, valor) {
        return cy.get('#contratoForm').then(($formulario) => {
            const rotuloNormalizado = this.normalizarTexto(rotulo).toLowerCase()
            const label = $formulario.find('label, nz-form-label, .ant-form-item-label, span').filter((_, elemento) => {
                const texto = this.normalizarTexto(elemento.innerText).toLowerCase()
                return texto.includes(rotuloNormalizado)
            }).first()

            if (!label.length) {
                cy.log(`[massa] label nao encontrado: ${rotulo}`)
                return cy.wrap(false, { log: false })
            }

            const container = label.closest('.ant-form-item, nz-form-item, .row, div')
            let campo = container.find('input:visible').first()

            if (!campo.length) {
                campo = container.nextAll().find('input:visible').first()
            }

            if (!campo.length) {
                cy.log(`[massa] input nao encontrado para label: ${rotulo}`)
                return cy.wrap(false, { log: false })
            }

            this.preencherCampoSeNecessario(campo, valor, rotulo)
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
            this.rebuscarSelectSemAcento(textoOpcao)
            this.selecionarOpcaoAberta(textoOpcao, selectors)

            return cy.wrap(true, { log: false })
        })
    }

    rebuscarSelectSemAcento(textoOpcao) {
        const textoSemAcento = this.normalizarTexto(textoOpcao)

        if (!textoOpcao || textoSemAcento === textoOpcao) {
            return
        }

        cy.get('body').then(($body) => {
            const inputBusca = $body.find('.ant-select-open .ant-select-selection-search-input')
            const opcoes = $body.find('.cdk-overlay-pane .ant-select-item-option:not(.ant-select-item-option-disabled)')
            const semDados = this.normalizarTexto($body.text()).includes('Nao ha dados')

            if (inputBusca.length && (!opcoes.length || semDados)) {
                cy.wrap(inputBusca.first()).clear({ force: true }).type(textoSemAcento, { force: true })
                this.aguardarCarregamento()
            }
        })
    }

    selecionarOpcaoAberta(textoOpcao, contexto = 'select') {
        cy.get('.cdk-overlay-pane .ant-select-item-option:not(.ant-select-item-option-disabled)', { timeout: 20000 })
            .then(($opcoes) => {
                const opcoesVisiveis = [...$opcoes].filter((opcao) => Cypress.$(opcao).is(':visible'))
                const opcoes = opcoesVisiveis.length ? opcoesVisiveis : [...$opcoes]
                const textoSemAcento = this.normalizarTexto(textoOpcao)
                const textoComparavel = textoSemAcento.toLowerCase()
                const opcaoExata = opcoes.find((opcao) => {
                    const opcaoComparavel = this.normalizarTexto(opcao.innerText).toLowerCase()
                    return this.normalizarValorCampo(opcaoComparavel) === this.normalizarValorCampo(textoComparavel)
                })
                const opcaoParcial = opcoes.find((opcao) => {
                    const opcaoComparavel = this.normalizarTexto(opcao.innerText).toLowerCase()
                    return opcao.innerText.toLowerCase().includes(String(textoOpcao).toLowerCase()) ||
                        opcaoComparavel.includes(textoComparavel)
                })

                if (!opcoes.length) {
                    throw new Error(`[massa] ${contexto}: select sem opcoes disponiveis`)
                }

                if (!opcaoExata && !opcaoParcial && textoOpcao) {
                    const opcoesDisponiveis = opcoes.map((opcao) => this.normalizarValorCampo(opcao.innerText)).join(', ')
                    throw new Error(`[massa] ${contexto}: opcao "${textoOpcao}" nao encontrada. Opcoes: ${opcoesDisponiveis}`)
                }

                cy.wrap(opcaoExata || opcaoParcial || opcoes[0]).click({ force: true, waitForAnimations: false })
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
            this.rebuscarSelectSemAcento(textoOpcao)
            this.selecionarOpcaoAberta(textoOpcao, selectors)

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

                this.rebuscarSelectSemAcento(textoOpcao)
                this.selecionarOpcaoAberta(textoOpcao, selectors)
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

            this.rebuscarSelectSemAcento(textoOpcao)
            this.selecionarOpcaoAberta(textoOpcao, `select ${rotulo}`)

            return cy.wrap(true, { log: false })
        })
    }

    selecionarPrimeiraOpcaoSelectSeExistir(selectors, contexto = 'select') {
        return cy.get('body').then(($body) => {
            const select = $body.find(selectors).filter(':visible').first()

            if (!select.length) {
                return false
            }

            if (select.hasClass('ant-select-disabled')) {
                cy.log(`[massa] ${contexto} desabilitado, mantendo valor atual`)
                return cy.wrap(false, { log: false })
            }

            cy.wrap(select).click({ force: true, waitForAnimations: false })
            this.selecionarOpcaoAberta(null, contexto)
            return cy.wrap(true, { log: false })
        })
    }

    selecionarPrimeiraOpcaoSelectPorRotuloSeExistir(rotulo) {
        return cy.get('body').then(($body) => {
            const rotuloNormalizado = this.normalizarTexto(rotulo).toLowerCase()
            const item = $body.find('.ant-form-item, nz-form-item').filter((_, elemento) => {
                return this.normalizarTexto(elemento.innerText).toLowerCase().includes(rotuloNormalizado) &&
                    Cypress.$(elemento).find('nz-select:visible').length
            }).first()

            if (!item.length) {
                return false
            }

            const select = item.find('nz-select:visible').first()

            if (select.hasClass('ant-select-disabled')) {
                cy.log(`[massa] select ${rotulo} desabilitado, mantendo valor atual`)
                return cy.wrap(false, { log: false })
            }

            cy.wrap(select).click({ force: true, waitForAnimations: false })
            this.selecionarOpcaoAberta(null, rotulo)
            return cy.wrap(true, { log: false })
        })
    }

    selecionarTipoAditivoObrigatorio() {
        cy.get('body').then(($body) => {
            const select = this.localizarSelectPorRotulo($body, 'Tipo de Aditivo')

            expect(select, 'select Tipo de Aditivo').to.have.length(1)

            if (select.hasClass('ant-select-disabled')) {
                throw new Error('[aditivo] Tipo de Aditivo esta desabilitado e nao pode ser preenchido')
            }

            cy.wrap(select).click({ force: true, waitForAnimations: false })
        })

        cy.get('.cdk-overlay-pane .ant-select-item-option:not(.ant-select-item-option-disabled)', { timeout: 20000 })
            .then(($opcoes) => {
                const opcoesValidas = [...$opcoes].filter((opcao) => {
                    const texto = this.normalizarTexto(opcao.innerText).replace(/\s+/g, ' ').trim()
                    return texto &&
                        !/Tipo de Aditivo|Selecione|Nao ha dados/i.test(texto)
                })

                expect(
                    opcoesValidas.map((opcao) => this.normalizarValorCampo(opcao.innerText)).join(', '),
                    'opcoes validas para Tipo de Aditivo'
                ).not.to.eq('')

                cy.wrap(opcoesValidas[0]).click({ force: true, waitForAnimations: false })
            })

        this.aguardarCarregamento()
        this.assertTipoAditivoPreenchido()
    }

    localizarSelectPorRotulo($body, rotulo) {
        if (this.normalizarTexto(rotulo).toLowerCase() === 'tipo de aditivo') {
            const selectTipoAditivo = $body.find(
                'nz-select[nzplaceholder="Tipo de Aditivo"], nz-select[formcontrolname="tipoAditivo"], nz-select[formcontrolname="tipoAditivoId"]'
            ).filter(':visible').first()

            if (selectTipoAditivo.length) {
                return selectTipoAditivo
            }

            const secaoAditivo = $body.find('#aditivoForm section').filter((_, section) => {
                const texto = this.normalizarTexto(section.innerText)
                return /Aditivo/i.test(texto) && /Tipo de Aditivo/i.test(texto)
            }).first()

            const primeiroSelectAditivo = secaoAditivo.find('nz-select:visible, .ant-select:visible').first()

            if (primeiroSelectAditivo.length) {
                return primeiroSelectAditivo
            }
        }

        const rotuloNormalizado = this.normalizarTexto(rotulo).toLowerCase()
        const item = $body.find('.ant-form-item, nz-form-item').filter((_, elemento) => {
            return this.normalizarTexto(elemento.innerText).toLowerCase().includes(rotuloNormalizado) &&
                Cypress.$(elemento).find('nz-select:visible').length
        }).first()

        return item.find('nz-select:visible').first()
    }

    assertTipoAditivoPreenchido() {
        cy.get('body', { timeout: 20000 }).then(($body) => {
            const select = this.localizarSelectPorRotulo($body, 'Tipo de Aditivo')
            const selectionItem = select.find('.ant-select-selection-item').first()
            const valor = this.normalizarTexto(
                selectionItem.attr('title') || selectionItem.text() || select.text()
            ).replace(/\s+/g, ' ').trim()

            expect(select, 'select Tipo de Aditivo').to.have.length(1)
            expect(valor, 'Tipo de Aditivo preenchido').to.not.eq('')
            expect(valor, 'Tipo de Aditivo nao deve permanecer no placeholder').not.to.match(/Tipo de Aditivo|Selecione/i)
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

                cy.get('body').then(($bodyAfterClick) => {
                    const opcoes = $bodyAfterClick.find('.cdk-overlay-pane .ant-select-item-option:visible')

                    if (!opcoes.length) {
                        cy.log('[massa] select obrigatorio sem opcoes disponiveis para fallback')
                        cy.get('body').type('{esc}', { force: true })
                        return
                    }

                    cy.wrap(opcoes.first()).click({ force: true, waitForAnimations: false })
                })
            })
        })
    }

    aguardarCarregamento(tentativasRestantes = 20) {
        cy.get('body', { timeout: 20000 }).should('exist').then(($body) => {
            const carregando = $body.find('.loader:visible, .ant-spin-spinning:visible').length

            if (carregando) {
                cy.wait(500, { log: false })

                if (tentativasRestantes > 1) {
                    this.aguardarCarregamento(tentativasRestantes - 1)
                }
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

        cy.contains('app-menu-card-icon', /Registro de Contrato por Tela/i)
            .should('be.visible')
            .click({ force: true, waitForAnimations: false })

        this.aguardarCarregamento()

        cy.get('body').then(($body) => {
            if (!$body.find('nz-select[formcontrolname="destino"]').length) {
                cy.contains('app-menu-card-icon', /Registro de Contrato por Tela/i)
                    .click({ force: true, waitForAnimations: false })

                this.aguardarCarregamento()
            }
        })
    }

    selecionarNovoAditivo() {
        cy.get('body', { timeout: 20000 }).then(($body) => {
            const opcaoNovoAditivo = $body.find('label, span, nz-radio, div').filter((_, elemento) => {
                const texto = this.normalizarTexto(elemento.innerText).replace(/\s+/g, ' ').trim()
                return texto.includes('Novo Aditivo') && !texto.includes('DETRAN-RS')
            }).first()

            expect(opcaoNovoAditivo, 'opcao Novo Aditivo').to.have.length(1)

            cy.wrap(opcaoNovoAditivo)
                .should('be.visible')
                .click({ force: true, waitForAnimations: false })
        })

        this.aguardarCarregamento()

        cy.get('#protocoloAditivo', { timeout: 20000 })
            .should('be.visible')
    }

    preencherProtocoloAditivo(protocolo) {
        cy.get('#protocoloAditivo', { timeout: 20000 })
            .should('be.visible')
            .clear({ force: true })
            .type(protocolo, { force: true })
            .blur({ force: true })

        this.aguardarCarregamento()
    }

    clicarBotaoAditivo() {
        cy.get('#aditivoForm', { timeout: 20000 })
            .should('be.visible')

        cy.get('#aditivoForm > section:nth-child(10) > div > button', { timeout: 20000 })
            .should('be.visible')
            .and('not.be.disabled')
            .click({ force: true, waitForAnimations: false })

        this.aguardarCarregamento()
    }

    abrirFormularioNovoAditivo() {
        this.clicarBotaoAditivo()

        cy.location('pathname', { timeout: 30000 })
            .should('include', '/vbconnection/vbauto/contrato/aditivo/inserir')

        cy.get('#aditivoForm', { timeout: 30000 })
            .should('be.visible')
    }

    assertContratoBaseAditivoCarregado(protocolo) {
        cy.get('#protocoloAditivo')
            .should('have.value', protocolo)

        cy.get('body', { timeout: 30000 })
            .invoke('text')
            .should((texto) => {
                expect(
                    texto,
                    'dados do contrato base devem carregar para novo aditivo'
                ).to.match(/Contrato|Devedor|Credor|Ve[ií]culo|Chassi|CPF|CNPJ/i)
            })
    }

    preencherDadosNovoAditivo(dados) {
        this.selecionarTipoAditivoObrigatorio()

        this.preencherInputPorRotuloSeHabilitado('Registro aditivo SIRCOF', dados.registroAditivoSircof)
        this.preencherInputPorRotuloSeHabilitado('Numero do aditivo', dados.numeroAditivo)
        this.preencherInputPorRotuloSeHabilitado('Data do aditivo', dados.dataAditivo)
        this.preencherInputPorRotuloSeHabilitado('Numero do registro', dados.numeroRegistro)

        this.preencherInputHabilitadoSeExistir(
            'input[placeholder="Registro aditivo SIRCOF"], input[name="registroAditivoSircof"], input[formcontrolname="registroAditivoSircof"]',
            dados.registroAditivoSircof
        )

        this.preencherInputHabilitadoSeExistir(
            'input[placeholder="NÃºmero do Aditivo"], input[placeholder="Numero do Aditivo"], input[name="numeroAditivo"], input[formcontrolname="numeroAditivo"]',
            dados.numeroAditivo
        )

        this.preencherInputHabilitadoSeExistir(
            'input[placeholder="Data do aditivo"], input[name="dataAditivo"], input[formcontrolname="dataAditivo"]',
            dados.dataAditivo
        )

        this.preencherInputHabilitadoSeExistir(
            'input[placeholder="NÃºmero do registro"], input[placeholder="Numero do registro"], input[name="numeroRegistro"], input[formcontrolname="numeroRegistro"]',
            dados.numeroRegistro
        )
    }

    assertDadosNovoAditivoPreenchidos(dados) {
        this.assertTipoAditivoPreenchido()

        cy.get('body').then(($body) => {
            const localizarInput = (rotulo) => {
                const rotuloNormalizado = this.normalizarTexto(rotulo).toLowerCase()
                const item = $body.find('.ant-form-item, nz-form-item').filter((_, elemento) => {
                    return this.normalizarTexto(elemento.innerText).toLowerCase().includes(rotuloNormalizado) &&
                        Cypress.$(elemento).find('input:visible').length
                }).first()

                return item.find('input:visible').first()
            }

            const numeroAditivo = localizarInput('Numero do aditivo')
            const dataAditivo = localizarInput('Data do aditivo')
            const numeroRegistro = localizarInput('Numero do registro')

            if (numeroAditivo.length && !numeroAditivo.is(':disabled') && !numeroAditivo.attr('readonly')) {
                expect(numeroAditivo.val(), 'numero do aditivo').to.eq(dados.numeroAditivo)
            }

            if (dataAditivo.length && !dataAditivo.is(':disabled') && !dataAditivo.attr('readonly')) {
                expect(dataAditivo.val(), 'data do aditivo').to.eq(dados.dataAditivo)
            }

            if (numeroRegistro.length && !numeroRegistro.is(':disabled') && !numeroRegistro.attr('readonly')) {
                expect(numeroRegistro.val(), 'numero do registro').to.eq(dados.numeroRegistro)
            }
        })
    }

    fecharModalSucessoAditivoSeExibido() {
        cy.get('body').then(($body) => {
            const botaoContinuar = $body.find('button').filter((_, button) => {
                return /Continuar enviando/i.test(button.innerText)
            }).first()

            if (botaoContinuar.length) {
                cy.wrap(botaoContinuar).click({ force: true, waitForAnimations: false })
                this.aguardarCarregamento()
            }
        })
    }

    abrirAlteracaoAditivo(protocoloAditivo) {
        this.fecharModalSucessoAditivoSeExibido()

        cy.get('body').then(($body) => {
            if ($body.find('#aditivoForm:visible').length) {
                return
            }

            cy.location('pathname', { timeout: 30000 })
                .should('include', '/vbconnection/vbauto/contrato/consultar')

            this.aguardarAditivoProcessadoNaConsulta(protocoloAditivo)

            cy.contains('tr', protocoloAditivo, { timeout: 30000 })
                .should('be.visible')
                .within(() => {
                    cy.get('button:visible, [role="button"]:visible')
                        .last()
                        .click({ force: true, waitForAnimations: false })
                })

            cy.get('.cdk-overlay-pane, .ant-dropdown, body', { timeout: 10000 })
                .contains(/Alterar|Editar/i)
                .click({ force: true, waitForAnimations: false })

            this.aguardarCarregamento()

            cy.location('pathname', { timeout: 30000 })
                .should('include', '/vbconnection/vbauto/contrato/aditivo')
        })
    }

    abrirAlteracaoContrato(protocoloContrato) {
        this.fecharModalSucessoAditivoSeExibido()
        this.acessarConsultaContratosAditivos()
        this.aguardarContratoFinalizadoNaConsulta(protocoloContrato)

        cy.contains('tr', protocoloContrato, { timeout: 30000 })
            .should('be.visible')
            .within(() => {
                cy.get('button:visible, [role="button"]:visible')
                    .last()
                    .click({ force: true, waitForAnimations: false })
            })

        cy.get('.cdk-overlay-pane, .ant-dropdown, body', { timeout: 10000 })
            .contains(/Alterar|Editar/i)
            .click({ force: true, waitForAnimations: false })

        this.aguardarCarregamento()

        cy.location('pathname', { timeout: 30000 })
            .should('include', '/vbconnection/vbauto/contrato')

        cy.get('#contratoForm', { timeout: 30000 })
            .should('be.visible')
    }

    aguardarContratoFinalizadoNaConsulta(protocoloContrato, tentativasRestantes = 8) {
        cy.contains('tr', protocoloContrato, { timeout: 30000 }).then(($linha) => {
            const textoLinha = this.normalizarTexto($linha.text()).replace(/\s+/g, ' ').trim()

            if (/Registro de Contrato/i.test(textoLinha) && /Finalizado com Sucesso/i.test(textoLinha)) {
                cy.task('log', `[contrato] ${protocoloContrato} liberado para alteracao: ${textoLinha}`)
                return
            }

            if (tentativasRestantes <= 1) {
                throw new Error(`[contrato] ${protocoloContrato} ainda nao esta Finalizado com Sucesso para alteracao. Linha: ${textoLinha}`)
            }

            cy.task('log', `[contrato] ${protocoloContrato} ainda em processamento. Tentativas restantes: ${tentativasRestantes - 1}`)
            cy.wait(10000, { log: false })

            cy.get('body').then(($body) => {
                const botaoPesquisar = $body.find('button').filter((_, button) => {
                    return /Pesquisar|Consultar/i.test(button.innerText)
                }).first()

                if (botaoPesquisar.length) {
                    cy.wrap(botaoPesquisar).click({ force: true, waitForAnimations: false })
                    this.aguardarCarregamento()
                }
            })

            this.aguardarContratoFinalizadoNaConsulta(protocoloContrato, tentativasRestantes - 1)
        })
    }

    preencherDadosAlteracaoContrato(dados) {
        cy.get('#contratoForm', { timeout: 30000 })
            .scrollIntoView({ ensureScrollable: false })
            .should('be.visible')

        this.preencherInputHabilitadoSeExistir(
            'input[placeholder="Penalidade"], textarea[placeholder="Penalidade"], input[name="penalidade"], textarea[name="penalidade"], input[formcontrolname="penalidade"], textarea[formcontrolname="penalidade"]',
            dados.descricaoPenalidade
        )

        this.preencherInputHabilitadoSeExistir(
            'input[placeholder="IOF"], input[name="iof"], input[formcontrolname="iof"]',
            dados.iof
        )
    }

    enviarAlteracaoContrato() {
        cy.intercept({ url: '**/vbauto.api/api/contratos/**' }).as('postAlteracaoContrato')

        cy.get('#contratoForm', { timeout: 20000 })
            .should('exist')
            .scrollTo('bottom', { ensureScrollable: false })

        this.clicarBotaoAlterarContrato()
        this.confirmarProsseguirSeNecessario()

        return cy.wait('@postAlteracaoContrato', { timeout: 60000 }).then((interception) => {
            const status = interception.response?.statusCode || 'sem-status'
            const body = interception.response?.body || {}
            const corpo = JSON.stringify(body).slice(0, 1000)
            const protocolo = body.protocolo || body.numeroProtocolo || body.data?.protocolo

            return cy.task('log', `[alteracao-contrato] ${interception.request.method} ${interception.request.url} -> ${status} ${corpo}`)
                .then(() => {
                    if (protocolo) {
                        return cy.wrap(protocolo, { log: false })
                    }

                    this.aguardarCarregamento()
                    this.confirmarEnvioSeNecessario()
                    this.aguardarCarregamento()
                    this.assertProtocoloGerado()
                    return this.capturarProtocoloGerado()
                })
        })
    }

    clicarBotaoAlterarContrato() {
        cy.get('body').then(($body) => {
            const botoes = $body.find('#contratoForm button').filter((_, button) => {
                return /Alterar Contrato|Enviar Alteracao|Enviar Alteração|Finalizar/i.test(this.normalizarTexto(button.innerText))
            })

            expect(
                [...botoes].map((button) => button.innerText.trim()).join(' | '),
                'botao final de alteracao de contrato'
            ).not.to.eq('')

            cy.wrap(botoes.last())
                .scrollIntoView({ ensureScrollable: false })
                .should('be.visible')
                .and('not.be.disabled')
                .click({ force: true, waitForAnimations: false })
        })
    }

    confirmarProsseguirSeNecessario() {
        cy.get('body').then(($body) => {
            const botaoProsseguir = $body.find('button').filter((_, button) => {
                return /Sim,\s*prosseguir|Prosseguir|Confirmar/i.test(button.innerText)
            }).first()

            if (botaoProsseguir.length) {
                cy.wrap(botaoProsseguir).click({ force: true, waitForAnimations: false })
            }
        })
    }

    validarTipoAditivoPersistido(protocoloAditivo) {
        this.acessarConsultaContratosAditivos()
        this.aguardarAditivoProcessadoNaConsulta(protocoloAditivo)

        cy.visit(`/vbconnection/vbauto/contrato/aditivo/editar/${protocoloAditivo}`)
        this.aguardarCarregamento()

        cy.location('pathname', { timeout: 30000 })
            .should('include', `/vbconnection/vbauto/contrato/aditivo/editar/${protocoloAditivo}`)

        cy.get('#aditivoForm', { timeout: 30000 })
            .should('be.visible')

        this.assertTipoAditivoPreenchido()
    }

    aguardarAditivoProcessadoNaConsulta(protocoloAditivo, tentativasRestantes = 6) {
        cy.contains('tr', protocoloAditivo, { timeout: 30000 }).then(($linha) => {
            const textoLinha = this.normalizarTexto($linha.text()).replace(/\s+/g, ' ').trim()

            if (/Finalizado com Sucesso/i.test(textoLinha)) {
                cy.task('log', `[aditivo] ${protocoloAditivo} liberado para alteracao: ${textoLinha}`)
                return
            }

            if (tentativasRestantes <= 1) {
                throw new Error(`[aditivo] ${protocoloAditivo} ainda nao esta Finalizado com Sucesso para alteracao. Linha: ${textoLinha}`)
            }

            cy.task('log', `[aditivo] ${protocoloAditivo} ainda em processamento. Tentativas restantes: ${tentativasRestantes - 1}`)
            cy.wait(10000, { log: false })

            cy.get('body').then(($body) => {
                const botaoPesquisar = $body.find('button').filter((_, button) => {
                    return /Pesquisar|Consultar/i.test(button.innerText)
                }).first()

                if (botaoPesquisar.length) {
                    cy.wrap(botaoPesquisar).click({ force: true, waitForAnimations: false })
                    this.aguardarCarregamento()
                }
            })

            this.aguardarAditivoProcessadoNaConsulta(protocoloAditivo, tentativasRestantes - 1)
        })
    }

    preencherDestinoAgenteAditivoSeNecessario(detran, agenteFinanceiro) {
        cy.get('body').then(($body) => {
            const destino = $body.find('nz-select[formcontrolname="destino"]:visible').first()

            if (destino.length &&
                !destino.hasClass('ant-select-disabled') &&
                !this.normalizarTexto(destino.text()).includes(detran)) {
                this.selecionarDetran(detran)
            }
        })

        cy.get('body').then(($body) => {
            const agente = $body.find('nz-select[formcontrolname="agenteFinanceiro"]:visible').first()

            if (agente.length &&
                !agente.hasClass('ant-select-disabled') &&
                !this.normalizarTexto(agente.text()).includes(agenteFinanceiro)) {
                this.selecionarAgenteFinanceiro(agenteFinanceiro)
            }
        })

        this.selecionarSelectPorRotuloSeExistir('Agente Financeiro / CNPJ', agenteFinanceiro)
        this.selecionarSelectPorRotuloSeExistir('Agente Financeiro', agenteFinanceiro)
    }

    acessarConsultaContratosAditivos() {
        cy.visit('/vbconnection/vbauto/contrato/consultar')
        this.aguardarCarregamento()

        cy.location('pathname', { timeout: 30000 })
            .should('include', '/vbconnection/vbauto/contrato/consultar')

        cy.get('table tbody tr', { timeout: 30000 })
            .should('have.length.at.least', 1)
    }

    abrirPrimeiroAditivoElegivelParaAlteracao() {
        this.acessarConsultaContratosAditivos()

        return cy.get('table tbody tr', { timeout: 30000 }).then(($linhas) => {
            const linhasElegiveis = [...$linhas].filter((linha) => {
                const texto = this.normalizarTexto(linha.innerText).replace(/\s+/g, ' ').trim()
                return /Registro de Aditivo/i.test(texto) &&
                    /Finalizado com Sucesso|Finalizado|Aguardando Envio/i.test(texto)
            })

            expect(
                linhasElegiveis.map((linha) => this.normalizarValorCampo(linha.innerText)).join(' | '),
                'aditivo elegivel para alteracao'
            ).not.to.eq('')

            const linha = linhasElegiveis[0]
            const protocolo = this.normalizarValorCampo(Cypress.$(linha).find('td').first().text())

            expect(protocolo, 'protocolo do aditivo elegivel').to.match(/\d{4,}/)

            cy.wrap(linha).within(() => {
                cy.get('button:visible, [role="button"]:visible')
                    .last()
                    .click({ force: true, waitForAnimations: false })
            })

            cy.get('.cdk-overlay-pane, .ant-dropdown, body', { timeout: 10000 })
                .contains(/Alterar|Editar/i)
                .click({ force: true, waitForAnimations: false })

            this.aguardarCarregamento()

            cy.location('pathname', { timeout: 30000 })
                .should('include', '/vbconnection/vbauto/contrato/aditivo')

            cy.task('log', `[aditivo] protocolo selecionado para alteracao: ${protocolo}`)
            return cy.wrap(protocolo, { log: false })
        })
    }

    preencherDadosAlteracaoAditivo(dados) {
        cy.get('#aditivoForm', { timeout: 30000 })
            .scrollIntoView({ ensureScrollable: false })
            .should('be.visible')

        this.habilitarEdicaoSecaoAditivoSeNecessario()
        this.selecionarTipoAditivoObrigatorio()
        this.preencherInputPorRotuloSeHabilitado('Numero do aditivo', dados.numeroAditivo)
        this.preencherInputPorRotuloSeHabilitado('Numero do registro', dados.numeroRegistro)
        this.preencherInputPorRotuloSeHabilitado('Data do aditivo', dados.dataAditivo)

        this.preencherInputHabilitadoSeExistir(
            'input[placeholder="NÃƒÂºmero do Aditivo"], input[placeholder="Numero do Aditivo"], input[name="numeroAditivo"], input[formcontrolname="numeroAditivo"]',
            dados.numeroAditivo
        )

        this.preencherInputHabilitadoSeExistir(
            'input[placeholder="NÃƒÂºmero do registro"], input[placeholder="Numero do registro"], input[name="numeroRegistro"], input[formcontrolname="numeroRegistro"]',
            dados.numeroRegistro
        )
    }

    habilitarEdicaoSecaoAditivoSeNecessario() {
        cy.get('body').then(($body) => {
            const secaoAditivo = $body.find('#aditivoForm section').filter((_, section) => {
                const texto = this.normalizarTexto(section.innerText)
                return /Aditivo/i.test(texto) && /Tipo de Aditivo|Numero do aditivo/i.test(texto)
            }).first()

            if (!secaoAditivo.length) {
                return
            }

            const possuiCampoEditavel = secaoAditivo.find('input:visible, textarea:visible').toArray().some((campo) => {
                const $campo = Cypress.$(campo)
                return !$campo.is(':disabled') && !$campo.attr('readonly')
            })

            if (possuiCampoEditavel) {
                return
            }

            const acionador = secaoAditivo.find('button:visible, [role="button"]:visible, i:visible, span.anticon:visible, svg:visible').filter((_, elemento) => {
                return !Cypress.$(elemento).closest('nz-select, input, textarea').length
            }).last()

            if (acionador.length) {
                cy.wrap(acionador).click({ force: true, waitForAnimations: false })
                this.aguardarCarregamento()
            }
        })
    }

    assertDadosAlteracaoAditivoPreenchidos(dados) {
        cy.get('body').then(($body) => {
            const localizarInput = (rotulo) => {
                const rotuloNormalizado = this.normalizarTexto(rotulo).toLowerCase()
                const item = $body.find('.ant-form-item, nz-form-item').filter((_, elemento) => {
                    return this.normalizarTexto(elemento.innerText).toLowerCase().includes(rotuloNormalizado) &&
                        Cypress.$(elemento).find('input:visible').length
                }).first()

                return item.find('input:visible').first()
            }

            const numeroAditivo = localizarInput('Numero do aditivo')
            const numeroRegistro = localizarInput('Numero do registro')

            if (numeroAditivo.length && !numeroAditivo.is(':disabled') && !numeroAditivo.attr('readonly')) {
                expect(numeroAditivo.val(), 'numero do aditivo alterado').to.eq(dados.numeroAditivo)
            }

            if (numeroRegistro.length && !numeroRegistro.is(':disabled') && !numeroRegistro.attr('readonly')) {
                expect(numeroRegistro.val(), 'numero do registro alterado').to.eq(dados.numeroRegistro)
            }
        })
    }

    enviarNovoAditivo() {
        this.assertTipoAditivoPreenchido()

        cy.intercept({ url: '**/vbauto.api/api/contratos/aditivo/**' }).as('postEnvioAditivo')

        cy.get('#aditivoForm', { timeout: 20000 })
            .should('be.visible')

        this.clicarBotaoEnviarAditivo()

        return this.registrarRespostaEnvioAditivo().then((envio) => {
            if (envio.protocolo) {
                return cy.wrap(envio.protocolo, { log: false })
            }

            this.aguardarCarregamento()
            this.confirmarEnvioSeNecessario()
            this.aguardarCarregamento()

            this.assertProtocoloGerado()
            return this.capturarProtocoloGerado()
        })
    }

    enviarAlteracaoAditivo() {
        cy.intercept({ url: '**/vbauto.api/api/contratos/aditivo/**' }).as('postEnvioAditivo')

        cy.get('#aditivoForm', { timeout: 20000 })
            .should('exist')
            .scrollTo('bottom', { ensureScrollable: false })

        this.clicarBotaoEnviarAditivo()

        return this.registrarRespostaEnvioAditivo().then((envio) => {
            this.assertPayloadAlteracaoAditivoComTipo(envio)

            if (envio.protocolo) {
                return cy.wrap(envio.protocolo, { log: false })
            }

            this.aguardarCarregamento()
            this.confirmarEnvioSeNecessario()
            this.aguardarCarregamento()

            this.assertProtocoloGerado()
            return this.capturarProtocoloGerado()
        })
    }

    assertPayloadAlteracaoAditivoComTipo(envio) {
        if (!/\/alterar/i.test(envio.url || '')) {
            return
        }

        const valoresTipo = []
        const visitar = (valor, caminho = '') => {
            if (!valor || typeof valor !== 'object') {
                return
            }

            Object.entries(valor).forEach(([chave, conteudo]) => {
                const proximoCaminho = caminho ? `${caminho}.${chave}` : chave
                const chaveNormalizada = this.normalizarTexto(chave).toLowerCase()

                if (/tipo.*aditivo|aditivo.*tipo|tipoAditivo/i.test(chave) ||
                    (chaveNormalizada.includes('tipo') && chaveNormalizada.includes('aditivo'))) {
                    valoresTipo.push({
                        caminho: proximoCaminho,
                        valor: conteudo
                    })
                }

                if (conteudo && typeof conteudo === 'object') {
                    visitar(conteudo, proximoCaminho)
                }
            })
        }

        visitar(envio.requestBody)

        const valoresPreenchidos = valoresTipo.filter(({ valor }) => {
            if (valor === null || valor === undefined) {
                return false
            }

            if (typeof valor === 'object') {
                return Object.values(valor).some((item) => {
                    return item !== null && item !== undefined && String(item).trim() !== ''
                })
            }

            return String(valor).trim() !== ''
        })

        cy.task(
            'log',
            `[aditivo] campos de tipo no payload=${JSON.stringify(valoresTipo).slice(0, 1000) || 'nenhum'}`
        )

        expect(
            valoresPreenchidos.map(({ caminho, valor }) => `${caminho}=${JSON.stringify(valor)}`).join(' | '),
            'Tipo de Aditivo deve ser enviado no payload de alteracao'
        ).not.to.eq('')
    }

    clicarBotaoEnviarAditivo() {
        cy.get('body').then(($body) => {
            const resumoBotoes = [...$body.find('#aditivoForm button')].map((button, indice) => {
                const texto = this.normalizarValorCampo(button.innerText) || '[sem texto]'
                const tipo = Cypress.$(button).attr('type') || 'sem-type'
                const classes = Cypress.$(button).attr('class') || 'sem-classe'
                return `${indice}:${texto}:${tipo}:${classes}`
            }).join(' | ')

            cy.task('log', `[aditivo] botoes no formulario=${resumoBotoes || 'nenhum'}`)

            const botaoSeletorPrincipal = $body
                .find('#aditivoForm > section:nth-child(10) > div > button')
                .first()

            if (botaoSeletorPrincipal.length) {
                cy.wrap(botaoSeletorPrincipal)
                    .scrollIntoView({ ensureScrollable: false })
                    .click({ force: true, waitForAnimations: false })
                return
            }

            const botoesFormulario = $body.find('#aditivoForm button').filter((_, button) => {
                const texto = this.normalizarTexto(button.innerText)
                const tipo = Cypress.$(button).attr('type') || ''
                return /Enviar|Salvar|Finalizar|Alterar|Registrar/i.test(texto) || tipo === 'submit'
            })

            const botoesFallback = botoesFormulario.length
                ? botoesFormulario
                : $body.find('#aditivoForm section button')

            expect(
                [...botoesFallback].map((button) => button.innerText.trim()).join(' | '),
                'botao de envio do aditivo'
            ).not.to.eq('')

            cy.wrap(botoesFallback.last())
                .scrollIntoView({ ensureScrollable: false })
                .click({ force: true, waitForAnimations: false })
        })
    }

    registrarRespostaEnvioAditivo() {
        return cy.wait('@postEnvioAditivo', { timeout: 60000 }).then((interception) => {
            const status = interception.response?.statusCode || 'sem-status'
            const body = interception.response?.body || {}
            const corpo = JSON.stringify(body).slice(0, 1000)
            const requestBody = interception.request?.body || {}
            const protocolo = body.protocolo || body.numeroProtocolo || body.data?.protocolo

            return cy.task(
                'log',
                `[envio-aditivo] ${interception.request.method} ${interception.request.url} -> ${status} ${corpo}`
            ).then(() => {
                return {
                    protocolo,
                    requestBody,
                    url: interception.request.url
                }
            })
        })
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

        this.selecionarOpcaoAberta(detran, 'DETRAN')

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

        this.corrigirDatasContrato(dados)

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

        this.selecionarSelectSeExistir(
            'nz-select[nzplaceholder="UF do local de pagamento"], nz-select[formcontrolname="ufLocalPagamento"]',
            dados.uf
        )
        this.aguardarCarregamento()

        this.selecionarSelectSeExistir(
            'nz-select[nzplaceholder="Cidade do local de pagamento"], nz-select[formcontrolname="cidadeLocalPagamento"]',
            dados.cidade
        )

        this.preencherDadosPessoa('Devedor', dados.devedor)
        this.preencherDadosPessoa('Credor', dados.credor)
        this.preencherSelectsObrigatoriosPendentes()
    }

    corrigirDatasContrato(dados) {
        const datasObrigatorias = [
            ['primeira parcela', dados.dataPrimeiraParcela],
            ['ultima parcela', dados.dataUltimaParcela],
            ['fim de vigencia', dados.dataFimVigencia]
        ]

        datasObrigatorias.forEach(([campo, valor]) => {
            expect(valor, `data obrigatoria: ${campo}`).to.not.be.empty
        })

        this.preencherInputSeExistir(
            'input#primeiraParcela, input[name="primeiraParcela"], input[formcontrolname="primeiraParcela"], input[placeholder="Dia da primeira parcela"], input[name="dataPrimeiraParcela"], input[name="dataVencimentoPrimeiraParcela"], input[formcontrolname="dataPrimeiraParcela"], input[formcontrolname="dataVencimentoPrimeiraParcela"]',
            dados.dataPrimeiraParcela
        )
        this.preencherInputPorRotuloSeHabilitado('Data da primeira parcela', dados.dataPrimeiraParcela)
        this.preencherInputPorLabelContrato('Data da primeira parcela', dados.dataPrimeiraParcela)

        this.preencherInputSeExistir(
            'input#ultimaParcela, input[name="ultimaParcela"], input[formcontrolname="ultimaParcela"], input[placeholder="Dia da Ãºltima parcela"], input[placeholder="Dia da ultima parcela"], input[name="dataUltimaParcela"], input[name="dataVencimentoUltimaParcela"], input[formcontrolname="dataUltimaParcela"], input[formcontrolname="dataVencimentoUltimaParcela"]',
            dados.dataUltimaParcela
        )
        this.preencherInputPorRotuloSeHabilitado('Data da ultima parcela', dados.dataUltimaParcela)
        this.preencherInputPorLabelContrato('Data da ultima parcela', dados.dataUltimaParcela)

        this.preencherTodosInputsSeExistirem(
            'input[placeholder="Data do Pagamento"], input[placeholder="Data do pagamento"], input#dataPagamento',
            dados.dataPagamento
        )

        this.preencherInputSeExistir(
            'input[placeholder="Fim de vigÃªncia"], input[placeholder="Fim de vigencia"], input#finalVigencia',
            dados.dataFimVigencia
        )
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
            'nz-select[nzplaceholder="UF"]',
            indicePessoa,
            dados.estado
        )

        this.selecionarSelectSeExistir(
            `nz-select#cidade${tipo}, nz-select[name="cidade${tipo}"], nz-select[formcontrolname="cidade${tipo}"]`,
            dados.cidade
        )
        this.selecionarSelectPorIndiceSeExistir(
            'nz-select[nzplaceholder="Cidade"]',
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
        this.corrigirDatasContrato(this.ultimoDadosContrato)
        this.assertCamposObrigatoriosContratoPreenchidos(this.ultimoDadosContrato)
        this.salvarVeiculo()

        cy.intercept({ method: 'POST', url: '**/contratos/registrar**' }).as('postEnvioContrato')
        this.clicarBotaoEnviarContrato()
        this.registrarRespostaEnvio()

        this.aguardarCarregamento()
        this.confirmarEnvioSeNecessario()
        this.aguardarCarregamento()
        this.assertProtocoloGerado()
        return this.capturarProtocoloGerado()
    }

    registrarRespostaEnvio() {
        cy.wait('@postEnvioContrato', { timeout: 60000 }).then((interception) => {
            const status = interception.response?.statusCode || 'sem-status'
            const corpo = JSON.stringify(interception.response?.body || {}).slice(0, 1000)
            const datasPayload = this.resumirCamposPayload(interception.request.body, /parcela|data/i)

            cy.wrap(interception.request.body, { log: false }).as('ultimoPayloadEnvioContrato')
            cy.task('log', `[envio-contrato] ${interception.request.method} ${interception.request.url} -> ${status} ${corpo}`)
            expect(status, `status registro contrato; datas=${datasPayload}; body=${corpo}`).to.be.oneOf([200, 201, 202])
        })
    }

    resumirCamposPayload(valor, padraoChave, caminho = '') {
        if (!valor || typeof valor !== 'object') {
            return ''
        }

        return Object.entries(valor)
            .flatMap(([chave, item]) => {
                const caminhoAtual = caminho ? `${caminho}.${chave}` : chave

                if (padraoChave.test(chave)) {
                    return [`${caminhoAtual}=${JSON.stringify(item)}`]
                }

                if (item && typeof item === 'object') {
                    return this.resumirCamposPayload(item, padraoChave, caminhoAtual)
                }

                return []
            })
            .filter(Boolean)
            .slice(0, 30)
            .join('; ')
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

        return cy.get('body')
            .invoke('text')
            .should((texto) => {
                expect(texto, 'número de protocolo gerado').to.match(/protocolo[\s\S]{0,120}\d{4,}/i)
            })
    }

    capturarProtocoloGerado() {
        return cy.get('body')
            .invoke('text')
            .then((texto) => {
                const match = texto.match(/protocolo[\s\S]{0,120}?([A-Z0-9.-]*\d{4,}[A-Z0-9.-]*)/i)
                const protocolo = match?.[1]?.replace(/[^\dA-Z.-]/gi, '')

                expect(protocolo, 'protocolo capturado').to.not.be.empty

                return cy.task('log', `[envio-contrato] protocolo capturado: ${protocolo}`).then(() => protocolo)
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
