const isFunction = arg => typeof arg === 'function';
const isString = arg => typeof arg === 'string';
const splitArray = arg => isString(arg) ? arg.split(/[,\s]+/) : arg;

export const name = 'ExternalToolbar';

export const install = (Jodit, { readyEvent = 'afterInit', toolbarContainer }) => {
  Object.assign(Jodit.defaultOptions, { toolbar: false });

  const { __initEditor } = Jodit.prototype;
  Jodit.prototype.__initEditor = function () {
    __initEditor.apply(this, arguments);
    renderToolbar(this);
  };

  function renderToolbar({ events, options, statusbar, toolbar }) {
    events.on(readyEvent, showToolbar);
    events.on('beforeDestruct', () => {
      if (!events) return;
      events.off(readyEvent, showToolbar);
    });

    const container = document.querySelector(toolbarContainer);
    const buttons = splitArray(options.buttons).concat(options.extraButtons);
    toolbar.container.style.display = 'none';
    toolbar.build(buttons, container);

    if (statusbar) statusbar.show();

    function showToolbar() {
      immediateCheckActiveButtons(toolbar);
      toolbar.container.style.display = 'block';
    }
  }
};

// TODO: Remove this proxy function after typo inside Jodit source gets fixed!
function immediateCheckActiveButtons(toolbar) {
  if (isFunction(toolbar.immediateCheckActiveButtons)) {
    return toolbar.immediateCheckActiveButtons();
  }
  return toolbar.immedateCheckActiveButtons();
}

export default install;
