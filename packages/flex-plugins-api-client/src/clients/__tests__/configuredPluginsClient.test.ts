import ConfiguredPluginsClient from '../configuredPlugins';
import PluginServiceHttpClient from '../client';

describe('ConfiguredPluginsClient', () => {
  const httpClient = new PluginServiceHttpClient('username', 'password');
  const get = jest.spyOn(httpClient, 'get');
  const client = new ConfiguredPluginsClient(httpClient);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should list configured plugins', async () => {
    get.mockResolvedValue('list');

    const result = await client.list('configId');

    expect(result).toEqual('list');
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith('Configurations/configId/Plugins', { cacheable: true });
  });

  it('should get configured plugin', async () => {
    get.mockResolvedValue('item');

    const result = await client.get('configId', 'pluginId');

    expect(result).toEqual('item');
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith('Configurations/configId/Plugins/pluginId', { cacheable: true });
  });
});
