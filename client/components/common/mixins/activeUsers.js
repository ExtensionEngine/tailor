import { mapActions, mapState } from 'vuex';
import pick from 'lodash/pick';

const trackedRoutes = ['course', 'editor'];

export default {
  computed: {
    ...mapState('activeUsers', ['sseId']),
    context() {
      const routeName = this.activityId ? 'activity' : 'course';
      return {
        ...pick(this, ['courseId', 'activityId', 'sseId']),
        routeName,
        created: new Date()
      };
    }
  },
  methods: {
    ...mapActions('activeUsers', {
      addActiveUser: 'add',
      removeActiveUser: 'remove',
      subscribeToActiveUsers: 'subscribe',
      unsubscribeFromActiveUsers: 'unsubscribe',
      fetchActiveUsers: 'fetch'
    })
  },
  watch: {
    sseId: {
      handler() {
        if (!this.sseId) return;
        this.addActiveUser(this.context);
      },
      immediate: true
    }
  },
  mounted() {
    this.subscribeToActiveUsers(this.courseId);
    this.fetchActiveUsers(this.courseId);
  },
  beforeRouteLeave(to, from, next) {
    if (!trackedRoutes.includes(to.name)) {
      this.unsubscribeFromActiveUsers(this.context);
    }
    // Remove children context
    if (to.name === 'course') this.removeActiveUser(this.context);
    next();
  }
};
