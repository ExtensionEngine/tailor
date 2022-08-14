import Edit from './edit/index.vue';
import Toolbar from './edit/Toolbar.vue';

const initState = () => {
  return {
    embeds: {},
    items: {},
    height: 500
  };
};

export default {
  name: 'Carousel',
  type: 'CAROUSEL',
  version: '1.0',
  initState,
  Edit,
  Toolbar,
  ui: {
    icon: 'mdi-view-carousel',
    forceFullWidth: true
  }
};
