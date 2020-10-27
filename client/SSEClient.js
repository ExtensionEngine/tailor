import createDebug from 'debug';
import { EventEmitter } from 'events';

const debug = createDebug('sse-client');

class SSEConnection extends EventEmitter {
  constructor(url, options = {}) {
    super();
    this.options = options;
    const { searchParams = {}, headers, timeout, ...config } = options;
    if (debug.enabled) searchParams.debug = debug.namespace;
    const streamUrl = createUrl(url, { searchParams });
    this._connection = this.initialize(streamUrl, { headers, timeout, ...config });
    if (debug.enabled) this.on('message', e => debug('emitting event: %j', e));
  }

  static connect(url, options) {
    return new this(url, options);
  }

  get url() {
    return this._connection.url;
  }

  initialize(url, { timeout = 45_000 /* ms */, ...config } = {}) {
    // NOTE: This is used by `event-source-polyfill`.
    config.headers = { ...config.headers, 'Connection-Timeout': timeout };
    config.heartbeatTimeout = timeout;
    const connection = new EventSource(url, config);
    debug('connected to the URL: %s with config: %j', connection.url, config);
    return connection;
  }

  close() {
    return this._connection.close();
  }

  _emit = e => {
    if (e.target !== this._connection) return;
    return this.emit(e.type, JSON.parse(e.data));
  }

  addListener(event, listener) {
    super.addListener(event, listener);
    this._connection.addEventListener(event, this._emit);
  }

  removeListener(event, listener) {
    super.removeListener(event, listener);
    this._connection.removeEventListener(event, this._emit);
  }
}
SSEConnection.prototype.on = SSEConnection.prototype.addListener;
SSEConnection.prototype.off = SSEConnection.prototype.removeListener;

class SSEClient {
  constructor() {
    this._connection = null;
  }

  get isConnected() {
    return Boolean(this._connection);
  }

  connect(url, options) {
    if (this._connection) this.disconnect();
    this._connection = new SSEConnection(url, options);
    return this;
  }

  disconnect() {
    this._connection.close();
    this._connection = null;
    return this;
  }

  subscribe(event, listener) {
    this._connection.on(event, listener);
    return this;
  }

  unsubscribe(event, listener) {
    this._connection.off(event, listener);
    return this;
  }
}

export default SSEClient;

function createUrl(pathname, { searchParams = {} }) {
  const url = new URL(pathname, location);
  url.search = new URLSearchParams(searchParams).toString();
  return url;
}
