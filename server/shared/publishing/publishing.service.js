'use strict';

const PromiseQueue = require('promise-queue');
const {
  publishActivity,
  publishRepositoryDetails,
  unpublishActivity
} = require('./helpers');
const { Storage, storage } = require('../storage');

class PublishingService {
  constructor(config) {
    this.queue = new PromiseQueue(1, Infinity);
    this.storage = config ? new Storage(config) : storage;
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
  PublishingService,
  publishingService: new PublishingService()
};
