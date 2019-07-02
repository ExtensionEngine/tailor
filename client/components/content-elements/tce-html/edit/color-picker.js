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
    const btnReset = document.createElement('button');
    btnReset.className = className('picker-item__none');
    btnReset.tabIndex = 0;
    btnReset.appendChild(createIcon('water-off'));
    btnReset.innerHTML += 'None';
    btnReset.addEventListener('click', () => {
      this.quill.format(this.type, null, Quill.sources.USER);
    });
    this.options.insertAdjacentElement('afterbegin', btnReset);
  }
}

function createIcon(name) {
  const icon = document.createElement('span');
  icon.className = className('icon', 'mdi', `mdi-${name}`);
  return icon;
}
