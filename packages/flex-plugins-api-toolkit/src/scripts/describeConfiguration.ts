import {
  ConfigurationsClient,
  ConfiguredPluginsClient,
  PluginsClient,
  PluginVersionsClient,
  ReleaseResource,
  ReleasesClient,
} from 'flex-plugins-api-client';
import { TwilioError } from 'flex-plugins-api-utils';

import { Script } from '.';
import { DeployPlugin } from './deploy';

interface DescribeConfigurationOption {
  version: string;
}

interface ConfiguredPlugins extends DeployPlugin {
  phase: number;
}

export interface Configuration {
  sid: string;
  version: string;
  description: string;
  dateCreated: string;
}

export interface DescribeConfiguration extends Configuration {
  isActive: boolean;
  plugins: ConfiguredPlugins[];
}

export type DescribeConfigurationScript = Script<DescribeConfiguration, DescribeConfigurationOption>;

/**
 * Internal method for returning configuration
 * @param pluginClient        the Public API {@link PluginsClient}
 * @param pluginVersionClient the Public API {@link PluginVersionsClient}
 * @param configurationClient the Public API  {@link ConfigurationsClient}
 * @param configuredPluginClient the Public API {@link ConfiguredPluginsClient}
 */
export function internalDescribeConfiguration(
  pluginClient: PluginsClient,
  pluginVersionClient: PluginVersionsClient,
  configurationClient: ConfigurationsClient,
  configuredPluginClient: ConfiguredPluginsClient,
) {
  return async (option: DescribeConfigurationOption, release: ReleaseResource) => {
    const configuration = await configurationClient.get(option.version);

    const isActive = release && release.configuration_sid === configuration.sid;
    const list = (await configuredPluginClient.list(option.version)).plugins;
    const pluginsPromise = list.map(async (p) => pluginClient.get(p.plugin_sid));
    const versionsPromise = list.map(async (p) => pluginVersionClient.get(p.plugin_sid, p.plugin_version_sid));
    const [plugins, versions] = await Promise.all([
      await Promise.all(pluginsPromise),
      await Promise.all(versionsPromise),
    ]);

    const installedPlugins: ConfiguredPlugins[] = list.map((p) => {
      const plugin = plugins.find((i) => i.sid === p.plugin_sid);
      const version = versions.find((i) => i.sid === p.plugin_version_sid);
      if (!plugin || !version) {
        // This should never happen
        throw new TwilioError('Expected resource was not found');
      }

      return {
        pluginSid: p.plugin_sid,
        pluginVersionSid: p.plugin_version_sid,
        name: p.unique_name,
        version: p.version,
        url: p.plugin_url,
        friendlyName: plugin.friendly_name,
        description: plugin.description,
        changelog: version.changelog,
        isPrivate: p.private,
        phase: p.phase,
      };
    });

    return {
      sid: configuration.sid,
      version: configuration.version,
      description: configuration.description,
      isActive,
      plugins: installedPlugins,
      dateCreated: configuration.date_created,
    };
  };
}

/**
 * The .describeConfiguration script. This script describes a configuration.
 * @param pluginClient        the Public API {@link PluginsClient}
 * @param pluginVersionClient the Public API {@link PluginVersionsClient}
 * @param configurationClient the Public API  {@link ConfigurationsClient}
 * @param configuredPluginClient the Public API {@link ConfiguredPluginsClient}
 * @param releasesClient the Public API {@link ReleasesClient}
 */
export default function describeConfiguration(
  pluginClient: PluginsClient,
  pluginVersionClient: PluginVersionsClient,
  configurationClient: ConfigurationsClient,
  configuredPluginClient: ConfiguredPluginsClient,
  releasesClient: ReleasesClient,
): DescribeConfigurationScript {
  return async (option: DescribeConfigurationOption) => {
    const release = await releasesClient.active();

    return internalDescribeConfiguration(
      pluginClient,
      pluginVersionClient,
      configurationClient,
      configuredPluginClient,
    )(option, release);
  };
}
