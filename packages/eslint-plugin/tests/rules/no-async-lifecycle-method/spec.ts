import { RuleTester } from '@angular-eslint/test-utils';
import rule, { RULE_NAME } from '../../../src/rules/no-async-lifecycle-method';
import { invalid, valid } from './cases';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run(RULE_NAME, rule, {
  valid,
  invalid,
});
