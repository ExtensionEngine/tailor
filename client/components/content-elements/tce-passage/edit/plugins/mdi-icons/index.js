import { getMdiIcon } from './toolbar-icons';

const capitalize = str => str[0].toUpperCase() + str.slice(1);
const noop = () => {};

const JODIT_CONTROL_ALIGN = 'align';
const JODIT_CONTROL_COLOR = 'brush';
const JODIT_EVENT_AFTER_COLOR_POPUP_OPEN = `after${capitalize(JODIT_CONTROL_COLOR)}OpenPopup`;

export const name = 'MdiIcons';

export const install = Jodit => {
  const { controls } = Jodit.defaultOptions;

  Jodit.plugins[name] = editor => {
    editor.events
      .on('getIcon', getMdiIcon)
      .on(JODIT_EVENT_AFTER_COLOR_POPUP_OPEN, onColorPopupOpen)
      .on('beforeDestruct', () => {
        if (!editor.events) return;
        editor.events.off('getIcon', getMdiIcon);
        editor.events.off(JODIT_EVENT_AFTER_COLOR_POPUP_OPEN, onColorPopupOpen);
      });

    function onColorPopupOpen(container) {
      const buttons = Array.from(container.querySelectorAll('svg')).map(el => el.parentElement);
      let textColorBtn, bgColorBtn;
      if (editor.options.colorPickerDefaultTab === 'background') {
        [bgColorBtn, textColorBtn] = buttons;
      } else if (editor.options.colorPickerDefaultTab === 'color') {
        [textColorBtn, bgColorBtn] = buttons;
      }
      buttons.forEach(el => {
        el.classList.add('btn-no-color');
        el.innerHTML = '';
        el.appendChild(createButton({ icon: 'mdi-water-off', text: 'None' }));
      });
      textColorBtn.addEventListener('click', () => {
        editor.execCommand('forecolor', false, '');
        editor.events.fire('closeAllPopups');
      });
      bgColorBtn.addEventListener('click', () => {
        editor.execCommand('background', false, '');
        editor.events.fire('closeAllPopups');
      });
    }
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
  }
};

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

export default install;
