import autoBind from 'auto-bind';

const isFunction = arg => typeof arg === 'function';
const isString = arg => typeof arg === 'string';
const hide = el => (el.style.display = 'none');
const show = el => (el.style.display = 'block');
const splitArray = arg => isString(arg) ? arg.split(/[,\s]+/) : arg;

/** @typedef {import('jodit/src/Config').Config & import('jodit/src/plugins')} Config */
/** @typedef {import('jodit').IJodit} Jodit */

export default class ExternalToolbarPlugin {
  static get pluginName() {
    return 'external-toolbar';
  }

  constructor(options) {
    options.readyEvent = options.readyEvent || 'afterInit';
    autoBind(this);
  }

  /**
   * @param {Config} config
   */
  apply(config) {
    config.toolbar = false;
    this.options.buttons = splitArray(config.buttons).concat(config.extraButtons);
  }

  /**
   * @param {Jodit} jodit
   */
  init(jodit) {
    const self = this;
    const { __initEditor } = jodit;
    jodit.__initEditor = function () {
      __initEditor.apply(this, arguments);
      self.renderToolbar();
    };
    jodit.events.on(this.options.readyEvent, this.showToolbar);
  }

  renderToolbar() {
    const { statusbar, toolbar } = this.jodit;
    const container = document.querySelector(this.options.toolbarContainer);
    hide(toolbar.container);
    toolbar.build(this.options.buttons, container);
    if (statusbar) statusbar.show();
  }

  showToolbar() {
    const { toolbar } = this.jodit;
    immediateCheckActiveButtons(toolbar);
    show(toolbar.container);
  }

  /**
   * @param {Jodit} jodit
   */
  beforeDestruct(jodit) {
    jodit.events.off(this.options.readyEvent, this.showToolbar);
  }
}

// TODO: Remove this proxy function after typo inside Jodit source gets fixed!
function immediateCheckActiveButtons(toolbar) {
  if (isFunction(toolbar.immediateCheckActiveButtons)) {
    return toolbar.immediateCheckActiveButtons();
  }
  return toolbar.immedateCheckActiveButtons();
}
