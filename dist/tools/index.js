import { getProjectBootstrap } from './bootstrap.js';
import { getConfiguration } from './configuration.js';
import { getCursorConfig, getCursorRules } from './cursor.js';
import { getCursorignore } from './cursorignore.js';
import { getDocumentation } from './documentation.js';
import { getFrameworkGuide } from './framework.js';
import { getGitFlow } from './git.js';
import { searchDocumentation } from './search.js';
import { getSixthConfig } from './sixth.js';
export async function listTools() {
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
                            description: 'Type of documentation: guides, rules, setup, patterns, redis, turbo, testing, linting, or all',
                            enum: ['guides', 'rules', 'setup', 'patterns', 'redis', 'turbo', 'testing', 'linting', 'all'],
                        },
                        fileName: {
                            type: 'string',
                            description: 'Optional: specific file name or relative markdown path (e.g., "RAILS_SETUP_GUIDE", "AGENTS.md", ".copilot/instructions.md")',
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
                name: 'get_project_bootstrap',
                description: 'Return the required scaffold workflow for a framework in this template, including default starter route/output and Docker inter-service networking conventions.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        framework: {
                            type: 'string',
                            description: 'Framework to scaffold with this template defaults',
                            enum: ['rails', 'nextjs', 'nestjs', 'fastapi', 'react', 'expo', 'phoenix'],
                        },
                        projectName: {
                            type: 'string',
                            description: 'Optional project/app name to use in the scaffold commands',
                        },
                        authentication: {
                            type: 'string',
                            description: 'Authentication approach (used for Rails bootstrap)',
                            enum: ['bcrypt', 'oauth'],
                        },
                        authorization: {
                            type: 'string',
                            description: 'Authorization library (used for Rails bootstrap)',
                            enum: ['cancancan', 'pundit'],
                        },
                        styling: {
                            type: 'string',
                            description: 'Rails styling strategy',
                            enum: ['tailwindcss-rails', 'simplecss'],
                        },
                        backgroundJobs: {
                            type: 'string',
                            description: 'Rails background jobs strategy',
                            enum: ['solid_queue', 'sidekiq', 'none'],
                        },
                        pagination: {
                            type: 'string',
                            description: 'Rails pagination gem strategy',
                            enum: ['pagy', 'kaminari', 'none'],
                        },
                        appShape: {
                            type: 'string',
                            description: 'Rails app shape to guide serialization and rendering choices',
                            enum: ['html-first', 'api-heavy'],
                        },
                        search: {
                            type: 'string',
                            description: 'Rails search/filtering strategy',
                            enum: ['ransack', 'pg_search', 'none'],
                        },
                        uploads: {
                            type: 'string',
                            description: 'Rails uploads strategy',
                            enum: ['active-storage', 'active-storage-image-processing', 'shrine', 'none'],
                        },
                        admin: {
                            type: 'string',
                            description: 'Rails admin/backoffice strategy',
                            enum: ['activeadmin', 'avo', 'none'],
                        },
                        auditing: {
                            type: 'string',
                            description: 'Rails auditing/versioning strategy',
                            enum: ['paper_trail', 'audited', 'none'],
                        },
                        multiTenancy: {
                            type: 'string',
                            description: 'Rails multi-tenancy strategy',
                            enum: ['acts_as_tenant', 'none'],
                        },
                    },
                    required: ['framework'],
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
            {
                name: 'get_cursor_config',
                description: 'Fetch Cursor editor configuration file (.cursor/config.json). Returns JSON configuration for Cursor AI.',
                inputSchema: {
                    type: 'object',
                    properties: {},
                    required: [],
                },
            },
            {
                name: 'get_cursor_rules',
                description: 'Fetch Cursor AI rules and guidelines (.cursor/rules.md). Returns markdown with coding standards.',
                inputSchema: {
                    type: 'object',
                    properties: {},
                    required: [],
                },
            },
            {
                name: 'get_cursorignore',
                description: 'Generate a standard .cursorignore file template to exclude files/folders from Cursor indexing.',
                inputSchema: {
                    type: 'object',
                    properties: {},
                    required: [],
                },
            },
            {
                name: 'get_sixth_config',
                description: 'Fetch Windsurf/Codeium Six configuration (.sixth/). Returns information about Six setup and skills.',
                inputSchema: {
                    type: 'object',
                    properties: {},
                    required: [],
                },
            },
        ],
    };
}
export async function callTool(request) {
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
            case 'get_project_bootstrap':
                return await getProjectBootstrap(args);
            case 'search_documentation':
                return await searchDocumentation(args);
            case 'get_cursor_config': {
                const content = await getCursorConfig();
                return {
                    content: [
                        {
                            type: 'text',
                            text: content,
                        },
                    ],
                };
            }
            case 'get_cursor_rules': {
                const content = await getCursorRules();
                return {
                    content: [
                        {
                            type: 'text',
                            text: content,
                        },
                    ],
                };
            }
            case 'get_cursorignore': {
                const content = await getCursorignore();
                return {
                    content: [
                        {
                            type: 'text',
                            text: content,
                        },
                    ],
                };
            }
            case 'get_sixth_config': {
                const content = await getSixthConfig();
                return {
                    content: [
                        {
                            type: 'text',
                            text: content,
                        },
                    ],
                };
            }
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
    }
    catch (error) {
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
//# sourceMappingURL=index.js.map