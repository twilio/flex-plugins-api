import { env, logger, HttpClient } from 'flex-plugins-api-utils';

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

/**
 * An implementation of the raw {@link HttpClient} but made for PluginService
 */
export default class PluginServiceHttp extends HttpClient {
  private static realms = ['dev', 'stage'];

  private static version = 'v1';

  constructor(username: string, password: string) {
    super({
      baseURL: `https://flex-api${PluginServiceHttp.getRealm()}.twilio.com/${PluginServiceHttp.version}/PluginService`,
      auth: { username, password },
    });
  }

  /**
   * Returns the realm if provided
   */
  private static getRealm = () => {
    const realm = env.getRealm();
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
