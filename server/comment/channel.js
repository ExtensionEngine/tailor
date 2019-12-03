'use strict';

const each = require('lodash/each');
const get = require('lodash/get');
const set = require('lodash/set');
const unset = require('lodash/unset');

const clients = {};

const events = {
  CREATE: 'comment_create',
  UPDATE: 'comment_update',
  DELETE: 'comment_delete'
};

function unsubscribe(repositoryId, client) {
  return () => {
    unset(clients, [repositoryId, client.id]);
    client.close();
  };
}

function subscribe(req, res) {
  const { id: repositoryId } = req.repository;
  const client = res.sse;
  set(clients, [repositoryId, client.id], client);
  req.on('close', unsubscribe(repositoryId, client));
}

function broadcast(event, comment) {
  const { repositoryId } = comment;
  const recipients = get(clients, repositoryId, {});
  each(recipients, r => r.send(event, comment));
  return comment;
}

module.exports = { subscribe, broadcast, events };
