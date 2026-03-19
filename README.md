# CMFlex ERP Agent

Automação do ERP **CMFlex / TotalFlex** via [Playwright](https://playwright.dev/). O projeto realiza duas funções principais:

1. **Warmup diário** — abre todos os módulos do sistema para forçar o carregamento do cache do servidor antes do horário de expediente.
2. **Validação de módulos** — verifica que cada módulo está acessível e funcionando corretamente.

---

## Índice

- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Módulos Cobertos](#módulos-cobertos)
- [Arquitetura](#arquitetura)
- [Agendamento Automático](#agendamento-automático)
- [Segurança](#segurança)
- [Resolução de Problemas](#resolução-de-problemas)

---

## Requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- Acesso ao CMFlex com usuário e senha válidos
- Conexão de rede com o servidor CMFlex

---

## Instalação

```bash
# 1. Clone ou extraia o projeto
cd cmflex-erp-agent

# 2. Instale as dependências Node.js
npm install

# 3. Instale o browser Chromium do Playwright
npx playwright install chromium
```

---

## Configuração

Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp .env.example .env
```

Edite o `.env`:

```env
# URL base do CMFlex (sem barra no final)
CMFLEX_URL=https://seu-dominio.cmerp.com.br

# Credenciais de acesso
CMFLEX_USER=seu_usuario
CMFLEX_PASS=sua_senha

# ID da empresa padrão a selecionar após o login
# (valor do <option> no select de empresas — ver tela de seleção)
CMFLEX_EMPRESA_ID=1

# Nome da empresa para o teste de troca de empresa (opcional)
CMFLEX_EMPRESA_ALVO=CARMEL TAÍBA
```

> ⚠️ O arquivo `.env` nunca deve ser commitado. Ele já está no `.gitignore`.

---

## Uso

### Autenticação

Antes de qualquer execução, garanta que a sessão está ativa:

```bash
npm run test:setup
```

Isso abre o browser, realiza login com as credenciais do `.env`, seleciona a empresa padrão e salva a sessão em `auth/session.json`. **Execute novamente quando a sessão expirar** (geralmente ao início de cada dia).

---

### Warmup diário

Abre todos os 10 módulos em sequência, forçando o servidor a carregar o cache:

```bash
npm run warmup
```

Saída esperada:

```
✅ Almoxarifado e Custos     5.3s
✅ Compras                   4.0s
✅ Contas a Pagar            3.1s
✅ Contas a Receber          2.9s
✅ Controle Financeiro       3.4s
✅ Contabilidade             2.8s
✅ Integra Front Office     20.7s
✅ Global                    4.0s
✅ Contratos                 2.8s
✅ Governança                2.7s

  Total: 10 módulos | OK: 10 | Falhas: 0
```

Para acompanhar visualmente com o browser aberto:

```bash
npm run warmup:headed
```

---

### Validação de módulos

Executa os testes individuais de cada módulo (verifica acesso e captura evidência):

```bash
npm test
```

Módulo específico:

```bash
npx playwright test tests/modules/compras.spec.ts --project=cmflex
```

---

### Relatório HTML

Após qualquer execução, visualize o relatório completo:

```bash
npx playwright show-report
```

---

## Estrutura do Projeto

```
cmflex-erp-agent/
│
├── .env                        # Credenciais locais (não versionar)
├── .env.example                # Template de configuração
├── .gitignore
├── package.json
├── playwright.config.ts        # Configuração global do Playwright
│
├── tests/
│   ├── auth.setup.ts           # Setup de autenticação (login + seleção de empresa)
│   ├── warmup.spec.ts          # Warmup diário de todos os módulos
│   ├── troca-empresa.spec.ts   # Teste de troca de empresa
│   │
│   ├── helpers/
│   │   ├── evidence.ts         # saveEvidence() — captura screenshots com timestamp
│   │   └── navigation.ts       # abrirModulo() + trocarEmpresa() — URLs e navegação
│   │
│   └── modules/                # Specs de validação por módulo
│       ├── almoxarifado.spec.ts
│       ├── compras.spec.ts
│       ├── contas-a-pagar.spec.ts
│       ├── contas-a-receber.spec.ts
│       ├── controle-financeiro.spec.ts
│       ├── contabilidade.spec.ts
│       ├── integra-back-office.spec.ts
│       ├── global.spec.ts
│       └── contratos-governanca.spec.ts
│
├── auth/
│   └── session.json            # Sessão autenticada (não versionar)
│
└── evidencias/                 # Screenshots geradas (não versionar)
    └── YYYYMMDD_HHMMSS_*.png
```

---

## Módulos Cobertos

| Módulo | URL | Descrição |
|---|---|---|
| Almoxarifado e Custos | `/Almoxarifado` | Gestão de estoque e custos |
| Compras | `/Compras` | Ordens de compra e fornecedores |
| Contas a Pagar | `/ContasAPagar` | Gestão de obrigações financeiras |
| Contas a Receber | `/ContasAReceber` | Gestão de recebimentos |
| Controle Financeiro | `/ControleFinanceiro` | Conciliação e fluxo de caixa |
| Contabilidade | `/Contabilidade` | Lançamentos e relatórios contábeis |
| Integra Front Office | `/IntegraFrontOffice` | Integração com front-office |
| Global | `/Global` | Configurações e parâmetros globais |
| Contratos | `/Contrato` | Gestão de contratos |
| Governança | `/Governanca` | Governança corporativa |

---

## Arquitetura

### Fluxo de autenticação

O CMFlex possui um fluxo de login em duas etapas:

```
1. Acessar CMFLEX_URL
      ↓
2. Preencher usuário e senha → clicar "Entrar"
      ↓
3. Selecionar empresa no dropdown (#idEmpresaSelecionada) → clicar "Logar"
      ↓
4. Sessão salva em auth/session.json (reutilizada nos demais testes)
```

### Estratégia de navegação

Todos os módulos são acessados via **URL direta** (ex: `https://dominio/Compras`). Isso é mais rápido e estável do que navegar pelos menus visuais.

O helper `abrirModulo()` ([tests/helpers/navigation.ts](tests/helpers/navigation.ts)) centraliza essa lógica:

```typescript
await abrirModulo(page, 'compras');
// equivale a: page.goto('/Compras', { waitUntil: 'domcontentloaded' })
```

### Evidências

Toda navegação gera screenshots em `evidencias/` com timestamp:

```
evidencias/20260319_165200_compras-carregado.png
```

---

## Agendamento Automático

Para executar o warmup automaticamente toda manhã no Windows:

### Windows Task Scheduler

1. Abra o **Agendador de Tarefas** (`taskschd.msc`)
2. Crie uma nova tarefa básica:
   - **Gatilho:** Diário, horário desejado (ex: 07:00)
   - **Ação:** Iniciar um programa
   - **Programa:** `cmd.exe`
   - **Argumentos:**
     ```
     /c "cd /d C:\Users\jadso\Projetos\cmflex-erp-agent && npm run test:setup && npm run warmup"
     ```
3. Marque "Executar estando o usuário conectado ou não"

### Verificação

Após a primeira execução agendada, confira as evidências em `evidencias/` e o relatório HTML:

```bash
npx playwright show-report
```

---

## Segurança

| Regra | Detalhe |
|---|---|
| Credenciais | Armazenadas apenas no `.env` local, nunca commitadas |
| Sessão | `auth/session.json` no `.gitignore` |
| Evidências | Screenshots não contêm senhas ou dados sensíveis |
| Ações destrutivas | Nenhuma — todos os scripts são somente leitura/navegação |

---

## Resolução de Problemas

### Sessão expirada

**Sintoma:** Testes redirecionam para a tela de login.

**Solução:**
```bash
npm run test:setup
```

---

### Timeout em módulos pesados

**Sintoma:** `TimeoutError: page.goto timeout exceeded`

**Causa:** Alguns módulos (ex: Integra Front Office) demoram mais para inicializar após limpeza de cache.

**Solução:** O warmup já lida com isso automaticamente via `catch` de erros de navegação. Para os testes de módulos, aumente o `timeout` em [playwright.config.ts](playwright.config.ts):

```typescript
timeout: 120000, // aumentar para 180000 se necessário
```

---

### Empresa não selecionada

**Sintoma:** Após o login, a seleção de empresa falha ou seleciona a errada.

**Solução:** Verifique o `CMFLEX_EMPRESA_ID` no `.env`. O ID correto é o `value` do `<option>` no select da tela de seleção de empresa.

---

### Browser não fecha / trava na pausa

**Sintoma:** O test discovery fica travado aguardando o Playwright Inspector.

**Solução:** Feche a janela do browser ou clique em "Resume" no Playwright Inspector.
