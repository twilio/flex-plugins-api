import {
  ConfigurationsClient,
  ConfiguredPluginsClient,
  PluginsClient,
  PluginVersionsClient,
} from 'flex-plugins-api-client';
import { TwilioError } from 'flex-plugins-api-utils';

import { Script } from '.';
import { internalDescribeConfiguration } from './describeConfiguration';
import { ConfigurationsDiff, findConfigurationsDiff } from '../tools/diff';

export interface DiffOption {
  resource: 'configuration';
  oldIdentifier: string;
  newIdentifier: string;
}

export type Diff = ConfigurationsDiff;

export type DiffScript = Script<DiffOption, Diff>;

/**
 * The .diff script. This script finds the diff between two resources
 * @param pluginClient        the Public API {@link PluginsClient}
 * @param pluginVersionClient the Public API {@link PluginVersionsClient}
 * @param configurationClient the Public API  {@link ConfigurationsClient}
 * @param configuredPluginClient the Public API {@link ConfiguredPluginsClient}
 */
export default function diff(
  pluginClient: PluginsClient,
  pluginVersionClient: PluginVersionsClient,
  configurationClient: ConfigurationsClient,
  configuredPluginClient: ConfiguredPluginsClient,
): DiffScript {
  const describeConfiguration = internalDescribeConfiguration(
    pluginClient,
    pluginVersionClient,
    configurationClient,
    configuredPluginClient,
  );

  /**
   * Finds the diff of two configurations
   * @param oldSid the old sid of the configuration
   * @param newSid the new sid of the configuration
   */
  const configurationDiff = async (oldSid: string, newSid: string): Promise<Diff> => {
    const oldConfig = await describeConfiguration({ sid: oldSid }, null);
    const newConfig = await describeConfiguration({ sid: newSid }, null);

    return findConfigurationsDiff(oldConfig, newConfig);
  };

  return async (option: DiffOption) => {
    if (option.resource === 'configuration') {
      return configurationDiff(option.oldIdentifier, option.newIdentifier);
    }

    throw new TwilioError(`Diff resource must be 'configuration'`);
  };
}
