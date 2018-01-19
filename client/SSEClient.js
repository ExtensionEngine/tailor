import EventSource from 'eventsource';
import get from 'lodash/get';
import set from 'lodash/set';
import unset from 'lodash/unset';

function listenerFactory(method) {
  return ({data}) => {
    const message = JSON.parse(data);
    method(message);
  };
}

class SSEClient {
  constructor(path) {
    this.path = path;
    this.connection = SSEClient.initConnection(path);
    this.listeners = {};
  }

  static initConnection(path) {
    const token = window.localStorage.getItem('JWT_TOKEN');
    const headers = { Authorization: `JWT ${token}` };
    return new EventSource(path, { headers });
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
