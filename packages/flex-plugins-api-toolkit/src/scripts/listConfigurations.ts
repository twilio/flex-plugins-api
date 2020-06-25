import { ConfigurationsClient, ReleasesClient } from 'flex-plugins-api-client';

import { Script } from '.';

export interface ListConfigurations {
  sid: string;
  version: string;
  description: string;
  isActive: boolean;
  dateCreated: string;
}

export type ListConfigurationsScript = Script<{}, ListConfigurations[]>;

/**
 * The .listConfigurations script. This script returns overall information about a Configuration
 * @param configurationsClient        the Public API {@link ConfigurationsClient}
 * @param releasesClient the Public API {@link ReleasesClient}
 */
export default function listConfigurations(configurationsClient: ConfigurationsClient, releasesClient: ReleasesClient) {
  return async (): Promise<ListConfigurations[]> => {
    const [result, release] = await Promise.all([configurationsClient.list(), releasesClient.active()]);

    return result.configurations.map((configuration) => ({
      sid: configuration.sid,
      version: configuration.version,
      description: configuration.description,
      isActive: Boolean(release && release.configuration_sid === configuration.sid),
      dateCreated: configuration.date_created,
    }));
  };
}
