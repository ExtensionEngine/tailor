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

  sendData(data) {
    if (webhook.isConnected) webhook.send(data);
    return data;
  }

  publishActivity(activity) {
    const publish = () => publishActivity(activity).then(this.sendData);
    return this.queue.add(publish);
  }

  publishRepoDetails(repository) {
    const publish = () => publishRepositoryDetails(repository).then(this.sendData);
    return this.queue.add(publish);
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
