import type { Config } from '@jest/types';
import { startLocalRegistry } from '@nx/js/plugins/jest/local-registry';
import { exec } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { rimraf } from 'rimraf';
import { FIXTURES_DIR, VERSION } from './process-utils';

const LARGE_BUFFER = 1024 * 1000000;

export default async function (globalConfig: Config.ConfigGlobals) {
  const isVerbose =
    process.env.NX_VERBOSE_LOGGING === 'true' || !!globalConfig.verbose;

  // Remove any existing tmp workspace fixtures on disk
  await rimraf(FIXTURES_DIR);
  if (!existsSync(FIXTURES_DIR)) {
    mkdirSync(FIXTURES_DIR);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global.e2eTeardown = await startLocalRegistry({
    localRegistryTarget: '@angular-eslint/angular-eslint:local-registry',
    verbose: isVerbose,
  });

  await new Promise<void>((res, rej) => {
    const publishProcess = exec(`./publish-to-verdaccio.sh ${VERSION}`, {
      env: process.env,
      maxBuffer: LARGE_BUFFER,
    });
    let logs = Buffer.from('');
    if (isVerbose) {
      publishProcess?.stdout?.pipe(process.stdout);
      publishProcess?.stderr?.pipe(process.stderr);
    } else {
      publishProcess?.stdout?.on('data', (data) => (logs += data));
      publishProcess?.stderr?.on('data', (data) => (logs += data));
    }
    publishProcess.on('exit', (code) => {
      if (code && code > 0) {
        const logsStr = logs.toString();
        if (logsStr.includes('this package is already present')) {
          console.log(
            'Looks like the package has already been published to the local registry. Continuing...',
          );
          return res();
        }
        if (!isVerbose) {
          console.log(logsStr);
        }
        rej(code);
      }
      res();
    });
  });
}
