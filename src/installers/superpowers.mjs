import { execa } from 'execa';
import chalk from 'chalk';

const REQUIRED_PLUGINS = [
  'superpowers',
  'typescript-lsp',
  'github',
  'commit-commands',
  'figma',
  'claude-code-setup',
];

const MARKETPLACE = 'claude-plugins-official';

async function installPlugin(name) {
  const fullName = `${name}@${MARKETPLACE}`;
  try {
    await execa('claude', ['plugin', 'install', fullName]);
    return { name, success: true };
  } catch {
    return { name, success: false };
  }
}

export async function installPlugins() {
  const results = [];

  for (const plugin of REQUIRED_PLUGINS) {
    const result = await installPlugin(plugin);
    results.push(result);
  }

  return results;
}

export async function isClaudeInstalled() {
  try {
    await execa('claude', ['--version']);
    return true;
  } catch {
    return false;
  }
}
