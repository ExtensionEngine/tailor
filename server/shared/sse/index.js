import channels from './channels.js';
import cuid from 'cuid';
import { EventEmitter } from 'events';

const SSE_TIMEOUT_MARGIN = 0.10;
const SSE_DEFAULT_TIMEOUT = 60000; /* ms */
const SSE_HEADERS = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-transform',
  Connection: 'keep-alive',
  'Transfer-Encoding': 'identity',
  // NOTE: This controls nginx proxy buffering
  // https://nginx.com/resources/wiki/start/topics/examples/x-accel/#x-accel-buffering
  'X-Accel-Buffering': 'no'
};

const hasProp = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

class SSEConnection extends EventEmitter {
  constructor(res) {
    super();
    this._id = null;
    this._res = res;
    this._req = res.req;
    this._lastEventId = 0;
    this._heartbeat = null;
    this.initialize();
  }

  static create(res) {
    return new this(res);
  }

  get id() {
    return this._id;
  }

  get socket() {
    return this._res.socket;
  }

  get query() {
    return this._req.query;
  }

  header(name) {
    return this._req.header(name);
  }

  get timeout() {
    const connectionTimeout = parseInt(this.header('connection-timeout'), 10);
    const timeout = connectionTimeout || SSE_DEFAULT_TIMEOUT;
    return timeout * (1 - SSE_TIMEOUT_MARGIN);
  }

  initialize() {
    // Set socket properties.
    this.socket.setTimeout(0);
    this.socket.setNoDelay(true);
    this.socket.setKeepAlive(true);
    // Gracefully handle termination.
    this._req.once('close', () => this.close());
    // Set event stream headers.
    this._res.writeHead(200, SSE_HEADERS);
    this._res.flushHeaders();
    // Ensure connection id is correctly set.
    this._id = cuid.isCuid(this.query.id) ? this.query.id : cuid();
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
    if (hasProp(this.query, 'debug')) {
      this.debug({ id, type: event, data });
    }
    return this;
  }

  debug(data = '') {
    const json = JSON.stringify(data);
    this.write(`data: ${json}`);
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

export default SSEConnection;
export function middleware(_req, res, next) {
  res.sse = SSEConnection.create(res);
  next();
}
