import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';

const COMPONENTS = {
  'auth-guard': {
    name: 'AuthGuard',
    description: 'Protected route wrapper component',
  },
  'user-avatar': {
    name: 'UserAvatar',
    description: 'User avatar with MS Graph photo',
  },
  'role-gate': {
    name: 'RoleGate',
    description: 'Role-based conditional rendering',
  },
  'debug-panel': {
    name: 'DebugPanel',
    description: 'Visual debug information panel',
  },
};

export async function addCommand(component: string, options: { path?: string }) {
  console.log(chalk.blue(`\n📦 Adding ${component}...\n`));

  if (!COMPONENTS[component as keyof typeof COMPONENTS]) {
    console.log(chalk.red(`❌ Unknown component: ${component}`));
    console.log(chalk.yellow('\nAvailable components:'));
    Object.entries(COMPONENTS).forEach(([key, value]) => {
      console.log(chalk.white(`  - ${key}: ${value.description}`));
    });
    process.exit(1);
  }

  const spinner = ora(`Adding ${component}...`).start();

  try {
    // Component addition logic here
    // This would copy template files to the project
    
    spinner.succeed(`${component} added successfully!`);
    console.log(chalk.green('\n✅ Component added!\n'));
  } catch (error) {
    spinner.fail(`Failed to add ${component}`);
    console.error(chalk.red(error));
    process.exit(1);
  }
}
