import { hooks } from 'sequelize/lib/hooks';
import mapValues from 'lodash/mapValues.js';

const Hooks = mapValues(hooks, (_, key) => key);

Hooks.withType = (hookType, hook) => {
  return function (...args) {
    return hook.call(this, hookType, ...args);
  };
};

export default Hooks;
