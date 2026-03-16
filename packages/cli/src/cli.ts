#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { addCommand } from './commands/add.js';
import { configureCommand } from './commands/configure.js';
import { migrateCommand } from './commands/migrate.js';

const program = new Command();

program
  .name('msal-next')
  .description('CLI tool for @chemmangat/msal-next')
  .version('5.0.0');

program
  .command('init')
  .description('Initialize MSAL authentication in your Next.js project')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .option('--app-router', 'Use App Router (default)')
  .option('--pages-router', 'Use Pages Router')
  .option('--typescript', 'Use TypeScript (default)')
  .option('--javascript', 'Use JavaScript')
  .action(initCommand);

program
  .command('add <component>')
  .description('Add a component or feature to your project')
  .option('-p, --path <path>', 'Custom output path')
  .action(addCommand);

program
  .command('configure')
  .description('Configure Azure AD app registration')
  .option('--tenant-id <id>', 'Azure AD Tenant ID')
  .option('--client-id <id>', 'Azure AD Client ID')
  .action(configureCommand);

program
  .command('migrate')
  .description(
    'Codemod: replace loginPopup, logoutPopup, acquireTokenPopup, and useRedirect={false} with redirect equivalents'
  )
  .action(migrateCommand);

program.parse();
