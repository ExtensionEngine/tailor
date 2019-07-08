import createColorPicker from './ui/color-picker';
import createImageEmbed from './modules/image-embed';

export default Quill => {
  const ImageEmbed = createImageEmbed(Quill);
  Quill.register(`modules/${ImageEmbed.NAME}`, ImageEmbed, true);

  return class CustomTheme extends Quill.import('themes/snow') {
    static DEFAULTS = Object.assign({}, super.DEFAULTS);
    static NAME = 'tailor';

    buildPickers(selects, icons) {
      selects = selects.slice();
      const background = remove(selects, it => it.classList.contains('ql-background'));
      const color = remove(selects, it => it.classList.contains('ql-color'));
      super.buildPickers(selects, icons);
      const ColorPicker = createColorPicker(Quill);
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
  };
};

function remove(arr, cb) {
  const index = arr.findIndex(cb);
  return arr.splice(index, 1)[0];
}
