import { mapActions } from 'vuex';

export default {
  methods: {
    ...mapActions('activities', { updatePosition: 'reorder' }),
    reorder({ newIndex: newPosition }, items) {
      const activity = items[newPosition];
      const isFirstChild = newPosition === 0;
      const context = { items, newPosition, isFirstChild };
      this.updatePosition({ activity, context });
    }
  }
};
