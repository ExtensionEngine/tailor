import get from 'lodash/get';
import { mapGetters } from 'vuex';

export default {
  computed: mapGetters('repository', ['selectedActivity']),
  methods: {
    selectActivity(activityId) {
      if (get(this.selectedActivity, 'id') === activityId) return;
      this.$router.push({ query: { activityId } });
    }
  }
};
