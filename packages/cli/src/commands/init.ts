import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { detectProjectType, installDependencies, createEnvFile, createLayoutFile, createMiddlewareFile, createExamplePage } from '../utils/index.js';

export interface InitOptions {
  yes?: boolean;
  appRouter?: boolean;
  pagesRouter?: boolean;
  typescript?: boolean;
  javascript?: boolean;
}

export async function initCommand(options: InitOptions) {
  console.log(chalk.blue.bold('\n🚀 Welcome to @chemmangat/msal-next setup!\n'));

  const cwd = process.cwd();
  const projectType = await detectProjectType(cwd);

  if (!projectType.isNextJs) {
    console.log(chalk.red('❌ This doesn\'t appear to be a Next.js project.'));
    console.log(chalk.yellow('Please run this command in a Next.js project directory.'));
    process.exit(1);
  }

  let config: {
    router: 'app' | 'pages';
    language: 'typescript' | 'javascript';
    clientId: string;
    tenantId: string;
    installDeps: boolean;
    createExample: boolean;
  };

  if (options.yes) {
    // Use defaults
    config = {
      router: 'app',
      language: 'typescript',
      clientId: 'YOUR_CLIENT_ID',
      tenantId: 'common',
      installDeps: true,
      createExample: true,
    };
  } else {
    // Interactive prompts
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'router',
        message: 'Which router are you using?',
        choices: [
          { name: 'App Router (Next.js 13+)', value: 'app' },
          { name: 'Pages Router', value: 'pages' },
        ],
        default: projectType.hasAppRouter ? 'app' : 'pages',
      },
      {
        type: 'list',
        name: 'language',
        message: 'Which language are you using?',
        choices: [
          { name: 'TypeScript', value: 'typescript' },
          { name: 'JavaScript', value: 'javascript' },
        ],
        default: projectType.isTypeScript ? 'typescript' : 'javascript',
      },
      {
        type: 'input',
        name: 'clientId',
        message: 'Azure AD Client ID (leave empty to configure later):',
        default: '',
      },
      {
        type: 'input',
        name: 'tenantId',
        message: 'Azure AD Tenant ID (or "common" for multi-tenant):',
        default: 'common',
      },
      {
        type: 'confirm',
        name: 'installDeps',
        message: 'Install dependencies now?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'createExample',
        message: 'Create example authentication page?',
        default: true,
      },
    ]);

    config = {
      ...answers,
      clientId: answers.clientId || 'YOUR_CLIENT_ID',
    };
  }

  console.log(chalk.blue('\n📦 Setting up your project...\n'));

  // Install dependencies
  if (config.installDeps) {
    const spinner = ora('Installing dependencies...').start();
    try {
      await installDependencies(cwd);
      spinner.succeed('Dependencies installed');
    } catch (error) {
      spinner.fail('Failed to install dependencies');
      console.log(chalk.yellow('You can install them manually with:'));
      console.log(chalk.cyan('npm install @chemmangat/msal-next @azure/msal-browser @azure/msal-react'));
    }
  }

  // Create .env file
  const spinner1 = ora('Creating .env.local file...').start();
  try {
    await createEnvFile(cwd, config.clientId, config.tenantId);
    spinner1.succeed('.env.local created');
  } catch (error) {
    spinner1.fail('Failed to create .env.local');
  }

  // Create layout file
  if (config.router === 'app') {
    const spinner2 = ora('Creating layout file...').start();
    try {
      await createLayoutFile(cwd, config.language);
      spinner2.succeed('Layout file created');
    } catch (error) {
      spinner2.fail('Failed to create layout file');
    }

    // Create middleware
    const spinner3 = ora('Creating middleware...').start();
    try {
      await createMiddlewareFile(cwd, config.language);
      spinner3.succeed('Middleware created');
    } catch (error) {
      spinner3.fail('Failed to create middleware');
    }
  }

  // Create example page
  if (config.createExample) {
    const spinner4 = ora('Creating example page...').start();
    try {
      await createExamplePage(cwd, config.router, config.language);
      spinner4.succeed('Example page created');
    } catch (error) {
      spinner4.fail('Failed to create example page');
    }
  }

  console.log(chalk.green.bold('\n✅ Setup complete!\n'));

  // Next steps
  console.log(chalk.blue.bold('Next steps:\n'));
  console.log(chalk.white('1. Update .env.local with your Azure AD credentials'));
  console.log(chalk.white('2. Start your development server: npm run dev'));
  console.log(chalk.white('3. Visit http://localhost:3000/auth to test authentication\n'));

  console.log(chalk.gray('Need help? Visit: https://github.com/chemmangat/msal-next\n'));
}
