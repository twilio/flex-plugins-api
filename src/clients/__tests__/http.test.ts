import HttpClient, { HttpConfig } from '../http';

describe('HttpClient', () => {
  const config: HttpConfig = {
    baseURL: 'https://test.com',
    auth: {
      username: 'AC00000000000000000000000000000000',
      password: 'abc123',
    },
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe('get', () => {
    it('should call get', async () => {
      const httpClient = new HttpClient(config);
      // @ts-ignore
      const client = httpClient.client;
      const get = jest.spyOn(client, 'get').mockResolvedValue({ data: 'the-result' });

      const response = await httpClient.get('the-uri');

      expect(response).toEqual('the-result');
      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith('the-uri');
    });
  });

  describe('post', () => {
    it('should post', async () => {
      const httpClient = new HttpClient(config);
      // @ts-ignore
      const client = httpClient.client;
      const post = jest.spyOn(client, 'post').mockResolvedValue({ data: 'the-result' });

      const response = await httpClient.post('the-uri', { payload: 'the-payload' });

      expect(response).toEqual('the-result');
      expect(post).toHaveBeenCalledTimes(1);
      expect(post).toHaveBeenCalledWith('the-uri', { payload: 'the-payload' });
    });
  });

  describe('list', () => {
    it('list should call get method', async () => {
      const client = new HttpClient(config);
      const data = { result: 'the-result' };
      const get = jest.spyOn(client, 'get').mockResolvedValue([data]);

      const result = await client.list('the-uri');

      expect(result).toEqual([data]);
      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith('the-uri');
    });
  });

  describe('delete', () => {
    it('should delete', async () => {
      const httpClient = new HttpClient(config);
      // @ts-ignore
      const client = httpClient.client;
      const del = jest.spyOn(client, 'delete').mockResolvedValue(null);

      const result = await httpClient.delete('the-uri');

      expect(result).toBeNull();
      expect(del).toHaveBeenCalledTimes(1);
      expect(del).toHaveBeenCalledWith('the-uri');
    });
  });
});
