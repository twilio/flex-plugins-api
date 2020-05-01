export type Script<O, R> = (options: O) => Promise<R>;

export { default as deployScript } from './deploy';
export { DeployScript } from './deploy';
