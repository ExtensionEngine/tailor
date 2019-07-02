import ColorPicker from './color-picker';
import { Quill } from 'vue-quill-editor';

const SnowTheme = Quill.import('themes/snow');

const findIndex = (selects, type) => selects.findIndex(it => it.classList.contains(type));
const remove = (arr, index) => arr.splice(index, 1)[0];

class CustomTheme extends SnowTheme {
  buildPickers(selects, icons) {
    const backgroundIndex = findIndex(selects, 'ql-background');
    const colorIndex = findIndex(selects, 'ql-color');
    selects = selects.slice();
    const backgroundSelect = remove(selects, backgroundIndex);
    const colorSelect = remove(selects, colorIndex);
    super.buildPickers(selects, icons);
    this.pickers.push(
      new ColorPicker(this.quill, {
        type: 'background',
        select: backgroundSelect,
        label: icons.background
      }),
      new ColorPicker(this.quill, {
        type: 'color',
        select: colorSelect,
        label: icons.color
      })
    );
  }
}

CustomTheme.DEFAULTS = Object.assign({}, SnowTheme.DEFAULTS);

export default CustomTheme;
