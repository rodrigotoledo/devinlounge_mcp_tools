import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '../../');
const gitFlowPath = path.join(projectRoot, 'GIT_FLOW.md');
function extractSection(content, section) {
    const sectionTitleByKey = {
        branches: 'branch',
        commits: 'commit',
        'pr-process': 'pr',
    };
    const keyword = sectionTitleByKey[section];
    if (!keyword) {
        return content;
    }
    const lines = content.split('\n');
    const filtered = lines.filter((line) => line.toLowerCase().includes(keyword) || line.startsWith('#'));
    return filtered.join('\n');
}
export async function getGitFlow(args) {
    const content = await fs.readFile(gitFlowPath, 'utf-8');
    const text = args.section === 'all' ? content : extractSection(content, args.section);
    return {
        content: [
            {
                type: 'text',
                text,
            },
        ],
    };
}
//# sourceMappingURL=git.js.map