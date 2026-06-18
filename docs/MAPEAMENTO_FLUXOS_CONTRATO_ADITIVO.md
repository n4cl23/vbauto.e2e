# Mapeamento tecnico - Alteracao de contrato e aditivos

Este documento consolida o mapeamento inicial dos proximos fluxos E2E do VB Auto.
O objetivo desta fase e estruturar a automacao antes da implementacao completa dos specs.

Fluxos contemplados:

- Alteracao de contrato
- Registro de aditivo
- Alteracao de aditivo

## Premissas gerais

- Os fluxos devem reutilizar o comando `cy.login`.
- Os specs de contrato novo/usado continuam sendo a referencia de navegacao, massa, preenchimento seguro e validacao de protocolo.
- Estados que exigem WebPKI/certificado devem continuar sendo ignorados via `cypress/fixtures/detransIgnorados.json`.
- Todo envio deve validar confirmacao visual e numero de protocolo quando o sistema gerar retorno de protocolo.
- Fluxos de alteracao/aditivo dependem de contrato previamente registrado/enviado.
- Para automacao estavel, o contrato base deve ser criado no proprio teste ou recuperado de uma massa controlada com status conhecido.
- Quando o fluxo localizar contratos/aditivos existentes, a busca deve usar identificadores unicos da execucao sempre que possivel.

## Estrutura reutilizavel recomendada

### Reuso imediato

Arquivos existentes a reaproveitar:

- `cypress/support/commands.js`
  - Login UI com ou sem sessao armazenada.
- `cypress/support/massaDados.js`
  - Pessoa por UF.
  - Veiculo novo/usado.
  - Chassi, placa, RENAVAM, CPF/CNPJ e endereco unicos.
- `cypress/pages/contratoPage.js`
  - Navegacao inicial.
  - Preenchimento idempotente de inputs.
  - Selecao de selects com fallback sem acento.
  - Validacao de campos obrigatorios.
  - Envio e validacao de protocolo.
- `cypress/actions/contratoActions.js`
  - Geracao de dados de contrato.
  - Inicio de fluxo de registro.
  - Inclusao de veiculo novo/usado.
  - Envio do contrato.

### Novos modulos sugeridos

```text
cypress/
  actions/
    alteracaoContratoActions.js
    aditivoActions.js
  pages/
    consultaContratoPage.js
    aditivoPage.js
  e2e/
    contrato/
      alteracao_contrato.cy.js
      registro_aditivo.cy.js
      alteracao_aditivo.cy.js
```

### Helpers comuns sugeridos

- `localizarContratoPorNumero(numeroContrato)`
- `localizarContratoPorCpfCnpj(cpfCnpj)`
- `localizarContratoPorChassi(chassi)`
- `abrirAcoesDoContrato()`
- `selecionarAcaoContrato(acao)`
- `assertProtocoloGerado(contexto)`
- `assertStatusProcessamento(statusEsperado)`
- `registrarContratoBase(detran, tipoVeiculo)`

## Fluxo 1 - Alteracao de contrato

### Nome do fluxo

Alteracao de contrato registrado.

### Caminho de navegacao

Caminho a confirmar em exploracao UI:

```text
VB Auto > Consultar ou Relatorios > Contratos > Buscar contrato > Acoes > Alterar
```

Possivel alternativa:

```text
VB Auto > Registrar > Registro de Contrato/Aditivo > Alteracao de contrato
```

### Pre-condicoes

- Existir contrato registrado com sucesso.
- O contrato deve possuir protocolo gerado.
- O contrato deve estar em status que permita alteracao.
- O DETRAN selecionado nao pode exigir WebPKI.
- O contrato base deve pertencer ao mesmo DETRAN/UF do teste.

### Massa necessaria

Dados para localizar contrato:

- DETRAN/UF.
- Numero do contrato.
- CPF/CNPJ do devedor.
- Chassi.
- Protocolo gerado no registro.

Dados para alterar:

- Nova data ou valor permitido pela regra do sistema.
- Novo email/telefone do devedor, se editavel.
- Dados financeiros editaveis, se permitidos.
- Documento complementar, se exigido por UF.

### Filtros esperados

Filtros a mapear na tela:

- DETRAN/UF.
- Agente financeiro.
- Numero do contrato.
- CPF/CNPJ do devedor.
- Chassi.
- Placa.
- RENAVAM.
- Periodo de cadastro/envio.
- Status do contrato.
- Protocolo.

### Tela inicial esperada

Tela de consulta/listagem com:

- Filtros de pesquisa.
- Botao pesquisar/consultar.
- Grid de resultados.
- Coluna de status.
- Coluna de acoes.

### Campos editaveis a confirmar

Campos provaveis:

- Dados de contato do devedor:
  - Telefone.
  - E-mail.
- Endereco do devedor/credor:
  - CEP.
  - Numero.
  - Complemento.
  - Bairro, cidade e UF quando liberados pelo sistema.
- Dados financeiros:
  - Data de liberacao de credito.
  - Data de pagamento.
  - Quantidade de parcelas.
  - Valores, taxas e multa.
- Observacao/descricao, quando existir.

### Campos bloqueados a confirmar

Campos que normalmente devem ficar bloqueados:

- DETRAN.
- Agente financeiro.
- Numero do contrato.
- CPF/CNPJ principal quando o contrato ja foi enviado.
- Chassi.
- Protocolo original.
- Tipo de veiculo novo/usado.
- Dados de identificacao do veiculo que tenham sido enviados ao DETRAN.

### Documentos obrigatorios

A confirmar por UF:

- Documento de alteracao contratual.
- Instrumento assinado.
- Comprovante ou termo do credor.
- Anexo exigido pelo DETRAN.

### Acoes executadas

1. Login.
2. Acessar tela de consulta/alteracao.
3. Filtrar contrato base.
4. Abrir acao `Alterar`.
5. Validar campos carregados.
6. Alterar apenas campos permitidos.
7. Validar ausencia de campos obrigatorios pendentes.
8. Enviar alteracao.
9. Confirmar envio, se houver modal.
10. Capturar protocolo de alteracao.

### Validacoes esperadas

- Contrato localizado com identificador correto.
- Campos bloqueados nao ficam editaveis.
- Campos editaveis aceitam novo valor.
- Botao de envio habilita somente com formulario valido.
- Envio retorna protocolo.
- Protocolo contem numero com pelo menos 4 digitos.
- Mensagem de sucesso exibida.

### Possiveis pontos de falha

- Contrato base ainda nao processado pelo HMG.
- Status nao permite alteracao.
- Campo obrigatorio especifico por UF.
- DETRAN exige certificado.
- Grid nao retorna contrato por atraso de indexacao.
- A tela exige documento obrigatorio nao mapeado.

### Spec Cypress sugerido

```text
cypress/e2e/contrato/alteracao_contrato.cy.js
```

Cenario inicial recomendado:

- Criar contrato base para `DETRAN-AC` ou `DETRAN-DF`.
- Buscar pelo numero do contrato.
- Alterar campo simples e seguro, preferencialmente telefone ou email.
- Enviar alteracao.
- Validar protocolo.

## Fluxo 2 - Registro de aditivo

### Nome do fluxo

Registro de aditivo de contrato.

### Caminho de navegacao

Caminho a confirmar em exploracao UI:

```text
VB Auto > Registrar > Registro de Contrato/Aditivo > Registro de Aditivo por Tela
```

Possivel alternativa:

```text
VB Auto > Consultar contrato > Acoes > Gerar/Registrar aditivo
```

### Pre-condicoes

- Existir contrato base registrado com sucesso.
- O contrato base deve estar apto a receber aditivo.
- O contrato base deve pertencer ao DETRAN/UF do teste.
- O DETRAN nao pode exigir WebPKI.
- O contrato base deve ter protocolo de registro.

### Contrato base necessario

Contrato base recomendado:

- Criado dinamicamente no proprio spec.
- Numero de contrato unico.
- Chassi unico.
- Devedor unico.
- Protocolo capturado apos envio.

Alternativa para smoke rapido:

- Usar contrato preexistente via fixture controlada.
- A fixture deve conter status conhecido e data de ultima validacao.

### Massa necessaria

- Numero do contrato base.
- CPF/CNPJ do devedor.
- Chassi.
- Protocolo original.
- Dados novos do aditivo:
  - Numero do aditivo, se existir.
  - Data do aditivo.
  - Tipo de aditivo.
  - Novo valor/condicao.
  - Documento/anexo, se exigido.

### Campos obrigatorios a confirmar

Campos provaveis:

- DETRAN.
- Agente financeiro.
- Numero do contrato base.
- CPF/CNPJ do devedor.
- Tipo de aditivo.
- Data do aditivo.
- Motivo do aditivo.
- Dados financeiros alterados.
- Dados do veiculo, quando exibidos.
- Documento obrigatorio, quando exigido por UF.

### Campos opcionais a confirmar

- Observacao.
- Complemento de justificativa.
- Dados complementares do contrato.
- Anexos adicionais.

### Regras especificas por UF

Devem ser registradas durante a exploracao:

- UF que exige certificado/WebPKI.
- UF que exige documento obrigatorio.
- UF que limita tipos de aditivo.
- UF que bloqueia aditivo para veiculo novo/usado.
- UF que exige prazo minimo apos registro do contrato.
- UF que nao disponibiliza aditivo no HMG.

### Acoes executadas

1. Login.
2. Criar ou localizar contrato base.
3. Acessar fluxo de registro de aditivo.
4. Informar DETRAN/agente, se solicitado.
5. Buscar contrato base.
6. Validar dados carregados.
7. Preencher campos obrigatorios do aditivo.
8. Anexar documentos, se aplicavel.
9. Enviar aditivo.
10. Capturar protocolo.

### Validacoes esperadas

- Contrato base encontrado.
- Dados do contrato base exibidos corretamente.
- Campos do contrato base protegidos quando nao editaveis.
- Dados do aditivo preenchidos.
- Botao de envio habilitado.
- Protocolo de aditivo gerado.
- Mensagem de sucesso exibida.

### Possiveis pontos de falha

- Contrato base sem status apto.
- Contrato base nao encontrado por atraso de processamento.
- Aditivo indisponivel para UF.
- Documento obrigatorio ausente.
- Modal WebPKI.
- Divergencia entre numero do contrato base e contrato retornado na busca.

### Spec Cypress sugerido

```text
cypress/e2e/contrato/registro_aditivo.cy.js
```

Cenario inicial recomendado:

- Registrar contrato base em um DETRAN elegivel.
- Abrir registro de aditivo.
- Buscar contrato pelo numero gerado.
- Preencher tipo/motivo/data do aditivo.
- Enviar.
- Validar protocolo.

## Fluxo 3 - Alteracao de aditivo

### Nome do fluxo

Alteracao de aditivo registrado.

### Caminho de navegacao

Caminho a confirmar em exploracao UI:

```text
VB Auto > Consultar ou Relatorios > Aditivos > Buscar aditivo > Acoes > Alterar
```

Possivel alternativa:

```text
VB Auto > Consultar contrato > Aditivos do contrato > Acoes > Alterar aditivo
```

### Pre-condicoes

- Existir contrato base registrado.
- Existir aditivo registrado/enviado para esse contrato.
- O aditivo deve possuir protocolo.
- O aditivo deve estar em status que permita alteracao.
- O DETRAN nao pode exigir WebPKI.

### Como localizar aditivo existente

Filtros a confirmar:

- Numero do contrato base.
- Numero/protocolo do aditivo.
- CPF/CNPJ do devedor.
- Chassi.
- DETRAN/UF.
- Periodo de envio.
- Status do aditivo.

### Massa necessaria

- Dados do contrato base.
- Protocolo do contrato base.
- Dados do aditivo registrado.
- Protocolo do aditivo.
- Novo valor para campo editavel.

### Campos editaveis a confirmar

Campos provaveis:

- Observacao/justificativa.
- Dados financeiros do aditivo.
- Data do aditivo, se permitido.
- Documento/anexo complementar.
- Contato/endereco, se o aditivo carregar dados de partes.

### Campos bloqueados a confirmar

Campos que normalmente devem ficar bloqueados:

- DETRAN.
- Agente financeiro.
- Numero do contrato base.
- Numero/protocolo do aditivo.
- CPF/CNPJ do devedor.
- Chassi.
- Dados originais do contrato base.
- Tipo do aditivo, se ja enviado.

### Acoes executadas

1. Login.
2. Criar/localizar contrato base.
3. Criar/localizar aditivo existente.
4. Acessar consulta de aditivos.
5. Filtrar pelo protocolo ou contrato base.
6. Abrir acao `Alterar`.
7. Validar campos editaveis e bloqueados.
8. Alterar dado permitido.
9. Enviar alteracao.
10. Capturar protocolo da alteracao.

### Validacoes esperadas

- Aditivo correto localizado.
- Campos bloqueados continuam desabilitados.
- Campo editavel aceita novo valor.
- Formulario sem obrigatorios pendentes.
- Protocolo de alteracao gerado.
- Mensagem de sucesso exibida.

### Possiveis pontos de falha

- Aditivo sem status apto para alteracao.
- Aditivo nao encontrado por atraso de processamento.
- Dependencia de certificado.
- Campos editaveis variam por UF.
- Alteracao exige anexo obrigatorio.
- Protocolo exibido em modal diferente do fluxo de contrato.

### Spec Cypress sugerido

```text
cypress/e2e/contrato/alteracao_aditivo.cy.js
```

Cenario inicial recomendado:

- Criar contrato base.
- Criar aditivo.
- Buscar aditivo pelo protocolo.
- Alterar campo seguro.
- Enviar.
- Validar novo protocolo.

## Estrategia de implementacao

### Fase 1 - Exploracao UI

Objetivo: confirmar telas, caminhos e seletores.

Tarefas:

- Navegar manualmente ou com spec temporario pelas telas.
- Registrar caminho exato de menu.
- Capturar nomes reais de botoes e labels.
- Mapear filtros reais.
- Mapear campos obrigatorios por UF base.
- Identificar estados com WebPKI ou indisponibilidade.

DETRANs sugeridos para exploracao:

- `DETRAN-AC`: baseline que ja vem passando bem.
- `DETRAN-DF`: costuma expor campos obrigatorios extras.
- `DETRAN-MT`: garante select com nomes semelhantes a `Mato Grosso do Sul`.
- `DETRAN-PB`: garante tratamento de acentos em selects.

### Fase 2 - Page Objects

Criar page objects pequenos e reutilizaveis:

- `consultaContratoPage.js`
- `aditivoPage.js`

Evitar duplicar:

- Login.
- Geracao de massa.
- Preenchimento seguro de inputs.
- Selecao resiliente de selects.
- Validacao de protocolo.

### Fase 3 - Actions

Criar actions de negocio:

- `alteracaoContratoActions.js`
- `aditivoActions.js`

Responsabilidades:

- Compor massa.
- Criar/recuperar contrato base.
- Executar fluxo.
- Retornar dados importantes do teste:
  - numeroContrato
  - cpfCnpj
  - chassi
  - protocoloContrato
  - protocoloAditivo

### Fase 4 - Specs

Specs propostos:

- `cypress/e2e/contrato/alteracao_contrato.cy.js`
- `cypress/e2e/contrato/registro_aditivo.cy.js`
- `cypress/e2e/contrato/alteracao_aditivo.cy.js`

Escopo inicial recomendado:

- Rodar em um DETRAN elegivel por spec, preferencialmente `DETRAN-AC` ou `DETRAN-DF`.
- Expandir para regressao multiestado depois que o fluxo estiver estabilizado.
- Usar `Cypress.env('detran')` para smoke direcionado.

## Regras de aceite para implementacao futura

- Cada fluxo deve validar protocolo ou confirmacao de envio.
- Cada fluxo deve deixar claro se cria contrato base ou usa massa preexistente.
- Cada spec deve respeitar `detransIgnorados.json`.
- Nenhum spec deve exigir WebPKI.
- Dados gerados devem ser unicos por execucao.
- Contrato/aditivo localizado deve ser validado por identificador unico.
- Logs devem indicar UF, fluxo, contrato, protocolo e motivo de falha.

## Pendencias de descoberta

Itens que precisam ser confirmados na primeira exploracao UI:

- Caminho exato dos menus.
- Labels oficiais das telas.
- Filtros reais de consulta.
- Nomes reais dos botoes de acao.
- Quais campos sao editaveis em alteracao de contrato.
- Quais campos sao editaveis em alteracao de aditivo.
- Quais campos/documentos sao obrigatorios por UF.
- Se o protocolo aparece em modal, toast ou tela final.
- Se existe tempo de processamento entre registro e permissao de alteracao/aditivo.
