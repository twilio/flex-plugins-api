import { env, logger, HttpClient } from 'flex-plugins-api-utils';
import { Realm } from 'flex-plugins-api-utils/dist/env';
import upperFirst from 'lodash.upperfirst';

export interface Pagination {
  pageSize?: number;
  page?: number;
  pageToken?: string;
}

export interface PaginationMeta {
  meta: {
    page: number;
    page_size: number;
    first_page_url: string;
    previous_page_url: string;
    url: string;
    next_page_url?: string;
    key: string;
    next_token?: string;
    previous_token?: string;
  };
}

export interface PluginServiceHttpOption {
  realm?: Realm;
}

/**
 * An implementation of the raw {@link HttpClient} but made for PluginService
 */
export default class PluginServiceHttp extends HttpClient {
  private static realms: Realm[] = ['dev', 'stage'];

  private static version = 'v1';

  constructor(username: string, password: string, options?: PluginServiceHttpOption) {
    super({
      baseURL: `https://flex-api${PluginServiceHttp.getRealm(options && options.realm)}.twilio.com/${
        PluginServiceHttp.version
      }/PluginService`,
      auth: { username, password },
    });
  }

  /**
   * Returns the realm if provided
   */
  private static getRealm = (realm?: Realm) => {
    if (realm && PluginServiceHttp.realms.includes(realm)) {
      return `.${realm}`;
    }

    realm = env.getRealm() as Realm;
    if (!realm) {
      return '';
    }

    if (!PluginServiceHttp.realms.includes(realm)) {
      logger.warning('Invalid realm %s was provided, returning production realm', realm);
      return '';
    }

    return `.${realm}`;
  };

  /**
   * List API endpoint with pagination support
   * @param uri     the uri endpoint
   * @param pagination  the request option
   */
  public async list<R extends PaginationMeta>(uri: string, pagination?: Pagination): Promise<R> {
    const params = new URLSearchParams();
    if (pagination) {
      Object.entries(pagination).forEach(([key, value]) => params.set(upperFirst(key), value));
    }

    const resp = await this.get<R>(`${uri}?${params.toString()}`);
    if (resp.meta.next_page_url) {
      const next = new URL(resp.meta.next_page_url);
      if (next.searchParams.has('PageToken')) {
        resp.meta.next_token = next.searchParams.get('PageToken') as string;
      }
    }
    if (resp.meta.previous_page_url) {
      const prev = new URL(resp.meta.previous_page_url);
      if (prev.searchParams.has('PageToken')) {
        resp.meta.previous_token = prev.searchParams.get('PageToken') as string;
      }
    }

    return resp;
  }
}
