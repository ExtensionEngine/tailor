'use strict';

const each = require('lodash/each');
const get = require('lodash/get');
const set = require('lodash/set');
const unset = require('lodash/unset');

const getKey = (courseId, activityId) => `c${courseId}a${activityId}`;

const events = {
  ADD: 'editors_add',
  REMOVE: 'editors_remove'
};

const clients = {};

function unsubscribe(client, data) {
  const { courseId, activityId, editor } = data;

  return () => {
    unset(clients, [getKey(courseId, activityId), client.id]);
    broadcast(events.REMOVE, { courseId, activityId, editor });
    client.close();
  };
}

function subscribe(req, res) {
  const { courseId, activityId, editor } = req;
  const client = res.sse;

  set(clients, [getKey(courseId, activityId), client.id], client);
  req.on('close', unsubscribe(client, { courseId, activityId, editor }));
  broadcast(events.ADD, { courseId, activityId, editor });
}

function broadcast(event, data) {
  const { courseId, activityId, editor } = data;
  const recipients = get(clients, getKey(courseId, activityId), {});
  each(recipients, r => r.send(event, editor));
  return data;
}

module.exports = { subscribe, broadcast, events };
