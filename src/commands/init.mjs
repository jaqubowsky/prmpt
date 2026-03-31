import chalk from 'chalk';
import { execa } from 'execa';
import { createInterface } from 'node:readline';
import { detectProject } from '../utils/detect.mjs';
import { copyTemplates } from '../utils/copy-templates.mjs';
import { installPlugins, isClaudeInstalled } from '../installers/superpowers.mjs';

async function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

export async function initCommand() {
  const cwd = process.cwd();

  // Step 1: Guard - Claude Code installed?
  const claudeOk = await isClaudeInstalled();
  if (!claudeOk) {
    console.log(chalk.red('✗ Claude Code is required but not found.'));
    console.log();
    console.log('  Install it from: https://docs.anthropic.com/en/docs/claude-code');
    console.log('  Then run prmpt again.');
    process.exit(1);
  }

  // Step 2: Detect existing project
  const project = await detectProject(cwd);

  // Step 3: Already initialized?
  if (project.hasAgentsMd) {
    console.log(chalk.yellow('Detected existing prmpt config.'));
    const choice = await ask('  [r] Reinitialize  [u] Update  [c] Cancel: ');

    if (choice === 'u') {
      const { updateCommand } = await import('./update.mjs');
      return updateCommand();
    }
    if (choice !== 'r') {
      console.log('Cancelled.');
      process.exit(0);
    }
    // choice === 'r' → continue with init
  }

  // Step 4: Copy templates
  console.log();
  const copied = await copyTemplates(cwd, {
    projectName: project.projectName || 'my-project',
  });

  console.log(chalk.green('✓ Created files:'));
  for (const file of copied) {
    console.log(chalk.gray(`  · ${file}`));
  }

  // Step 5: Install plugins
  console.log();
  console.log(chalk.cyan('Installing plugins...'));
  const results = await installPlugins();

  const succeeded = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  for (const r of succeeded) {
    console.log(chalk.green(`  ✓ ${r.name}`));
  }
  for (const r of failed) {
    console.log(chalk.yellow(`  ⚠ ${r.name} (manual install needed)`));
  }

  // Step 6: Launch Claude Code for project setup + plugin audit
  console.log();
  console.log(chalk.cyan('⚡ Launching Claude Code to finish setup...'));
  console.log();

  try {
    await execa('claude', ['finish project setup'], { stdio: 'inherit' });
  } catch {
    console.log();
    console.log(chalk.yellow('Claude Code session ended.'));
    console.log('You can resume setup anytime by running:');
    console.log(chalk.cyan('  claude "finish project setup"'));
  }
}
