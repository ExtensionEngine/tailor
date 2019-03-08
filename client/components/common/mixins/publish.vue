<script>
import EventBus from 'EventBus';
import Promise from 'bluebird';

const appChannel = EventBus.channel('app');
const m1 = `Are you sure you want to publish this activity?`;
const m2 = `Are you sure you want to publish all activities within this course?`;
const m3 = `Are you sure you want to publish this activity along with all its
descendants?`;

export default {
  methods: {
    publishConfirmation(activities = [this.activity]) {
      const message = this.getPublishMessage(activities);
      appChannel.emit('showConfirmationModal', {
        type: 'publish',
        message: message,
        action: () => {
          this.publishing = true;
          Promise.each(activities, activity => {
            this.publishStatus = `Publishing ${activity.data.name}`;
            return (this.publish(activity));
          }).then(() => {
            this.publishing = false;
            this.publishStatus = '';
          });
        }
      });
    },
    getPublishMessage(activities) {
      if (activities.length === 1) return m1;
      if (activities.length === this.outlineActivities.length) return m2;
      return m3;
    }
  }
};
</script>
