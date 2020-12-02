import api from '@/api/feed';
import SSEConnection from '@/sse';
import urlJoin from 'url-join';

const noop = () => {};

class RepositoryFeed {
  baseUrl
  _connection
  _repositoryId

  constructor({ baseUrl, authScheme }) {
    this.baseUrl = baseUrl;
    this.authScheme = authScheme;
  }

  get connected() {
    return Boolean(this._connection);
  }

  connect = (repositoryId, token, cb = noop) => {
    if (this.connected && this._repositoryId === repositoryId) return this;
    if (this.connected) this.disconnect();
    const url = this._buildUrl(repositoryId);
    const config = this._buildConfig(token);
    this._connection = new SSEConnection(url, config);
    this._connection.once('open', () => cb(this._connection));
    this._repositoryId = repositoryId;
    return this;
  }

  _buildUrl(repositoryId) {
    return urlJoin(this.baseUrl, api.urls.subscribe(repositoryId));
  }

  _buildConfig(token) {
    const headers = { Authorization: `${this.authScheme} ${token}` };
    const searchParams = { token };
    return { headers, searchParams };
  }

  disconnect() {
    this._connection?.close();
    this._connection = null;
    return this;
  }

  subscribe(event, listener) {
    this._connection?.on(event, listener);
    return this;
  }

  unsubscribe(event, listener) {
    this._connection?.off(event, listener);
    return this;
  }
}

export default new RepositoryFeed({
  baseUrl: process.env.API_PATH,
  authScheme: process.env.AUTH_JWT_SCHEME
});
