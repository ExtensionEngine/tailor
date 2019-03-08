import cuid from 'cuid';
import Edit from './edit';

const getTextElement = () =>
  ({ id: cuid(), type: 'HTML', embedded: true, data: { width: 12 } });

const initState = () => {
  const question = getTextElement();
  return {
    embeds: { [question.id]: question },
    question: question.id
  };
};

export default {
  name: 'Text Reflection',
  type: 'TEXT_REFLECTION',
  version: '1.0',
  initState,
  Edit,
  ui: {
    icon: 'mdi-comment-text',
    forceFullWidth: true
  }
};
