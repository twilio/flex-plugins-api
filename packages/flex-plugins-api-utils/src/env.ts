/**
 * Returns true if running in debug verbose mode
 */
export const isDebug = () => process.env.DEBUG === 'true';

/**
 * Returns the realm
 */
export const getRealm = () => process.env.REALM;

export default {
  isDebug,
  getRealm,
};
