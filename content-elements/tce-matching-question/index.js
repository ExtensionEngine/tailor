import cuid from 'cuid';
import Edit from './edit';
import times from 'lodash/times';
import yup from 'yup';

const objectMap = yup.object().shape({
  key: yup.string().required(),
  value: yup.string().required()
});

const schema = {
  premises: yup.array().of(objectMap),
  responses: yup.array().of(objectMap),
  headings: yup.object().shape({
    premise: yup.string().trim().min(1).max(200).required(),
    response: yup.string().trim().min(1).max(200).required()
  })
};

const initState = () => {
  const element = {
    premises: [],
    responses: [],
    correct: {},
    headings: {
      premise: 'Premise',
      response: 'Response'
    }
  };
  times(2, () => {
    const premiseKey = cuid();
    const responseKey = cuid();
    element.premises.push({ key: premiseKey, value: '' });
    element.responses.push({ key: responseKey, value: '' });
    element.correct[premiseKey] = responseKey;
  });
  return element;
};

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
