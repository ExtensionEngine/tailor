'use strict';

module.exports = new (class extends Map {
  addContext(user, context) {
    this._ensureUser(user);
    const record = this.get(user.id);
    record.contexts.push(context);
  }

  removeContext(user, filterFn) {
    const record = this.get(user.id);
    if (!record) return;
    record.contexts = record.contexts.filter(context => !filterFn(context));
    if (record.contexts.length <= 0) this.delete(user.id);
  }

  _ensureUser(user) {
    if (this.has(user.id)) return;
    const created = new Date();
    this.set(user.id, { ...user, created, contexts: [] });
  }

  toJSON() {
    return Array.from(this.entries()).reduce((acc, [key, value]) => {
      return Object.assign(acc, { [key]: value });
    }, {});
  }
})();
