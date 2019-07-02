'use strict';

class Feeds extends Map {
  add(channel) {
    super.set(channel.id, channel);
    channel.on('close', () => this.remove(channel));
  }

  remove(channel) {
    return super.delete(channel.id);
  }
}

exports.withFeeds = (Model, Events) => class extends Model {
  static init(_attributes, _options) {
    this._feeds = new Feeds();
    return super.init(...arguments);
  }

  static get feeds() {
    return this._feeds;
  }

  static get Events() {
    return Events;
  }
};
