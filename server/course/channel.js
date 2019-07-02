'use strict';

const each = require('lodash/each');
const get = require('lodash/get');
const set = require('lodash/set');
const unset = require('lodash/unset');

const sseClients = {};

function unsubscribe(courseId, sseClient, { onUnsubscribe, params } = {}) {
  return () => {
    unset(sseClients, [courseId, sseClient.id]);
    sseClient.close();
    if (onUnsubscribe) {
      params.courseId = courseId;
      onUnsubscribe(params);
    }
  };
}

function subscribe(req, res, { onUnsubscribe, params } = {}) {
  const { id: courseId } = req.course;
  const sseClient = res.sse;
  set(sseClients, [courseId, sseClient.id], sseClient);
  req.on('close', unsubscribe(courseId, sseClient, { onUnsubscribe, params }));
}

function broadcast(event, courseId, data) {
  const recipients = get(sseClients, courseId, {});
  each(recipients, r => r.send(event, data));
  return data;
}

module.exports = { subscribe, broadcast };
