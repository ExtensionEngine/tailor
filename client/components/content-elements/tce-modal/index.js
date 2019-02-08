import Edit from './edit';
import Toolbar from './edit/Toolbar';

const initState = () => ({ title: null, embeds: {} });

export default {
  name: 'Modal',
  type: 'MODAL',
  version: '1.0',
  initState,
  Edit,
  Toolbar,
  ui: {
    icon: 'mdi-window-maximize',
    forceFullWidth: false
  }
};
