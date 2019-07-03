<script>
import { mapActions, mapState } from 'vuex';
import pick from 'lodash/pick';

const trackedRoutes = ['course', 'editor'];

export default {
  computed: {
    ...mapState('activeUsers', ['sseId']),
    context() {
      return { ...pick(this, ['courseId', 'activityId', 'sseId']), created: new Date() };
    }
  },
  methods: {
    ...mapActions('activeUsers', {
      addActiveUser: 'add',
      removeActiveUserSession: 'removeSession',
      subscribeToActiveUsers: 'subscribe',
      fetchActiveUsers: 'fetch'
    })
  },
  watch: {
    sseId: {
      async handler() {
        if (!this.sseId) return;
        await this.addActiveUser(this.context);
      },
      immediate: true
    }
  },
  async mounted() {
    this.subscribeToActiveUsers(this.courseId);
    await this.fetchActiveUsers(this.courseId);
  },
  beforeRouteLeave(to, from, next) {
    if (!trackedRoutes.includes(to.name)) {
      this.removeActiveUserSession(this.context);
    }
    next();
  }
};
</script>
