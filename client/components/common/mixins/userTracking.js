import { mapActions, mapState } from 'vuex';
import has from 'lodash/has';
import pickBy from 'lodash/pickBy';

const trackedRoutes = {
  repository: 'repository',
  editor: 'editor'
};

export default {
  computed: {
    ...mapState('repository', ['sseId']),
    context: vm => pickBy({
      sseId: vm.sseId,
      repositoryId: Number(vm.$route.params.repositoryId),
      activityId: Number(vm.$route.params.activityId),
      created: new Date()
    })
  },
  methods: {
    ...mapActions('repository', ['reset']),
    ...mapActions('repository/userTracking', {
      fetchActiveUsers: 'fetch',
      addContext: 'start',
      removeContext: 'end'
    })
  },
  watch: {
    sseId: {
      immediate: true,
      handler() {
        if (!this.sseId) return;
        this.addContext(this.context);
      }
    }
  },
  beforeRouteLeave(to, _from, next) {
    if (!has(trackedRoutes, to.name)) this.reset(this.context);
    // Remove context when leaving route except when navigating
    // to course route (Outline component)
    if (to.name === trackedRoutes.repository) this.removeContext(this.context);
    next();
  }
};
