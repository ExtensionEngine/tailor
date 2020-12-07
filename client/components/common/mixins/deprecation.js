import { noCase } from 'change-case';

const printDeprecationWarning = (oldEvent, newEvent) => {
  console.warn(`Deprecation notice:
    '${oldEvent}' listener is deprecated and will no longer be used!
    Please emit '${newEvent}' instead on your content containers`);
};

export default {
  methods: {
    deprecateEvent(handler, { oldEvent, newEvent, adaptArgs }) {
      newEvent = newEvent || noCase(oldEvent, { delimiter: ':' });
      const context = this;
      return function () {
        printDeprecationWarning(oldEvent, newEvent);
        const args = adaptArgs ? adaptArgs(...arguments) : arguments;
        return context[handler](...args);
      };
    }
  }
};
