import PluginServiceHttpClient, { PaginationMeta } from './client';

export interface ReleaseResource {
  sid: string;
  account_sid: string;
  configuration_sid: string;
  date_created: string;
}

export interface ReleaseResourcePage extends PaginationMeta {
  releases: ReleaseResource[];
}

export interface CreateReleaseResource {
  ConfigurationId: string;
}

/**
 * Plugin Releases Client Public API Http client for the Release resource
 * @url https://www.twilio.com/docs/flex/plugins/api/release
 */
export default class ReleasesClient {
  private readonly client: PluginServiceHttpClient;

  constructor(client: PluginServiceHttpClient) {
    this.client = client;
  }

  /**
   * Helper method to generate the URI for Releases
   * @param releaseId    the release identifier
   */
  private static getUrl(releaseId?: string) {
    if (releaseId) {
      return `Releases/${releaseId}`;
    }

    return 'Releases';
  }

  /**
   * Fetches the list of {@link ReleaseResourcePage}
   */
  public async list(): Promise<ReleaseResourcePage> {
    return this.client.get<ReleaseResourcePage>(ReleasesClient.getUrl());
  }

  /**
   * Fetches the active {@link ReleaseResource}
   */
  public async active(): Promise<ReleaseResource> {
    const list = await this.list();

    return list.releases[0];
  }

  /**
   * Fetches an instance of the {@link ReleaseResource}
   * @param releaseId the release identifier
   */
  public async get(releaseId: string): Promise<ReleaseResource> {
    return this.client.get<ReleaseResource>(ReleasesClient.getUrl(releaseId), { cacheable: true });
  }

  /**
   * Creates a new {@link ReleaseResource}
   * @param object the {@link CreateReleaseResource} request
   */
  public async create(object: CreateReleaseResource): Promise<ReleaseResource> {
    return this.client.post<ReleaseResource>(ReleasesClient.getUrl(), object);
  }
}
