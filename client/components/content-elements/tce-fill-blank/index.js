import * as yup from 'yup';
import Edit from './edit';
import find from 'lodash/find';

const BLANK_PLACEHOLDER = /(@blank)/g;

const schema = {
  question: yup.array().test(
    'has-blanks', 'At least one @blank required', question => {
      return !!find(question, it => containsText(it) && containsBlanks(it));
    }
  ),
  correct: yup.array().of(yup.array().min(1).of(yup.string().trim().min(1).max(200).required()))
};

const initState = () => ({
  correct: []
});

export default {
  name: 'Fill in the blank',
  type: 'QUESTION',
  subtype: 'FB',
  version: '1.0',
  schema,
  initState,
  Edit,
  ui: {
    forceFullWidth: true
  }
};

function containsText(asset) {
  return asset.type === 'HTML' &&
    asset.data.content &&
    asset.data.content.trim().length > 0;
}

function containsBlanks(asset) {
  return asset.data.content.match(BLANK_PLACEHOLDER);
}
