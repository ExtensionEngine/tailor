import autoBind from 'auto-bind';

/** @typedef {import('jodit').IJodit} Jodit */

export default class AutofocusPlugin {
  static get pluginName() {
    return 'autofocus';
  }

  constructor(options) {
    options.readyEvent = options.readyEvent || 'joditReady';
    options.cursorStyle = options.cursorStyle || 'auto';
    autoBind(this);
  }

  /**
   * @param {Jodit} jodit
   */
  init(jodit) {
    jodit.editor.style.cursor = this.options.cursorStyle;
  }

  /**
   * @param {Jodit} jodit
   */
  afterInit(jodit) {
    setTimeout(() => {
      jodit.selection.focus();
      jodit.events.fire(this.options.readyEvent);
    }, 0);
  }
}
