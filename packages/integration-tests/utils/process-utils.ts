/* eslint-disable @typescript-eslint/no-non-null-assertion */
import execa from 'execa';
import { join } from 'node:path';

export const FIXTURES_DIR = join(__dirname, '../fixtures/');

// Used to ensure all the time-consuming setup steps for fixtures do not cause jest to time out
export const LONG_TIMEOUT_MS = 600000; // 10 mins

export const VERSION = `9999.0.1-local-integration-tests`;

function ensureLocalRegistry() {
  if (process.env.npm_config_registry?.indexOf('http://localhost') === -1) {
    throw Error(`
      ------------------
      💣 ERROR 💣 => $NPM_REGISTRY does not look like a local registry'
      ------------------
    `);
  }
}

export async function runNpmInstall(): Promise<
  execa.ExecaChildProcess<string>
> {
  ensureLocalRegistry();

  const subprocess = execa('npm', ['install']);
  subprocess.stdout!.pipe(process.stdout);
  subprocess.stderr!.pipe(process.stderr);

  return await subprocess;
}

export async function runYarnInstall(): Promise<
  execa.ExecaChildProcess<string>
> {
  ensureLocalRegistry();

  const subprocess = execa('yarn', ['install']);
  subprocess.stdout!.pipe(process.stdout);
  subprocess.stderr!.pipe(process.stderr);

  return await subprocess;
}

export async function runNgAdd(): Promise<execa.ExecaChildProcess<string>> {
  ensureLocalRegistry();

  const subprocess = execa('npx', [
    'ng',
    'add',
    `@angular-eslint/schematics@${VERSION}`,
  ]);
  subprocess.stdout!.pipe(process.stdout);
  subprocess.stderr!.pipe(process.stderr);

  return await subprocess;
}

export async function runNgNew(
  workspaceName: string,
  createApplication = true,
): Promise<execa.ExecaChildProcess<string>> {
  ensureLocalRegistry();

  const ngNewArgs = [
    `--strict=true`,
    `--package-manager=npm`,
    `--interactive=false`,
  ];

  if (!createApplication) {
    ngNewArgs.push(`--create-application=false`);
  }

  const subprocess = execa('../../../node_modules/.bin/ng', [
    'new',
    ...ngNewArgs,
    workspaceName,
  ]);
  subprocess.stdout!.pipe(process.stdout);
  subprocess.stderr!.pipe(process.stderr);

  return await subprocess;
}

export async function runNgGenerate(
  args: string[],
): Promise<execa.ExecaChildProcess<string>> {
  ensureLocalRegistry();

  const subprocess = execa('npx', ['ng', 'generate', ...args]);
  subprocess.stdout!.pipe(process.stdout);
  subprocess.stderr!.pipe(process.stderr);

  return await subprocess;
}
