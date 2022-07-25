const isFunction = arg => typeof arg === 'function';
const last = arr => arr[arr.length - 1];
const noop = () => { };
const replyEvent = id => `reply->${id}`;
const requestEvent = id => `request->${id}`;

class Channel {
  constructor(bus, id) {
    this._bus = bus;
    this._id = id;
    this._repliers = new Map();
  }

  eventName = event => this._id ? [this._id, event].join('/') : event;

  emit = delegateBus('$emit');
  on = delegateBus('$on');
  once = delegateBus('$once');
  off = delegateBus('$off');

  request(id, ...args) {
    const onReply = isFunction(last(args)) ? args.pop() : noop;
    this.once(replyEvent(id), onReply);
    this.emit(requestEvent(id), ...args);
    return this;
  }

  reply(id, listener) {
    const callback = (...args) => this.emit(replyEvent(id), ...args);
    const onRequest = (...args) => listener(...args, callback);
    this._repliers.set(listener, onRequest);
    this.on(requestEvent(id), onRequest);
    return this;
  }

  replyOnce(id, listener) {
    const callback = (...args) => this.emit(replyEvent(id), ...args);
    const onRequest = (...args) => listener(...args, callback);
    this._repliers.set(listener, onRequest);
    this.once(requestEvent(id), onRequest);
    return this;
  }

  stopReplying(id, listener) {
    const onRequest = this._repliers.get(listener);
    if (onRequest) this._repliers.delete(onRequest);
    this.off(requestEvent(id), onRequest);
    return this;
  }
}

function delegateBus(method) {
  return function (event, ...args) {
    this._bus[method](this.eventName(event), ...args);
    return this;
  };
}

export default class Radio {
  static _instance = null;
  static _channels = new Map();

  constructor(bus) {
    this._bus = bus;
  }

  channel(id) {
    const { _channels: channels } = this.constructor;
    if (channels.has(id)) return channels.get(id);
    const channel = new Channel(this._bus, id);
    channels.set(id, channel);
    return channel;
  }

  static getInstance(vm) {
    this._instance = this._instance = new Radio(vm.$root);
    return this._instance;
  }
}
