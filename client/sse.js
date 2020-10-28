import createDebug from 'debug';
import { EventEmitter } from 'events';

const debug = createDebug('sse-client');

const Events = {
  open: '#open'
};

const convertType = type => Events[type] || type;

export default class SSEConnection extends EventEmitter {
  constructor(url, options = {}) {
    super();
    this.options = options;
    const { searchParams = {}, headers, timeout, ...config } = options;
    if (debug.enabled) searchParams.debug = debug.namespace;
    const streamUrl = createUrl(url, { searchParams });
    this._connection = this.initialize(streamUrl, { headers, timeout, ...config });
    this.once('open', ({ id }) => (this._id = id));
    if (debug.enabled) this.on('message', e => debug('emitting event: %j', e));
  }

  static connect(url, options) {
    return new this(url, options);
  }

  get id() {
    return this._id;
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
    const payload = e.data ? JSON.parse(e.data) : e;
    return this.emit(e.type, payload);
  }

  addListener(event, listener) {
    const type = convertType(event);
    super.addListener(type, listener);
    this._connection.addEventListener(type, this._emit);
  }

  removeListener(event, listener) {
    const type = convertType(event);
    super.removeListener(type, listener);
    this._connection.removeEventListener(type, this._emit);
  }
}
SSEConnection.prototype.on = SSEConnection.prototype.addListener;
SSEConnection.prototype.off = SSEConnection.prototype.removeListener;

function createUrl(pathname, { searchParams = {} }) {
  const url = new URL(pathname, location);
  url.search = new URLSearchParams(searchParams).toString();
  return url;
}
