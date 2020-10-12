'use strict';

const each = require('lodash/each');
const get = require('lodash/get');

const clients = {};

const events = {
  CREATE: 'comment_create',
  UPDATE: 'comment_update',
  DELETE: 'comment_delete'
};

function broadcast(event, comment) {
  const { repositoryId } = comment;
  const recipients = get(clients, repositoryId, {});
  each(recipients, r => r.send(event, comment));
  return comment;
}

module.exports = { broadcast, events };
