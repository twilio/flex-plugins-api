import { env } from 'flex-plugins-api-utils';

import PluginServiceHttp from '../client';

jest.mock('flex-plugins-api-utils/dist/logger');

describe('PluginServiceHttp', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('getRealm', () => {
    it('should return the realm passed to it', () => {
      jest.spyOn(env, 'getRealm');

      // @ts-ignore
      expect(PluginServiceHttp.getRealm('stage')).toEqual('.stage');
      expect(env.getRealm).not.toHaveBeenCalled();
    });

    it('should return prod realm if no realm provided', () => {
      // @ts-ignore
      jest.spyOn(env, 'getRealm').mockReturnValue('');

      // @ts-ignore
      expect(PluginServiceHttp.getRealm()).toEqual('');
    });

    it('should return prod realm if invalid realm provided', () => {
      // @ts-ignore
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
