import Edit from './edit';
import yup from 'yup';

const schema = {
  correct: yup.boolean().required()
};

const initState = () => ({
  correct: null
});

export default {
  name: 'True - False',
  type: 'ASSESSMENT',
  subtype: 'TF',
  reflection: true,
  version: '1.0',
  schema,
  initState,
  Edit,
  ui: {
    forceFullWidth: true
  }
};
