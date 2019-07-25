// NOTE: `brace` is browserify compatible ACE wrapper.
import ace from 'brace';
import beautify from 'js-beautify/js/src/html';
// eslint-disable-next-line sort-imports
import 'brace/mode/html';
import 'brace/theme/chrome';

// NOTE: Unfortunately jodit gets ACE constructor from window global. :(
window.ace = ace;

export const name = 'SourceEditor';

export const install = (Jodit, { theme = 'ace/theme/chrome' } = {}) => {
  const { defaultOptions } = Jodit;
  defaultOptions.sourceEditorNativeOptions = defaultOptions.sourceEditorNativeOptions || {};
  Object.assign(defaultOptions.sourceEditorNativeOptions, {
    mode: 'ace/mode/html',
    theme
  });

  const { source: Source } = Jodit.plugins;
  Jodit.plugins.source = class extends Source {
    constructor(editor) {
      super(editor);
      if (editor.options.beautifyHTML) {
        // NOTE: Unfortunately jodit gets beautify function from window global. :(
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
