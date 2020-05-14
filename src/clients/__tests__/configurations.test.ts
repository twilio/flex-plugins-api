import ConfigurationsClient from '../configurations';
import PluginServiceHttpClient from '../client';

describe('ConfigurationsClient', () => {
  const httpClient = new PluginServiceHttpClient('username', 'password');
  const get = jest.spyOn(httpClient, 'get');
  const post = jest.spyOn(httpClient, 'post');
  const client = new ConfigurationsClient(httpClient);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should list configurations', async () => {
    get.mockResolvedValue('list');

    const result = await client.list();

    expect(result).toEqual('list');
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith('Configurations');
  });

  it('should get configurations', async () => {
    get.mockResolvedValue('item');

    const result = await client.get('configId');

    expect(result).toEqual('item');
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith('Configurations/configId');
  });

  it('should create configurations', async () => {
    post.mockResolvedValue('created');

    const payload = { Version: '1.0.0', Plugins: [] };
    const result = await client.create(payload);

    expect(result).toEqual('created');
    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith('Configurations', payload);
  });
});
