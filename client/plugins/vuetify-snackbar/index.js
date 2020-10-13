import debounce from 'lodash/debounce';
import Queue from 'promise-queue';
import Snackbar from './Snackbar';

const queue = new Queue(1, Infinity);

export const install = Vue => {
  const SnackbarCtor = Vue.extend(Snackbar);
  const vm = new SnackbarCtor();

  Vue.mixin({
    mounted() {
      if (this.$options.name !== 'v-app') return;
      vm.$vuetify = this.$root.$vuetify;
      this.$el.appendChild(vm.$mount().$el);
    }
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
