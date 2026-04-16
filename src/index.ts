#!/usr/bin/env node

// Decide qual modo rodar baseado no ambiente
const mode = process.env.MCP_MODE || process.env.NODE_ENV === 'production' ? 'http' : 'stdio';

if (mode === 'http') {
  console.error('Starting MCP server in HTTP mode (remote)');
  await import('./index.http.js');
} else {
  console.error('Starting MCP server in stdio mode (local)');
  await import('./index.stdio.js');
}
