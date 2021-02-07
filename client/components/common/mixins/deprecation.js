import { noCase } from 'change-case';

const printDeprecationWarning = (oldEvent, newEvent) => {
  console.warn(`Deprecation notice:
    '${oldEvent}' listener is deprecated and will no longer be used!
    Please emit '${newEvent}' instead on your content containers`);
};

export default {
  methods: {
    deprecateEvent(handlerName, { oldEvent, newEvent, adaptArgs }) {
      newEvent = newEvent || noCase(oldEvent, { delimiter: ':' });
      return (...args) => {
        printDeprecationWarning(oldEvent, newEvent);
        this[handlerName](...(adaptArgs ? adaptArgs(...args) : args));
      };
    }
  }
};
