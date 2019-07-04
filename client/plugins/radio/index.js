import Radio from './radio';

export const install = Vue => {
  Object.defineProperty(Vue.prototype, '$radio', {
    get() {
      const radio = Radio.getInstance(this);
      return {
        channel: id => wrapChannel(radio.channel(id), this),
        emit: delegateChannel('emit'),
        on: delegateChannel('on'),
        once: delegateChannel('once'),
        off: delegateChannel('off'),
        request: delegateChannel('request'),
        reply: delegateChannel('reply'),
        replyOnce: delegateChannel('replyOnce'),
        stopReplying: delegateChannel('stopReplying')
      };

      function delegateChannel(method) {
        return (channelId, ...args) => {
          const channel = this.channel(channelId);
          channel[method](...args);
          return this;
        };
      }
    }
  });
};

export * from './helpers';
export default install;

function wrapChannel(channel, vm) {
  const cleanup = new (class extends Map {
    constructor(vm) {
      super();
      this._vm = vm;
    }

    set(listener, disposeFn) {
      if (!this.size) this._vm.$once('hook:beforeDestroy', this.run);
      super.set(listener, disposeFn);
      return this;
    }

    delete(listener) {
      super.delete(listener);
      if (!this.size) this._vm.$off('hook:beforeDestroy', this.run);
      return this;
    }

    run = () => this.forEach(disposeFn => disposeFn());
  })(vm);

  return {
    // Proxy method invocations.
    emit: channel.emit.bind(channel),
    request: channel.request.bind(channel),
    // Autoclean listener registrations.
    on(event, listener) {
      cleanup.set(listener, () => channel.off(event, listener));
      return channel.on(event, listener);
    },
    once(event, listener) {
      cleanup.set(listener, () => channel.off(event, listener));
      return channel.once(event, listener);
    },
    reply(id, listener) {
      cleanup.set(listener, () => channel.stopReplying(id, listener));
      return channel.reply(id, listener);
    },
    replyOnce(id, listener) {
      cleanup.set(listener, () => channel.stopReplying(id, listener));
      return channel.replyOnce(id, listener);
    },
    off(event, listener) {
      cleanup.delete(listener);
      return channel.off(event, listener);
    },
    stopReplying(id, listener) {
      cleanup.delete(listener);
      return channel.stopReplying(id, listener);
    }
  };
}
