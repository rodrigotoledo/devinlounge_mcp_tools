import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '../../');
const configurationByType = {
    linting: ['.eslintrc.json', 'LINTING_AND_CODE_QUALITY.md'],
    formatting: ['.prettierrc', '.prettierignore', 'LINTING_AND_CODE_QUALITY.md'],
    docker: ['docker-compose.yml', 'DOCKER_COMPOSE_TEMPLATE.md'],
    environment: ['.env.example', 'scripts/sync-env-from-example.sh'],
    vscode: ['.vscode/settings.json', '.vscode/extensions.json', 'EDITOR_SETTINGS_REVIEW.md'],
};
export async function getConfiguration(args) {
    const { configType, fileName } = args;
    const files = fileName
        ? [fileName]
        : configurationByType[configType] ?? [];
    if (files.length === 0) {
        return {
            content: [
                {
                    type: 'text',
                    text: `Unknown configuration type: ${configType}`,
                },
            ],
        };
    }
    const collected = {};
    for (const file of files) {
        const filePath = path.join(projectRoot, file);
        try {
            collected[file] = await fs.readFile(filePath, 'utf-8');
        }
        catch {
            collected[file] = `[Could not read ${file}]`;
        }
    }
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify(collected, null, 2),
            },
        ],
    };
}
//# sourceMappingURL=configuration.js.map