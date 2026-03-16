README.md
# VB Auto E2E

Automação de testes end-to-end do sistema **VBConnection** utilizando Cypress.

## 📌 Tecnologias

- Cypress
- JavaScript
- Node.js
- GitHub Actions (CI)

---

## 🚀 Objetivo do projeto

Automatizar os fluxos críticos do sistema **VBConnection**, incluindo:

- Login
- Registro de contrato
- Execução do fluxo para múltiplos DETRANs
- Validação de navegação e comportamento da aplicação

---

## 🌐 Ambiente de teste


https://hmg.vbconnection.info/


---

## 📂 Estrutura do projeto


vbauto.e2e
│
├─ cypress
│ │
│ ├─ actions
│ │ └─ contratoActions.js
│ │
│ ├─ pages
│ │ ├─ loginPage.js
│ │ └─ contratoPage.js
│ │
│ ├─ fixtures
│ │ ├─ loginData.json
│ │ └─ detrans.json
│ │
│ ├─ e2e
│ │ ├─ login.cy.js
│ │ └─ contrato.cy.js
│ │
│ └─ support
│ ├─ commands.js
│ └─ e2e.js
│
├─ cypress.config.js
├─ package.json
└─ README.md


---

## ⚙️ Instalação

Clone o repositório:

```bash
git clone https://github.com/n4cl23/vbauto.e2e.git

Entre na pasta do projeto:

cd vbauto.e2e

Instale as dependências:

npm install
▶️ Executar testes

Abrir interface do Cypress:

npx cypress open

Executar testes em modo headless:

npx cypress run
🔐 Login automatizado

O projeto utiliza session caching do Cypress para evitar login repetido durante os testes.

Fluxo:

Login
↓
Sessão salva
↓
Reutilização nos testes seguintes

Isso melhora significativamente a performance da suíte.

🧪 Estratégia de testes

Os testes são executados para múltiplos DETRANs.

Exemplo:

DETRAN-BA
DETRAN-SP
DETRAN-MG
DETRAN-RJ
...

Cada DETRAN roda como um teste independente.

⚡ Integração Contínua

O projeto utiliza GitHub Actions para execução automática dos testes.

Pipeline executa:

Push no repositório
↓
Instala dependências
↓
Executa testes Cypress
↓
Salva vídeos e screenshots

Resultados podem ser visualizados na aba:

Actions

do repositório.

📊 Evidências de teste

Em caso de falha, o pipeline salva:

Screenshots

Vídeos da execução

Disponíveis como Artifacts no GitHub Actions.

📈 Melhorias futuras

Execução paralela dos testes

Relatórios de execução

Integração com dashboards de QA

Ampliação da cobertura de testes