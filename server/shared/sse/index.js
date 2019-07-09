'use strict';

const Channel = require('./channel');
const cuid = require('cuid');
const { EventEmitter } = require('events');
const nocache = require('nocache')();

const reEOL = /\r?\n/g;
const SSE_TIMEOUT_MARGIN = 0.10;
const SSE_DEFAULT_TIMEOUT = 60000; /* ms */
const SSE_HEADERS = {
  connection: 'keep-alive',
  'transfer-encoding': 'identity'
};

const isObject = arg => arg !== null && typeof arg === 'object';
const noop = () => {};

class SSEConnection extends EventEmitter {
  constructor(req, res) {
    super();
    this._id = cuid();
    this._lastEventId = 0;
    this._heartbeat = null;
    this.req = req;
    this.res = res;
    this.initialize();
  }

  get id() {
    return this._id;
  }

  get timeout() {
    const timeout = parseInt(this.req.header('connection-timeout'), 0) || SSE_DEFAULT_TIMEOUT;
    return timeout * (1 - SSE_TIMEOUT_MARGIN);
  }

  initialize() {
    // Gracefully handle termination.
    this.req.socket.setNoDelay(true);
    this.req.on('close', () => this.close());
    // Set event stream headers.
    nocache(null, this.res, noop);
    this.res.status(200)
      .type('text/event-stream')
      .set(SSE_HEADERS);
    // Start stream.
    this.res.setTimeout(0);
    this.res.write(':ok\n\n');
    this.send('connection_initialized', { sseId: this.id });
    // Setup heartbeat interval.
    if (this.timeout) {
      this._heartbeat = setInterval(() => this.res.write(':ping\n\n'), this.timeout);
    }
  }

  send(event, data = '') {
    this._lastEventId += 1;
    this.res.write(`id = ${this._lastEventId}\n`);
    this.res.write(`event: ${event}\n`);
    // Stringify data; split lines and send them separately.
    const payload = isObject(data) ? JSON.stringify(data) : String(data);
    payload.split(reEOL).forEach(line => this.res.write(`data: ${line}\n`));
    this.res.write('\n');
    return this;
  }

  close() {
    if (this._heartbeat) clearInterval(this._heartbeat);
    this.res.end();
    this.emit('close');
  }

  static channel(channelId) {
    channelId = String(channelId);
    return this._channels.get(channelId);
  }

  join(channelId) {
    channelId = String(channelId);
    this._ensureChannel(channelId);
    const channel = this.constructor.channel(channelId);
    return channel && channel.add(this);
  }

  leave(channelId) {
    channelId = String(channelId);
    const channel = this.constructor.channel(channelId);
    return channel && channel.remove(this);
  }

  _ensureChannel(channelId) {
    channelId = String(channelId);
    const { _channels: channels } = this.constructor;
    if (channels.has(channelId)) return;
    const channel = new Channel(channelId);
    channel.on('close', () => channels.delete(channelId));
    channels.set(channelId, channel);
  }
}

SSEConnection._channels = new Map();

function middleware(req, res, next) {
  res.sse = new SSEConnection(req, res);
  next();
}

module.exports = SSEConnection;
module.exports.middleware = middleware;
