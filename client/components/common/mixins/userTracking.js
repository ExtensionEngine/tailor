import has from 'lodash/has';
import { mapActions } from 'vuex';
import pickBy from 'lodash/pickBy';

const trackedRoutes = {
  repository: 'repository',
  editor: 'editor'
};

export default {
  computed: {
    context: vm => pickBy({ activityId: Number(vm.$route.params.activityId) })
  },
  methods: {
    ...mapActions('repository', ['reset']),
    ...mapActions('repository/userTracking', {
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
