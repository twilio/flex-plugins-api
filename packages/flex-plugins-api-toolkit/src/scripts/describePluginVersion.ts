import { ConfiguredPluginsClient, PluginsClient, PluginVersionsClient, ReleasesClient } from 'flex-plugins-api-client';

import { Script } from '.';
import { Plugin } from './describePlugin';

export interface DescribePluginVersionOption {
  name: string;
  version: string;
}

export interface PluginVersion {
  sid: string;
  version: string;
  url: string;
  changelog: string;
  isPrivate: boolean;
  isActive: boolean;
  dateCreated: string;
}

export interface DescribePluginVersion extends PluginVersion {
  plugin: Plugin;
}

export type DescribePluginVersionScript = Script<DescribePluginVersionOption, DescribePluginVersion | null>;

/**
 * The .describePluginVersion script. This script describes a plugin version.
 * @param pluginClient        the Public API {@link PluginsClient}
 * @param pluginVersionClient the Public API {@link PluginVersionsClient}
 * @param configuredPluginClient the Public API {@link ConfiguredPluginsClient}
 * @param releasesClient the Public API {@link ReleasesClient}
 */
export default function describePluginVersion(
  pluginClient: PluginsClient,
  pluginVersionClient: PluginVersionsClient,
  configuredPluginClient: ConfiguredPluginsClient,
  releasesClient: ReleasesClient,
): DescribePluginVersionScript {
  return async (option: DescribePluginVersionOption) => {
    const [plugin, version, release] = await Promise.all([
      pluginClient.get(option.name),
      pluginVersionClient.get(option.name, option.version),
      releasesClient.active(),
    ]);

    let isActive = false;
    if (release) {
      const installedPlugins = (await configuredPluginClient.list(release.configuration_sid)).plugins;
      isActive = installedPlugins.some((p) => p.plugin_version_sid === version.sid);
    }

    return {
      sid: version.sid,
      version: version.version,
      url: version.plugin_url,
      changelog: version.changelog,
      isPrivate: version.private,
      isActive,
      dateCreated: version.date_created,
      plugin: {
        sid: plugin.sid,
        name: plugin.unique_name,
        friendlyName: plugin.friendly_name,
        description: plugin.description,
        dateCreated: plugin.date_created,
        dateUpdated: plugin.date_updated,
      },
    };
  };
}
