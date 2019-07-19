<template>
  <div class="select-action pa-3">
    <v-btn
      v-for="({ label, icon, action }) in actions"
      :key="label"
      @click="action"
      color="primary"
      flat>
      <v-icon class="pr-2">mdi-{{ icon }}</v-icon>{{ label }}
    </v-btn>
  </div>
</template>

<script>
export default {
  computed: {
    actions() {
      const select = action => () => this.$emit('selected', action);
      const actions = [
        { label: 'Create', icon: 'plus', action: select('create') },
        { label: 'Copy', icon: 'content-copy', action: select('copy') },
        { label: 'Cancel', icon: 'close', action: () => this.$emit('close') }
      ];

      if (!process.env.ENABLE_ACTIVITY_LINKING) return actions;
      actions.splice(
        2, 0, { label: 'Use existing', icon: 'link', action: select('link') },
      );
      return actions;
    }
  }
};
</script>
