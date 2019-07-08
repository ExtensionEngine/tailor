import './color-picker.scss';
import { Quill } from 'vue-quill-editor';

const BaseColorPicker = Quill.import('ui/color-picker');

const className = (...names) => names.join(' ');

export default class ColorPicker extends BaseColorPicker {
  constructor(quill, { type, select, label }) {
    super(select, label);
    this.quill = quill;
    this.type = type;
  }

  buildPicker() {
    super.buildPicker();
    const btnReset = createButton({ icon: 'mdi-water-off', text: 'None' });
    btnReset.className = className('picker-item__none');
    btnReset.addEventListener('click', () => {
      this.quill.format(this.type, null, Quill.sources.USER);
      this.close();
    });
    const colorOptions = wrapOptions(this.options);
    colorOptions.className = className('picker-colors');
    this.options.appendChild(btnReset);
    this.options.appendChild(colorOptions);
  }
}

function wrapOptions(options) {
  const container = document.createElement('div');
  Array.from(options.children).forEach(option => container.appendChild(option));
  return container;
}

function createButton({ icon, text }) {
  const btn = document.createElement('button');
  btn.tabIndex = 0;
  btn.appendChild(createIcon(icon));
  btn.innerHTML += text;
  return btn;
}

function createIcon(name) {
  const icon = document.createElement('span');
  icon.className = className('icon', 'mdi', name);
  return icon;
}
