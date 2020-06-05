export type Script<O, R> = (options: O) => Promise<R>;

export { default as deployScript, DeployScript, DeployOption, DeployPlugin } from './deploy';
export {
  default as createConfigurationScript,
  CreateConfigurationScript,
  CreateConfigurationOption,
  CreateConfiguration,
  InstalledPlugin,
} from './createConfiguration';
export { default as releaseScript, ReleaseScript, ReleaseOption, Release } from './release';
export {
  default as describePluginScript,
  DescribePluginScript,
  DescribePluginOption,
  DescribePlugin,
} from './describePlugin';
export {
  default as describePluginVersionScript,
  DescribePluginVersionScript,
  DescribePluginVersionOption,
  DescribePluginVersion,
} from './describePluginVersion';
export {
  default as describeConfigurationScript,
  DescribeConfigurationScript,
  DescribeConfigurationOption,
  DescribeConfiguration,
} from './describeConfiguration';
export {
  default as describeReleaseScript,
  DescribeReleaseScript,
  DescribeReleaseOption,
  DescribeRelease,
} from './describeRelease';
