import { TwilioApiError } from 'flex-plugins-api-utils';

import PluginsClient from '../plugins';
import PluginServiceHttpClient from '../client';

describe('PluginsClient', () => {
  const httpClient = new PluginServiceHttpClient('username', 'password');
  const get = jest.spyOn(httpClient, 'get');
  const post = jest.spyOn(httpClient, 'post');
  const client = new PluginsClient(httpClient);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should list plugins', async () => {
    get.mockResolvedValue('list');

    const result = await client.list();

    expect(result).toEqual('list');
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith('Plugins');
  });

  it('should get plugin', async () => {
    get.mockResolvedValue('item');

    const result = await client.get('pluginId');

    expect(result).toEqual('item');
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith('Plugins/pluginId');
  });

  it('should update plugin', async () => {
    post.mockResolvedValue('updated');

    const payload = { FriendlyName: 'the-name' };
    const result = await client.update('pluginId', payload);

    expect(result).toEqual('updated');
    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith('Plugins/pluginId', payload);
  });

  it('should create plugin', async () => {
    post.mockResolvedValue('created');

    const payload = { UniqueName: 'the-name' };
    const result = await client.create(payload);

    expect(result).toEqual('created');
    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith('Plugins', payload);
  });

  describe('upsert', () => {
    it('should fetch existing plugin without update', async () => {
      get.mockResolvedValue('existing-plugin');

      const payload = { UniqueName: 'the-name' };
      const result = await client.upsert(payload);

      expect(result).toEqual('existing-plugin');
      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith('Plugins/the-name');
      expect(post).not.toHaveBeenCalled();
    });

    it('should fetch and update existing plugin', async () => {
      get.mockResolvedValue('existing-plugin');
      post.mockResolvedValue('updated-existing-plugin');

      const updatePayload = { FriendlyName: 'friendly-name', Description: 'the-description' };
      const payload = { UniqueName: 'the-name', ...updatePayload };
      const result = await client.upsert(payload);

      expect(result).toEqual('updated-existing-plugin');
      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith('Plugins/the-name');
      expect(post).toHaveBeenCalledTimes(1);
      expect(post).toHaveBeenCalledWith('Plugins/the-name', updatePayload);
    });

    it('should create a new plugin', async () => {
      get.mockRejectedValue(new TwilioApiError(404, 'message', 'info', 404));
      post.mockResolvedValue('created-plugin');

      const payload = { UniqueName: 'the-name' };
      const result = await client.upsert(payload);

      expect(result).toEqual('created-plugin');
      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith('Plugins/the-name');
      expect(post).toHaveBeenCalledTimes(1);
      expect(post).toHaveBeenCalledWith('Plugins', payload);
    });

    it('should throw an exception', async (done) => {
      const exception = new TwilioApiError(400, 'message', 'info', 400);
      get.mockRejectedValue(exception);

      try {
        const payload = { UniqueName: 'the-name' };
        await client.upsert(payload);
      } catch (err) {
        expect(err).toBeInstanceOf(TwilioApiError);
        expect(err).toEqual(exception);

        expect(get).toHaveBeenCalledTimes(1);
        expect(get).toHaveBeenCalledWith('Plugins/the-name');
        expect(post).not.toHaveBeenCalled();
        done();
      }
    });
  });
});
