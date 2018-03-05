const addons = require('./service');

function list(_, res) {
  return addons.list().then(data => res.json(data));
}

module.exports = {
  install: update(addons, addons.install),
  uninstall: update(addons, addons.uninstall),
  list
};

function update(addons, action) {
  return async function ({ body }, res) {
    const { packages, loglevel } = body;
    const proc = await action.call(addons, packages, { loglevel });
    proc.stdout.pipe(res);
    proc.stderr.pipe(res);
    return proc.promise();
  };
}
