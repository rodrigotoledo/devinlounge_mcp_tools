export async function getCursorignore() {
    const content = `# Cursor Ignore Rules
# This file tells Cursor which files/folders to ignore for indexing and context

# Dependencies
node_modules/
.venv/
__pycache__/
venv/
env/
*.egg-info/
.bundle/

# Build outputs
dist/
build/
out/
*.o
*.a
*.so

# Environment
.env
.env.local
.env.*.local
.env.*.example

# Version control
.git/
.gitignore
.github/

# OS files
.DS_Store
Thumbs.db
*.swp
*.swo
*~

# IDE/Editor
.vscode/
.cursor/
.idea/
*.sublime-*
.vim/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
pids/

# Caches
.eslintcache
.stylelintcache
.cache/
tmp/
temp/

# Test coverage
coverage/
.nyc_output/

# Docker
.dockerignore
docker-compose.override.yml

# Rails specific
tmp/
log/
*.sqlite3
public/uploads/

# Python specific
.pytest_cache/
.mypy_cache/
.ruff_cache/
__pycache__/

# Node specific
package-lock.json.backup
yarn.lock.backup

# Large files
*.bin
*.iso
*.tar.gz
*.zip
`;
    return content;
}
//# sourceMappingURL=cursorignore.js.map