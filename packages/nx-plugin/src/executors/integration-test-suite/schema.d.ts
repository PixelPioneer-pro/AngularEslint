export interface IntegrationTestSuiteExecutorSchema {
  cwd: string;
  testFilePath: string;
  updateSnapshots?: boolean;
}
