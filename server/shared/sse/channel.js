'use strict';

const { EventEmitter } = require('events');

module.exports = class Channel extends EventEmitter {
  constructor(id) {
    super();
    this._id = id;
    this._connections = new Map();
  }

  get id() {
    return this._id;
  }

  add(connection) {
    this._connections.set(connection.id, connection);
    connection.on('close', () => this.remove(connection));
    return this;
  }

  remove(connection) {
    this._connections.delete(connection.id);
    if (!this._connections.size) this.emit('close');
    return this;
  }

  send(_event, _data) {
    this._connections.forEach(connection => connection.send(...arguments));
    return this;
  }
};
