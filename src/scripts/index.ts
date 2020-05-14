export type Script<O, R> = (options: O) => Promise<R>;

export { default as deployScript } from './deploy';
export { DeployScript } from './deploy';

export { default as createConfigurationScript } from './createConfiguration';
export { CreateConfigurationScript } from './createConfiguration';
