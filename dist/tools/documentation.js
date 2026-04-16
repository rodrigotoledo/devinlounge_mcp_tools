import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.join(__dirname, '../../');
const docCategories = {
    guides: [
        'AGENTS.md',
        'CLAUDE.md',
        'RAILS_SETUP_GUIDE.md',
        'NEXTJS_SETUP_GUIDE.md',
        'NESTJS_SETUP_GUIDE.md',
        'REACT_NATIVE_SETUP.md',
        'PHOENIX_ELIXIR_SETUP.md',
        'QUICK_START.md',
    ],
    rules: ['AGENTS.md', 'CLAUDE.md', '.copilot/instructions.md', '.cursor/rules.md'],
    setup: [
        'PROJECT_SETUP_CHECKLIST.md',
        'IMPLEMENTATION_CHECKLIST.md',
        'DOCKER_COMPOSE_TEMPLATE.md',
    ],
    patterns: [
        'TURBO_RAILS_PATTERNS.md',
        'TURBO_FRAMES_GUIDE.md',
        'TURBO_STREAMS_GUIDE.md',
        'TURBO_REDIS_INTEGRATION.md',
        'TESTING_TURBO_ACTIONCABLE.md',
    ],
    redis: ['REDIS_CONFIGURATION.md'],
    turbo: [
        'TURBO_RAILS_PATTERNS.md',
        'TURBO_FRAMES_GUIDE.md',
        'TURBO_STREAMS_GUIDE.md',
        'TURBO_REDIS_INTEGRATION.md',
    ],
    testing: ['TESTING_TURBO_ACTIONCABLE.md'],
    linting: ['LINTING_AND_CODE_QUALITY.md', 'RUBY_EDITOR_SETTINGS.md', 'PYTHON_EDITOR_SETTINGS.md'],
};
export async function getDocumentation(args) {
    const { docType, fileName } = args;
    try {
        if (fileName) {
            const normalizedFileName = fileName.endsWith('.md') ? fileName : `${fileName}.md`;
            const filePath = path.join(docsDir, normalizedFileName);
            const content = await fs.readFile(filePath, 'utf-8');
            return {
                content: [
                    {
                        type: 'text',
                        text: content,
                    },
                ],
            };
        }
        if (docType === 'all') {
            const allDocs = {};
            const allFiles = Object.values(docCategories).flat();
            for (const file of allFiles) {
                try {
                    const filePath = path.join(docsDir, file);
                    allDocs[file] = await fs.readFile(filePath, 'utf-8');
                }
                catch {
                    allDocs[file] = `[Could not read ${file}]`;
                }
            }
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(allDocs, null, 2),
                    },
                ],
            };
        }
        const files = docCategories[docType] || [];
        if (files.length === 0) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Unknown documentation type: ${docType}`,
                    },
                ],
            };
        }
        const docs = {};
        for (const file of files) {
            try {
                const filePath = path.join(docsDir, file);
                docs[file] = await fs.readFile(filePath, 'utf-8');
            }
            catch {
                docs[file] = `[Could not read ${file}]`;
            }
        }
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(docs, null, 2),
                },
            ],
        };
    }
    catch (error) {
        throw new Error(`Failed to get documentation: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=documentation.js.map