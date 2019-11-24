import * as yup from 'yup';
import Edit from './edit';

const schema = {
  correct: yup.boolean().required()
};

const initState = () => ({
  correct: null
});

export default {
  name: 'True - False',
  type: 'QUESTION',
  subtype: 'TF',
  version: '1.0',
  schema,
  initState,
  Edit,
  ui: {
    forceFullWidth: true
  }
};
