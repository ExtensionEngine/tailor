import Edit from './edit';
import Toolbar from './edit/Toolbar';

const initState = () => ({ content: '' });

export default {
  name: 'Passage',
  type: 'PASSAGE',
  version: '1.0',
  initState,
  Edit,
  Toolbar,
  ui: {
    icon: 'mdi-text-short',
    forceFullWidth: false
  }
};
