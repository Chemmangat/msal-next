import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';

interface MigrationSummary {
  filesScanned: number;
  filesModified: number;
  replacements: Record<string, number>;
}

const PATTERNS: Array<{ find: RegExp; replace: string; label: string }> = [
  {
    find: /\bloginPopup\b/g,
    replace: 'loginRedirect',
    label: 'loginPopup → loginRedirect',
  },
  {
    find: /\blogoutPopup\b/g,
    replace: 'logoutRedirect',
    label: 'logoutPopup → logoutRedirect',
  },
  {
    find: /\bacquireTokenPopup\b/g,
    replace: 'acquireTokenRedirect',
    label: 'acquireTokenPopup → acquireTokenRedirect',
  },
  {
    find: /useRedirect\s*=\s*\{?\s*false\s*\}?/g,
    replace: '',
    label: 'useRedirect={false} removed',
  },
];

export async function migrateCommand() {
  console.log(chalk.blue.bold('\n🔄 @chemmangat/msal-next codemod — migrating to redirect-only API\n'));

  const cwd = process.cwd();
  const spinner = ora('Scanning project files...').start();

  const summary: MigrationSummary = {
    filesScanned: 0,
    filesModified: 0,
    replacements: {},
  };

  for (const p of PATTERNS) {
    summary.replacements[p.label] = 0;
  }

  let files: string[] = [];
  try {
    files = await glob('**/*.{ts,tsx,js,jsx,mts,mjs}', {
      cwd,
      ignore: ['**/node_modules/**', '**/.next/**', '**/dist/**', '**/.git/**'],
      absolute: true,
    });
  } catch (err) {
    spinner.fail('Failed to scan files');
    console.error(chalk.red(String(err)));
    process.exit(1);
  }

  spinner.succeed(`Found ${files.length} source files`);
  summary.filesScanned = files.length;

  const modifySpinner = ora('Applying replacements...').start();

  for (const filePath of files) {
    let source: string;
    try {
      source = await fs.readFile(filePath, 'utf-8');
    } catch {
      continue;
    }

    let modified = source;
    let fileChanged = false;

    for (const pattern of PATTERNS) {
      const before = modified;
      modified = modified.replace(pattern.find, pattern.replace);
      if (modified !== before) {
        const count = (before.match(pattern.find) || []).length;
        summary.replacements[pattern.label] += count;
        fileChanged = true;
      }
    }

    if (fileChanged) {
      await fs.writeFile(filePath, modified, 'utf-8');
      summary.filesModified++;
      const rel = path.relative(cwd, filePath);
      modifySpinner.text = `Modified: ${rel}`;
    }
  }

  modifySpinner.succeed('Replacements applied');

  // Print summary
  console.log(chalk.green.bold('\n✅ Migration complete!\n'));
  console.log(chalk.white(`Files scanned:  ${summary.filesScanned}`));
  console.log(chalk.white(`Files modified: ${summary.filesModified}\n`));

  const totalChanges = Object.values(summary.replacements).reduce((a, b) => a + b, 0);
  if (totalChanges === 0) {
    console.log(chalk.gray('No popup API usage found — your project is already up to date.'));
  } else {
    console.log(chalk.blue('Changes made:'));
    for (const [label, count] of Object.entries(summary.replacements)) {
      if (count > 0) {
        console.log(chalk.white(`  ${label}: ${count} occurrence${count !== 1 ? 's' : ''}`));
      }
    }
  }

  console.log(chalk.gray('\nReview the changes with: git diff\n'));
}
