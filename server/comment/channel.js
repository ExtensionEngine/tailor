const each = require('lodash/each');
const get = require('lodash/get');
const set = require('lodash/set');
const unset = require('lodash/unset');

const clients = {};

const events = {
  CREATE: 'comment_create',
  UPDATE: 'comment_update',
  DELETE: 'comment_delete'
};

function unsubscribe(courseId, client) {
  return () => {
    unset(clients, [courseId, client.id]);
    client.close();
  };
};

function subscribe(req, res) {
  const { courseId } = req.params;
  const client = res.sse;
  set(clients, [courseId, client.id], client);
  req.on('close', unsubscribe(courseId, client));
};

function broadcast(event, comment) {
  const { courseId } = comment;
  const recipients = get(clients, courseId, {});
  each(recipients, r => r.send(event, comment));
  return comment;
}

module.exports = { subscribe, broadcast, events };
