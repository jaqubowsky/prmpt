#!/usr/bin/env node

import { Command } from 'commander';
import { printBanner } from '../src/utils/banner.mjs';
import { initCommand } from '../src/commands/init.mjs';
import { updateCommand } from '../src/commands/update.mjs';

const program = new Command();

printBanner();

program
  .name('prmpt')
  .description('Scaffold AI-first development workflow')
  .version('1.0.0');

program
  .command('init', { isDefault: true })
  .description('Initialize prmpt in current project')
  .action(initCommand);

program
  .command('update')
  .description('Update prmpt templates to latest version')
  .action(updateCommand);

program.parse();
