import { EventEmitter } from 'events';

const channels = new Map();

class Channel extends EventEmitter {
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
    connection.prependOnceListener('close', () => this.remove(connection));
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
}

export default {
  getChannel,
  addConnection,
  removeConnection
};

function getChannel(channelId) {
  channelId = String(channelId);
  return channels.get(channelId) || new Channel('\0dummy');
}

function addConnection(channelId, connection) {
  channelId = String(channelId);
  if (channels.has(channelId)) {
    return channels.get(channelId).add(connection);
  }
  const channel = new Channel(channelId);
  channel.prependOnceListener('close', () => channels.delete(channelId));
  channels.set(channelId, channel);
  return channel.add(connection);
}

function removeConnection(channelId, connection) {
  return getChannel(channelId).remove(connection);
}
