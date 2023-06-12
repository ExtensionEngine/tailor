<template>
  <v-select
    v-on="$listeners"
    v-bind="$attrs"
    :value="value"
    :items="priorities"
    label="Priority"
    item-text="label"
    item-value="id"
    outlined>
    <template #prepend-inner>
      <v-icon v-if="selected" class="icon mr-1">
        {{ `$vuetify.icons.${selected.icon}` }}
      </v-icon>
    </template>
    <template #item="{ item }">
      <v-icon v-if="item.icon" class="icon mr-3">
        {{ `$vuetify.icons.${item.icon}` }}
      </v-icon>
      <span>{{ item.label }}</span>
    </template>
  </v-select>
</template>

<script>
import { workflow } from 'tailor-config';

export default {
  name: 'select-priority',
  props: {
    value: { type: String, required: true }
  },
  data: () => ({ priorities: workflow.priorities }),
  computed: {
    selected: vm => vm.priorities.find(it => it.id === vm.value)
  }
};
</script>

<style lang="scss" scoped>
.icon {
  width: 1rem;
}
</style>
