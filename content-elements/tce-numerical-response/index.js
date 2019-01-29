import Edit from './edit';
import yup from 'yup';

const schema = {
  prefixes: yup.array().min(1).of(yup.string().trim().max(64)),
  suffixes: yup.array().min(1).of(yup.string().trim().max(64)),
  correct: yup.array().min(1).of(yup.number()).required()
};

const initState = () => ({
  prefixes: [''],
  suffixes: [''],
  correct: ['']
});

export default {
  name: 'Numerical Response',
  type: 'ASSESSMENT',
  subtype: 'NR',
  version: '1.0',
  schema,
  initState,
  Edit,
  ui: {
    forceFullWidth: true
  }
};
