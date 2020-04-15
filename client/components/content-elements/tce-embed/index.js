import Edit from './edit';
import Toolbar from './edit/Toolbar';

const initState = () => ({ url: null, height: 260 });

export default {
  name: 'Embed',
  type: 'EMBED',
  version: '1.0',
  initState,
  Edit,
  Toolbar,
  ui: {
    icon: 'mdi-arrange-bring-forward',
    forceFullWidth: false
  }
};
