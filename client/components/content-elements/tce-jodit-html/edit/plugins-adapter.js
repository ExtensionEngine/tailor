import autoBind from 'auto-bind';
import cloneDeep from 'lodash/cloneDeep';
import keysIn from 'lodash/keysIn';
import uniqueId from 'lodash/uniqueId';

const isFunction = arg => typeof arg === 'function';
const isString = arg => typeof arg === 'string';
const splitArray = arg => isString(arg) ? arg.split(/[,\s]+/) : arg;

/** @typedef {import('jodit/src/Config').Config & import('jodit/src/plugins')} Config */
/** @typedef {import('jodit').IJodit} Jodit */

class PluginProxy {
  /**
   * @param {Object} plugin
   * @param {Jodit} jodit
   */
  constructor(plugin, jodit) {
    this._plugin = plugin;
    this.jodit = jodit;
    autoBind(this);
    jodit.events
      .on('afterInit', this.afterInit)
      .on('beforeDestruct', this.beforeDestruct);
  }

  afterInit() {
    if (!isFunction(this._plugin.afterInit)) return;
    this._plugin.afterInit(this.jodit);
  }

  beforeDestruct() {
    this.jodit.events.off('beforeDestruct', this.beforeDestruct);
    if (!isFunction(this._plugin.beforeDestruct)) return;
    this._plugin.beforeDestruct(this.jodit);
  }

  destruct() {
    if (!isFunction(this._plugin.destruct)) return;
    this._plugin.destruct();
  }
}

export default function extend(Jodit) {
  /**
   * @param {Config} config
   */
  Jodit.prototype.$applyPlugins = function (config) {
    const { plugins = [] } = config;
    const disablePlugins = splitArray(config.disablePlugins);
    this.__plugins = this.__plugins = {};
    this.$plugins = new Map();
    plugins.forEach(({ use: Plugin, options = {} }) => {
      const { pluginName } = Plugin;
      if (disablePlugins.includes(pluginName)) return;
      // Create plugin instance with provided options.
      const plugin = new Plugin(options);
      plugin.options = options;
      this.$plugins.set(pluginName, plugin);
      this.__plugins[uniqueId('plugin_proxy__')] = new PluginProxy(plugin, this);
      // Apply plugin on jodit options.
      if (isFunction(plugin.apply)) plugin.apply(config, Jodit);
    });
  };

  Object.defineProperty(Jodit.prototype, 'options', {
    enumerable: true,
    configurable: false,
    get() {
      return this.$options;
    },
    set(options = {}) {
      if (this.jodit) {
        options = cloneOptions(options);
        this.$applyPlugins(options);
      }
      this.$options = options;
    }
  });

  const { __initPlugines } = Jodit.prototype;
  Jodit.prototype.__initPlugines = function () {
    this.$plugins.forEach(plugin => {
      if (isFunction(plugin.init)) plugin.init(this, plugin.options);
      plugin.jodit = this;
    });
    return __initPlugines.apply(this, arguments);
  };
}

function cloneOptions(options) {
  const shared = ['ownerDocument', 'ownerWindow'];
  return Object.fromEntries(keysIn(options).map(key => {
    const value = options[key];
    if (shared.includes(key)) return [key, value];
    return [key, cloneDeep(value)];
  }));
}
