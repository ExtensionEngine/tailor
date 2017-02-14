import yup from 'yup';

export const typeInfo = {
  MC: { type: 'MC', title: 'Multiple choice', class: 'multiple-choice' },
  SC: { type: 'SC', title: 'Single choice', class: 'single-choice' },
  TF: { type: 'TF', title: 'Text response', class: 'text-response' },
  NR: { type: 'NR', title: 'Numerical response', class: 'numerical-response' },
  TR: { type: 'TR', title: 'True - false', class: 'true-false' }
};

export const schemas = {
  MC: yup.object().shape({
    question: yup.string().trim().min(1).required(),
    answers: yup.array().min(3).of(yup.string().trim().min(1)).required(),
    correct: yup.array().min(2).of(yup.number()).required()
  }),
  NR: yup.object().shape({
    question: yup.string().trim().min(1).required(),
    correct: yup.string().trim().matches(/^(^\d+$)|(^\d+\.\d+$)$/).required()
  }),
  SC: yup.object().shape({
    question: yup.string().trim().min(1).required(),
    answers: yup.array().min(2).of(yup.string().trim().min(1)).required(),
    correct: yup.number().required()
  }),
  TR: yup.object().shape({
    question: yup.string().trim().min(1).required(),
    correct: yup.string().trim().min(1).required()
  }),
  TF: yup.object().shape({
    question: yup.string().trim().min(1).required(),
    correct: yup.boolean().required()
  })
};

export const defaults = {
  MC: {
    type: 'MC',
    question: '',
    answers: ['', '', ''],
    correct: [],
    hint: ''
  },
  NR: {
    type: 'NR',
    question: '',
    correct: '',
    hint: ''
  },
  SC: {
    type: 'SC',
    question: '',
    answers: ['', ''],
    correct: '',
    hint: ''
  },
  TR: {
    type: 'TR',
    question: '',
    correct: '',
    hint: ''
  },
  TF: {
    type: 'TF',
    question: '',
    correct: null,
    hint: ''
  }
};
