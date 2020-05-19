export type Realm = 'dev' | 'stage';

/**
 * Returns true if running in debug verbose mode
 */
export const isDebug = () => process.env.DEBUG === 'true';

/**
 * Returns the realm
 */
export const getRealm = () => process.env.REALM as Realm;

export default {
  isDebug,
  getRealm,
};
