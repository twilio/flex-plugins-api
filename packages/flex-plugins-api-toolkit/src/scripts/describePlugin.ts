import { ConfiguredPluginsClient, PluginsClient, PluginVersionsClient, ReleasesClient } from 'flex-plugins-api-client';

import { Script } from '.';
import { PluginVersion } from './describePluginVersion';

export interface DescribePluginOption {
  name: string;
}

export interface Plugin {
  sid: string;
  name: string;
  friendlyName: string;
  description: string;
  dateCreated: string;
  dateUpdated: string;
}

export interface DescribePlugin extends Plugin {
  isActive: boolean;
  versions: PluginVersion[];
}

export type DescribePluginScript = Script<DescribePluginOption, DescribePlugin>;

/**
 * The .describePlugin script. This script describes a plugin
 * @param pluginClient        the Public API {@link PluginsClient}
 * @param pluginVersionClient the Public API {@link PluginVersionsClient}
 * @param configuredPluginClient the Public API {@link ConfiguredPluginsClient}
 * @param releasesClient the Public API {@link ReleasesClient}
 */
export default function describePlugin(
  pluginClient: PluginsClient,
  pluginVersionClient: PluginVersionsClient,
  configuredPluginClient: ConfiguredPluginsClient,
  releasesClient: ReleasesClient,
): DescribePluginScript {
  return async (option: DescribePluginOption) => {
    const [plugin, versions, release] = await Promise.all([
      pluginClient.get(option.name),
      pluginVersionClient.list(option.name),
      releasesClient.active(),
    ]);

    let isPluginActive = false;
    const formattedVersions: PluginVersion[] = versions.plugin_versions.map((version) => ({
      sid: version.sid,
      version: version.version,
      url: version.plugin_url,
      changelog: version.changelog,
      isPrivate: version.private,
      isActive: false,
      dateCreated: version.date_created,
    }));

    if (release) {
      const installedPlugins = (await configuredPluginClient.list(release.configuration_sid)).plugins;
      isPluginActive = installedPlugins.some((p) => p.plugin_sid === plugin.sid);
      formattedVersions.forEach((v) => {
        v.isActive = installedPlugins.some((p) => p.plugin_version_sid === v.sid);
      });
    }

    return {
      sid: plugin.sid,
      name: plugin.unique_name,
      friendlyName: plugin.friendly_name,
      description: plugin.description,
      isActive: isPluginActive,
      versions: formattedVersions,
      dateCreated: plugin.date_created,
      dateUpdated: plugin.date_updated,
    };
  };
}
