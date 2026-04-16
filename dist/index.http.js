#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { CallToolRequestSchema, ListResourcesRequestSchema, ListToolsRequestSchema, ReadResourceRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import express from 'express';
import crypto from 'node:crypto';
import { listResources, readResource } from './resources/index.js';
import { callTool, listTools } from './tools/index.js';
const serverVersion = '1.0.0';
const serverName = 'default-settings-mcp';
// Armazena sessões ativas
const transports = {};
const app = express();
app.use(express.json());
const bearerToken = process.env.MCP_BEARER_TOKEN?.trim();
const authenticationEnabled = Boolean(bearerToken);
function safeEquals(left, right) {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);
    if (leftBuffer.length !== rightBuffer.length) {
        return false;
    }
    return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}
function isAuthorized(request) {
    if (!authenticationEnabled || !bearerToken) {
        return true;
    }
    const authorizationHeader = request.header('authorization');
    if (!authorizationHeader) {
        return false;
    }
    const [scheme, token] = authorizationHeader.split(' ');
    if (!scheme || !token || scheme.toLowerCase() !== 'bearer') {
        return false;
    }
    return safeEquals(token, bearerToken);
}
function requireBearerAuth(request, response, next) {
    if (isAuthorized(request)) {
        next();
        return;
    }
    response
        .status(401)
        .set('WWW-Authenticate', 'Bearer realm="default-settings-mcp"')
        .json({ error: 'Unauthorized' });
}
// Função para criar um novo servidor MCP com os handlers
function createMCPServer() {
    const server = new Server({
        name: serverName,
        version: serverVersion,
    }, {
        capabilities: {
            tools: {},
            resources: {},
        },
    });
    // Seus handlers (reaproveitados!)
    server.setRequestHandler(ListToolsRequestSchema, listTools);
    server.setRequestHandler(CallToolRequestSchema, callTool);
    server.setRequestHandler(ListResourcesRequestSchema, listResources);
    server.setRequestHandler(ReadResourceRequestSchema, readResource);
    return server;
}
// Endpoint SSE para conexão MCP
app.get('/mcp', async (req, res) => {
    requireBearerAuth(req, res, async () => {
        const server = createMCPServer();
        const transport = new SSEServerTransport('/messages', res);
        transports[transport.sessionId] = transport;
        res.on('close', () => {
            delete transports[transport.sessionId];
        });
        await server.connect(transport);
        console.error(`[${serverName}] New SSE connection: ${transport.sessionId}`);
    });
});
// Endpoint para mensagens POST
app.post('/messages', async (req, res) => {
    requireBearerAuth(req, res, async () => {
        const sessionId = req.query.sessionId;
        const transport = transports[sessionId];
        if (transport) {
            await transport.handlePostMessage(req, res);
        }
        else {
            res.status(404).json({ error: 'Session not found' });
        }
    });
});
// Endpoint de health check (opcional)
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        name: serverName,
        version: serverVersion,
        mode: 'http',
        activeSessions: Object.keys(transports).length
    });
});
// Inicia o servidor HTTP
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.error(`[${serverName}] HTTP server running on port ${PORT}`);
    console.error(`[${serverName}] MCP endpoint: http://localhost:${PORT}/mcp`);
    console.error(`[${serverName}] Health check: http://localhost:${PORT}/health`);
    console.error(`[${serverName}] Bearer auth: ${authenticationEnabled ? 'enabled' : 'disabled (set MCP_BEARER_TOKEN to enable)'}`);
});
//# sourceMappingURL=index.http.js.map