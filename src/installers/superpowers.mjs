import { execa } from 'execa';
import chalk from 'chalk';

export async function installSuperpowers() {
  try {
    await execa('claude', ['plugin', 'install', 'superpowers@claude-plugins-official']);
    return { success: true };
  } catch (error) {
    console.log(chalk.yellow('⚠ Could not install Superpowers automatically.'));
    console.log(chalk.yellow('  Run manually: claude plugin install superpowers@claude-plugins-official'));
    return { success: false };
  }
}

export async function isClaudeInstalled() {
  try {
    await execa('claude', ['--version']);
    return true;
  } catch {
    return false;
  }
}
