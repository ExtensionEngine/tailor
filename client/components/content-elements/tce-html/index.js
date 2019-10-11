import Edit from './edit';
import Toolbar from './edit/Toolbar';

const initState = () => ({
  content: ''
});

export default {
  name: 'Text',
  type: 'HTML',
  version: '1.0',
  initState,
  Edit,
  Toolbar,
  ui: {
    icon: 'mdi-format-text',
    forceFullWidth: false
  }
};
