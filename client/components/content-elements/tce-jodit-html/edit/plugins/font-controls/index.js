import autoBind from 'auto-bind';

const JODIT_CONTROL_FONT = 'font';
const JODIT_CONTROL_FONTSIZE = 'fontsize';
const JODIT_CONTROL_PARAGRAPH_STYLE = 'paragraph';

const isEmpty = el => !el.innerHTML;
const find = (arr, cb, defVal) => arr.find(cb) || defVal;

/** @typedef {import('jodit/src/Config').Config & import('jodit/src/plugins')} Config */
/** @typedef {import('jodit').IJodit} Jodit */
/** @typedef {import('jodit').IToolbarButton} Button */
/** @typedef {import('jodit').IControlType<Jodit,Button} Control */

export default class FontControlsPlugin {
  static get pluginName() {
    return 'font-controls';
  }

  constructor(options) {
    options.defaultFontFamily = options.defaultFontFamily || 'Sans Serif';
    options.defaultFontSize = options.defaultFontSize || 16; /* px */
    options.defaultParagraphStyle = options.defaultParagraphStyle || 'Normal';
    options.pickerLabelClass = options.pickerLabelClass || 'picker_label';
    autoBind(this);
  }

  /**
   * @param {Config} config
   */
  apply({ controls }) {
    let control;

    if ((control = controls[JODIT_CONTROL_FONT])) {
      Object.assign(control, {
        defaultValue: this.options.defaultFontFamily,
        getLabel: this.getLabel
      });
    }

    if ((control = controls[JODIT_CONTROL_FONTSIZE])) {
      Object.assign(control, {
        defaultValue: this.options.defaultFontSize,
        getLabel: this.getLabel
      });
    }

    if ((control = controls[JODIT_CONTROL_PARAGRAPH_STYLE])) {
      Object.assign(control, {
        defaultValue: this.options.defaultParagraphStyle,
        getLabel: this.getLabel
      });
    }
  }

  /**
   * @param {Jodit} jodit
   * @param {Control} control
   * @param {Button} button
   */
  getLabel(jodit, control, button) {
    const entry = this.getActiveEntry(jodit, control, control.defaultValue);
    const [, key] = entry;
    const icon = button.createIcon(control.icon, control);
    const label = document.createElement('span');
    label.classList.add(this.options.pickerLabelClass);
    label.appendChild(icon);
    label.innerHTML += key;
    button.textBox.innerHTML = '';
    button.textBox.appendChild(label);
    return false;
  }

  /**
   * @param {Jodit} jodit
   * @param {Control} control
   * @returns {[*, String]}
   */
  getActiveEntry(jodit, control, defaultValue) {
    if (!jodit.isInited) return [null, defaultValue];

    const entries = Object.entries(control.list);
    const entry = entries.find(args => control.isActiveChild(jodit, { args }));
    if (entry) return entry;

    if (isEmpty(jodit.editor)) return [null, defaultValue];

    if (control.name === JODIT_CONTROL_FONT) {
      const { fontFamily: currentFontFamily } = getComputedStyle(jodit.editor);
      return find(entries, ([fontFamily]) => {
        return normalize.fontFamily(fontFamily) === currentFontFamily;
      }, [null, defaultValue]);
    }

    if (control.name === JODIT_CONTROL_FONTSIZE) {
      const { fontSize: currentFontSize } = getComputedStyle(jodit.editor);
      return find(entries, ([_, fontSize]) => {
        return fontSize === normalize.fontSize(currentFontSize);
      }, [null, defaultValue]);
    }

    if (control.name === JODIT_CONTROL_PARAGRAPH_STYLE) {
      return find(entries, ([_, style]) => {
        return style.toLowerCase() === 'normal';
      }, [null, defaultValue]);
    }
  }
}

const normalize = (() => {
  const span = document.createElement('span');
  return {
    fontFamily(str) {
      span.style.fontFamily = str;
      return span.style.fontFamily;
    },
    fontSize(str) {
      return String(parseFloat(str));
    }
  };
})();
