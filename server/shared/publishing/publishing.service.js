'use strict';

const {
  publishActivity,
  publishRepositoryDetails,
  unpublishActivity,
  updatePublishingStatus,
  updateRepositoryCatalog
} = require('./helpers');
const PromiseQueue = require('promise-queue');
const webhook = require('../webhookProvider');

class PublishingService {
  constructor() {
    this.queue = new PromiseQueue(1, Infinity);
  }

  publishActivity(activity) {
    return this.queue.add(createPublishJob(publishActivity, activity));
  }

  publishRepoDetails(repository) {
    return this.queue.add(createPublishJob(publishRepositoryDetails, repository));
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

function createPublishJob(action, payload) {
  return async () => {
    const data = await action(payload);
    if (webhook.isConnected) webhook.send(data);
    return data;
  };
}
