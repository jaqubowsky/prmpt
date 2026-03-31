import chalk from 'chalk';
import fse from 'fs-extra';
import { createInterface } from 'node:readline';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PATH_MAP } from '../utils/copy-templates.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, '../../templates');

const ALWAYS_UPDATE = [
  '.claude/skills/project-setup/SKILL.md',
  '.claude/ai-workflow.json',
];

const NEVER_AUTO_UPDATE = [
  'AGENTS.md',
  'docs/ai/CONVENTIONS.md',
  'docs/ai/PATTERNS.md',
  'docs/ai/TESTING.md',
  'docs/ai/ARCHITECTURE.md',
];

async function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

export async function updateCommand() {
  const cwd = process.cwd();
  const metaPath = join(cwd, '.claude/ai-workflow.json');

  if (!existsSync(metaPath)) {
    console.log(chalk.red('✗ No ai-workflow installation found.'));
    console.log('  Run ai-workflow init first.');
    process.exit(1);
  }

  const currentMeta = await fse.readJson(metaPath);
  console.log(chalk.gray(`Current version: ${currentMeta.version}`));

  const bundledMeta = await fse.readJson(join(TEMPLATES_DIR, 'ai-workflow.json'));
  console.log(chalk.gray(`Bundled version: ${bundledMeta.version}`));
  console.log();

  let updated = 0;

  for (const { src, dest } of PATH_MAP) {
    const srcPath = join(TEMPLATES_DIR, src);
    const destPath = join(cwd, dest);

    if (ALWAYS_UPDATE.includes(dest)) {
      await fse.ensureDir(dirname(destPath));
      await fse.copy(srcPath, destPath);
      console.log(chalk.green(`  ✓ ${dest} (auto-updated)`));
      updated++;
      continue;
    }

    if (!existsSync(destPath)) {
      await fse.ensureDir(dirname(destPath));
      await fse.copy(srcPath, destPath);
      console.log(chalk.green(`  ✓ ${dest} (new file)`));
      updated++;
      continue;
    }

    const currentContent = await fse.readFile(destPath, 'utf-8');
    const bundledContent = await fse.readFile(srcPath, 'utf-8');

    if (currentContent === bundledContent) {
      continue; // no changes
    }

    if (NEVER_AUTO_UPDATE.includes(dest)) {
      const answer = await ask(`  Update ${dest}? (y/n): `);
      if (answer === 'y') {
        await fse.copy(srcPath, destPath);
        console.log(chalk.green(`  ✓ ${dest}`));
        updated++;
      } else {
        console.log(chalk.gray(`  · ${dest} (skipped)`));
      }
      continue;
    }

    const answer = await ask(`  Update ${dest}? (y/n): `);
    if (answer === 'y') {
      await fse.copy(srcPath, destPath);
      console.log(chalk.green(`  ✓ ${dest}`));
      updated++;
    } else {
      console.log(chalk.gray(`  · ${dest} (skipped)`));
    }
  }

  // Update metadata
  const now = new Date().toISOString();
  await fse.writeJson(metaPath, { ...bundledMeta, installedAt: currentMeta.installedAt, updatedAt: now }, { spaces: 2 });

  console.log();
  if (updated > 0) {
    console.log(chalk.green(`✓ Updated ${updated} file(s).`));
  } else {
    console.log(chalk.gray('No updates needed.'));
  }
}
