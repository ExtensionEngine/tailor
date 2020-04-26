'use strict';

const {
  publishActivity,
  publishRepositoryDetails,
  unpublishActivity,
  updatePublishingStatus,
  updateRepositoryCatalog
} = require('./helpers');
const PromiseQueue = require('promise-queue');

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

  updateRepositoryCatalog(repository) {
    return this.queue.add(() => updateRepositoryCatalog(repository));
  }

  updatePublishingStatus(repository, activity) {
    return this.queue.add(() => updatePublishingStatus(repository, activity));
  }
}

module.exports = new PublishingService();
