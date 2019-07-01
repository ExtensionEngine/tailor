import { EventSource } from 'event-source-polyfill';
import get from 'lodash/get';
import set from 'lodash/set';
import unset from 'lodash/unset';

function listenerFactory(method) {
  return ({ data }) => {
    const message = JSON.parse(data);
    method(message);
  };
}

class SSEClient {
  constructor(url) {
    this.url = url;
    this.connection = SSEClient.initConnection(url);
    this.listeners = {};
  }

  static initConnection(url) {
    window.EventSource = window.EventSource || EventSource;
    const token = window.localStorage.getItem('JWT_TOKEN');
    url += url.includes('?') ? `&jwt=${token}` : `?jwt=${token}`;
    return new window.EventSource(url, { withCredentials: true });
  }

  disconnect() {
    this.connection.close();
  }

  subscribe(event, method) {
    const listener = listenerFactory(method);
    this.connection.addEventListener(event, listener);
    set(this.listeners, event, listener);
  }

  unsubscribe(event) {
    const listener = get(this.listeners, event);
    this.connection.removeEventListener(event, listener);
    unset(this.listeners, event);
  }
}

export default SSEClient;
