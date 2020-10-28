import * as yup from 'yup';
import cuid from 'cuid';
import Edit from './edit';
import times from 'lodash/times';

const createValidator = label => yup.object().shape({
  key: yup.string().required().label(label),
  value: yup.string().required().label(label)
});

const schema = {
  premises: yup.array().of(createValidator('Premise')),
  responses: yup.array().of(createValidator('Response')),
  headings: yup.object().shape({
    premise: yup.string().trim().max(200).required().label('Premise heading'),
    response: yup.string().trim().max(200).required().label('Response heading')
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
