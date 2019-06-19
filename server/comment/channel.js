'use strict';

const each = require('lodash/each');
const get = require('lodash/get');
const set = require('lodash/set');
const unset = require('lodash/unset');

const sseClients = {};

const events = {
  CREATE: 'comment_create',
  UPDATE: 'comment_update',
  DELETE: 'comment_delete'
};

function unsubscribe(courseId, sseClient) {
  return () => {
    unset(sseClients, [courseId, sseClient.id]);
    sseClient.close();
  };
}

function subscribe(req, res) {
  const { id: courseId } = req.course;
  const sseClient = res.sse;
  set(sseClients, [courseId, sseClient.id], sseClient);
  req.on('close', unsubscribe(courseId, sseClient));
}

function broadcast(event, courseId, data) {
  const recipients = get(sseClients, courseId, {});
  each(recipients, r => r.send(event, data));
  return data;
}

module.exports = { subscribe, broadcast, events };
