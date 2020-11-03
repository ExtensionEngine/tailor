import { noCase } from 'change-case';

const printDeprecationWarning = (oldEvent, newEvent) => {
  console.warn(`Deprecation notice:
    '${oldEvent}' listener is deprecated and will no longer be used!
    Please emit '${newEvent}' instead on your content containers`);
};

export default {
  methods: {
    deprecateEvent(handler, { oldEvent, newEvent }) {
      newEvent = newEvent || noCase(oldEvent, { delimiter: ':' });
      const context = this;
      return () => {
        printDeprecationWarning(oldEvent, newEvent);
        return context[handler](...arguments);
      };
    }
  }
};
