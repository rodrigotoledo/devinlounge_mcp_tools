import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { getConfiguration } from './configuration.js';
import { getDocumentation } from './documentation.js';
import { getFrameworkGuide } from './framework.js';
import { getGitFlow } from './git.js';
import { searchDocumentation } from './search.js';

export async function listTools(): Promise<{ tools: Tool[] }> {
  return {
    tools: [
      {
        name: 'get_documentation',
        description: 'Fetch project documentation files (guides, setup instructions, patterns). Returns markdown content.',
        inputSchema: {
          type: 'object',
          properties: {
            docType: {
              type: 'string',
              description: 'Type of documentation: guides, setup, patterns, redis, turbo, testing, linting, or all',
              enum: ['guides', 'setup', 'patterns', 'redis', 'turbo', 'testing', 'linting', 'all'],
            },
            fileName: {
              type: 'string',
              description: 'Optional: specific file name without extension (e.g., "RAILS_SETUP_GUIDE", "TURBO_STREAMS_GUIDE")',
            },
          },
          required: ['docType'],
        },
      },
      {
        name: 'get_configuration',
        description: 'Fetch project configuration files (ESLint, Prettier, RuboCop, docker-compose, .env, etc.)',
        inputSchema: {
          type: 'object',
          properties: {
            configType: {
              type: 'string',
              description: 'Type of configuration: linting, formatting, docker, environment, or vscode',
              enum: ['linting', 'formatting', 'docker', 'environment', 'vscode'],
            },
            fileName: {
              type: 'string',
              description: 'Optional: specific config file name (e.g., ".eslintrc.json", ".rubocop.yml", ".env.example")',
            },
          },
          required: ['configType'],
        },
      },
      {
        name: 'get_framework_guide',
        description: 'Get framework-specific setup guides and best practices.',
        inputSchema: {
          type: 'object',
          properties: {
            framework: {
              type: 'string',
              description: 'Framework to get guide for',
              enum: [
                'rails',
                'nestjs',
                'fastapi',
                'phoenix',
                'nextjs',
                'react',
                'expo',
                'all',
              ],
            },
          },
          required: ['framework'],
        },
      },
      {
        name: 'get_git_flow',
        description: 'Get Git workflow, branching strategy, and commit conventions for this project.',
        inputSchema: {
          type: 'object',
          properties: {
            section: {
              type: 'string',
              description: 'Section of Git Flow guide: branches, commits, pr-process, or all',
              enum: ['branches', 'commits', 'pr-process', 'all'],
            },
          },
          required: ['section'],
        },
      },
      {
        name: 'search_documentation',
        description: 'Search across project documentation for specific topics or patterns.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search term (e.g., "Docker", "Turbo Streams", "RuboCop", "Sidekiq")',
            },
            maxResults: {
              type: 'number',
              description: 'Maximum number of results to return (default: 5, max: 20)',
            },
          },
          required: ['query'],
        },
      },
    ],
  };
}

export async function callTool(
  request: any
): Promise<{ content: any; isError?: boolean }> {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_documentation':
        return await getDocumentation(args);
      case 'get_configuration':
        return await getConfiguration(args);
      case 'get_framework_guide':
        return await getFrameworkGuide(args);
      case 'get_git_flow':
        return await getGitFlow(args);
      case 'search_documentation':
        return await searchDocumentation(args);
      default:
        return {
          content: [
            {
              type: 'text',
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: `Error executing tool ${name}: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
}
