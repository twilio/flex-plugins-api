/* eslint-disable camelcase */
import { AxiosRequestConfig } from 'axios';

import HttpClient, { HttpConfig } from '../http';
import { TwilioApiError } from '../exceptions';

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
      const get = jest.spyOn(client, 'get').mockResolvedValue('the-result');

      const response = await httpClient.get('the-uri');

      expect(response).toEqual('the-result');
      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith('the-uri', {});
    });
  });

  describe('post', () => {
    it('should post', async () => {
      const httpClient = new HttpClient(config);
      // @ts-ignore
      const client = httpClient.client;
      const post = jest.spyOn(client, 'post').mockResolvedValue('the-result');

      const response = await httpClient.post('the-uri', { payload: 'the-payload' });

      expect(response).toEqual('the-result');
      expect(post).toHaveBeenCalledTimes(1);
      expect(post).toHaveBeenCalledWith('the-uri', { payload: 'the-payload' });
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

  describe('isTwilioError', () => {
    it('should return true if Twilio Error', () => {
      const err = {
        isAxiosError: true,
        response: {
          data: {
            more_info: 'the-info',
          },
        },
      };
      // @ts-ignore
      expect(HttpClient.isTwilioError(err)).toEqual(true);
    });

    it('should return false', () => {
      // @ts-ignore
      expect(HttpClient.isTwilioError(null)).toEqual(false);
      // @ts-ignore
      expect(HttpClient.isTwilioError({})).toEqual(false);
      // @ts-ignore
      expect(HttpClient.isTwilioError(new Error())).toEqual(false);
      // @ts-ignore
      expect(HttpClient.isTwilioError({ isAxiosError: false })).toEqual(false);
      // @ts-ignore
      expect(HttpClient.isTwilioError({ isAxiosError: true, response: {} })).toEqual(false);
    });
  });

  describe('transformRequest', () => {
    it('should transform post parameter if json blob', () => {
      const req: AxiosRequestConfig = {
        method: 'post',
        data: { payload: 'value' },
      };
      // @ts-ignore
      const transformed = HttpClient.transformRequest(req);

      expect(transformed.data).toEqual('payload=value');
    });

    it('should transform not transform data-blob', () => {
      const req: AxiosRequestConfig = {
        method: 'post',
        data: 'payload=value',
      };
      // @ts-ignore
      const transformed = HttpClient.transformRequest(req);

      expect(transformed.data).toEqual('payload=value');
    });

    it('should transform nested array of object', () => {
      const req: AxiosRequestConfig = {
        method: 'post',
        data: {
          payload: 'value',
          arr: ['item1', 'item2'],
          objArr: [
            { name: 'item1', phase: 0 },
            { name: 'item2', phase: 1 },
          ],
        },
      };

      // @ts-ignore
      const transformed = HttpClient.transformRequest(req);

      expect(transformed.data).toEqual(
        'payload=value&arr=item1&arr=item2&objArr={"name":"item1","phase":0}&objArr={"name":"item2","phase":1}',
      );
    });
  });

  describe('transformResponse', () => {
    it('should transform response', () => {
      const response = {
        data: '123',
        config: {},
        request: {},
      };
      // @ts-ignore
      expect(HttpClient.transformResponse(response)).toEqual('123');
    });
  });

  describe('transformResponseError', () => {
    it('should not transform any rejection if not a twilio error', async (done) => {
      const err = new Error('the-error');
      try {
        // @ts-ignore
        await HttpClient.transformResponseError(err);
      } catch (e) {
        expect(e).toEqual(err);
        done();
      }
    });

    it('should not transform rejection to twilio error', async (done) => {
      const err = {
        isAxiosError: true,
        response: {
          data: {
            code: 123,
            message: 'the-message',
            more_info: 'more-info',
            status: 321,
          },
        },
      };

      try {
        // @ts-ignore
        await HttpClient.transformResponseError(err);
      } catch (e) {
        expect(e).toBeInstanceOf(TwilioApiError);
        expect((e as TwilioApiError).code).toEqual(err.response.data.code);
        expect((e as TwilioApiError).message).toEqual(err.response.data.message);
        expect((e as TwilioApiError).moreInfo).toEqual(err.response.data.more_info);
        expect((e as TwilioApiError).status).toEqual(err.response.data.status);
        done();
      }
    });
  });

  describe('getRequestOption', () => {
    it('should return empty object', () => {
      const httpClient = new HttpClient(config);

      // @ts-ignore
      expect(httpClient.getRequestOption()).toEqual({});
    });

    it('should return default maxAge', () => {
      const httpClient = new HttpClient(config);

      // @ts-ignore
      const maxAge = httpClient.cacheAge;
      // @ts-ignore
      expect(httpClient.getRequestOption({ cacheable: true })).toEqual({ cache: { maxAge } });
    });

    it('should return requested maxAge', () => {
      const httpClient = new HttpClient(config);

      // @ts-ignore
      expect(httpClient.getRequestOption({ cacheable: true, cacheAge: 123 })).toEqual({ cache: { maxAge: 123 } });
    });
  });
});
