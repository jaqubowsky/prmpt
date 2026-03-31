import fse from 'fs-extra';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, '../../templates');

const PATH_MAP = [
  { src: 'AGENTS.md', dest: 'AGENTS.md' },
  { src: 'SETUP_WITH_CLAUDE.md', dest: 'SETUP_WITH_CLAUDE.md' },
  { src: 'docs/ai/CONVENTIONS.md', dest: 'docs/ai/CONVENTIONS.md' },
  { src: 'docs/ai/PATTERNS.md', dest: 'docs/ai/PATTERNS.md' },
  { src: 'docs/ai/TESTING.md', dest: 'docs/ai/TESTING.md' },
  { src: 'docs/ai/ARCHITECTURE.md', dest: 'docs/ai/ARCHITECTURE.md' },
  { src: 'claude/settings.json', dest: '.claude/settings.json' },
  { src: 'claude/skills/project-setup/SKILL.md', dest: '.claude/skills/project-setup/SKILL.md' },
  { src: 'ai-workflow.json', dest: '.claude/ai-workflow.json' },
];

export async function copyTemplates(cwd, { projectName }) {
  const copied = [];

  for (const { src, dest } of PATH_MAP) {
    const srcPath = join(TEMPLATES_DIR, src);
    const destPath = join(cwd, dest);

    await fse.ensureDir(dirname(destPath));
    await fse.copy(srcPath, destPath);
    copied.push(dest);
  }

  // Inject project name into AGENTS.md
  if (projectName) {
    const agentsPath = join(cwd, 'AGENTS.md');
    let content = await fse.readFile(agentsPath, 'utf-8');
    content = content.replace('[PROJECT_NAME]', projectName);
    await fse.writeFile(agentsPath, content);
  }

  // Inject timestamp into ai-workflow.json
  const jsonPath = join(cwd, '.claude/ai-workflow.json');
  const meta = await fse.readJson(jsonPath);
  const now = new Date().toISOString();
  meta.installedAt = now;
  meta.updatedAt = now;
  await fse.writeJson(jsonPath, meta, { spaces: 2 });

  return copied;
}

export { PATH_MAP };
