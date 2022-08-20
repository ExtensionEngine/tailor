import {
  publishActivity,
  publishRepositoryDetails,
  unpublishActivity,
  updatePublishingStatus,
  updateRepositoryCatalog
} from './helpers.js';
import PromiseQueue from 'promise-queue';
import webhook from '../webhookProvider.js';

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

export default new PublishingService();

function createPublishJob(action, payload) {
  return async () => {
    const data = await action(payload);
    if (webhook.isConnected) webhook.send(data);
    return data;
  };
}
