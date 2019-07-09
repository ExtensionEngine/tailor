import { getMdiIcon } from './toolbar-icons';

export default editor => {
  editor.events
    .on('getIcon', getMdiIcon)
    .on('beforeDestruct', () => {
      editor.events && editor.events.off('getIcon', getMdiIcon);
    });
};
