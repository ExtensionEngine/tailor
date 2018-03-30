'use strict';

const PromiseQueue = require('promise-queue');
const {
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
}

module.exports = new PublishingService();
