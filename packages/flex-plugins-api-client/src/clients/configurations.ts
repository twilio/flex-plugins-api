import PluginServiceHttpClient, { Pagination, PaginationMeta } from './client';

export interface ConfigurationResource {
  sid: string;
  account_sid: string;
  name: string;
  description: string;
  date_created: string;
}

export interface ConfigurationResourcePage extends PaginationMeta {
  configurations: ConfigurationResource[];
}

export interface CreateConfiguredPlugin {
  phase: number;
  plugin_version: string;
}

export interface CreateConfigurationResource {
  Sid: string;
  Plugins: CreateConfiguredPlugin[];
  Description?: string;
}

/**
 * Plugin Configuration Public API Http client for the Configuration resource
 * @link https://www.twilio.com/docs/flex/plugins/api/plugin-configuration
 */
export default class ConfigurationsClient {
  private readonly client: PluginServiceHttpClient;

  constructor(client: PluginServiceHttpClient) {
    this.client = client;
  }

  /**
   * Helper method to generate the URI for Configurations
   *
   * @param configId  the configuration identifier
   */
  private static getUrl(configId?: string) {
    if (configId) {
      return `Configurations/${configId}`;
    }

    return 'Configurations';
  }

  /**
   * Fetches a list of {@link ConfigurationResource}
   * @param pagination the pagination meta data
   */
  public async list(pagination?: Pagination): Promise<ConfigurationResourcePage> {
    return this.client.list<ConfigurationResourcePage>(ConfigurationsClient.getUrl(), pagination);
  }

  /**
   * Fetches the latest {@link ConfigurationResource}
   */
  public async latest(): Promise<ConfigurationResource | null> {
    const list = await this.list();

    return list.configurations[0];
  }

  /**
   * Fetches an instance of the {@link ConfigurationResource}
   * @param configId  the configuration identifier
   */
  public async get(configId: string): Promise<ConfigurationResource> {
    return this.client.get<ConfigurationResource>(ConfigurationsClient.getUrl(configId), { cacheable: true });
  }

  /**
   * Creates a new {@link ConfigurationResource}
   * @param object the {@link CreateConfigurationResource} request
   */
  public async create(object: CreateConfigurationResource): Promise<ConfigurationResource> {
    return this.client.post<ConfigurationResource>(ConfigurationsClient.getUrl(), object);
  }
}
