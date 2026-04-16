import fs from 'fs';
import path from 'path';
const projectRoot = process.cwd();
export async function getCursorConfig() {
    const configPath = path.join(projectRoot, '.cursor', 'config.json');
    const content = fs.readFileSync(configPath, 'utf-8');
    return content;
}
export async function getCursorRules() {
    const rulesPath = path.join(projectRoot, '.cursor', 'rules.md');
    const content = fs.readFileSync(rulesPath, 'utf-8');
    return content;
}
//# sourceMappingURL=cursor.js.map