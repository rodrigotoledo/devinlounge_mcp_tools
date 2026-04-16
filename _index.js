import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import fs from "fs/promises";

const server = new Server({
  name: "meu-config-manager",
  version: "1.0.0",
}, {
  capabilities: { tools: {} },
});

// 1. Lista as ferramentas que a IA terá disponível
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: "get_my_hook",
    description: "Busca um hook específico da minha pasta default_settings",
    inputSchema: {
      type: "object",
      properties: { name: { type: "string" } },
      required: ["name"],
    },
  }],
}));

// 2. Lógica de como a ferramenta funciona
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_my_hook") {
    const hookName = request.params.arguments.name;
    const content = await fs.readFile(`./hooks/${hookName}.ts`, "utf-8");
    return { content: [{ type: "text", text: content }] };
  }
});

// 3. Inicia o transporte via Standard Input/Output (comunicação com Cursor/Claude)
const transport = new StdioServerTransport();
await server.connect(transport);
