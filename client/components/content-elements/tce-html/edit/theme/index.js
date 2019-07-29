import mdiIcons, { getMdiIcon } from './toolbar-icons';
import createColorPicker from './ui/color-picker';
import createImageEmbed from './modules/image-embed';
import Tooltip from 'tooltip.js';

const colors = [
  '#000000',
  '#e60000',
  '#ff9900',
  '#ffff00',
  '#008a00',
  '#0066cc',
  '#9933ff',
  '#ffffff',
  '#facccc',
  '#ffebcc',
  '#ffffcc',
  '#cce8cc',
  '#cce0f5',
  '#ebd6ff',
  '#bbbbbb',
  '#f06666',
  '#ffc266',
  '#ffff66',
  '#66b966',
  '#66a3e0',
  '#c285ff',
  '#888888',
  '#a10000',
  '#b26b00',
  '#b2b200',
  '#006100',
  '#0047b2',
  '#6b24b2',
  '#444444',
  '#5c0000',
  '#663d00',
  '#666600',
  '#003700',
  '#002966',
  '#3d1466'
];
const reQuillControl = /^ql-/;

class ToolbarTooltip extends Tooltip {
  constructor(input, showDelay = 350) {
    const isPicker = Boolean(input.select);
    const reference = isPicker ? input.container : input;
    const title = isPicker ? input.select.dataset.title : input.dataset.title;
    super(reference, {
      placement: 'bottom',
      delay: { show: showDelay, hide: 0 },
      title
    });
    if (isPicker) return this._interceptToggle(input);
    input.addEventListener('click', this.hide);
  }

  _show(reference, options) {
    if (reference.classList.contains('ql-expanded')) return;
    return super._show(reference, options);
  }

  _interceptToggle(picker) {
    const { togglePicker } = picker;
    picker.togglePicker = () => {
      this.hide();
      return togglePicker.call(picker);
    };
  }
}

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

  return class TailorTheme extends SnowTheme {
    static NAME = 'tailor';

    static DEFAULTS = {
      modules: { toolbar }
    };

    extendToolbar(toolbar) {
      super.extendToolbar(toolbar);
      this.buildTooltips();
    }

    buildButtons(buttons) {
      buttons.forEach(it => buildButton(it));
      this.buttons = buttons;
    }

    buildPickers(selects, icons) {
      selects = selects.slice();
      const background = remove(selects, it => it.classList.contains('ql-background'));
      const color = remove(selects, it => it.classList.contains('ql-color'));
      const align = remove(selects, it => it.classList.contains('ql-align'));
      super.buildPickers(selects, icons);
      const ColorPicker = createColorPicker(Quill);
      const IconPicker = Quill.import('ui/icon-picker');
      if (background) {
        fillSelect(background, colors, '#ffffff');
        this.pickers.push(new ColorPicker(this.quill, {
          type: 'background',
          select: background,
          label: getMdiIcon('background')
        }));
      }
      if (color) {
        fillSelect(color, colors, '#000000');
        this.pickers.push(new ColorPicker(this.quill, {
          type: 'color',
          select: color,
          label: getMdiIcon('color')
        }));
      }
      if (align) {
        const icons = mapKeys(mdiIcons.align, (_, icon) => getMdiIcon('align', icon));
        this.pickers.push(new IconPicker(align, icons));
      }
    }

    buildTooltips() {
      this.pickers.forEach(picker => new ToolbarTooltip(picker));
      this.buttons.forEach(button => new ToolbarTooltip(button));
    }
  };
};

function buildButton(button) {
  let name = Array.from(button.classList).find(it => reQuillControl.test(it));
  if (!name) return;
  name = name.replace(reQuillControl, '');
  if (name === 'direction') {
    button.innerHTML = getMdiIcon(name, '') + getMdiIcon(name, 'rtl');
    return;
  }
  button.innerHTML = getMdiIcon(name, button.value);
}

function fillSelect(select, values, defaultValue = false) {
  values.forEach(value => {
    const option = document.createElement('option');
    if (value === defaultValue) {
      option.setAttribute('selected', 'selected');
    } else {
      option.setAttribute('value', value);
    }
    select.appendChild(option);
  });
}

function mapKeys(obj, cb) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    value = cb(value, key);
    return Object.assign(acc, { [key]: value });
  }, {});
}

function remove(arr, cb) {
  const index = arr.findIndex(cb);
  return arr.splice(index, 1)[0];
}
