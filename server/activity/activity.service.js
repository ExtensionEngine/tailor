const PromiseQueue = require('promise-queue');
const { publishActivity, unpublishActivity } = require('./publishing');

class ActivityService {
  constructor() {
    this.publishingQueue = new PromiseQueue(1, Infinity);
  }

  publish(activity) {
    return this.publishingQueue.add(() => publishActivity(activity));
  }

  unpublish(repository, activity) {
    return this.publishingQueue.add(() => unpublishActivity(repository, activity));
  }
}

module.exports = new ActivityService();
