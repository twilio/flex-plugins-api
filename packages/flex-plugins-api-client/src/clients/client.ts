import { env, logger, HttpClient } from 'flex-plugins-api-utils';
import { Realm } from 'flex-plugins-api-utils/dist/env';

export interface PaginationMeta {
  meta: {
    page: number;
    page_size: number;
    first_page_url: string;
    previous_page_url: string;
    url: string;
    next_page_url?: string;
    key: string;
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

    realm = env.getRealm();
    if (!realm) {
      return '';
    }

    if (!PluginServiceHttp.realms.includes(realm)) {
      logger.warning('Invalid realm %s was provided, returning production realm', realm);
      return '';
    }

    return `.${realm}`;
  };
}
