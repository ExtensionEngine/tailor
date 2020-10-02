'use strict';

module.exports = new (class extends Map {
  addContext(user, context) {
    const record = this._findOrCreate(user);
    record.contexts.push(context);
  }

  removeContext(user, filterFn) {
    const record = this.get(user.id);
    if (!record) return;
    record.contexts = record.contexts.filter(it => !filterFn(it));
    if (record.contexts.length <= 0) this.delete(user.id);
  }

  toJSON() {
    return Array.from(this.entries())
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  }

  _findOrCreate(user) {
    if (!this.has(user.id)) {
      const connectedAt = new Date();
      this.set(user.id, { ...user, connectedAt, contexts: [] });
    }
    return this.get(user.id);
  }
})();
