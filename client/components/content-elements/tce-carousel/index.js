import Edit from './edit';
import Toolbar from './edit/Toolbar';

const initState = () => {
  const id = 1;
  return {
    embeds: {},
    items: { [id]: { id, body: {} } },
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
