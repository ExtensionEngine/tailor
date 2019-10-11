import Edit from './edit';
import Toolbar from './edit/Toolbar';

const initState = () => ({ url: null });

export default {
  name: 'Image',
  type: 'IMAGE',
  version: '1.0',
  initState,
  Edit,
  Toolbar,
  ui: {
    icon: 'mdi-image',
    forceFullWidth: false
  }
};
