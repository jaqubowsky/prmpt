#!/usr/bin/env node

import { Command } from 'commander';
import { printBanner } from '../src/utils/banner.mjs';
import { initCommand } from '../src/commands/init.mjs';
import { updateCommand } from '../src/commands/update.mjs';

const program = new Command();

printBanner();

program
  .name('ai-workflow')
  .description('Scaffold AI-first development workflow')
  .version('1.0.0');

program
  .command('init', { isDefault: true })
  .description('Initialize ai-workflow in current project')
  .action(initCommand);

program
  .command('update')
  .description('Update ai-workflow templates to latest version')
  .action(updateCommand);

program.parse();
