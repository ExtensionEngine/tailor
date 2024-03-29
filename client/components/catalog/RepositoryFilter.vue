<template>
  <v-menu
    ref="filter"
    @update:return-value="search = ''"
    :close-on-content-click="false"
    offset-y>
    <template #activator="{ on: menu, value }">
      <v-tooltip
        :disabled="value"
        open-delay="800"
        top>
        <template #activator="{ on: tooltip }">
          <v-btn v-on="{ ...menu, ...tooltip }" color="primary lighten-2" icon>
            <v-icon>{{ icon }}</v-icon>
          </v-btn>
        </template>
        <span class="text-capitalize">{{ label }}</span>
      </v-tooltip>
    </template>
    <v-sheet
      tile
      class="pa-3 primary darken-4">
      <v-text-field
        v-model="search"
        :label="`Filter ${label}...`"
        flat hide-details solo clearable />
    </v-sheet>
    <v-list v-if="filteredOptions.length" :key="isVisible">
      <v-list-item
        v-for="option in filteredOptions"
        :key="option.id"
        @click="$emit('update', option)">
        <v-list-item-action class="mr-2">
          <v-checkbox :input-value="option.isSelected" />
        </v-list-item-action>
        <v-list-item-content class="text-left">
          <v-list-item-title>{{ option.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <div v-else class="white py-3">
      No {{ label }} found
    </div>
  </v-menu>
</template>

<script>
import filter from 'lodash/filter';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';

export default {
  name: 'repository-filter',
  props: {
    values: { type: Array, required: true },
    label: { type: String, required: true },
    icon: { type: String, required: true }
  },
  data: () => ({ search: '' }),
  computed: {
    isVisible: vm => get(vm.$refs.filter, 'isActive', false),
    options: ({ values }) => {
      return orderBy(values, [option => option.name.toLowerCase()], ['asc']);
    },
    filteredOptions: ({ options, search }) => {
      if (!search) return options;
      const reqex = new RegExp(search.trim(), 'i');
      return filter(options, ({ name }) => reqex.test(name));
    }
  }
};
</script>

<style lang="scss" scoped>
.v-list {
  border-radius: 0;
  max-height: 18.75rem;
  overflow-y: auto;
}
</style>
