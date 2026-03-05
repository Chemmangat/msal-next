import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

export interface ConfigureOptions {
  tenantId?: string;
  clientId?: string;
}

export async function configureCommand(options: ConfigureOptions) {
  console.log(chalk.blue.bold('\n⚙️  Configure Azure AD\n'));

  const cwd = process.cwd();
  const envPath = path.join(cwd, '.env.local');

  let config = options;

  if (!config.clientId || !config.tenantId) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'clientId',
        message: 'Azure AD Client ID:',
        default: config.clientId,
        validate: (input) => input.length > 0 || 'Client ID is required',
      },
      {
        type: 'input',
        name: 'tenantId',
        message: 'Azure AD Tenant ID:',
        default: config.tenantId || 'common',
      },
    ]);

    config = { ...config, ...answers };
  }

  // Update .env.local file
  let envContent = '';
  
  if (await fs.pathExists(envPath)) {
    envContent = await fs.readFile(envPath, 'utf-8');
    
    // Update existing values
    envContent = envContent.replace(
      /NEXT_PUBLIC_AZURE_AD_CLIENT_ID=.*/,
      `NEXT_PUBLIC_AZURE_AD_CLIENT_ID=${config.clientId}`
    );
    envContent = envContent.replace(
      /NEXT_PUBLIC_AZURE_AD_TENANT_ID=.*/,
      `NEXT_PUBLIC_AZURE_AD_TENANT_ID=${config.tenantId}`
    );
  } else {
    // Create new file
    envContent = `# Azure AD Configuration
NEXT_PUBLIC_AZURE_AD_CLIENT_ID=${config.clientId}
NEXT_PUBLIC_AZURE_AD_TENANT_ID=${config.tenantId}
`;
  }

  await fs.writeFile(envPath, envContent, 'utf-8');

  console.log(chalk.green('\n✅ Configuration updated!\n'));
  console.log(chalk.white('Updated .env.local with your Azure AD credentials.\n'));
}
