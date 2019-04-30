<script>
import EventBus from 'EventBus';
import get from 'lodash/get';
import Promise from 'bluebird';

const appChannel = EventBus.channel('app');
const prefix = message => `Are you sure you want to publish ${message}`;

export default {
  data() {
    return {
      activityNum: 0,
      isPublishing: false,
      publishStatus: ''
    };
  },
  methods: {
    confirmPublishing(activities = [this.activity]) {
      const message = this.getPublishMessage(activities.length);
      appChannel.emit('showConfirmationModal', {
        title: 'Publish content',
        message,
        action: () => this.publish(activities)
      });
    },
    publish(activities) {
      this.isPublishing = true;
      return Promise.each(activities, activity => {
        this.publishStatus = `Publishing ${activity.data.name}`;
        return this.publishActivity(activity)
          .then(() => this.activityNum++);
      }).then(() => {
        this.activityNum = 0;
        this.isPublishing = false;
        this.publishStatus = '';
      });
    },
    getPublishMessage(activityCount) {
      const name = get(this, 'activity.data.name', 'activity');
      const totalActivities = get(this, 'outlineActivities.length', 0);
      if (activityCount === 1) return prefix(`${name} activity?`);
      if (activityCount === totalActivities) return prefix('all activities?');
      return prefix(`${name} and all its descendants?`);
    }
  }
};
</script>
