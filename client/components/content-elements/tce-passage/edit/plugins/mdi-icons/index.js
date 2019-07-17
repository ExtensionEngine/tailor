import { getMdiIcon } from './toolbar-icons';

export const name = 'MdiIcons';

export const install = Jodit => {
  Jodit.plugins[name] = editor => {
    editor.events
      .on('getIcon', getMdiIcon)
      .on('beforeDestruct', () => {
        if (!editor.events) return;
        editor.events.off('getIcon', getMdiIcon);
      });
  };
};

export default install;
