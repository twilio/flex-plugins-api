import { TwilioApiError } from '../exceptions';
import PluginServiceHttpClient, { PaginationMeta } from './client';

export interface PluginResource {
  sid: string;
  account_sid: string;
  unique_name: string;
  description: string;
  friendly_name: string;
  date_created: string;
  date_updated: string;
  url: string;
}

export interface PluginResourcePage extends PaginationMeta {
  plugins: PluginResource[];
}

export interface UpdatePluginResource {
  FriendlyName?: string;
  Description?: string;
}

export interface CreatePluginResource extends UpdatePluginResource {
  UniqueName: string;
}

/**
 * Plugin Public API Http client for the Plugin resource
 * @link https://www.twilio.com/docs/flex/plugins/api/plugin
 */
export default class PluginsClient {
  private readonly client: PluginServiceHttpClient;

  constructor(client: PluginServiceHttpClient) {
    this.client = client;
  }

  private static getUrl(pluginId?: string) {
    if (pluginId) {
      return `Plugins/${pluginId}`;
    }

    return 'Plugins';
  }

  /**
   * Fetches the list of {@link PluginResource}
   */
  public list = async (): Promise<PluginResourcePage> => {
    return this.client.get<PluginResourcePage>(PluginsClient.getUrl());
  };

  /**
   * Fetches an instance of the {@link PluginResource}
   * @param id  the plugin identifier
   */
  public async get(id: string): Promise<PluginResource> {
    return this.client.get<PluginResource>(PluginsClient.getUrl(id));
  }

  /**
   * Creates a new {@link PluginResource}
   * @param object the {@link CreatePluginResource} request
   */
  public async create(object: CreatePluginResource): Promise<PluginResource> {
    return this.client.post<PluginResource>(PluginsClient.getUrl(), object);
  }

  /**
   * Updates a {@link PluginResource}
   * @param id the plugin identifier
   * @param object the {@link UpdatePluginResource} request
   */
  public async update(id: string, object: UpdatePluginResource): Promise<PluginResource> {
    return this.client.post<PluginResource>(PluginsClient.getUrl(id), object);
  }

  /**
   * Upserts a {@link PluginResource}. If no resource is found, then it creates it first, otherwise it will update it
   * @param object the {@link CreatePluginResource} request
   */
  public async upsert(object: CreatePluginResource): Promise<PluginResource> {
    try {
      const existingPlugin = await this.get(object.UniqueName);
      const { FriendlyName, Description } = object;
      if (FriendlyName || Description) {
        return this.update(object.UniqueName, { FriendlyName, Description });
      }

      return existingPlugin;
    } catch (e) {
      if (e instanceof TwilioApiError && e.status === 404) {
        return this.create(object);
      }

      throw e;
    }
  }
}
