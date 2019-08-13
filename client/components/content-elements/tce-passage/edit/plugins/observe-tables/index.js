import get from 'lodash/get';

export const name = 'ObserveTables';

export const install = Jodit => {
  const { afterInitHook } = Jodit.prototype;
  Jodit.prototype.afterInitHook = function () {
    afterInitHook.apply(this, arguments);
    observeTables(this, Jodit);
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

export default install;
