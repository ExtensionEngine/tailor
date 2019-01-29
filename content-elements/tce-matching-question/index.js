import Edit from './edit';
import yup from 'yup';

const objectMap = yup.object().shape({
  key: yup.string().required(),
  value: yup.string().required()
});

const schema = yup.object().shape({
  premises: yup.array().of(objectMap),
  responses: yup.array().of(objectMap),
  headings: yup.object().shape({
    premise: yup.string().trim().min(1).max(200).required(),
    response: yup.string().trim().min(1).max(200).required()
  })
});

const initState = () => ({
  premises: [],
  responses: [],
  correct: {},
  headings: {
    premise: 'Premise',
    response: 'Response'
  }
});

export default {
  name: 'Matching question',
  type: 'ASSESSMENT',
  subtype: 'MQ',
  version: '1.0',
  schema,
  initState,
  Edit,
  ui: {
    forceFullWidth: true
  }
};
