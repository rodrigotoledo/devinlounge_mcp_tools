import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '../../');
const alwaysIncludedFiles = ['AGENTS.md', 'CLAUDE.md', '.copilot/instructions.md', '.cursor/rules.md'];
export async function searchDocumentation(args) {
    const normalizedQuery = args.query.trim().toLowerCase();
    const maxResults = Math.min(Math.max(args.maxResults ?? 5, 1), 20);
    if (!normalizedQuery) {
        return {
            content: [
                {
                    type: 'text',
                    text: 'Query cannot be empty.',
                },
            ],
        };
    }
    const files = await fs.readdir(projectRoot);
    const markdownFiles = Array.from(new Set([...files.filter((file) => file.endsWith('.md')), ...alwaysIncludedFiles]));
    const matches = [];
    for (const file of markdownFiles) {
        const filePath = path.join(projectRoot, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const lines = content.split('\n');
        lines.forEach((line, index) => {
            if (line.toLowerCase().includes(normalizedQuery)) {
                matches.push({
                    file,
                    lineNumber: index + 1,
                    line: line.trim(),
                });
            }
        });
    }
    const limited = matches.slice(0, maxResults);
    if (limited.length === 0) {
        return {
            content: [
                {
                    type: 'text',
                    text: `No results found for "${args.query}".`,
                },
            ],
        };
    }
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify(limited, null, 2),
            },
        ],
    };
}
//# sourceMappingURL=search.js.map