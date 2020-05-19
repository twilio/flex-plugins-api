import PluginServiceHttpClient, { PaginationMeta } from './client';

export interface PluginVersionResource {
  sid: string;
  account_sid: string;
  plugin_sid: string;
  version: string;
  plugin_url: string;
  private: boolean;
  changelog: string;
  date_created: string;
}

export interface PluginVersionResourcePage extends PaginationMeta {
  plugin_versions: PluginVersionResource[];
}

export interface CreatePluginVersionResource {
  Version: string;
  PluginUrl: string;
  Private?: boolean;
  Changelog?: string;
}

/**
 * Plugin Public API Http client for the PluginVersion resource
 * @link https://www.twilio.com/docs/flex/plugins/api/plugin-version
 */
export default class PluginVersionsClient {
  private readonly client: PluginServiceHttpClient;

  constructor(client: PluginServiceHttpClient) {
    this.client = client;
  }

  /**
   * Helper method to generate the URI for PluginVersion
   * @param pluginId    the plugin identifier
   * @param versionId   the plugin version identifier
   */
  private static getUrl(pluginId: string, versionId?: string) {
    const url = `Plugins/${pluginId}/Versions`;
    if (versionId) {
      return `${url}/${versionId}`;
    }

    return url;
  }

  /**
   * Fetches the list of {@link PluginVersionResourcePage}
   * @param pluginId the plugin identifier
   */
  public async list(pluginId: string): Promise<PluginVersionResourcePage> {
    return this.client.get<PluginVersionResourcePage>(PluginVersionsClient.getUrl(pluginId));
  }

  /**
   * Fetches the latest {@link PluginVersionResourcePage} by calling the List endpoint and returns the first entry.
   * @param pluginId the plugin identifier
   */
  public async latest(pluginId: string): Promise<PluginVersionResource> {
    const list = await this.list(pluginId);

    return list.plugin_versions[0];
  }

  /**
   * Fetches an instance of the {@link PluginVersionResource}
   * @param pluginId the plugin identifier
   * @param id the plugin version identifier
   */
  public async get(pluginId: string, id: string): Promise<PluginVersionResource> {
    return this.client.get<PluginVersionResource>(PluginVersionsClient.getUrl(pluginId, id));
  }

  /**
   * Creates a new {@link PluginVersionResource}
   * @param pluginId the plugin identifier
   * @param object  the {@link CreatePluginVersionResource} request
   */
  public async create(pluginId: string, object: CreatePluginVersionResource): Promise<PluginVersionResource> {
    return this.client.post<PluginVersionResource>(PluginVersionsClient.getUrl(pluginId), object);
  }
}
