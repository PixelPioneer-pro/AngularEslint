import type { ExecutorContext } from 'nx/src/config/misc-interfaces';
import runCommands from 'nx/src/executors/run-commands/run-commands.impl';
import type { IntegrationTestSuiteExecutorSchema } from './schema';

export default async function runExecutor(
  options: IntegrationTestSuiteExecutorSchema,
  context: ExecutorContext,
) {
  const updateSnapshots = options.updateSnapshots ?? false;

  return runCommands(
    {
      parallel: false,
      cwd: options.cwd,
      commands: [
        `npx jest --runInBand ${options.testFilePath}${
          updateSnapshots ? ' -u' : ''
        }`,
      ].filter(Boolean) as string[],
      __unparsed__: [],
    },
    context,
  );
}
