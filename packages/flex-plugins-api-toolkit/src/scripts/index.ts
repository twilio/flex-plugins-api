export type Script<O, R> = (options: O) => Promise<R>;

export { default as deployScript, DeployScript } from './deploy';
export { default as createConfigurationScript, CreateConfigurationScript } from './createConfiguration';
export { default as releaseScript, ReleaseScript } from './release';
export { default as describePluginScript, DescribePluginScript } from './describePlugin';
export { default as describePluginVersionScript, DescribePluginVersionScript } from './describePluginVersion';
export { default as describeConfigurationScript, DescribeConfigurationScript } from './describeConfiguration';
export { default as describeReleaseScript, DescribeReleaseScript } from './describeRelease';
