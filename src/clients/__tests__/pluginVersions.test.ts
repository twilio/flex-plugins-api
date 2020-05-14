import PluginVersionsClient from '../pluginVersions';
import PluginServiceHttpClient from '../client';

describe('PluginVersionsClient', () => {
  const httpClient = new PluginServiceHttpClient('username', 'password');
  const get = jest.spyOn(httpClient, 'get');
  const post = jest.spyOn(httpClient, 'post');

  const client = new PluginVersionsClient(httpClient);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should list plugin versions', async () => {
    get.mockResolvedValue('list');

    const result = await client.list('pluginId');

    expect(result).toEqual('list');
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith('Plugins/pluginId/Versions');
  });

  it('should get the latest version', async () => {
    get.mockResolvedValue({ plugin_versions: ['version1', 'version2'] });

    const result = await client.latest('pluginId');

    expect(result).toEqual('version1');
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith('Plugins/pluginId/Versions');
  });

  it('should get plugin versions', async () => {
    get.mockResolvedValue('item');

    const result = await client.get('pluginId', 'versionId');

    expect(result).toEqual('item');
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith('Plugins/pluginId/Versions/versionId');
  });

  it('should create plugin version', async () => {
    post.mockResolvedValue('created');

    const payload = { Version: '1.2.3', PluginUrl: 'https://twilio.com' };
    const result = await client.create('pluginId', payload);

    expect(result).toEqual('created');
    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith('Plugins/pluginId/Versions', payload);
  });
});
