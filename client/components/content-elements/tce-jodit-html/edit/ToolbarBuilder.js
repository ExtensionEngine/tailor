import Jodit from 'jodit';
import tooltipControl from './controls/tooltip';

const JODIT_TOOLBAR_SEPARATOR = '|';

Object.assign(Jodit.defaultOptions.controls, tooltipControl);

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
      const { en } = Jodit.lang;
      if (!control) return acc;
      control.tooltip = control.tooltip || tooltip;
      Object.assign(en, { [control.tooltip]: tooltip });
      Object.assign(control, { hotkeys: [] });
      acc.push(name);
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
