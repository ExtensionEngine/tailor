import cuid from 'cuid';
import Edit from './edit';

const initState = () => {
  const id = cuid();
  return {
    embeds: {},
    items: {
      [id]: { id, header: 'Header', body: {} }
    }
  };
};

export default {
  name: 'Accordion',
  type: 'ACCORDION',
  version: '1.0',
  initState,
  Edit,
  ui: {
    icon: 'mdi-view-sequential',
    forceFullWidth: true
  }
};
