import yup from 'yup';

export const typeInfo = {
  MC: { type: 'MC', title: 'Multiple choice', class: 'multiple-choice' },
  SC: { type: 'SC', title: 'Single choice', class: 'single-choice' },
  TR: { type: 'TR', title: 'Text response', class: 'text-response' },
  NR: { type: 'NR', title: 'Numerical response', class: 'numerical-response' },
  TF: { type: 'TF', title: 'True - false', class: 'true-false' },
  FB: { type: 'FB', title: 'Fill in the blank', class: 'fill-blank' },
  DD: { type: 'DD', title: 'Drag & Drop', class: 'drag-drop' }
};

export const helperText = {
  FB: { question: 'Type "@blank" when new blank is needed.' }
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
  }),
  FB: yup.object().shape({
    question: yup.string().trim().matches(/@blank/).required(),
    correct: yup.array().of(yup.array().min(1).of(yup.string().trim().min(1).required()))
  }),
  DD: yup.object().shape({
    question: yup.string().trim().required(),
    correct: yup.array().of(yup.object().shape({
      heading: yup.string().trim().notOneOf(['Drop spot']).required(),
      answers: yup.array().of(yup.string().trim().notOneOf(['Response item']).required())
    }))
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
  },
  FB: {
    type: 'FB',
    question: '',
    correct: []
  },
  DD: {
    type: 'DD',
    question: '',
    correct: [],
    hint: ''
  }
};
