import Vue from 'vue';

const bus = new Vue();

function channel(name) {
  return {
    emit(event, ...args) {
      bus.$emit(`${name}/${event}`, ...args);
    },
    on(event, ...args) {
      bus.$on(`${name}/${event}`, ...args);
    }
  };
}

export default {
  channel,
  emit: (event, ...args) => bus.$emit(event, ...args),
  on: (event, ...args) => bus.$on(event, ...args)
};
