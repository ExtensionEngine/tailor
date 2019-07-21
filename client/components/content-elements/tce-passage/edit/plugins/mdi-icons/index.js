import { getMdiIcon } from './toolbar-icons';

const noop = () => {};

const CSS_NO_COLOR = '';
const JODIT_COMMAND_BACKGROUND_COLOR = 'background';
const JODIT_COMMAND_TEXT_COLOR = 'forecolor';
const JODIT_CONTROL_ALIGN = 'align';
const JODIT_CONTROL_COLOR = 'brush';

export const name = 'MdiIcons';

export const install = (Jodit, { btnResetColorClass = 'btn_reset_color' } = {}) => {
  const { controls, popup } = Jodit.defaultOptions;

  Jodit.plugins[name] = editor => {
    editor.events
      .on('getIcon', getMdiIcon)
      .on('beforeDestruct', () => {
        if (editor.events) editor.events.off('getIcon', getMdiIcon);
      });
  };

  if (controls[JODIT_CONTROL_ALIGN]) {
    const { getLabel = noop } = controls[JODIT_CONTROL_ALIGN];
    controls[JODIT_CONTROL_ALIGN].getLabel = function (_, control, button) {
      const result = getLabel.apply(this, arguments);
      const currentValue = control.data && control.data.currentValue;
      if (!currentValue) return;
      button.textBox.innerHTML = '';
      button.textBox.appendChild(button.createIcon(currentValue, control));
      return result;
    };
  }

  if (controls[JODIT_CONTROL_COLOR]) {
    const { getLabel = noop } = controls[JODIT_CONTROL_COLOR];
    controls[JODIT_CONTROL_COLOR].getLabel = function (_editor, _control, button) {
      const result = getLabel.apply(this, arguments);
      const colorHelper = button.textBox.querySelector('.mdi-color-helper');
      const svg = button.textBox.querySelector('svg');
      if (!colorHelper || !svg) return result;
      colorHelper.style.color = svg.style.fill;
      return result;
    };

    const { popup: createPopup = noop } = controls[JODIT_CONTROL_COLOR];
    controls[JODIT_CONTROL_COLOR].popup = function (editor, _current, _self, close = noop) {
      const popup = createPopup.apply(this, arguments);
      if (!popup) return popup;

      const pickers = getColorPickers(popup, {
        defaultTab: editor.options.colorPickerDefaultTab
      });

      setupResetColorButton(pickers.textColor, () => {
        editor.execCommand(JODIT_COMMAND_TEXT_COLOR, false, CSS_NO_COLOR);
        close();
      });
      setupResetColorButton(pickers.backgroundColor, () => {
        editor.execCommand(JODIT_COMMAND_BACKGROUND_COLOR, false, CSS_NO_COLOR);
        close();
      });

      return popup;
    };
  }

  if (Array.isArray(popup.table)) {
    const control = popup.table.find(it => it.name === JODIT_CONTROL_COLOR);
    if (!control) return;
    const { popup: createPopup = noop } = control;
    control.popup = function (editor, table) {
      const popup = createPopup.apply(this, arguments);
      if (!popup) return popup;

      const pickers = getColorPickers(popup, { defaultTab: 'background' });
      pickers.forEach(picker => {
        const isResetButton = el => el.classList.contains(btnResetColorClass);
        editor.events.on(picker, 'mousedown touchend', e => {
          const button = parent(e.target, '[data-color]');
          if (!button) return;
          if (isResetButton(button)) return onReset(picker);
          onSelect(picker);
        });
        onSelect(picker);
      });

      setupResetColorButton(pickers.textColor, () => {
        const selectedCells = Jodit.modules.Table.getAllSelectedCells(table);
        selectedCells.forEach(cell => (cell.style.color = CSS_NO_COLOR));
        editor.setEditorValue();
      });
      setupResetColorButton(pickers.backgroundColor, () => {
        const selectedCells = Jodit.modules.Table.getAllSelectedCells(table);
        selectedCells.forEach(cell => (cell.style.backgroundColor = CSS_NO_COLOR));
        editor.setEditorValue();
      });
      setupResetColorButton(pickers.borderColor, () => {
        const selectedCells = Jodit.modules.Table.getAllSelectedCells(table);
        selectedCells.forEach(cell => (cell.style.borderColor = CSS_NO_COLOR));
        editor.setEditorValue();
      });

      return popup;

      function onSelect(picker) {
        const selected = picker.querySelector('.active');
        if (!selected) return;
        const svg = selected.querySelector('svg');
        svg.style.display = 'none';
        const circle = createIcon('mdi-circle');
        Object.assign(circle.style, {
          color: svg.style.fill,
          fontSize: `${Math.max(selected.offsetHeight - 8, 8)}px`
        });
        selected.appendChild(circle);
      }

      function onReset(picker) {
        const selected = picker.querySelector('.active');
        if (!selected) return;
        selected.classList.remove('active');
        selected.innerHTML = '';
      }
    };
  }

  function getColorPickers(popup, { defaultTab }) {
    const pickers = Array.from(popup.querySelectorAll('.jodit_colorpicker'));
    if (pickers.length <= 0) return pickers;
    let textColor, backgroundColor, borderColor;
    if (defaultTab === 'background') {
      [backgroundColor, textColor, borderColor] = pickers;
    } else if (defaultTab === 'color') {
      [textColor, backgroundColor, borderColor] = pickers;
    }
    return Object.assign(pickers, {
      textColor,
      backgroundColor,
      borderColor
    });
  }

  function setupResetColorButton(picker, action) {
    const btnResetColor = picker && findResetColorButton(picker);
    if (!btnResetColor) return;
    btnResetColor.classList.add(btnResetColorClass);
    btnResetColor.innerHTML = '';
    btnResetColor.appendChild(createButton({ icon: 'mdi-water-off', text: 'None' }));
    btnResetColor.addEventListener('click', action);
  }

  function findResetColorButton(picker) {
    return Array.from(picker.children).filter(el => el.matches('a')).pop();
  }
};

export default install;

function createButton({ icon, text }) {
  const btn = document.createElement('span');
  btn.tabIndex = 0;
  btn.setAttribute('role', 'button');
  btn.appendChild(createIcon(icon));
  btn.innerHTML += text;
  return btn;
}

function createIcon(name) {
  const icon = document.createElement('span');
  icon.classList.add('jodit_icon', 'mdi', name);
  return icon;
}

function parent(el, selector) {
  while (el && !el.matches(selector)) {
    el = el.parentElement;
  }
  return el;
}
