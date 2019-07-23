import ace from 'brace';
import beautify from 'js-beautify/js/src/html';
// eslint-disable-next-line sort-imports
import 'brace/mode/html';
import 'brace/theme/chrome';

window.ace = ace;

export const name = 'SourceEditor';

export const install = Jodit => {
  const { defaultOptions } = Jodit;
  defaultOptions.sourceEditorNativeOptions = defaultOptions.sourceEditorNativeOptions || {};
  Object.assign(defaultOptions.sourceEditorNativeOptions, {
    mode: 'ace/mode/html',
    theme: 'ace/theme/chrome'
  });

  const { source: Source } = Jodit.plugins;
  Jodit.plugins.source = class extends Source {
    constructor(editor) {
      super(editor);
      if (editor.options.beautifyHTML) {
        window.html_beautify = beautify;
      }
      editor.events.on('aceInited', this.onAceEditorReady);
    }

    beforeDestruct(editor) {
      if (editor.events) editor.events.off('aceInited', this.onAceEditorReady);
      return super.beforeDestruct(editor);
    }

    onAceEditorReady = () => {
      const { aceEditor } = this;
      aceEditor.setShowPrintMargin(false);
    }
  };
};

export default install;
