import Edit from './edit/index.vue';
import Toolbar from './edit/Toolbar.vue';

const initState = () => ({
  content: ''
});

export default {
  name: 'Text (deprecated)',
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
