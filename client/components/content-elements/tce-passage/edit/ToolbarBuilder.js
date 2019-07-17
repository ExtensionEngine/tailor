import Jodit from 'jodit';

const JODIT_TOOLBAR_SEPARATOR = '|';

export default class ToolbarBuilder {
  constructor() {
    this._buttons = [];
  }

  get buttons() {
    return this._buttons;
  }

  static get separator() {
    return JODIT_TOOLBAR_SEPARATOR;
  }

  static build(groups = []) {
    const builder = new this();
    groups.forEach(it => builder.addGroup(it));
    return builder.buttons;
  }

  addGroup(controls = []) {
    const buttons = controls.reduce((acc, [name, tooltip]) => {
      const control = Jodit.defaultOptions.controls[name];
      if (!control) return acc;
      Object.assign(control, { tooltip, hotkeys: [] });
      acc.push(control.name || name);
      return acc;
    }, []);
    if (this._buttons.length > 0 && buttons.length > 0) {
      this._buttons.push(this.constructor.separator);
    }
    this._buttons = this._buttons.concat(buttons);
    return this;
  }

  _setTooltip(control, tooltip) {
    const options = Jodit.defaultOptions.controls[control];
    if (!options) return;
    Object.assign(options, { tooltip });
  }
}
