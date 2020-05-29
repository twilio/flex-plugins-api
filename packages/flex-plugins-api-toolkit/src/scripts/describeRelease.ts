import {
  ConfigurationsClient,
  ConfiguredPluginsClient,
  PluginsClient,
  PluginVersionsClient,
  ReleasesClient,
} from 'flex-plugins-api-client';

import { Script } from '.';
import { DescribeConfiguration, internalDescribeConfiguration } from './describeConfiguration';

export interface DescribeReleaseOption {
  sid: string;
}

interface Release {
  sid: string;
  configurationSid: string;
  isActive: boolean;
  dateCreated: string;
}

export interface DescribeRelease extends Release {
  configuration: DescribeConfiguration;
}

export type DescribeReleaseScript = Script<DescribeReleaseOption, DescribeRelease>;

/**
 * The .describeRelease script. This script describes a release.
 * @param pluginClient        the Public API {@link PluginsClient}
 * @param pluginVersionClient the Public API {@link PluginVersionsClient}
 * @param configurationClient the Public API  {@link ConfigurationsClient}
 * @param configuredPluginClient the Public API {@link ConfiguredPluginsClient}
 * @param releasesClient the Public API {@link ReleasesClient}
 */
export default function describeRelease(
  pluginClient: PluginsClient,
  pluginVersionClient: PluginVersionsClient,
  configurationClient: ConfigurationsClient,
  configuredPluginClient: ConfiguredPluginsClient,
  releasesClient: ReleasesClient,
): DescribeReleaseScript {
  return async (option: DescribeReleaseOption) => {
    const release = await releasesClient.get(option.sid);
    const active = await releasesClient.active();

    const configuration = await internalDescribeConfiguration(
      pluginClient,
      pluginVersionClient,
      configurationClient,
      configuredPluginClient,
    )({ version: release.configuration_sid }, release);

    return {
      sid: release.sid,
      configurationSid: release.configuration_sid,
      isActive: Boolean(active && active.sid === release.sid),
      configuration,
      dateCreated: release.date_created,
    };
  };
}
