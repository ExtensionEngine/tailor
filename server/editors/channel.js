'use strict';

const each = require('lodash/each');
const get = require('lodash/get');
const set = require('lodash/set');
const unset = require('lodash/unset');

const getKey = (courseId, activityId) => `${courseId}:${activityId}`;

const events = {
  UPDATE: 'editors_update'
};

const clients = {};

function unsubscribe(client, courseId, activityId) {
  return () => {
    unset(clients, [getKey(courseId, activityId), client.id]);
    client.close();
  };
}

function subscribe(req, res) {
  const { courseId, activityId } = req;
  const client = res.sse;
  set(clients, [getKey(courseId, activityId), client.id], client);
  req.on('close', unsubscribe(client, courseId, activityId));
  client.send(events.UPDATE, req.editors);
}

function broadcast(data, event = events.UPDATE) {
  const { courseId, activityId, payload } = data;
  const recipients = get(clients, getKey(courseId, activityId), {});
  each(recipients, r => r.send(event, payload));
  return data;
}

module.exports = { subscribe, broadcast, events };
