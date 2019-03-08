import cuid from 'cuid';
import Edit from './edit';
import times from 'lodash/times';

const getTextElement = () =>
  ({ id: cuid(), type: 'HTML', embedded: true, data: { width: 12 } });

const initState = () => {
  const question = getTextElement();
  const data = {
    name: null,
    embeds: { [question.id]: question },
    question: question.id,
    options: {}
  };
  times(2, i => {
    const option = { id: cuid(), content: null, position: i + 1 };
    data.options[option.id] = option;
  });
  return data;
};

export default {
  name: 'Poll',
  type: 'POLL',
  version: '1.0',
  initState,
  Edit,
  ui: {
    icon: 'mdi-poll-box',
    forceFullWidth: true
  }
};
