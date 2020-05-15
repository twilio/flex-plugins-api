export type Script<O, R> = (options: O) => Promise<R>;

export { default as deployScript, DeployScript } from './deploy';
export { default as createConfigurationScript, CreateConfigurationScript } from './createConfiguration';
export { default as releaseScript, ReleaseScript } from './release';
