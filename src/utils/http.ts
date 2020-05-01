import qs from 'querystring';

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import logger from './logger';
import { TwilioApiError } from '../exceptions';

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

  constructor(config: HttpConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      auth: {
        username: config.auth.username,
        password: config.auth.password,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
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
    logger.debug(`Making a ${req.method?.toUpperCase()} to ${req.baseURL}/${req.url}`);

    // Transform data to urlencoded
    if (req.method?.toLocaleLowerCase() === 'post' && typeof req.data === 'object') {
      req.data = qs.stringify(req.data);
    }

    return req;
  }

  /**
   * Transformss the response object
   * @param resp
   */
  private static transformResponse(resp: AxiosResponse) {
    const data = resp.data;
    logger.debug(`Request resulted in ${resp.status} with data\n${Http.prettyPrint(data)}`);

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
   * @param uri   the uri endpoint
   */
  public async list<R>(uri: string): Promise<R[]> {
    return this.get<R[]>(uri);
  }

  /**
   * Makes a GET request to return an instance
   * @param uri   the uri endpoint
   */
  public async get<R>(uri: string): Promise<R> {
    return this.client.get(uri);
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
}
