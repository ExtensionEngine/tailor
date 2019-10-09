import Edit from './edit';
import Toolbar from './edit/Toolbar';

const initState = () => ({ url: null, name: null, label: null });

export default {
  name: 'File',
  type: 'FILE',
  version: '1.0',
  initState,
  Edit,
  Toolbar,
  ui: {
    icon: 'mdi-file',
    forceFullWidth: false
  }
};
