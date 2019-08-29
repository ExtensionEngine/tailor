const JODIT_CONTROL_FONT = 'font';
const JODIT_CONTROL_FONTSIZE = 'fontsize';
const JODIT_CONTROL_PARAGRAPH_STYLE = 'paragraph';

const isEmpty = el => !el.innerHTML;
const find = (arr, cb, defVal) => arr.find(cb) || defVal;

export const name = 'FontControls';

export const install = (Jodit, {
  defaultFontFamily = 'Sans Serif',
  defaultFontSize = 16,
  defaultParagraphStyle = 'Normal',
  pickerLabelClass = 'picker_label'
} = {}) => {
  const { controls } = Jodit.defaultOptions;

  if (controls[JODIT_CONTROL_FONT]) {
    Object.assign(controls[JODIT_CONTROL_FONT], {
      defaultValue: defaultFontFamily,
      getLabel
    });
  }

  if (controls[JODIT_CONTROL_FONTSIZE]) {
    Object.assign(controls[JODIT_CONTROL_FONTSIZE], {
      defaultValue: defaultFontSize,
      getLabel
    });
  }

  if (controls[JODIT_CONTROL_PARAGRAPH_STYLE]) {
    Object.assign(controls[JODIT_CONTROL_PARAGRAPH_STYLE], {
      defaultValue: defaultParagraphStyle,
      getLabel
    });
  }

  function getLabel(editor, control, button) {
    const entry = getActiveEntry(editor, control, control.defaultValue);
    const [, key] = entry;
    const icon = button.createIcon(control.icon, control);
    const label = document.createElement('span');
    label.classList.add(pickerLabelClass);
    label.appendChild(icon);
    label.innerHTML += key;
    button.textBox.innerHTML = '';
    button.textBox.appendChild(label);
    return false;
  }
};

export default install;

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

function getActiveEntry(editor, control, defaultValue) {
  if (!editor.isInited) return [null, defaultValue];

  const entries = Object.entries(control.list);
  const entry = entries.find(args => control.isActiveChild(editor, { args }));
  if (entry) return entry;

  if (isEmpty(editor.editor)) return [null, defaultValue];

  if (control.name === JODIT_CONTROL_FONT) {
    const { fontFamily: currentFontFamily } = getComputedStyle(editor.editor);
    return find(entries, ([fontFamily]) => {
      return normalize.fontFamily(fontFamily) === currentFontFamily;
    }, [null, defaultValue]);
  }

  if (control.name === JODIT_CONTROL_FONTSIZE) {
    const { fontSize: currentFontSize } = getComputedStyle(editor.editor);
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
