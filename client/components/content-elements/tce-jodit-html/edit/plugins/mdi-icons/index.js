import { getMdiIcon } from './toolbar-icons';

const CSS_NO_COLOR = '';
const JODIT_COLORPICKER = '.jodit_colorpicker';
const JODIT_COMMAND_BACKGROUND_COLOR = 'background';
const JODIT_COMMAND_TEXT_COLOR = 'forecolor';
const JODIT_CONTROL_ALIGN = 'align';
const JODIT_CONTROL_COLOR = 'brush';
const JODIT_DEFAULT_EVENT_NAMESPACE = 'JoditEventDefaultNamespace';
const JODIT_PICKER_SELECTION_EVENTS = ['mousedown', 'touchend'];

const noop = () => {};
const onSelect = (events, target, listener) => {
  return events.on(target, JODIT_PICKER_SELECTION_EVENTS.join(' '), listener);
};

export const name = 'MdiIcons';

export const install = (Jodit, { btnResetColorClass = 'btn_reset_color' } = {}) => {
  const { controls, popup } = Jodit.defaultOptions;
  const isResetButton = el => el.classList.contains(btnResetColorClass);

  Jodit.plugins[name] = ({ events }) => {
    events
      .on('getIcon', getMdiIcon)
      .on('beforeDestruct', () => {
        if (events) events.off('getIcon', getMdiIcon);
      });
  };

  if (controls[JODIT_CONTROL_ALIGN]) {
    const { getLabel = noop } = controls[JODIT_CONTROL_ALIGN];
    controls[JODIT_CONTROL_ALIGN].getLabel = function (_, control, button) {
      const result = getLabel.apply(this, arguments);

      // Show current alignment inside button label.
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

      // Colorize material design `color-helper` icon.
      const colorHelper = button.textBox.querySelector('.mdi-color-helper');
      const svg = button.textBox.querySelector('svg');
      if (!colorHelper || !svg) return result;
      colorHelper.style.color = svg.style.fill;

      return result;
    };

    // Add reset color buttons to main toolbar's colorpicker/s.
    const { popup: createPopup = noop } = controls[JODIT_CONTROL_COLOR];
    controls[JODIT_CONTROL_COLOR].popup = function (editor, _current, _self, close = noop) {
      const popup = createPopup.apply(this, arguments);
      if (!popup) return popup;

      const { events, options } = editor;
      const pickers = getColorPickers(popup, { defaultTab: options.colorPickerDefaultTab });

      onSelect(events, resetButton(editor, pickers.textColor), () => {
        editor.execCommand(JODIT_COMMAND_TEXT_COLOR, false, CSS_NO_COLOR);
        close();
      });
      onSelect(events, resetButton(editor, pickers.backgroundColor), () => {
        editor.execCommand(JODIT_COMMAND_BACKGROUND_COLOR, false, CSS_NO_COLOR);
        close();
      });

      return popup;
    };
  }

  // Add reset color buttons to inline toolbar's colorpicker/s.
  if (Array.isArray(popup.table)) {
    const control = popup.table.find(it => it.name === JODIT_CONTROL_COLOR);
    if (!control) return;

    const { popup: createPopup = noop } = control;
    control.popup = function (editor, table) {
      const popup = createPopup.apply(this, arguments);
      if (!popup) return popup;

      const { events } = editor;
      const pickers = getColorPickers(popup, { defaultTab: 'background' });
      pickers.forEach(picker => {
        const [eventDesc] = events.getStore(picker)
          .get(JODIT_PICKER_SELECTION_EVENTS[0], JODIT_DEFAULT_EVENT_NAMESPACE);
        const listener = eventDesc && eventDesc.originalCallback;
        if (!listener) return;
        replaceListener(
          editor,
          picker,
          JODIT_PICKER_SELECTION_EVENTS.join(' '),
          onChange,
          listener
        );

        function onChange(e) {
          listener.apply(this, arguments);
          const button = parent(e.target, '[data-color]');
          if (!button) return;

          const selected = picker.querySelector('.active');
          if (!selected) return;

          if (isResetButton(button)) {
            selected.classList.remove('active');
            selected.innerHTML = '';
            return;
          }

          // Swap eye icon marking selected color with colorized bullet.
          const svg = selected.querySelector('svg');
          svg.style.display = 'none';
          const circle = createIcon('mdi-circle');
          Object.assign(circle.style, {
            color: svg.style.fill,
            fontSize: '8px'
          });
          selected.appendChild(circle);
        }
      });

      onSelect(events, resetButton(editor, pickers.textColor), () => {
        const selectedCells = Jodit.modules.Table.getAllSelectedCells(table);
        selectedCells.forEach(cell => (cell.style.color = CSS_NO_COLOR));
        editor.setEditorValue();
      });
      onSelect(events, resetButton(editor, pickers.backgroundColor), () => {
        const selectedCells = Jodit.modules.Table.getAllSelectedCells(table);
        selectedCells.forEach(cell => (cell.style.backgroundColor = CSS_NO_COLOR));
        editor.setEditorValue();
      });
      onSelect(events, resetButton(editor, pickers.borderColor), () => {
        const selectedCells = Jodit.modules.Table.getAllSelectedCells(table);
        selectedCells.forEach(cell => (cell.style.borderColor = CSS_NO_COLOR));
        editor.setEditorValue();
      });

      return popup;
    };
  }

  function getColorPickers(popup, { defaultTab }) {
    const pickers = Array.from(popup.querySelectorAll(JODIT_COLORPICKER));
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

  function resetButton({ options }, picker) {
    const btnResetColor = picker &&
      Array.from(picker.children).filter(el => el.matches('a')).pop();
    if (!btnResetColor) return document.createElement('span');
    btnResetColor.classList.add(btnResetColorClass);
    btnResetColor.innerHTML = '';
    const tabIndex = options.allowTabNavigation ? 0 : -1;
    btnResetColor
      .appendChild(createButton({ icon: 'mdi-water-off', text: 'None', tabIndex }));
    return btnResetColor;
  }
};

export default install;

function createButton({ icon, text, tabIndex = 0 }) {
  const btn = document.createElement('span');
  btn.tabIndex = tabIndex;
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

function replaceListener(editor, target, events, listener, oldListener) {
  editor.events
    .off(target, events, oldListener)
    .on(target, events, listener);
}
