# VB Auto E2E

Automacao End-to-End do fluxo de registro de contratos do VB Auto, utilizando Cypress.

![CI](https://github.com/n4cl23/vbauto.e2e/actions/workflows/cypress.yml/badge.svg)
![Node](https://img.shields.io/badge/node-22-green)
![Cypress](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)

## Objetivo

Este projeto valida os fluxos criticos de contrato do VB Auto:

- registro de contrato com veiculo novo;
- registro de contrato com veiculo usado;
- envio do contrato e geracao de protocolo;
- regressao por DETRAN elegivel;
- geracao de massa unica e coerente por UF;
- cadastro com CNPJ alfanumerico.

## Ambiente

Ambiente homologacao:

```text
https://hmg.vbconnection.info/
```

As credenciais devem ser informadas por variaveis de ambiente no arquivo `.env`.

## Stack

| Tecnologia | Uso |
| --- | --- |
| Cypress | Automacao E2E |
| JavaScript | Implementacao dos testes |
| Node.js | Runtime |
| Mochawesome | Relatorios locais |
| GitHub Actions | Integracao continua |

## Estrutura

```text
cypress/
  actions/
    contratoActions.js
  e2e/
    cadastro_cnpj_alfanumerico.cy.js
    api/
      webservice/
        registro_contrato_webservice.cy.js
    contrato/
      alteracao_aditivo.cy.js
      alteracao_contrato.cy.js
      contrato_novo.cy.js
      contrato_usado.cy.js
      registro_aditivo.cy.js
  fixtures/
    detrans.json
    detransIgnorados.json
    veiculos/
      novo.json
      usado.json
  pages/
    contratoPage.js
  support/
    commands.js
    e2e.js
    massaDados.js
```

## Suites Ativas da Regressao

As suites abaixo compoem a regressao principal executada por `npm test`:

| Suite | Objetivo |
| --- | --- |
| `contrato/contrato_novo.cy.js` | Regressao multiestado para contrato de veiculo novo, com envio e protocolo |
| `contrato/contrato_usado.cy.js` | Regressao multiestado para contrato de veiculo usado, com envio e protocolo |
| `cadastro_cnpj_alfanumerico.cy.js` | Cadastro usando CNPJ alfanumerico unico |

Specs antigos de login isolado, contrato generico e veiculo novo/usado foram removidos para evitar redundancia.

## Suites API / Webservice

As suites de API ficam separadas das suites de UI em `cypress/e2e/api/webservice`.

| Suite | Objetivo |
| --- | --- |
| `api/webservice/registro_contrato_webservice.cy.js` | Registro de contrato via endpoint REST para os DETRANs elegiveis |

A suite de webservice:

- autentica em `/vbauto.api/auth/ws/tokens` usando as credenciais do `.env`;
- envia contratos em `/vbauto.api/ws/rest/contratos/v2`;
- reutiliza a massa dinamica por UF;
- gera contrato, devedor, credor, chassi, placa e RENAVAM unicos por execucao;
- percorre os DETRANs configurados em `cypress/fixtures/detrans.json`;
- ignora os DETRANs configurados em `cypress/fixtures/detransIgnorados.json`;
- valida status de sucesso e protocolo retornado.

Excecoes especificas da suite de webservice:

| Motivo | DETRANs |
| --- | --- |
| Retorno HMG sem protocolo (`99999 - Erro inesperado`) | `DETRAN-RJ` |

Executar somente webservice de contrato:

```bash
npm run test:ws:contrato
```

Executar webservice para um DETRAN especifico:

```bash
npm run test:ws:contrato -- --env detran=DETRAN-MG
```

## Specs em Mapeamento

Os specs abaixo ja existem como estrutura inicial, mas ficam fora do `npm test` ate a confirmacao UI dos caminhos, filtros e campos obrigatorios:

| Suite | Objetivo |
| --- | --- |
| `contrato/alteracao_contrato.cy.js` | Alteracao de contrato registrado |
| `contrato/registro_aditivo.cy.js` | Registro de aditivo a partir de contrato base |
| `contrato/alteracao_aditivo.cy.js` | Alteracao de aditivo registrado |

## Mapeamentos Tecnicos

Os proximos fluxos de automacao estao documentados antes da implementacao dos specs:

| Documento | Conteudo |
| --- | --- |
| `docs/MAPEAMENTO_FLUXOS_CONTRATO_ADITIVO.md` | Alteracao de contrato, registro de aditivo e alteracao de aditivo |

Esses fluxos ainda dependem de confirmacao UI dos caminhos, filtros, campos editaveis/bloqueados e regras especificas por UF.

## Regressao Multiestado

Os specs de contrato percorrem os DETRANs configurados em `cypress/fixtures/detrans.json`, ignorando automaticamente os DETRANs listados em `cypress/fixtures/detransIgnorados.json`.

Estados ignorados atualmente:

| Motivo | DETRANs |
| --- | --- |
| WebPKI / certificado digital | `DETRAN-PR` |
| Formulario indisponivel | `DETRAN-SE` |
| Servico de registro nao contratado no HMG | `DETRAN-MS` |

Para executar a regressao completa:

```bash
npm test
```

Para executar apenas os contratos:

```bash
npm run test:contrato
```

Para executar um smoke em um DETRAN especifico:

```bash
npm test -- --env detran=DETRAN-DF
```

## CNPJ Alfanumerico

A suite `cadastro_cnpj_alfanumerico.cy.js` valida:

- geracao de CNPJ alfanumerico unico por execucao;
- preenchimento do campo CPF/CNPJ;
- aceite do novo formato;
- ausencia de erro indevido de mascara ou validacao;
- envio do cadastro com sucesso;
- geracao de protocolo.

Executar somente esta suite:

```bash
npm run test:cadastro:cnpj
```

## Massa de Dados

A massa e gerada em `cypress/support/massaDados.js`.

Caracteristicas:

- dados unicos por execucao;
- CPF valido para fluxos padrao;
- CNPJ alfanumerico para a suite dedicada;
- endereco coerente com a UF;
- validacao de CEP por UF;
- cidade, bairro, logradouro e estado configurados por UF;
- retry controlado para evitar duplicidade;
- logs claros com UF, tentativa e motivo de falha.

## Otimizacao de Preenchimento

O Page Object `contratoPage.js` evita preenchimento redundante:

- nao limpa nem digita campos que ja possuem o valor esperado;
- nao reprocessa selects ja preenchidos;
- reduz waits fixos;
- usa esperas baseadas no estado da tela quando possivel;
- registra logs de massa e preenchimento para facilitar diagnostico.

## Comandos

Instalar dependencias:

```bash
npm install
```

Abrir Cypress:

```bash
npm run test:open
```

Executar stack principal:

```bash
npm test
```

Executar contratos:

```bash
npm run test:contrato
```

Executar CNPJ alfanumerico:

```bash
npm run test:cadastro:cnpj
```

Executar specs em mapeamento:

```bash
npm run test:alteracao:contrato
npm run test:aditivo:registro
npm run test:aditivo:alteracao
```

Executar contrato via webservice:

```bash
npm run test:ws:contrato
```

## Relatorios e Evidencias

Os relatorios locais do Mochawesome sao gerados em `cypress/reports` e nao devem ser versionados.

Screenshots e videos de falha tambem ficam fora do versionamento, conforme `.gitignore`.

## Manutencao

Para adicionar um novo DETRAN elegivel:

1. Incluir o DETRAN em `cypress/fixtures/detrans.json`.
2. Garantir que a UF correspondente exista em `cypress/support/massaDados.js`.
3. Rodar smoke com `npm test -- --env detran=DETRAN-UF`.
4. Rodar a regressao completa antes de promover a alteracao.

Para ignorar temporariamente um DETRAN:

1. Incluir o DETRAN em `cypress/fixtures/detransIgnorados.json`.
2. Informar o motivo na chave apropriada, por exemplo `webPki` ou `formularioIndisponivel`.

## Autor

Janderson Santos

QA Automation Engineer
