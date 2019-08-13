import get from 'lodash/get';

const EVENT_NAME = 'recalcPositionPopup';
const NAMESPACE = 'JoditEventDefaultNamespace';
const SCROLLABLE_PARENT_SELECTOR = '.editor';

export const name = 'TablePopups';

export const install = Jodit => {
  const { afterInitHook } = Jodit.prototype;
  Jodit.prototype.afterInitHook = function () {
    afterInitHook.apply(this, arguments);
    observeTables(this, Jodit);
    addScrollHandler(this);
  };
};

function observeTables(editor, Jodit) {
  const $$ = get(Jodit, 'modules.Helpers.$$', () => []);
  const tableProcessor = get(editor, '__plugins.table', {});
  if (typeof tableProcessor.observe !== 'function') return;
  $$('table', editor.editor).forEach(table => {
    if (table[tableProcessor.__key]) return;
    tableProcessor.observe(table);
  });
}

function addScrollHandler(editor) {
  const node = document.querySelector(SCROLLABLE_PARENT_SELECTOR);
  const popup = get(editor, '__plugins.inlinePopup');
  const handler = getScrollHandler(editor, popup);
  if (!popup || !node || !handler) return;
  node.addEventListener('scroll', handler);
  editor.events.on('beforeDestruct', () => {
    node.removeEventListener('scroll', handler);
  });
}

function getScrollHandler(editor, popup = {}) {
  const store = editor.events.getStore(editor.events);
  const [{ originalCallback } = {}] = store.get(EVENT_NAME, NAMESPACE);
  if (typeof originalCallback !== 'function') return;
  return () => {
    if (!popup.isShown) return;
    originalCallback.call(popup);
  };
}

export default install;
