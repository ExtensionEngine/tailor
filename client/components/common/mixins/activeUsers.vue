<script>
import { mapActions, mapState } from 'vuex';
import omit from 'lodash/omit';
import pick from 'lodash/pick';

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
      removeActiveUser: 'remove',
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
    this.removeActiveUser(omit(this.context, 'created'));
    next();
  }
};
</script>
