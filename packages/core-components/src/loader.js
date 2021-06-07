import pMinDelay from 'p-min-delay';

export default function loader(action, name, minDuration = 0) {
  return function () {
    this[name] = true;
    return pMinDelay(Promise.resolve(action.call(this, ...arguments)), minDuration)
      .finally(() => (this[name] = false));
  };
}
