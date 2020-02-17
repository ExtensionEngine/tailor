const info = require('./info');

function fetch(parent) {
  const opts = { where: { type: info.type } };
  return parent.getChildren(opts);
}

module.exports = {
  ...info,
  fetch
};
