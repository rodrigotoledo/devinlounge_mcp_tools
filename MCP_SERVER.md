# MCP Server — default-settings-mcp

Este repositório funciona como um **MCP Server** (Model Context Protocol). Ele expõe toda a documentação, guias de configuração e padrões deste repo para qualquer editor ou projeto que conectar a ele.

**Resultado prático:** qualquer projeto seu que usar VS Code ou Cursor com este servidor configurado terá acesso aos guias, regras e configurações daqui — sem precisar copiar tudo manualmente.

**Importante:** o MCP **não altera automaticamente** o comportamento nativo do `rails new`, `npm create`, ou outros geradores. Ele expõe contexto e regras para o agente consultar. Então, se um projeto Rails foi criado com `rails new` normal, o Rails vai gerar Minitest por padrão. Para evitar isso, o agente precisa criar com `--skip-test` e depois instalar `rspec-rails` + `simplecov`.

---

## O que este servidor expõe

**Tools (ferramentas que o AI pode chamar):**
- `get_documentation` — guias de setup, padrões Rails/Turbo, Redis, testes, linting
- `get_configuration` — arquivos de config (ESLint, Prettier, Docker, .env, VS Code)
- `get_framework_guide` — guia por framework: `rails`, `nestjs`, `fastapi`, `phoenix`, `nextjs`, `react`, `expo`
- `get_project_bootstrap` — fluxo curto de scaffold por framework (`rails`, `nextjs`, `nestjs`, `fastapi`, `react`, `expo`, `phoenix`) usando os defaults deste template
- `get_git_flow` — estratégia de branches, commits, PR
- `search_documentation` — busca livre em toda a documentação

**Resources (contexto que você pode anexar ao chat):**
- Regras centrais (`AGENTS.md`, `CLAUDE.md`, `.copilot/instructions.md`, `.cursor/rules.md`)
- Guias principais do projeto (RAILS_SETUP_GUIDE.md, GIT_FLOW.md, QUICK_START.md, etc.)

---

## Pré-requisitos

- Node.js >= 18
- Repositório clonado em `/Users/rodrigotoledo/www/default_settings`

---

## Iniciar / Parar

### Modo normal (produção)
O servidor **não precisa ser iniciado manualmente**. O VS Code e o Cursor gerenciam o processo automaticamente quando você abre qualquer projeto.

### Para testar se está funcionando
```bash
cd /Users/rodrigotoledo/www/default_settings
npm run build && node dist/index.js
# Esperado: [default-settings-mcp] Connected and ready
# Ctrl+C para sair
```

### Modo desenvolvimento (hot-reload ao salvar)
```bash
cd /Users/rodrigotoledo/www/default_settings
npm run dev
```

### Após alterar o código-fonte
```bash
npm run build
```
O editor reinicia o servidor automaticamente na próxima interação.

---

## Configuração global (uma vez só, já feita)

### VS Code
Arquivo: `~/Library/Application Support/Code/User/mcp.json`

```json
{
  "servers": {
    "default-settings-mcp": {
      "type": "stdio",
      "command": "node",
      "args": ["/Users/rodrigotoledo/www/default_settings/dist/index.js"],
      "cwd": "/Users/rodrigotoledo/www/default_settings"
    }
  }
}
```

### Cursor
Arquivo: `~/.cursor/mcp.json`

```json
{
  "mcpServers": {
    "default-settings-mcp": {
      "command": "node",
      "args": ["/Users/rodrigotoledo/www/default_settings/dist/index.js"],
      "cwd": "/Users/rodrigotoledo/www/default_settings"
    }
  }
}
```

> Para abrir via UI no VS Code: `⇧⌘P` → `MCP: Open User Configuration`
> Para abrir via UI no Cursor: `Settings` → `MCP`

---

## O que os projetos que usam este servidor NÃO precisam ter

Toda configuração que está neste repositório fica centralizada aqui. Os seus outros projetos **não precisam** de cópias de:

- `CLAUDE.md` — regras de Docker, estilo de código, stack
- `.cursor/rules/` — regras do Cursor
- `AGENTS.md` — instruções para agentes AI
- `GIT_FLOW.md`, `RAILS_SETUP_GUIDE.md`, `LINTING_AND_CODE_QUALITY.md`, etc.
- Qualquer outro arquivo `.md` de documentação deste repo

O AI pode consultar isso via MCP quando precisar, mas a qualidade do resultado depende de o cliente/agente realmente chamar os tools/resources corretos durante a tarefa. O caminho mais seguro ao pedir criação de projeto é o agente usar `get_project_bootstrap` com o framework desejado antes de scaffolding.

---

## Verificar se o servidor está ativo no VS Code

1. `⇧⌘P` → `MCP: List Servers`
2. O servidor `default-settings-mcp` deve aparecer com status **Running**
3. Se aparecer parado: selecione → `Restart Server`

## Verificar se o servidor está ativo no Cursor

1. `Settings` → `MCP`
2. O servidor deve aparecer com status verde (connected)
3. Se aparecer vermelho: clique em `Refresh` ou reinicie o Cursor

---

## Troubleshooting

| Problema | Solução |
|---|---|
| Servidor não aparece | Rode `npm run build` e reinicie o editor |
| Tools não aparecem no chat | `MCP: Restart Server` no VS Code ou `Refresh` no Cursor |
| Erro ao carregar um documento | O arquivo `.md` referenciado pode não existir mais — verifique `src/resources/index.ts` |
| Mudou o path do repositório | Atualize `args` nos dois `mcp.json` globais com o novo caminho absoluto |
