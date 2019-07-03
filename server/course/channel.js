'use strict';

const each = require('lodash/each');
const get = require('lodash/get');
const set = require('lodash/set');
const unset = require('lodash/unset');

const sseClients = {};

function unsubscribe(req, res, onUnsubscribe) {
  return () => {
    unset(sseClients, [req.course.id, res.sse.id]);
    res.sse.close();
    if (onUnsubscribe) onUnsubscribe(req, res);
  };
}

function subscribe(req, res, onUnsubscribe) {
  const { id: courseId } = req.course;
  const sseClient = res.sse;
  set(sseClients, [courseId, sseClient.id], sseClient);
  req.on('close', unsubscribe(req, res, onUnsubscribe));
}

function broadcast(event, courseId, data) {
  const recipients = get(sseClients, courseId, {});
  each(recipients, r => r.send(event, data));
  return data;
}

module.exports = { subscribe, broadcast };
