'use strict';

const store = require('./store');

module.exports = {
  store: store.arangoSessionStore
};
