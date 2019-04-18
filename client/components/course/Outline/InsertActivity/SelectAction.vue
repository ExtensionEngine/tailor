<template>
  <v-item-group class="select-action">
    <v-btn
      v-for="action in actions"
      :key="action.name"
      @click="$emit('selected', action.name)">
      <v-icon class="action-icon">{{ action.icon }}</v-icon>
      <span>{{ action.label }}</span>
    </v-btn>
    <v-btn @click="$emit('close')">
      <v-icon class="action-icon">mdi-close</v-icon>
      <span>Cancel</span>
    </v-btn>
  </v-item-group>
</template>

<script>
const ACTIONS = [
  { name: 'create', label: 'Create', icon: 'mdi-plus' },
  { name: 'clone', label: 'Copy', icon: 'mdi-content-copy' }
];

export default {
  computed: {
    actions() {
      return ACTIONS;
    }
  }
};
</script>

<style lang="scss" scoped>
.select-action {
  margin: 16px 0;
}

.action-icon {
  padding-right: 4px;
}
</style>
