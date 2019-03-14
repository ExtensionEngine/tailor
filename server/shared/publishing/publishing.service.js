'use strict';

const PromiseQueue = require('promise-queue');
const {
  publishActivity,
  publishRepositoryDetails,
  unpublishActivity
} = require('./helpers');
const storage = require('../storage');

class PublishingService {
  constructor(config) {
    this.queue = new PromiseQueue(1, Infinity);
    this.storage = config ? storage.create(config) : storage.storage;
  }
  static create(config) {
    return new PublishingService(config);
  }
  publishActivity(activity) {
    return this.queue.add(() => publishActivity(activity, this.storage));
  }

  publishRepoDetails(repository) {
    return this.queue.add(() => publishRepositoryDetails(repository, this.storage));
  }

  unpublishActivity(repository, activity) {
    return this.queue.add(() => unpublishActivity(repository, activity, this.storage));
  }
}

module.exports = {
  publishingService: new PublishingService(),
  create: PublishingService.create
};
