import { Quill } from 'vue-quill-editor';
import Tooltip from './tooltip';

import './image-embed.scss';
const Keyboard = Quill.import('modules/keyboard');

class EmbedTooltip extends Tooltip {
  constructor(quill, bounds) {
    super(quill, bounds);
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
      const index = range.index + range.length;
      const source = Quill.sources.USER;
      quill.insertEmbed(index, 'image', url, source);
      quill.insertText(index + 1, ' ', source);
      quill.setSelection(index + 2, source);
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
  constructor(quill) {
    this.quill = quill;
    quill.tooltips = quill.tooltips = {};
    quill.tooltips.imageEmbed = new EmbedTooltip(quill, quill.options.bounds);
  }
}
