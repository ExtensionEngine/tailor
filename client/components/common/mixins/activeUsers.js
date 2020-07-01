import { mapActions, mapState } from 'vuex';
import has from 'lodash/has';
import pickBy from 'lodash/pickBy';

const trackedRoutes = {
  repository: 'repository',
  editor: 'editor'
};

export default {
  computed: {
    ...mapState('activeUsers', ['sseId']),
    context() {
      const context = {
        activityId: Number(this.$route.params.activityId),
        repositoryId: Number(this.$route.params.repositoryId),
        sseId: this.sseId,
        created: new Date()
      };
      return pickBy(context);
    }
  },
  methods: {
    ...mapActions('activeUsers', {
      addContext: 'add',
      removeContext: 'remove',
      subscribeToActiveUsers: 'subscribe',
      unsubscribeFromActiveUsers: 'unsubscribe',
      fetchActiveUsers: 'fetch'
    })
  },
  watch: {
    sseId: {
      handler() {
        if (!this.sseId) return;
        this.addContext(this.context);
      },
      immediate: true
    }
  },
  created() {
    this.subscribeToActiveUsers(this.repositoryId);
    this.fetchActiveUsers(this.repositoryId);
  },
  beforeRouteLeave(to, from, next) {
    if (!has(trackedRoutes, to.name)) {
      this.unsubscribeFromActiveUsers(this.context);
    }
    // Remove context when leaving route except when navigating
    // to course route (Outline component)
    if (to.name === trackedRoutes.repository) this.removeContext(this.context);
    next();
  }
};
