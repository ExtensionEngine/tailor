import Edit from './edit/index.vue';
import Toolbar from './edit/Toolbar.vue';

const initState = () => ({ url: null });

export default {
  name: 'PDF',
  type: 'PDF',
  version: '1.0',
  initState,
  Edit,
  Toolbar,
  ui: {
    icon: 'mdi-file-pdf-box',
    forceFullWidth: true
  }
};
