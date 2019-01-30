'use strict';

module.exports = function Deffered() {
  this.promise = new Promise((resolve, reject) => {
    this.resolve = resolve;
    this.reject = reject;
  });
  this.callback = (err, ...args) => {
    return err ? this.reject(err) : this.resolve(...args);
  };
};
