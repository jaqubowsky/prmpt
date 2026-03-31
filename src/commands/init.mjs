import chalk from 'chalk';
import { execa } from 'execa';
import { createInterface } from 'node:readline';
import { detectProject } from '../utils/detect.mjs';
import { copyTemplates } from '../utils/copy-templates.mjs';
import { installSuperpowers, isClaudeInstalled } from '../installers/superpowers.mjs';

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
    console.log('  Then run ai-workflow again.');
    process.exit(1);
  }

  // Step 2: Detect existing project
  const project = await detectProject(cwd);

  // Step 3: Already initialized?
  if (project.hasAgentsMd) {
    console.log(chalk.yellow('Detected existing ai-workflow config.'));
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

  // Step 5: Install Superpowers
  const sp = await installSuperpowers();

  // Step 6: Print summary
  console.log();
  console.log(chalk.green('✓ Created files:'));
  for (const file of copied) {
    console.log(chalk.gray(`  · ${file}`));
  }
  console.log();
  if (sp.success) {
    console.log(chalk.green('✓ Superpowers installed'));
  } else {
    console.log(chalk.yellow('⚠ Superpowers: manual install needed'));
  }

  // Step 7: Launch Claude Code
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
