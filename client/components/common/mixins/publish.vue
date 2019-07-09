<script>
import EventBus from 'EventBus';
import get from 'lodash/get';
import Promise from 'bluebird';

const appChannel = EventBus.channel('app');
const prefix = message => `Are you sure you want to publish ${message}`;

const initialStatus = () => ({ progress: 0, message: '' });

export default {
  data: () => ({ publishStatus: initialStatus() }),
  computed: {
    isPublishing: ({ publishStatus }) => publishStatus.progress > 0
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
      return Promise.each(activities, (activity, i) => {
        const progress = (i + 1) / activities.length;
        const message = `Publishing ${activity.data.name}`;
        this.publishStatus = { progress, message };
        return this.publishActivity(activity);
      })
      .finally(() => (this.publishStatus = initialStatus()));
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
