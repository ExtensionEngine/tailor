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
  constructor(url, token) {
    this.url = url;
    this.connection = SSEClient.initConnection(url, token);
    this.listeners = {};
  }

  static initConnection(url, token) {
    const headers = { Authorization: `JWT ${token}` };
    return new window.EventSource(url, { headers });
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
