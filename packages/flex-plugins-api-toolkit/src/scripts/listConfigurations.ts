import { ConfigurationsClient, ReleasesClient } from 'flex-plugins-api-client';

import { ListResource, Page, ResourceNames, Script } from '.';

export type ListConfigurationsOption = Page;

export interface ListConfigurations {
  sid: string;
  version: string;
  description: string;
  isActive: boolean;
  dateCreated: string;
}

export type ListConfigurationsResource = ListResource<ResourceNames.Configurations, ListConfigurations>;
export type ListConfigurationsScript = Script<ListConfigurationsOption, ListConfigurationsResource>;

/**
 * The .listConfigurations script. This script returns overall information about a Configuration
 * @param configurationsClient        the Public API {@link ConfigurationsClient}
 * @param releasesClient the Public API {@link ReleasesClient}
 */
export default function listConfigurations(
  configurationsClient: ConfigurationsClient,
  releasesClient: ReleasesClient,
): ListConfigurationsScript {
  return async (option) => {
    const [result, release] = await Promise.all([configurationsClient.list(option.page), releasesClient.active()]);

    const configurations = result.configurations.map((configuration) => ({
      sid: configuration.sid,
      version: configuration.version,
      description: configuration.description,
      isActive: Boolean(release && release.configuration_sid === configuration.sid),
      dateCreated: configuration.date_created,
    }));

    return {
      configurations,
      meta: result.meta,
    };
  };
}
