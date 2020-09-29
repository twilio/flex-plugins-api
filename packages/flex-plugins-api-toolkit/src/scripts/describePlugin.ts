import {
  ConfiguredPluginResourcePage,
  ConfiguredPluginsClient,
  PluginResource,
  PluginsClient,
  PluginVersionsClient,
  ReleaseResource,
  ReleasesClient,
} from 'flex-plugins-api-client';

import { Script } from '.';
import { PluginVersion } from './describePluginVersion';

interface OptionalResources {
  plugin?: PluginResource;
  activeRelease?: ReleaseResource;
  configuredPlugins: ConfiguredPluginResourcePage;
}

export interface DescribePluginOption {
  name: string;
  resources?: OptionalResources;
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
    const resources = option.resources ? option.resources : ({} as OptionalResources);

    const [plugin, versions, release] = await Promise.all([
      resources.plugin ? Promise.resolve(resources.plugin) : pluginClient.get(option.name),
      pluginVersionClient.list(option.name),
      resources.activeRelease ? Promise.resolve(resources.activeRelease) : releasesClient.active(),
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
      const list = await (resources.configuredPlugins
        ? Promise.resolve(resources.configuredPlugins)
        : configuredPluginClient.list(release.configuration_sid));
      isPluginActive = list.plugins.some((p) => p.plugin_sid === plugin.sid);
      formattedVersions.forEach((v) => {
        v.isActive = list.plugins.some((p) => p.plugin_version_sid === v.sid);
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
