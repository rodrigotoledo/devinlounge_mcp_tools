import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

type ToolResponse = { content: Array<{ type: 'text'; text: string }> };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '../../');

const frameworkGuides: Record<string, string[]> = {
  rails: [
    'AGENTS.md',
    'CLAUDE.md',
    '.copilot/instructions.md',
    '.cursor/rules.md',
    'RAILS_SETUP_GUIDE.md',
    'TURBO_RAILS_PATTERNS.md',
  ],
  nestjs: ['CLAUDE.md', 'NESTJS_SETUP_GUIDE.md'],
  fastapi: ['CLAUDE.md'],
  phoenix: ['PHOENIX_ELIXIR_SETUP.md'],
  nextjs: ['CLAUDE.md', 'NEXTJS_SETUP_GUIDE.md', 'NPM_PACKAGES_GUIDE.md'],
  react: ['CLAUDE.md', 'NPM_PACKAGES_GUIDE.md'],
  expo: ['REACT_NATIVE_SETUP.md', 'NPM_PACKAGES_GUIDE.md'],
  all: [
    'AGENTS.md',
    'CLAUDE.md',
    '.copilot/instructions.md',
    '.cursor/rules.md',
    'RAILS_SETUP_GUIDE.md',
    'NEXTJS_SETUP_GUIDE.md',
    'NESTJS_SETUP_GUIDE.md',
    'REACT_NATIVE_SETUP.md',
    'PHOENIX_ELIXIR_SETUP.md',
  ],
};

export async function getFrameworkGuide(args: {
  framework: string;
}): Promise<ToolResponse> {
  const files = frameworkGuides[args.framework] ?? [];

  if (files.length === 0) {
    return {
      content: [
        {
          type: 'text',
          text: `Unknown framework: ${args.framework}`,
        },
      ],
    };
  }

  const guides: Record<string, string> = {};
  for (const file of files) {
    const filePath = path.join(projectRoot, file);
    try {
      guides[file] = await fs.readFile(filePath, 'utf-8');
    } catch {
      guides[file] = `[Could not read ${file}]`;
    }
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(guides, null, 2),
      },
    ],
  };
}
