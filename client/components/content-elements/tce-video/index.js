import Edit from './edit';
import Toolbar from './edit/Toolbar';

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
