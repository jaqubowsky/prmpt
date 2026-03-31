import { existsSync } from 'node:fs';
import fse from 'fs-extra';
import { join } from 'node:path';

export async function detectProject(cwd) {
  const result = {
    hasGit: existsSync(join(cwd, '.git')),
    hasPackageJson: existsSync(join(cwd, 'package.json')),
    hasAgentsMd: existsSync(join(cwd, 'AGENTS.md')),
    hasClaude: existsSync(join(cwd, '.claude')),
    projectName: null,
  };

  if (result.hasPackageJson) {
    try {
      const pkg = await fse.readJson(join(cwd, 'package.json'));
      result.projectName = pkg.name || null;
    } catch {
      // malformed package.json - ignore
    }
  }

  return result;
}
