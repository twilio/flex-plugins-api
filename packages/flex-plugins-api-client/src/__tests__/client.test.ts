import { env } from 'flex-plugins-api-utils';

import PluginServiceHttp from '../client';

jest.mock('../../utils/logger');

describe('PluginServiceHttp', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('getRealm', () => {
    it('should return prod realm if no realm provided', () => {
      jest.spyOn(env, 'getRealm').mockReturnValue('');

      // @ts-ignore
      expect(PluginServiceHttp.getRealm()).toEqual('');
    });

    it('should return prod realm if invalid realm provided', () => {
      jest.spyOn(env, 'getRealm').mockReturnValue('foo');

      // @ts-ignore
      expect(PluginServiceHttp.getRealm()).toEqual('');
    });

    it('should return dev realm', () => {
      jest.spyOn(env, 'getRealm').mockReturnValue('dev');

      // @ts-ignore
      expect(PluginServiceHttp.getRealm()).toEqual('.dev');
    });

    it('should return stage realm', () => {
      jest.spyOn(env, 'getRealm').mockReturnValue('stage');

      // @ts-ignore
      expect(PluginServiceHttp.getRealm()).toEqual('.stage');
    });
  });
});
