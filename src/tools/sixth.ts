import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();

export async function getSixthConfig(): Promise<string> {
  const sixthPath = path.join(projectRoot, '.sixth');

  if (!fs.existsSync(sixthPath)) {
    return JSON.stringify(
      {
        error: '.sixth configuration not found in this project',
        message: 'Create .sixth/ directory with your Windsurf/Codeium Six configuration',
      },
      null,
      2
    );
  }

  const skillsPath = path.join(sixthPath, 'skills');

  let result: Record<string, unknown> = {
    location: '.sixth/',
    note: 'Windsurf/Codeium Six configuration directory',
  };

  if (fs.existsSync(skillsPath)) {
    const skills = fs
      .readdirSync(skillsPath)
      .filter((file) => !file.startsWith('.'))
      .map((file) => ({
        name: file,
        path: `${skillsPath}/${file}`,
      }));

    result.skills = skills;
  }

  return JSON.stringify(result, null, 2);
}
