'use strict';

const channels = require('./channels');
const cuid = require('cuid');
const { EventEmitter } = require('events');

const SSE_TIMEOUT_MARGIN = 0.10;
const SSE_DEFAULT_TIMEOUT = 60000; /* ms */
const SSE_HEADERS = {
  connection: 'keep-alive',
  'transfer-encoding': 'identity',
  'cache-control': 'no-transform',
  // NOTE: This controls nginx proxy buffering
  // https://nginx.com/resources/wiki/start/topics/examples/x-accel/#x-accel-buffering
  'x-accel-buffering': 'no'
};

class SSEConnection extends EventEmitter {
  constructor(res) {
    super();
    this._id = cuid();
    this._lastEventId = 0;
    this._heartbeat = null;
    this._res = res;
    this.initialize();
    this.send('connection_initialized', { sseId: this.id });
  }

  static create(res) {
    return new this(res);
  }

  get id() {
    return this._id;
  }

  get request() {
    return this._res.req;
  }

  get timeout() {
    const connectionTimeout = parseInt(this.request.header('connection-timeout'), 0);
    const timeout = connectionTimeout || SSE_DEFAULT_TIMEOUT;
    return timeout * (1 - SSE_TIMEOUT_MARGIN);
  }

  initialize() {
    const { socket } = this.request;
    socket.setTimeout(0);
    socket.setNoDelay(true);
    socket.setKeepAlive(true);
    // Gracefully handle termination.
    this.request.once('close', () => this.close());
    // Set event stream headers.
    this._res.status(200).type('text/event-stream').set(SSE_HEADERS);
    this._res.flushHeaders();
    // Setup heartbeat interval.
    if (this.timeout > 0) {
      this._heartbeat = setInterval(() => this.write(':ping'), this.timeout);
    }
    // Start stream.
    return this.write(':ok');
  }

  write(payload = '') {
    return this._res.write(`${payload}\n\n`);
  }

  send(event, data = '') {
    const id = this._lastEventId += 1;
    this.emit('data', { id, event, data });
    const json = JSON.stringify(data);
    const payload = [
      `id: ${id}`,
      `event: ${event}`,
      `data: ${json}`
    ].join('\n');
    this.write(payload);
    return this;
  }

  close() {
    if (this._heartbeat) clearInterval(this._heartbeat);
    this._res.end();
    this.emit('close');
  }

  static channel(channelId) {
    return channels.getChannel(channelId);
  }

  join(channelId) {
    return channels.addConnection(channelId, this);
  }

  leave(channelId) {
    return channels.removeConnection(channelId, this);
  }
}

module.exports = SSEConnection;
module.exports.middleware = middleware;

function middleware(_req, res, next) {
  res.sse = SSEConnection.create(res);
  next();
}
