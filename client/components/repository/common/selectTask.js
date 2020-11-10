import get from 'lodash/get';
import { mapGetters } from 'vuex';

export default {
  computed: mapGetters('repository', ['selectedTask']),
  methods: {
    selectTask(taskId) {
      if (get(this.selectedTask, 'id') === taskId) return;
      this.$router.push({ query: { ...this.$route.query, taskId } });
    }
  }
};
