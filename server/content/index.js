const containers = require('./containers');
const elements = require('./elements');
const Promise = require('bluebird');

module.exports = {
  initialize() {
    return Promise.all([containers.initialize(), elements.initialize()]);
  },
  fetch(...attrs) {
    return containers
      .fetch(attrs)
      .then(containers => {
        return containers.reduce((acc, { data, publishedAs }) => {
          return acc.concat(data.map(it => ({ ...it, publishedAs })));
        }, []);
      });
  },
  resolve(container, defaultResolver) {
    const resolver = containers.getStaticsResolver(container.publishedAs);
    return resolver(container, defaultResolver);
  }
};
