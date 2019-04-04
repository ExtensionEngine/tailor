'use strict';

const PromiseQueue = require('promise-queue');
const {
  publishActivity,
  publishRepositoryDetails,
  unpublishActivity
} = require('./helpers');
const defaultStorage = require('../storage');

class PublishingService {
  constructor(storage = defaultStorage) {
    this.queue = new PromiseQueue(1, Infinity);
    this.storage = storage;
  }
  publishActivity(activity) {
    return this.queue.add(() => publishActivity(this.storage, activity));
  }

  publishRepoDetails(repository) {
    return this.queue.add(() => publishRepositoryDetails(this.storage, repository));
  }

  unpublishActivity(repository, activity) {
    return this.queue.add(() => unpublishActivity(this.storage, repository, activity));
  }
}

module.exports = new PublishingService();
module.exports.PublishingService = PublishingService;
