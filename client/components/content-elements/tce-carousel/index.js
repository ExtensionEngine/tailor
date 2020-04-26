import Edit from './edit';
import Toolbar from './edit/Toolbar';

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
