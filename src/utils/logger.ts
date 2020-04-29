/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from 'util';

import chalk from 'chalk';

import { isDebug } from './env';

type Level = 'info' | 'error' | 'warn';
type Color = 'red' | 'yellow' | 'green' | 'blue';
type LogLevels = 'debug' | 'info' | 'warning' | 'error';

interface LogArg {
  color?: Color;
  level: Level;
  args: string[];
}

/**
 *  The internal logger method
 * @param args
 * @private
 */
const _log = (args: LogArg) => {
  const color = args.color ? chalk[args.color] : null;
  const msg = format.apply({}, args.args as any);
  // eslint-disable-next-line no-console
  console[args.level]((color && color(msg)) || msg);
};

/**
 * debug level log
 * @param args
 */
export const debug = (...args: any[]) => {
  if (isDebug()) {
    _log({ level: 'info', args });
  }
};

/**
 * info level log
 * @param args
 */
export const info = (...args: any[]) => {
  _log({ level: 'info', args });
};

/**
 * success level log
 * @param args
 */
export const success = (...args: any[]) => {
  _log({ level: 'info', color: 'green', args });
};

/**
 * error level log
 * @param args
 */
export const error = (...args: any[]) => {
  _log({ level: 'error', color: 'red', args });
};

/**
 * warning level log
 * @param args
 */
export const warning = (...args: any[]) => {
  _log({ level: 'warn', color: 'yellow', args });
};

/**
 * Appends new line
 * @param lines the number of lines to append
 */
export const newline = (lines: number = 1) => {
  for (let i = 0; i < lines; i++) {
    info();
  }
};

export default {
  debug,
  info,
  warning,
  error,
  success,
  newline,
};
