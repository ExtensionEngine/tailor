import cuid from 'cuid';
import times from 'lodash/times';

export const typeInfo = {
  MC: { type: 'MC', title: 'Multiple choice', class: 'multiple-choice' },
  SC: { type: 'SC', title: 'Single choice', class: 'single-choice' },
  TR: { type: 'TR', title: 'Text response', class: 'text-response' },
  NR: { type: 'NR', title: 'Numerical response', class: 'numerical-response' },
  TF: { type: 'TF', title: 'True - false', class: 'true-false' },
  FB: { type: 'FB', title: 'Fill in the blank', class: 'fill-blank' },
  MQ: { type: 'MQ', title: 'Matching question', class: 'matching-question' },
  DD: { type: 'DD', title: 'Drag & Drop', class: 'drag-drop' }
};

const baseDefaults = {
  question: [],
  hint: ''
};

export const defaults = {
  MC: () => ({
    type: 'MC',
    ...baseDefaults,
    answers: ['', '', ''],
    correct: []
  }),
  NR: () => ({
    type: 'NR',
    ...baseDefaults,
    prefixes: [''],
    suffixes: [''],
    correct: ['']
  }),
  SC: () => ({
    type: 'SC',
    ...baseDefaults,
    answers: ['', ''],
    correct: ''
  }),
  TR: () => ({
    type: 'TR',
    ...baseDefaults,
    correct: ''
  }),
  TF: () => ({
    type: 'TF',
    ...baseDefaults,
    correct: null
  }),
  FB: () => ({
    type: 'FB',
    ...baseDefaults,
    correct: []
  }),
  MQ() {
    const element = {
      type: 'MQ',
      ...baseDefaults,
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
  },
  DD() {
    const element = {
      type: 'DD',
      ...baseDefaults,
      groups: {},
      answers: {},
      correct: {}
    };
    times(2, () => {
      const groupKey = cuid();
      const answerKey = cuid();
      element.groups[groupKey] = '';
      element.answers[answerKey] = '';
      element.correct[groupKey] = [answerKey];
    });
    return element;
  }
};

export const getErrorMessages = (errors, path) => errors
  .filter(err => err.path.includes(path))
  .map(err => err.message);
