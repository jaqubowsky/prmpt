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

  console.log();
  console.log(chalk.bold.cyan('    \u2588\u2580\u2588 \u2588\u2580\u2588 \u2588\u2580\u2584\u2580\u2588 \u2588\u2580\u2588 \u2580\u2588\u2580'));
  console.log(chalk.bold.cyan('    \u2588\u2580\u2580 \u2588\u2580\u2584 \u2588 \u2580 \u2588 \u2588\u2580\u2580  \u2588 '));
  console.log(chalk.bold.cyan('    \u2580   \u2580 \u2580 \u2580   \u2580 \u2580    \u2580 '));
  console.log();
  console.log(chalk.dim(`    v${v}  \u00b7  Claude Code + Superpowers + TDD`));
  console.log();
}
