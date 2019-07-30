'use strict';

const PromiseQueue = require('promise-queue');
const {
  deprecateRepository,
  publishActivity,
  publishRepositoryDetails,
  unpublishActivity
} = require('./helpers');

class PublishingService {
  constructor() {
    this.queue = new PromiseQueue(1, Infinity);
  }

  publishActivity(activity) {
    return this.queue.add(() => publishActivity(activity));
  }

  publishRepoDetails(repository) {
    return this.queue.add(() => publishRepositoryDetails(repository));
  }

  unpublishActivity(repository, activity) {
    return this.queue.add(() => unpublishActivity(repository, activity));
  }

  deprecateRepository(repository) {
    return this.queue.add(() => deprecateRepository(repository));
  }
}

module.exports = new PublishingService();
