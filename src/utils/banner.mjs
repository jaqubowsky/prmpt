import chalk from 'chalk';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function printBanner() {
  const pkg = JSON.parse(
    readFileSync(join(__dirname, '../../package.json'), 'utf-8')
  );
  const v = pkg.version;

  console.log(chalk.cyan('╔══════════════════════════════════════╗'));
  console.log(chalk.cyan(`║    ai-workflow · v${v.padEnd(19)}║`));
  console.log(chalk.cyan('║  Claude Code + Superpowers + TDD     ║'));
  console.log(chalk.cyan('╚══════════════════════════════════════╝'));
  console.log();
}
