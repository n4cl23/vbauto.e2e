class MapeamentoFluxosPage {
    normalizarTexto(texto) {
        return String(texto || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    }

    aguardarCarregamento() {
        cy.get('body', { timeout: 20000 }).should('exist').then(($body) => {
            const carregando = $body.find('.loader:visible, .ant-spin-spinning:visible').length

            if (carregando) {
                cy.wait(500, { log: false })
            }
        })
    }

    logarResumoTela(contexto) {
        cy.get('body').then(($body) => {
            const texto = this.normalizarTexto($body.text()).replace(/\s+/g, ' ').trim().slice(0, 1500)
            cy.task('log', `[mapeamento:${contexto}] ${texto}`)
        })
    }

    acessarMenuPrincipal(rotulo) {
        this.aguardarCarregamento()

        cy.contains(rotulo, { timeout: 20000 })
            .should('be.visible')
            .click({ force: true, waitForAnimations: false })

        this.aguardarCarregamento()
    }

    acessarCardPorTexto(textoCard) {
        cy.contains('app-menu-card-icon', textoCard, { timeout: 20000 })
            .should('be.visible')
            .click({ force: true, waitForAnimations: false })

        this.aguardarCarregamento()
    }

    listarCards(contexto) {
        cy.get('body').then(($body) => {
            const cards = [...$body.find('app-menu-card-icon:visible')]
                .map((card) => card.innerText.replace(/\s+/g, ' ').trim())
                .filter(Boolean)

            cy.task('log', `[mapeamento:${contexto}] cards=${cards.join(' | ') || 'nenhum card encontrado'}`)
        })
    }

    listarCamposFormulario(contexto) {
        cy.get('body').then(($body) => {
            const campos = [
                ...$body.find('input:visible, textarea:visible, nz-select:visible, button:visible')
            ].map((campo) => {
                const $campo = Cypress.$(campo)
                return $campo.attr('placeholder') ||
                    $campo.attr('formcontrolname') ||
                    campo.innerText.replace(/\s+/g, ' ').trim()
            }).filter(Boolean)

            cy.task('log', `[mapeamento:${contexto}] campos=${campos.join(' | ') || 'nenhum campo encontrado'}`)
        })
    }

    validarTelaConsulta(contexto) {
        cy.location('pathname', { timeout: 20000 }).should('include', '/vbconnection/vbauto')
        cy.get('body').should(($body) => {
            const texto = this.normalizarTexto($body.text())
            expect(texto, `${contexto}: tela deve exibir consulta, filtros ou resultados`).to.match(/Consultar|Consulta|Filtro|Pesquisar|Resultado|Relatorio/i)
        })

        this.listarCamposFormulario(contexto)
        this.logarResumoTela(contexto)
    }

    validarEntradaRegistroContratoAditivo(contexto) {
        this.acessarMenuPrincipal('Registrar')
        this.acessarCardPorTexto(/Registro de Contrato\s*(\/|e)\s*Aditivo/i)
        this.listarCards(contexto)

        cy.get('body').should(($body) => {
            const texto = this.normalizarTexto($body.text())
            expect(texto, `${contexto}: tela de contrato/aditivo deve carregar`).to.match(/Registro de Contrato|Aditivo/i)
        })
    }

    validarPossivelEntradaAditivo(contexto) {
        this.validarEntradaRegistroContratoAditivo(contexto)

        cy.get('body').then(($body) => {
            const texto = this.normalizarTexto($body.text())
            const possuiAditivo = /Aditivo/i.test(texto)
            const possuiContratoTela = /Registro de Contrato por Tela/i.test(texto)

            expect(
                possuiAditivo || possuiContratoTela,
                `${contexto}: deve exibir entrada de aditivo ou ao menos confirmar modulo de contrato/aditivo`
            ).to.eq(true)
        })
    }
}

export default new MapeamentoFluxosPage()
