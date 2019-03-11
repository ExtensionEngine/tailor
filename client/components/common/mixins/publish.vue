<script>
import EventBus from 'EventBus';
import Promise from 'bluebird';

const appChannel = EventBus.channel('app');
const prefixMessage = 'Are you sure you want to publish';
const m1 = `${prefixMessage} this activity?`;
const m2 = `${prefixMessage} all activities within this course?`;
const m3 = `${prefixMessage} this activity along with all its descendants?`;

export default {
  methods: {
    publishConfirmation(activities = [this.activity]) {
      const message = this.getPublishMessage(activities.length);
      appChannel.emit('showConfirmationModal', {
        type: 'publish',
        message: message,
        action: () => {
          this.publishing = true;
          Promise.each(activities, activity => {
            this.publishStatus = `Publishing ${activity.data.name}`;
            return this.publish(activity);
          }).then(() => {
            this.publishing = false;
            this.publishStatus = '';
          });
        }
      });
    },
    getPublishMessage(activityCount) {
      if (activityCount === 1) return m1;
      return activityCount === this.outlineActivities.length ? m2 : m3;
    }
  }
};
</script>
