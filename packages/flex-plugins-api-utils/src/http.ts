import qs from 'qs';
import { setupCache } from 'axios-cache-adapter';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import logger from './logger';
import { TwilioApiError } from './exceptions';

interface RequestOption {
  cacheable?: boolean;
  cacheAge?: number;
}

export interface AuthConfig {
  username: string;
  password: string;
}

export interface HttpConfig {
  baseURL: string;
  auth: AuthConfig;
}

export default class Http {
  protected readonly client: AxiosInstance;
  protected readonly cacheAge: number;

  constructor(config: HttpConfig) {
    this.cacheAge = 15 * 60 * 1000;
    const cache = setupCache({ maxAge: 0 });

    this.client = axios.create({
      baseURL: config.baseURL,
      auth: {
        username: config.auth.username,
        password: config.auth.password,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      adapter: cache.adapter,
    });

    this.client.interceptors.request.use(Http.transformRequest);
    this.client.interceptors.response.use(Http.transformResponse, Http.transformResponseError);
  }

  /**
   * Pretty prints a JSON object
   * @param obj
   */
  private static prettyPrint(obj: object) {
    return JSON.stringify(obj, null, 2);
  }

  /**
   * Determines if the exception is a Twilio API response error
   * @param err
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static isTwilioError(err: any) {
    return Boolean(err && err.isAxiosError && err.response && err.response.data && err.response.data.more_info);
  }

  /**
   * Transforms the POST param if provided as object
   * @param req
   */
  private static transformRequest(req: AxiosRequestConfig): AxiosRequestConfig {
    const method = req.method ? req.method : 'GET';
    logger.debug(`Making a ${method.toUpperCase()} to ${req.baseURL}/${req.url}`);

    // Transform data to urlencoded
    if (method.toLocaleLowerCase() === 'post' && typeof req.data === 'object') {
      // This is formatting array of objects into a format Twilio Public API can consume
      const data = Object.keys(req.data).map((key) => {
        if (!Array.isArray(req.data[key])) {
          return { [key]: req.data[key] };
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const value = req.data[key].map((v: any) => {
          if (typeof v !== 'object') {
            return v;
          }

          return JSON.stringify(v);
        });

        return { [key]: value };
      });

      req.data = qs.stringify(Object.assign({}, ...data), { encode: false, arrayFormat: 'repeat' });
    }

    return req;
  }

  /**
   * Transforms the response object
   * @param resp
   */
  private static transformResponse(resp: AxiosResponse) {
    const data = resp.data;

    const servedFromCache = resp.request.fromCache === true ? '(served from cache) ' : '';
    const pretty = Http.prettyPrint(data);
    const url = `${resp.config.baseURL}/${resp.config.url}`;
    const method = resp.request.method || '';
    logger.debug(
      `${method} request to ${url} ${servedFromCache}responded with statusCode ${resp.status} and data\n${pretty}\n`,
    );

    return data;
  }

  /**
   * Transforms the rejection into a Twilio API Error if possible
   * @param err
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static async transformResponseError(err: any) {
    if (Http.isTwilioError(err)) {
      const data = err.response.data;
      logger.debug(`Request errored with data\n${Http.prettyPrint(data)}`);
      return Promise.reject(new TwilioApiError(data.code, data.message, data.more_info, data.status));
    }

    logger.debug(`Request errored with message ${err.message}`);
    return Promise.reject(err);
  }

  /**
   * List API endpoint; makes a GET request and returns an array of R
   * @param uri     the uri endpoint
   * @param option  the request option
   */
  public async list<R>(uri: string, option?: RequestOption): Promise<R[]> {
    return this.get<R[]>(uri, option);
  }

  /**
   * Makes a GET request to return an instance
   * @param uri   the uri endpoint
   * @param option  the request option
   */
  public async get<R>(uri: string, option?: RequestOption): Promise<R> {
    return this.client.get(uri, this.getRequestOption(option));
  }

  /**
   * Makes a POST request
   * @param uri   the uri of the endpoint
   * @param data  the data to post
   */
  public async post<R>(uri: string, data: object): Promise<R> {
    return this.client.post(uri, data);
  }

  /**
   * Makes a delete request
   *
   * @param uri   the uri of the endpoint
   */
  public async delete(uri: string): Promise<void> {
    return this.client.delete(uri);
  }

  /**
   * Returns a {@link AxiosRequestConfig} configuration
   * @param option  request configuration
   */
  private getRequestOption(option?: RequestOption) {
    const opt: AxiosRequestConfig = {};

    if (!option) {
      return opt;
    }

    if (option.cacheable) {
      opt.cache = {
        maxAge: option.cacheAge || this.cacheAge,
      };
    }

    return opt;
  }
}
