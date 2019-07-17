import { getMdiIcon } from './toolbar-icons';

const JODIT_CONTROL_ALIGN = 'align';

export const name = 'MdiIcons';

export const install = Jodit => {
  const { controls } = Jodit.defaultOptions;

  Jodit.plugins[name] = editor => {
    editor.events
      .on('getIcon', getMdiIcon)
      .on('beforeDestruct', () => {
        if (!editor.events) return;
        editor.events.off('getIcon', getMdiIcon);
      });
  };

  if (controls[JODIT_CONTROL_ALIGN]) {
    const { getLabel } = controls[JODIT_CONTROL_ALIGN];
    controls[JODIT_CONTROL_ALIGN].getLabel = function (_, control, button) {
      const result = getLabel.apply(this, arguments);
      const currentValue = control.data && control.data.currentValue;
      if (!currentValue) return;
      button.textBox.innerHTML = '';
      button.textBox.appendChild(button.createIcon(currentValue));
      return result;
    };
  }
};

export default install;
