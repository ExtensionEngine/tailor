import { concat, isArray, isEmpty } from 'lodash';
import Permissions from '../utils/perms';
import state from '../store';

export default {
  name: 'permissions',
  inserted(el, binding, vnode) {
    const { value, modifiers } = binding;
    const permissions = Permissions(state.getters.user);

    // Accepts permissions as directive values and modifiers.
    // Modifiers are hardcoded permissions which should always
    // be checked and values can be passed in dynamically.
    const staticPermissions = !isEmpty(modifiers) ? Object.keys(modifiers) : [];
    const dynamicPermissions = isArray(value) && !isEmpty(value) ? value : [];
    const allow = permissions.check(concat(staticPermissions, dynamicPermissions));

    if (!allow) vnode.elm.parentNode.removeChild(el);
  }
};
