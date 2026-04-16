#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { listResources, readResource } from './resources/index.js';
import { callTool, listTools } from './tools/index.js';

declare const console: {
  error: (...args: string[]) => void;
};
declare const process: {
  exit: (code: number) => void;
};

const serverVersion = '1.0.0';
const serverName = 'default-settings-mcp';

const server = new Server(
  {
    name: serverName,
    version: serverVersion,
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, listTools);

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, callTool);

// Handle resource listing
server.setRequestHandler(ListResourcesRequestSchema, listResources);

// Handle resource reading
server.setRequestHandler(ReadResourceRequestSchema, readResource);

// Connect via stdio
async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`[${serverName}] Connected and ready`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error('Fatal error:', message);
  process.exit(1);
});
