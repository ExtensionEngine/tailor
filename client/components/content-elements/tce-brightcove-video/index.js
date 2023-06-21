import Edit from './edit/index.vue';
import Toolbar from './edit/Toolbar.vue';

const initState = () => ({ accountId: null, playerId: null, videoId: null });

export default {
  name: 'Brightcove Video',
  type: 'BRIGHTCOVE_VIDEO',
  version: '1.0',
  initState,
  Edit,
  Toolbar,
  ui: {
    icon: 'mdi-video',
    forceFullWidth: false
  }
};
