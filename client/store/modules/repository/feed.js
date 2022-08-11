import { feed as api } from '@/api';
import SSEConnection from '@/sse';
import urlJoin from 'url-join';

const noop = () => {};

class RepositoryFeed {
  baseUrl;
  _connection;
  _repositoryId;

  constructor({ baseUrl }) {
    this.baseUrl = baseUrl;
  }

  get connected() {
    return Boolean(this._connection);
  }

  connect = (repositoryId, cb = noop) => {
    if (this.connected && this._repositoryId === repositoryId) return this;
    if (this.connected) this.disconnect();
    const url = this._buildUrl(repositoryId);
    this._connection = new SSEConnection(url);
    this._connection.once('open', () => cb(this._connection));
    this._repositoryId = repositoryId;
    return this;
  };

  _buildUrl(repositoryId) {
    return urlJoin(this.baseUrl, api.urls.subscribe(repositoryId));
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
  baseUrl: import.meta.env.API_PATH
});
