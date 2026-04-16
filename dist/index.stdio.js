#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListResourcesRequestSchema, ListToolsRequestSchema, ReadResourceRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { listResources, readResource } from './resources/index.js';
import { callTool, listTools } from './tools/index.js';
const serverVersion = '1.0.0';
const serverName = 'default-settings-mcp';
const server = new Server({
    name: serverName,
    version: serverVersion,
}, {
    capabilities: {
        tools: {},
        resources: {},
    },
});
// Seus handlers (já existentes)
server.setRequestHandler(ListToolsRequestSchema, listTools);
server.setRequestHandler(CallToolRequestSchema, callTool);
server.setRequestHandler(ListResourcesRequestSchema, listResources);
server.setRequestHandler(ReadResourceRequestSchema, readResource);
// Conexão via stdio (modo local)
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error(`[${serverName}] Connected and ready (stdio mode)`);
}
main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Fatal error:', message);
    process.exit(1);
});
//# sourceMappingURL=index.stdio.js.map