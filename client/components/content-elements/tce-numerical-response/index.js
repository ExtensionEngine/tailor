import * as yup from 'yup';
import Edit from './edit';

const MESSAGE = 'Numeric answer is required (use . as a decimal separator)';

const answer = () => yup.number().required().typeError(MESSAGE).label('Answer');
const prefix = () => yup.string().trim().max(64).label('Prefix');
const suffix = () => yup.string().trim().max(64).label('Suffix');

const schema = {
  correct: yup.array().min(1).of(answer()).required(),
  prefixes: yup.array().min(1).of(prefix()),
  suffixes: yup.array().min(1).of(suffix())
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
