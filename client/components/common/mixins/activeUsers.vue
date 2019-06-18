<script>
import { mapActions } from 'vuex-module';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import { pingInterval } from 'shared/active-users';

export default {
  data() {
    return {
      timer: null
    };
  },
  computed: {
    context() {
      return { ...pick(this, ['courseId', 'activityId']), created: new Date() };
    }
  },
  methods: {
    ...mapActions({
      addActiveUser: 'add',
      removeActiveUser: 'remove',
      subscribeActiveUsers: 'subscribe',
      fetchActiveUsers: 'fetch'
    }, 'activeUsers')
  },
  async mounted() {
    this.subscribeActiveUsers(this.courseId);
    await this.fetchActiveUsers(this.courseId);
    await this.addActiveUser(this.context);
    this.timer = setInterval(() => this.addActiveUser(this.context), pingInterval);
  },
  beforeRouteLeave(to, from, next) {
    this.removeActiveUser(omit(this.context, 'created'));
    clearInterval(this.timer);
    next();
  }
};
</script>
