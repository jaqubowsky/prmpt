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

  const cols = process.stdout.columns || 80;
  const pad = (str, width) => {
    const left = Math.max(0, Math.floor((cols - width) / 2));
    return ' '.repeat(left) + str;
  };

  const g = chalk.hex('#00d4aa');
  const b = chalk.hex('#0088ff');
  const w = chalk.bold.white;

  console.log();
  console.log(pad(g.bold('\u2588\u2580\u2588 \u2588\u2580\u2588 \u2588\u2580\u2584\u2580\u2588 \u2588\u2580\u2588 \u2580\u2588\u2580'), 21));
  console.log(pad(b.bold('\u2588\u2580\u2580 \u2588\u2580\u2584 \u2588 \u2580 \u2588 \u2588\u2580\u2580  \u2588 '), 21));
  console.log(pad(chalk.dim('\u2580   \u2580 \u2580 \u2580   \u2580 \u2580    \u2580 '), 21));
  const sub = `v${v}  \u00b7  Claude Code + Superpowers + TDD`;
  console.log(pad(chalk.dim(sub), sub.length));
  console.log();
}
