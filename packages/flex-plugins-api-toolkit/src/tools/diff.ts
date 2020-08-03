import { DescribeConfiguration } from '../scripts';
import { ConfiguredPlugins } from '../scripts/describeConfiguration';

export interface Difference<T> {
  path: keyof T;
  before: unknown;
  after: unknown;
}

export type ConfigurationsDiff = {
  configuration: Difference<Omit<DescribeConfiguration, 'plugins'>>[];
  plugins: {
    [key: string]: Difference<ConfiguredPlugins>[];
  };
};

/**
 * Dynamically sets the type of the value field
 *
 * @param diff  the original diff
 * @param key   the key of the template of the diff to change the type
 * @private
 */
export const setDiffType = <T, K extends keyof T, U extends T[K]>(
  diff: Difference<T>,
  key: K,
): Difference<T> & { before: U; after: U } => {
  return diff as Difference<T> & { before: U; after: U };
};

/**
 * Finds diff between two {@link DescribeConfiguration}
 * @param oldConfig the old {@link DescribeConfiguration}
 * @param newConfig the new {@link DescribeConfiguration}
 */
export const findConfigurationsDiff = (
  oldConfig: DescribeConfiguration,
  newConfig: DescribeConfiguration,
): ConfigurationsDiff => {
  const diffs: ConfigurationsDiff = {
    configuration: [],
    plugins: {},
  };

  diffs.configuration.push(
    setDiffType(
      {
        path: 'name',
        before: oldConfig.name,
        after: newConfig.name,
      },
      'name',
    ),
  );
  diffs.configuration.push(
    setDiffType(
      {
        path: 'description',
        before: oldConfig.description,
        after: newConfig.description,
      },
      'description',
    ),
  );
  diffs.configuration.push(
    setDiffType(
      {
        path: 'isActive',
        before: oldConfig.isActive,
        after: newConfig.isActive,
      },
      'isActive',
    ),
  );

  const appendPluginDiff = (beforePlugins: ConfiguredPlugins[], afterPlugins: ConfiguredPlugins[]) => {
    beforePlugins.forEach((beforePlugin) => {
      const afterPlugin = afterPlugins.find((p) => p.pluginSid === beforePlugin.pluginSid);

      if (beforePlugin.name === 'plugin-sample') {
      }
      // We've already added this, skip
      if (!diffs.plugins[beforePlugin.name]) {
        const diff: Difference<ConfiguredPlugins>[] = [];

        Object.entries(beforePlugin).forEach(([key, value]) => {
          diff.push({
            path: key as keyof ConfiguredPlugins,
            before: value,
            after: afterPlugin && afterPlugin[key],
          });
        });

        diffs.plugins[beforePlugin.name] = diff;
      }
    });
  };

  appendPluginDiff(oldConfig.plugins, newConfig.plugins);
  appendPluginDiff(newConfig.plugins, oldConfig.plugins);

  return diffs;
};
