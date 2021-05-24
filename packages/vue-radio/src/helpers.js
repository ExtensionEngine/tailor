const isFunction = arg => typeof arg === 'function';

export function mapChannels(channels) {
  return mapKeys(castObject(channels), name => {
    return vm => vm.$radio.channel(name);
  });
}

export function mapRequests(channel, requests) {
  const getChannel = !isFunction(channel)
    ? vm => vm.$radio.channel(channel)
    : channel;
  return mapKeys(castObject(requests), request => {
    return function (...args) {
      return getChannel(this).request(request, ...args);
    };
  });
}

function castObject(arg) {
  if (!Array.isArray(arg)) return arg;
  return arg.reduce((acc, name) => {
    return Object.assign(acc, { [name]: name });
  }, {});
}

function mapKeys(obj, cb) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    value = cb(value, key);
    return Object.assign(acc, { [key]: value });
  }, {});
}
