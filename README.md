# VB Auto E2E

![CI](https://github.com/n4cl23/vbauto.e2e/actions/workflows/cypress.yml/badge.svg)
![Node](https://img.shields.io/badge/node-22-green)
![Cypress](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)
![License](https://img.shields.io/badge/license-MIT-blue)

Automação de testes **End-to-End (E2E)** do sistema **VBConnection** utilizando Cypress.

---

# 🚀 Objetivo

Automatizar fluxos críticos da aplicação:

* Login
* Registro de contrato
* Execução do fluxo para múltiplos DETRANs
* Validação de comportamento da aplicação

---

# 🌐 Ambiente de Teste

```
https://hmg.vbconnection.info/
```

---

# 🧰 Tecnologias

| Tecnologia     | Uso                        |
| -------------- | -------------------------- |
| Cypress        | Automação E2E              |
| JavaScript     | Desenvolvimento dos testes |
| Node.js        | Runtime                    |
| GitHub Actions | Integração contínua        |

---

# 📁 Estrutura do projeto

```
vbauto.e2e
│
├─ cypress
│  │
│  ├─ actions
│  │   └─ contratoActions.js
│  │
│  ├─ pages
│  │   ├─ loginPage.js
│  │   └─ contratoPage.js
│  │
│  ├─ fixtures
│  │   ├─ loginData.json
│  │   └─ detrans.json
│  │
│  ├─ e2e
│  │   ├─ login.cy.js
│  │   └─ contrato.cy.js
│  │
│  └─ support
│      ├─ commands.js
│      └─ e2e.js
│
├─ cypress.config.js
├─ package.json
└─ README.md
```

---

# ⚙️ Instalação

Clone o repositório:

```
git clone https://github.com/n4cl23/vbauto.e2e.git
```

Entrar no diretório:

```
cd vbauto.e2e
```

Instalar dependências:

```
npm install
```

---

# ▶️ Executar testes

Abrir interface do Cypress:

```
npx cypress open
```

Executar testes em modo headless:

```
npx cypress run
```

---

# 🔐 Login automatizado

O projeto utiliza **session caching** do Cypress.

Fluxo:

Login
↓
Sessão salva
↓
Reutilização da sessão nos testes

Isso evita múltiplos logins e reduz o tempo de execução.

---

# 🧪 Estratégia de testes

Execução de fluxo para múltiplos DETRANs:

```
DETRAN-BA
DETRAN-SP
DETRAN-MG
DETRAN-RJ
DETRAN-RS
...
```

Cada DETRAN roda como **teste independente**.

---

# ⚡ Integração Contínua

Pipeline automático utilizando GitHub Actions.

Fluxo:

Push no repositório
↓
Instala dependências
↓
Executa testes Cypress
↓
Salva evidências (screenshots e vídeos)

Os resultados podem ser visualizados na aba **Actions** do repositório.

---

# 📊 Evidências de teste

Quando ocorre falha, o pipeline salva:

* screenshots
* vídeos de execução

Disponíveis nos **Artifacts** do pipeline.

---

# 📈 Melhorias futuras

* Execução paralela dos testes
* Relatórios HTML
* Dashboard de execução
* Ampliação da cobertura de testes

---

## 👨‍💻 Autor

**Janderson**

QA Automation Engineer  
Automação de testes E2E com Cypress

GitHub: https://github.com/n4cl23
