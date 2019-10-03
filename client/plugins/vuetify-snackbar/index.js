import Queue from 'promise-queue';
import Snackbar from './Snackbar';

const queue = new Queue(1, Infinity);

export const install = (Vue, { parent } = {}) => {
  const SnackbarCtor = Vue.extend(Snackbar);
  const vm = new SnackbarCtor().$mount();
  document.addEventListener('DOMContentLoaded', () => {
    const element = parent || document.getElementById('app');
    element.appendChild(vm.$el);
  });
  const $snackbar = {
    show: (msg, options) => queue.add(() => vm.show(msg, options)),
    close: () => vm.close,
    success: (msg, options) => $snackbar.show(msg, { ...options, color: 'success' }),
    info: (msg, options) => $snackbar.show(msg, { ...options, color: 'info' }),
    warning: (msg, options) => $snackbar.show(msg, { ...options, color: 'warning' }),
    error: (msg, options) => $snackbar.show(msg, { ...options, color: 'error' })
  };
  Object.assign(Vue.prototype, { $snackbar });
};

export default install;
