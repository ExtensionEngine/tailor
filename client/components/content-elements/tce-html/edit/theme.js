import ColorPicker from './ui/color-picker';
import { Quill } from 'vue-quill-editor';

const SnowTheme = Quill.import('themes/snow');

export default class CustomTheme extends SnowTheme {
  static DEFAULTS = Object.assign({}, SnowTheme.DEFAULTS);

  buildPickers(selects, icons) {
    selects = selects.slice();
    const background = remove(selects, it => it.classList.contains('ql-background'));
    const color = remove(selects, it => it.classList.contains('ql-color'));
    super.buildPickers(selects, icons);
    if (background) {
      this.pickers.push(new ColorPicker(this.quill, {
        type: 'background',
        select: background,
        label: icons.background
      }));
    }
    if (color) {
      this.pickers.push(new ColorPicker(this.quill, {
        type: 'color',
        select: color,
        label: icons.color
      }));
    }
  }
}

function remove(arr, cb) {
  const index = arr.findIndex(cb);
  return arr.splice(index, 1)[0];
}
