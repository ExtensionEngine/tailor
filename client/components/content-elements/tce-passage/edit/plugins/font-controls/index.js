const JODIT_CONTROL_FONT = 'font';
const JODIT_CONTROL_FONTSIZE = 'fontsize';
const JODIT_CONTROL_PARAGRAPH_STYLE = 'paragraph';

export const name = 'FontControls';

export const install = (Jodit, {
  defaultFontFamily = 'Sans Serif',
  defaultFontSize = 16,
  defaultParagraphStyle = 'Normal',
  pickerLabelClass = 'picker_label'
}) => {
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
  const entries = Object.entries(control.list);
  const entry = entries.find(args => control.isActiveChild(editor, { args }));
  if (entry) return entry;
  if (editor.editor.innerHTML) return [null, defaultValue];
  if (control.name === JODIT_CONTROL_FONT) {
    const { fontFamily: currentFontFamily } = getComputedStyle(editor.editor);
    return entries.find(([fontFamily]) => {
      return normalize.fontFamily(fontFamily) === currentFontFamily;
    }) || [null, defaultValue];
  }
  if (control.name === JODIT_CONTROL_FONTSIZE) {
    const { fontSize: currentFontSize } = getComputedStyle(editor.editor);
    return entries.find(([_, fontSize]) => {
      return fontSize === normalize.fontSize(currentFontSize);
    }) || [null, defaultValue];
  }
  if (control.name === JODIT_CONTROL_PARAGRAPH_STYLE) {
    return entries.find(([_, style]) => {
      return style.toLowerCase() === 'normal';
    }) || [null, defaultValue];
  }
}
