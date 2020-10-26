class SSEClient {
  constructor() {
    this._listeners = new Map();
    this._connection = null;
  }

  get isConnected() {
    return Boolean(this._connection);
  }

  connect(url, { headers, searchParams, timeout = 45000 /* ms */, ...options } = {}) {
    if (this._connection) this.disconnect();
    url = createUrl(url, { searchParams });
    this._connection = new EventSource(url, {
      ...options,
      // NOTE: This is used by `event-source-polyfill`.
      headers: Object.assign({}, headers, { 'Connection-Timeout': timeout }),
      heartbeatTimeout: timeout
    });
    return this;
  }

  disconnect() {
    this._connection.close();
    this._connection = null;
    return this;
  }

  subscribe(event, listener) {
    const wrappedListener = parseJson(listener);
    this._listeners.set(listener, wrappedListener);
    this._connection.addEventListener(event, wrappedListener);
    return this;
  }

  unsubscribe(event, listener) {
    const wrappedListener = this._listeners.get(listener);
    this._connection.removeEventListener(event, wrappedListener);
    return this;
  }
}

export default SSEClient;

function createUrl(pathname, { searchParams = {} }) {
  const url = new URL(pathname, location);
  url.search = new URLSearchParams(searchParams).toString();
  return url.href;
}

function parseJson(listener) {
  return function ({ data } = {}) {
    listener.call(this, JSON.parse(data));
  };
}
