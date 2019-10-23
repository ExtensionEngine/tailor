// NOTE: `brace` is browserify compatible ACE wrapper.
import ace from 'brace';
import autoBind from 'auto-bind';
import beautify from 'js-beautify/js/src/html';
// eslint-disable-next-line sort-imports
import 'brace/mode/html';
import 'brace/theme/chrome';

// NOTE: Unfortunately jodit gets ACE constructor from window global. :(
window.ace = ace;

/** @typedef {import('jodit/src/Config').Config & import('jodit/src/plugins')} Config */
/** @typedef {import('jodit').IJodit} Jodit */

export default class SourceEditorPlugin {
  static get pluginName() {
    return 'source-editor';
  }

  constructor(options) {
    options.theme = options.theme || 'ace/theme/chrome';
    autoBind(this);
  }

  /**
   * @param {Config} config
   */
  apply(config) {
    config.sourceEditorNativeOptions = config.sourceEditorNativeOptions || {};
    Object.assign(config.sourceEditorNativeOptions, {
      mode: 'ace/mode/html',
      theme: this.options.theme
    });
  }

  /**
   * @param {Jodit} jodit
   */
  init(jodit) {
    if (jodit.options.beautifyHTML) {
      // NOTE: Unfortunately jodit gets beautify function from window global. :(
      window.html_beautify = beautify;
    }
    jodit.events.on('aceInited', this.onAceEditorReady);
  }

  onAceEditorReady() {
    const { source } = this.jodit.__plugins;
    /** @type {import('brace').Editor} */
    const aceEditor = source.aceEditor;
    aceEditor.setShowPrintMargin(false);
  }

  /**
   * @param {Jodit} jodit
   */
  beforeDestruct(jodit) {
    jodit.events.off('aceInited', this.onAceEditorReady);
  }
}
