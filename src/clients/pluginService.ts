import env from '../utils/env';
import logger from '../utils/logger';
import HttpClient, { HttpConfig, AuthConfig } from './http';

export default abstract class PluginService {
  private static realms = ['dev', 'stage'];

  private static version = 'v1';

  protected readonly client: HttpClient;

  protected constructor(auth: AuthConfig, baseUrl: string) {
    const domain = `https://flex-api${PluginService.getRealm()}.twilio.com/${PluginService.version}/PluginService`;

    const config: HttpConfig = {
      baseURL: `${domain}/${baseUrl}`,
      auth,
    };

    this.client = new HttpClient(config);
  }

  /**
   * Returns the realm if provided
   */
  protected static getRealm = () => {
    const realm = env.getRealm();
    if (!realm) {
      return '';
    }

    if (!PluginService.realms.includes(realm)) {
      logger.warning('Invalid realm %s was provided, returning production realm', realm);
      return '';
    }

    return `.${realm}`;
  };
}
