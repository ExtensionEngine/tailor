import './image-embed.scss';
import { Quill } from 'vue-quill-editor';
import repeat from 'lodash/repeat';
import Tooltip from './tooltip';

const Keyboard = Quill.import('modules/keyboard');

class EmbedTooltip extends Tooltip {
  constructor(quill, bounds, { spacing = 0 } = {}) {
    super(quill, bounds);
    this.padding = repeat(' ', spacing);
    this.textbox = this.root.querySelector('input.url');
    this.btnAction = this.root.querySelector('a.action');
    this.listen();
  }

  listen() {
    this.btnAction.addEventListener('click', () => this.embedImage());
    this.textbox.addEventListener('keydown', e => {
      if (Keyboard.match(e, 'enter')) {
        this.embedImage();
        e.preventDefault();
      } else if (Keyboard.match(e, 'escape')) {
        this.hide();
        e.preventDefault();
      }
    });
  }

  show() {
    super.show();
    this.root.classList.add('ql-image-embed');
    this.textbox.select();
  }

  embedImage() {
    const url = this.textbox.value;
    if (!url) return;
    const { quill } = this;
    const range = quill.getSelection(true);
    if (range) {
      const { padding } = this;
      const source = Quill.sources.USER;
      let offset = range.index + range.length;
      quill.insertText(offset, padding, source);
      offset += padding.length;
      quill.insertEmbed(offset, 'image', url, source);
      offset += 1;
      quill.insertText(offset, padding, source);
      offset += padding.length;
      quill.setSelection(offset, source);
    }
    this.textbox.value = '';
    this.hide();
  }
}

EmbedTooltip.TEMPLATE = `
  <div class="controls">
    <label>Enter image url:</label>
    <input class="url" type="text">
    <a class="action">Save</a>
  </div>`;

export default class ImageEmbed {
  constructor(quill, options = {}) {
    this.quill = quill;
    quill.tooltips = quill.tooltips = {};
    const bounds = quill.options.bounds;
    quill.tooltips.imageEmbed = new EmbedTooltip(quill, bounds, options);
  }
}
