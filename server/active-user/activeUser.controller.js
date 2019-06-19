'use strict';

const {
  activeUsers,
  broadcast,
  events,
  addContext,
  removeContext
} = require('./channel');
const pick = require('lodash/pick');

function fetch(req, res) {
  res.json({ data: { activeUsers } });
}

function add(req, res) {
  const { user, body: { context } } = req;
  const activeUser = pick(user, ['id', 'email', 'firstName', 'lastName']);
  activeUser.created = new Date();
  addContext(activeUser, context);
  broadcast(events.ADD_ACTIVE_USER, activeUser, context);
  res.end();
}

function remove(req, res) {
  const { user, body: { context } } = req;
  const activeUser = pick(user, ['id', 'email', 'firstName', 'lastName']);
  removeContext(activeUser, context, true);
  broadcast(events.REMOVE_ACTIVE_USER, activeUser, context);
  res.end();
}


module.exports = {
  fetch,
  add,
  remove
};
