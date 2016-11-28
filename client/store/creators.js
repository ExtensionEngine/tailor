/**
 * Creates action types with prefix.
 * @param {String} prefix  Prefix all types with
 * @param {Array} actions  List of actions to create
 * @return {Object} Key/value pairs of action names and prefixed action names
 */
export function createMutationTypes(prefix, actions) {
  return actions.map(action => ({
    [action]: `${prefix}/${action}`
  }));
};
