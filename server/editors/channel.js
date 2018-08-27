'use strict';

const each = require('lodash/each');
const get = require('lodash/get');
const set = require('lodash/set');
const unset = require('lodash/unset');

const clients = {};

const events = {
  ADD: 'editors_add',
  REMOVE: 'editors_remove'
};

function unsubscribe(courseId, activityId, editor, client) {
  return () => {
    unset(clients, [courseId, activityId, client.id]);
    broadcast(events.REMOVE, { courseId, activityId, editor });
    client.close();
  };
}

function subscribe(req, res) {
  const { courseId, activityId, editor } = req;
  const client = res.sse;

  set(clients, [courseId, activityId, client.id], client);
  req.on('close', unsubscribe(courseId, activityId, editor, client));
  broadcast(events.ADD, { courseId, activityId, editor });
}

function broadcast(event, data) {
  const { courseId, activityId, editor } = data;
  const recipients = get(clients, [courseId, activityId], {});
  each(recipients, r => r.send(event, editor));
  return data;
}

module.exports = { subscribe, broadcast, events };
