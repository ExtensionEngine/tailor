'use strict';

const each = require('lodash/each');
const get = require('lodash/get');
const set = require('lodash/set');
const unset = require('lodash/unset');

const getKey = courseId => `c${courseId}`;

const events = {
  ADD: 'editors_add',
  REMOVE: 'editors_remove'
};

const clients = {};

function unsubscribe(client, courseId) {
  return () => {
    unset(clients, [getKey(courseId), client.id]);
    client.close();
  };
}

function subscribe(req, res) {
  const { courseId } = req;
  const client = res.sse;
  set(clients, [getKey(courseId), client.id], client);
  req.on('close', unsubscribe(client, courseId));
}

function broadcast(event, data) {
  const { courseId, editor } = data;
  const recipients = get(clients, getKey(courseId), {});
  each(recipients, r => r.send(event, editor));
  return data;
}

module.exports = { subscribe, broadcast, events };
