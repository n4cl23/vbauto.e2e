class FormPage {
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
}

export default FormPage
