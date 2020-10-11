import Vue from 'vue';

const bus = new Vue();

function channel(channelName) {
  const subscriptions = [];
  return {
    emit(name, ...args) {
      bus.$emit(`${channelName}/${name}`, ...args);
    },
    on(name, ...args) {
      subscriptions.push(name);
      bus.$on(`${channelName}/${name}`, ...args);
    },
    off(name) {
      bus.$off(`${channelName}/${name}`);
    },
    unsubscribe() {
      subscriptions.forEach(name => bus.$off(`${channelName}/${name}`));
    }
  };
}

export default {
  channel,
  emit: (name, ...args) => bus.$emit(name, ...args),
  on: (name, ...args) => bus.$on(name, ...args),
  off: (name, ...args) => bus.$off(name, ...args)
};
