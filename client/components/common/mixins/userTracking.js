import { mapActions, mapState } from 'vuex';
import has from 'lodash/has';
import isEqual from 'lodash/isEqual';
import pickBy from 'lodash/pickBy';

const trackedRoutes = {
  repository: 'repository',
  editor: 'editor'
};

export default {
  computed: {
    ...mapState('repository', ['sseId']),
    trackingParams: vm => pickBy({
      sseId: vm.sseId,
      repositoryId: Number(vm.$route.params.repositoryId),
      activityId: Number(vm.$route.params.activityId),
      elementId: vm.$route.query.elementId
    })
  },
  methods: {
    ...mapActions('repository', { resetRepositoryStore: 'reset' }),
    ...mapActions('repository/userTracking', {
      reportActivityStart: 'start',
      reportActivityEnd: 'end'
    })
  },
  watch: {
    trackingParams: {
      deep: true,
      immediate: true,
      handler(val, prevVal = {}) {
        if (!val.sseId || isEqual(val, prevVal)) return;
        if (prevVal.sseId) this.reportActivityEnd(prevVal);
        this.reportActivityStart(val);
      }
    }
  },
  beforeRouteLeave(to, _from, next) {
    this.reportActivityEnd(this.trackingParams);
    if (!has(trackedRoutes, to.name)) this.resetRepositoryStore();
    next();
  }
};
