'use strict';

const each = require('lodash/each');
const get = require('lodash/get');
const set = require('lodash/set');
const unset = require('lodash/unset');

const clients = {};

const events = {
  ADD_ACTIVE_USER: 'active_user_add',
  REMOVE_ACTIVE_USER: 'active_user_remove'
};

function unsubscribe(courseId, client) {
  return () => {
    unset(clients, [courseId, client.id]);
    client.close();
  };
}

function subscribe(req, res) {
  const { id: courseId } = req.params;
  const client = res.sse;
  set(clients, [courseId, client.id], client);
  req.on('close', unsubscribe(courseId, client));
}

function broadcast(event, courseId, activeUser) {
  const recipients = get(clients, courseId, {});
  each(recipients, r => {
    r.send(event, activeUser);
  });
  return activeUser;
}

module.exports = { subscribe, broadcast, events };
