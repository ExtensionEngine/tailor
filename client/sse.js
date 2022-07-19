import createDebug from 'debug';
import cuid from 'cuid';
import { EventEmitter } from 'events';

const debug = createDebug('sse-client');

export default class SSEConnection extends EventEmitter {
  _id;
  _connection;

  constructor(url, options = {}) {
    super();
    this.config = this._buildConfig(options);
    this._id = cuid();
    this._connection = this.initialize(createUrl(url, options), this.config);
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

  initialize(url, config) {
    url.searchParams.append('id', this.id);
    if (debug.enabled) url.searchParams.append('debug', debug.namespace);
    const connection = new EventSource(url, config);
    debug('connected to the URL: %s with config: %j', connection.url, config);
    return connection;
  }

  _buildConfig({ headers, timeout = 45_000 /* ms */, withCredentials } = {}) {
    return {
      withCredentials,
      // NOTE: This is used by `event-source-polyfill`.
      headers: { ...headers, 'Connection-Timeout': timeout },
      heartbeatTimeout: timeout
    };
  }

  close() {
    return this._connection.close();
  }

  _emit = e => {
    if (e.target !== this._connection) return;
    const payload = e.data ? JSON.parse(e.data) : e;
    return this.emit(e.type, payload);
  };

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

function createUrl(pathname, { searchParams = {} }) {
  const url = new URL(pathname, location);
  url.search = new URLSearchParams(searchParams);
  return url;
}
