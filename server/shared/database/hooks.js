import { hooks } from 'sequelize/lib/hooks.js';
import mapValues from 'lodash/mapValues';

const Hooks = mapValues(hooks, (_, key) => key);

Hooks.withType = (hookType, hook) => {
  return function (...args) {
    return hook.call(this, hookType, ...args);
  };
};

export default Hooks;
