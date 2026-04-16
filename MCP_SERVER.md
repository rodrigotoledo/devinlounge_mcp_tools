# MCP Server — default-settings-mcp

Este repositório funciona como um **MCP Server** (Model Context Protocol). Ele expõe toda a documentação, guias de configuração e padrões deste repo para qualquer editor ou projeto que conectar a ele.

**Resultado prático:** qualquer projeto seu que usar VS Code ou Cursor com este servidor configurado terá acesso a todos os guias, regras e configurações daqui — sem precisar copiar nada.

---

## O que este servidor expõe

**Tools (ferramentas que o AI pode chamar):**
- `get_documentation` — guias de setup, padrões Rails/Turbo, Redis, testes, linting
- `get_configuration` — arquivos de config (ESLint, Prettier, Docker, .env, VS Code)
- `get_framework_guide` — guia por framework: `rails`, `nestjs`, `fastapi`, `phoenix`, `nextjs`, `react`, `expo`
- `get_git_flow` — estratégia de branches, commits, PR
- `search_documentation` — busca livre em toda a documentação

**Resources (contexto que você pode anexar ao chat):**
- Todos os arquivos `.md` do projeto (CLAUDE.md, GIT_FLOW.md, RAILS_SETUP_GUIDE.md, etc.)

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

O AI (Copilot, Cursor, Claude) consulta tudo via MCP automaticamente quando precisar.

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
