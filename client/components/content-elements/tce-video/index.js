import Edit from './edit/index.vue';
import Toolbar from './edit/Toolbar.vue';

const initState = () => ({ url: null });

export default {
  name: 'Video',
  type: 'VIDEO',
  version: '1.0',
  initState,
  Edit,
  Toolbar,
  ui: {
    icon: 'mdi-video',
    forceFullWidth: false
  }
};
