import { ConfiguredPluginsClient, PluginVersionsClient, ReleasesClient } from 'flex-plugins-api-client';

import { Script } from '.';

export interface ListPluginVersionsOption {
  name: string;
}

export interface ListPluginVersions {
  sid: string;
  pluginSid: string;
  version: string;
  url: string;
  changelog: string;
  isPrivate: boolean;
  isActive: boolean;
  dateCreated: string;
}

export type ListPluginVersionsScripts = Script<ListPluginVersionsOption, ListPluginVersions[]>;

/**
 * The .listPluginVersions script. This script returns overall information about a PluginVersion
 * @param pluginVersionsClient        the Public API {@link PluginVersionsClient}
 * @param configuredPluginsClient the Public API {@link ConfiguredPluginsClient}
 * @param releasesClient the Public API {@link ReleasesClient}
 */
export default function listPluginVersions(
  pluginVersionsClient: PluginVersionsClient,
  configuredPluginsClient: ConfiguredPluginsClient,
  releasesClient: ReleasesClient,
) {
  return async (option: ListPluginVersionsOption): Promise<ListPluginVersions[]> => {
    const [result, release] = await Promise.all([pluginVersionsClient.list(option.name), releasesClient.active()]);

    const versions = result.plugin_versions.map((version) => ({
      sid: version.sid,
      pluginSid: version.plugin_sid,
      version: version.version,
      url: version.plugin_url,
      changelog: version.changelog,
      isPrivate: version.private,
      isActive: false,
      dateCreated: version.date_created,
    }));

    if (release && versions.length) {
      const installedPlugins = (await configuredPluginsClient.list(release.configuration_sid)).plugins;
      versions.forEach(
        (version) => (version.isActive = installedPlugins.some((p) => p.plugin_version_sid === version.sid)),
      );
    }

    return versions;
  };
}
