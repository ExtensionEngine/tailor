import Edit from './edit';
import info from './info';
import Toolbar from './edit/Toolbar';

const initState = () => ({ url: null });

export default {
  ...info,
  initState,
  Edit,
  Toolbar,
  ui: {
    icon: 'mdi-image',
    forceFullWidth: false
  }
};
