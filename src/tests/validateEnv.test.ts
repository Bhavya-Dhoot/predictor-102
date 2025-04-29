import { validateEnv } from '../lib/validateEnv';

describe('validateEnv', () => {
  it('throws if missing', () => {
    expect(() => validateEnv(['NOT_PRESENT'])).toThrow(/NOT_PRESENT/);
  });
  it('passes if present', () => {
    process.env.TEST_VAR = 'ok';
    expect(() => validateEnv(['TEST_VAR'])).not.toThrow();
  });
});
