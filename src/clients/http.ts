import axios, { AxiosInstance } from 'axios';

import logger from '../utils/logger';

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

  private readonly config: HttpConfig;

  constructor(config: HttpConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseURL,
      auth: {
        username: config.auth.username,
        password: config.auth.password,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
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
    logger.debug('Making GET request to %s/%s', this.config.baseURL, uri);

    return this.client.get(uri).then((resp) => resp.data || {});
  }

  /**
   * Makes a POST request
   * @param uri   the uri of the endpoint
   * @param data  the data to post
   */
  public async post<R>(uri: string, data: object): Promise<R> {
    logger.debug('Making POST request to %s/%s with data %s', this.config.baseURL, uri, JSON.stringify(data));

    return this.client.post(uri, data).then((resp) => resp.data);
  }

  /**
   * Makes a delete request
   *
   * @param uri   the uri of the endpoint
   */
  public async delete(uri: string): Promise<void> {
    logger.debug('Making DELETE request to %s/%s', this.config.baseURL, uri);

    return this.client.delete(uri);
  }
}
