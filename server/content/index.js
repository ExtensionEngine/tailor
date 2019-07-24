const containers = require('./containers');

module.exports = {
  initialize() {
    return containers.initialize();
  },
  fetch(...attrs) {
    return containers
      .fetch(attrs)
      .then(containers => {
        return containers.reduce((acc, { data, publishedAs }) => {
          return acc.concat(data.map(it => ({ ...it, publishedAs })));
        }, []);
      });
  }
};
