'use strict';

const each = require('lodash/each');
const get = require('lodash/get');
const omit = require('lodash/omit');
const set = require('lodash/set');
const unset = require('lodash/unset');

const sseClients = {};

const events = {
  ADD_ACTIVE_USER: 'active_user_add',
  REMOVE_ACTIVE_USER: 'active_user_remove'
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

function broadcast(event, user, context) {
  const { courseId } = context;
  const recipients = get(sseClients, courseId, {});
  each(recipients, r => {
    r.send(event, { user, context: omit(context, ['timer']) });
  });
  return user;
}

module.exports = { subscribe, broadcast, events };
