import autoBind from 'auto-bind';
import cloneDeep from 'lodash/cloneDeep';
import uniqueId from 'lodash/uniqueId';

const JODIT_TOOLBAR_SEPARATOR = '|';

/** @typedef {import('jodit').IJodit} Jodit */

export default class ToolbarBuilderPlugin {
  static get pluginName() {
    return 'toolbar-builder';
  }

  constructor(options) {
    options.buttons = options.buttons || [];
    options.separator = options.separator || JODIT_TOOLBAR_SEPARATOR;
    autoBind(this);
  }

  /**
   * @param {Config} config
   * @param {*} Jodit
   */
  apply(config, Jodit) {
    const language = config.language || 'en';
    config.language = uniqueId(`${language}_`);
    Jodit.lang[config.language] = cloneDeep(Jodit.lang[language]);
    this.options.language = config.language;
    config.buttons = [];
    this.options.buttons.forEach(it => this.addGroup(config, Jodit, it));
  }

  addGroup(config, Jodit, controls = []) {
    const buttons = controls.reduce((acc, [name, tooltip]) => {
      const control = config.controls[name];
      const lang = Jodit.lang[this.options.language];
      if (!control) return acc;
      control.tooltip = control.tooltip || tooltip;
      Object.assign(lang, { [control.tooltip]: tooltip });
      Object.assign(control, { hotkeys: [] });
      acc.push(name);
      return acc;
    }, []);
    if (config.buttons.length > 0 && buttons.length > 0) {
      config.buttons.push(this.options.separator);
    }
    config.buttons = config.buttons.concat(buttons);
  }
}
