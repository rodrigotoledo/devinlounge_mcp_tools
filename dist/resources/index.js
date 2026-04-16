import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.join(__dirname, '../../');
const availableResources = [
    {
        uri: 'doc://agents.md',
        name: 'AGENTS.md - Agent Instructions',
        description: 'Top-level instructions for AI agents, including Rails and Docker rules',
        mimeType: 'text/markdown',
    },
    {
        uri: 'doc://claude.md',
        name: 'CLAUDE.md - Core Project Rules',
        description: 'Complete project configuration, Docker rules, code style, and editor setup',
        mimeType: 'text/markdown',
    },
    {
        uri: 'doc://copilot-instructions.md',
        name: '.copilot/instructions.md - Copilot Rules',
        description: 'GitHub Copilot-specific rules and per-service guidance',
        mimeType: 'text/markdown',
    },
    {
        uri: 'doc://cursor-rules.md',
        name: '.cursor/rules.md - Cursor Rules',
        description: 'Cursor-specific coding and workflow rules',
        mimeType: 'text/markdown',
    },
    {
        uri: 'doc://git-flow.md',
        name: 'GIT_FLOW.md - Git Workflow',
        description: 'Branching strategy, commit conventions, and PR process',
        mimeType: 'text/markdown',
    },
    {
        uri: 'doc://quick-start.md',
        name: 'QUICK_START.md - 5-Minute Setup',
        description: 'Quick start guide for local development',
        mimeType: 'text/markdown',
    },
    {
        uri: 'doc://rails-setup.md',
        name: 'RAILS_SETUP_GUIDE.md',
        description: 'Rails 8 gems, RSpec, SimpleCov, RuboCop configuration',
        mimeType: 'text/markdown',
    },
    {
        uri: 'doc://nextjs-setup.md',
        name: 'NEXTJS_SETUP_GUIDE.md',
        description: 'Next.js App Router MVP setup with TanStack Query and forms baseline',
        mimeType: 'text/markdown',
    },
    {
        uri: 'doc://nestjs-setup.md',
        name: 'NESTJS_SETUP_GUIDE.md',
        description: 'NestJS modular MVP setup with validation, Swagger, and tests baseline',
        mimeType: 'text/markdown',
    },
    {
        uri: 'doc://react-native-setup.md',
        name: 'REACT_NATIVE_SETUP.md',
        description: 'Expo setup, NativeWind, package.json template',
        mimeType: 'text/markdown',
    },
    {
        uri: 'doc://phoenix-setup.md',
        name: 'PHOENIX_ELIXIR_SETUP.md',
        description: 'Phoenix/Elixir deps, Credo, ExUnit structure',
        mimeType: 'text/markdown',
    },
    {
        uri: 'doc://turbo-rails-patterns.md',
        name: 'TURBO_RAILS_PATTERNS.md',
        description: 'Critical Turbo Rails patterns and rules',
        mimeType: 'text/markdown',
    },
    {
        uri: 'doc://turbo-streams.md',
        name: 'TURBO_STREAMS_GUIDE.md',
        description: 'ActionCable channels, broadcasting, real-time updates',
        mimeType: 'text/markdown',
    },
    {
        uri: 'doc://turbo-frames.md',
        name: 'TURBO_FRAMES_GUIDE.md',
        description: 'Partial replacement, lazy loading, nested frames',
        mimeType: 'text/markdown',
    },
    {
        uri: 'doc://redis-config.md',
        name: 'REDIS_CONFIGURATION.md',
        description: 'Redis setup, docker-compose, Rails config',
        mimeType: 'text/markdown',
    },
    {
        uri: 'doc://linting.md',
        name: 'LINTING_AND_CODE_QUALITY.md',
        description: 'ESLint, RuboCop, Ruff, Credo configuration',
        mimeType: 'text/markdown',
    },
    {
        uri: 'doc://ruby-gems.md',
        name: 'RUBY_GEMS_STRATEGY.md',
        description: 'Comprehensive Ruby gem selection by use case',
        mimeType: 'text/markdown',
    },
    {
        uri: 'doc://npm-packages.md',
        name: 'NPM_PACKAGES_GUIDE.md',
        description: 'npm packages for Expo, Next.js, React with shared versions',
        mimeType: 'text/markdown',
    },
];
const fileMapping = {
    'doc://agents.md': 'AGENTS.md',
    'doc://claude.md': 'CLAUDE.md',
    'doc://copilot-instructions.md': '.copilot/instructions.md',
    'doc://cursor-rules.md': '.cursor/rules.md',
    'doc://git-flow.md': 'GIT_FLOW.md',
    'doc://quick-start.md': 'QUICK_START.md',
    'doc://rails-setup.md': 'RAILS_SETUP_GUIDE.md',
    'doc://nextjs-setup.md': 'NEXTJS_SETUP_GUIDE.md',
    'doc://nestjs-setup.md': 'NESTJS_SETUP_GUIDE.md',
    'doc://react-native-setup.md': 'REACT_NATIVE_SETUP.md',
    'doc://phoenix-setup.md': 'PHOENIX_ELIXIR_SETUP.md',
    'doc://turbo-rails-patterns.md': 'TURBO_RAILS_PATTERNS.md',
    'doc://turbo-streams.md': 'TURBO_STREAMS_GUIDE.md',
    'doc://turbo-frames.md': 'TURBO_FRAMES_GUIDE.md',
    'doc://redis-config.md': 'REDIS_CONFIGURATION.md',
    'doc://linting.md': 'LINTING_AND_CODE_QUALITY.md',
    'doc://ruby-gems.md': 'RUBY_GEMS_STRATEGY.md',
    'doc://npm-packages.md': 'NPM_PACKAGES_GUIDE.md',
};
export async function listResources() {
    return {
        resources: availableResources.map((r) => ({
            uri: r.uri,
            name: r.name,
            description: r.description,
            mimeType: r.mimeType,
        })),
    };
}
export async function readResource(request) {
    const uri = request.params.uri;
    const fileName = fileMapping[uri];
    if (!fileName) {
        throw new Error(`Unknown resource: ${uri}`);
    }
    try {
        const filePath = path.join(docsDir, fileName);
        const content = await fs.readFile(filePath, 'utf-8');
        return {
            uri,
            mimeType: 'text/markdown',
            text: content,
        };
    }
    catch (error) {
        throw new Error(`Failed to read resource ${uri}: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=index.js.map