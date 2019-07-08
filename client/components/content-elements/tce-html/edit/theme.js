import createColorPicker from './ui/color-picker';
import createImageEmbed from './modules/image-embed';

export default Quill => {
  const ImageEmbed = createImageEmbed(Quill);
  Quill.register(`modules/${ImageEmbed.NAME}`, ImageEmbed, true);

  const SnowTheme = Quill.import('themes/snow');
  const { toolbar: baseToolbar } = SnowTheme.DEFAULTS.modules;
  const toolbar = {
    handlers: {
      ...baseToolbar.handlers,
      image() {
        this.quill.tooltips.imageEmbed.show();
      }
    }
  };

  return class CustomTheme extends SnowTheme {
    static NAME = 'tailor';
    static DEFAULTS = {
      modules: { toolbar }
    };

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
