import { mapActions, mapState } from 'vuex';
import has from 'lodash/has';
import isEqual from 'lodash/isEqual';
import pickBy from 'lodash/pickBy';

const PING_INTERVAL = 30000; // 30s
const trackedRoutes = {
  repository: 'repository',
  editor: 'editor'
};

export default {
  data: () => ({ interval: null }),
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
        clearInterval(this.interval);
        this.reportActivityStart(val);
        this.interval = setInterval(() => this.reportActivityStart(val), PING_INTERVAL);
      }
    }
  },
  beforeRouteLeave(to, _from, next) {
    clearInterval(this.interval);
    this.reportActivityEnd(this.trackingParams);
    if (!has(trackedRoutes, to.name)) this.resetRepositoryStore();
    next();
  }
};
