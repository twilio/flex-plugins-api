import env from '../env';

describe('Environment', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  describe('debug', () => {
    it('should return true', () => {
      process.env.DEBUG = 'true';
      expect(env.isDebug()).toEqual(true);
    });

    it('should return false', () => {
      expect(env.isDebug()).toEqual(false);
    });
  });

  describe('realm', () => {
    it('should return realm', () => {
      process.env.REALM = 'test';
      expect(env.getRealm()).toEqual('test');
    });

    it('should return undefined', () => {
      expect(env.getRealm()).toBeUndefined();
    });
  });
});
