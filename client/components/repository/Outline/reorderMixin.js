import { mapActions } from 'vuex';

export default {
  methods: {
    ...mapActions('repository/activities', { updatePosition: 'reorder' }),
    reorder({ newIndex: newPosition }, items) {
      const activity = items[newPosition];
      const context = { items, newPosition };
      this.updatePosition({ activity, context });
    }
  }
};
