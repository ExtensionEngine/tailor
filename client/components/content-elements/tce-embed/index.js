import Edit from './edit/index.vue';
import Toolbar from './edit/Toolbar.vue';

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
