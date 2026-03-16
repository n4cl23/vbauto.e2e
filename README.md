# VB Auto E2E

![Cypress Tests](https://github.com/n4cl23/vbauto.e2e/actions/workflows/cypress.yml/badge.svg)

Automação de testes **End-to-End (E2E)** do sistema **VBConnection** utilizando Cypress.

---

# 🚀 Objetivo

Automatizar fluxos críticos do sistema VBConnection:

* Login
* Registro de contrato
* Execução para múltiplos DETRANs
* Validação de navegação e comportamento da aplicação

---

# 🌐 Ambiente de Teste

https://hmg.vbconnection.info/

---

# 🧰 Stack Tecnológica

| Tecnologia     | Uso                  |
| -------------- | -------------------- |
| Cypress        | Automação E2E        |
| JavaScript     | Linguagem dos testes |
| Node.js        | Runtime              |
| GitHub Actions | Integração contínua  |

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

```bash
git clone https://github.com/n4cl23/vbauto.e2e.git
```

Entrar no diretório do projeto:

```bash
cd vbauto.e2e
```

Instalar dependências:

```bash
npm install
```

---

# ▶️ Executar testes

Abrir interface do Cypress:

```bash
npx cypress open
```

Executar testes em modo headless:

```bash
npx cypress run
```

---

# 🔐 Login automatizado

O projeto utiliza **session caching** do Cypress para evitar múltiplos logins durante a execução da suíte.

Fluxo:

```
Login
↓
Sessão salva
↓
Reutilização da sessão nos testes
```

Isso reduz significativamente o tempo de execução.

---

# 🧪 Estratégia de testes

Os testes são executados para múltiplos **DETRANs**.

Exemplo:

```
DETRAN-BA
DETRAN-SP
DETRAN-MG
DETRAN-RJ
DETRAN-RS
...
```

Cada DETRAN executa como **teste independente**.

---

# ⚡ Integração Contínua

O projeto utiliza **GitHub Actions** para execução automática dos testes.

Pipeline executa:

```
Push no repositório
↓
Instala dependências
↓
Executa testes Cypress
↓
Salva vídeos e screenshots
```

Resultados disponíveis na aba **Actions** do repositório.

---

# 📊 Evidências de teste

Quando ocorre falha, o pipeline salva:

* screenshots
* vídeos da execução

Disponíveis como **Artifacts** no GitHub Actions.

---

# 📈 Melhorias futuras

* Execução paralela dos testes
* Relatórios de execução
* Dashboard de qualidade
* Ampliação da cobertura de testes

---

# 👨‍💻 Autor

Projeto de automação E2E para o sistema VBConnection.
