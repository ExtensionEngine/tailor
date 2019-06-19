'use strict';

const { activeUsers, addContext, removeContext } = require('./store');
const { broadcast, events } = require('./channel');
const pick = require('lodash/pick');

function fetch(req, res) {
  res.json({ data: { activeUsers } });
}

function add(req, res) {
  const { user: loggedUser, body: { context } } = req;
  const { courseId } = context;
  const user = pick(loggedUser, ['id', 'email', 'firstName', 'lastName']);
  user.created = new Date();
  addContext(user, context);
  const data = { user, context };
  broadcast(events.ADD_ACTIVE_USER, courseId, data);
  res.end();
}

function remove(req, res) {
  const { user: loggedUser, body: { context } } = req;
  const { courseId } = context;
  const user = pick(loggedUser, ['id', 'email', 'firstName', 'lastName']);
  removeContext(user, context, true);
  const data = { user, context };
  broadcast(events.REMOVE_ACTIVE_USER, courseId, data);
  res.end();
}

module.exports = {
  fetch,
  add,
  remove
};
