function task(action) {
  const deferred = new Deferred();
  return {
    run() {
      const proc = action();
      deferred.resolve(proc);
      return proc.promise();
    },
    getProcess() {
      return deferred.promise;
    }
  };
}

module.exports = task;

function Deferred() {
  this.resolve = null;
  this.promise = new Promise(resolve => (this.resolve = resolve));
}
