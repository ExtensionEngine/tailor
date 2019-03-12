<script>
import EventBus from 'EventBus';
import Promise from 'bluebird';

const appChannel = EventBus.channel('app');
const prefixMessage = 'Are you sure you want to publish';
const messages = {
  activity: `${prefixMessage} this activity?`,
  allActivities: `${prefixMessage} all activities within this course?`,
  allDescendants: `${prefixMessage} this activity along with all its descendants?`
};

export default {
  data() {
    return {
      isPublishing: false,
      publishStatus: ''
    };
  },
  methods: {
    confirmPublishing(activities = [this.activity]) {
      const message = this.getPublishMessage(activities.length);
      appChannel.emit('showConfirmationModal', {
        title: 'Publish',
        message: message,
        action: () => this.publish(activities)
      });
    },
    publish(activities) {
      this.isPublishing = true;
      Promise.each(activities, activity => {
        this.publishStatus = `Publishing ${activity.data.name}`;
        return this.publishActivity(activity);
      }).then(() => {
        this.isPublishing = false;
        this.publishStatus = '';
      });
    },
    getPublishMessage(activityCount) {
      const { activity, allActivities, allDescendants } = messages;
      if (activityCount === 1) return activity;
      if (activityCount === this.outlineActivities.length) return allActivities;
      return allDescendants;
    }
  }
};
</script>
