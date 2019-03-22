'use strict';

function isQuestion(type) {
  return ['QUESTION', 'REFLECTION', 'ASSESSMENT'].includes(type);
}

module.exports = { isQuestion };
