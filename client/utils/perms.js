import settings from '../../config/shared';

/**
 * Partially applied function for lazy binding of reactive data.
 * Returns object which exposes check function for checking wether
 * logged in user has given permissions.
 *
 * @param  {object} role Object with predefined user roles.
 * @param  {user} user Currently logged in user. Passed from state.
 * @return {object} Object containing check function.
 */
const Permissions = role => user => {
  const hasPermission = role => user.role === role;

  const permissionMapper = {
    isSystemAdmin: () => hasPermission(role.SYSTEM_ADMIN),
    isAdmin: () => hasPermission(role.ADMIN),
    isContentAuthor: () => hasPermission(role.CONTENT_AUTHOR),
    isUser: () => hasPermission(role.USER)
  };

  return {
    /**
     * Spreads multipe arguments in an array. Iterates through passed perms
     * and check against permission function from permission wrapper.
     *
     * @param  {array} ...perms Perms to check for logged in user.
     * @return {boolean} Wether or not user has the permission.
     */
    check(...perms) {
      let allow = false;

      // Flatten just in case
      perms.forEach(p => {
        const mapper = permissionMapper[p];
        if (mapper) allow = allow || mapper(p);
      });

      return allow;
    }
  };
};

export default Permissions(settings.role);
