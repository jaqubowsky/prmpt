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

  const logo = [
    '    ▄▀█ █   █ █ █ █▀█ █▀█ █▄▀ █▀▀ █   █▀█ █ █ █',
    '    █▀█ █   ▀▄▀▄▀ █▄█ █▀▄ █ █ █▀  █▄▄ █▄█ ▀▄▀▄▀',
  ];

  console.log();
  for (const line of logo) {
    console.log(chalk.bold.cyan(line));
  }
  console.log();
  console.log(chalk.dim(`    v${v}  ·  Claude Code + Superpowers + TDD`));
  console.log();
}
