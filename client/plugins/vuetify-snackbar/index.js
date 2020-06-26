import debounce from 'lodash/debounce';
import Queue from 'promise-queue';
import Snackbar from './Snackbar';

const queue = new Queue(1, Infinity);

export const install = (Vue, { parent } = {}) => {
  const SnackbarCtor = Vue.extend(Snackbar);
  // Create unmounted snackbar instance; $mount called without selector
  const vm = new SnackbarCtor().$mount();
  document.addEventListener('DOMContentLoaded', () => {
    // TODO: Temp fix, should be properly registrated
    setTimeout(() => {
      const element = parent || document.getElementById('app');
      element.appendChild(vm.$el);
    }, 1000);
  });

  const toQueue = (msg, opts) => queue.add(() => vm.show(msg, opts));
  const debouncedQueue = debounce(toQueue, 2500);
  const show = (msg, opts) => {
    return (opts && opts.immediate ? toQueue : debouncedQueue)(msg, opts);
  };

  const $snackbar = {
    show: (msg, opts) => show(msg, opts),
    close: () => vm.close,
    success: (msg, opts) => show(msg, { ...opts, color: 'success' }),
    info: (msg, opts) => show(msg, { ...opts, color: 'info' }),
    warning: (msg, opts) => show(msg, { ...opts, color: 'warning' }),
    error: (msg, opts) => show(msg, { ...opts, color: 'error' })
  };
  Object.assign(Vue.prototype, { $snackbar });
};

export default install;
