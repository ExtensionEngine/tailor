import Edit from './edit/index.vue';
import info from './info';
import Toolbar from './edit/Toolbar.vue';

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
