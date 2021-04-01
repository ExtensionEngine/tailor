<template>
  <div class="d-flex align-center">
    <v-text-field
      @input="updateFilter('searchText', $event)"
      :value="searchText"
      prepend-inner-icon="mdi-magnify"
      name="Search"
      placeholder="Search by ID or name"
      clearable
      class="search-field" />
    <status-filter
      @change="updateFilter('status', $event)"
      :items="statusOptions"
      :value="status"
      placeholder="Filter by status"
      clearable
      class="status-field ml-7 mr-3" />
    <assignee-filter
      v-if="assigneeOptions"
      @change:assignee="updateFilter('selectedAssigneeIds', $event)"
      @change:unassigned="updateFilter('unassigned', $event)"
      :selected="selectedAssigneeIds"
      :unassigned="unassigned"
      :options="assigneeOptions"
      :show-unassigned="showUnassigned"
      class="ml-7 mr-3" />
    <v-btn
      @click="updateFilter('recentOnly', !recentOnly)"
      :class="{ active: recentOnly }"
      text
      class="btn-filters mx-1 text-capitalize">
      Recently updated
    </v-btn>
  </div>
</template>

<script>
import AssigneeFilter from './Assignee';
import StatusFilter from '../SelectStatus';

export default {
  name: 'workflow-filters',
  props: {
    searchText: { type: String, default: null },
    recentOnly: { type: Boolean, default: false },
    status: { type: String, default: null },
    selectedAssigneeIds: { type: Array, default: () => [] },
    unassigned: { type: Boolean, default: false },
    assigneeOptions: { type: Object, default: () => ({}) },
    statusOptions: { type: Array, default: () => [] },
    showUnassigned: { type: Boolean, default: false }
  },
  methods: {
    updateFilter(filter, value) {
      this.$emit(`update:${filter}`, value);
    }
  },
  components: { AssigneeFilter, StatusFilter }
};
</script>

<style lang="scss" scoped>
.search-field {
  min-width: 14.5rem;
  max-width: 17.5rem;
}

.status-field {
  max-width: 14.5rem;
}

.btn-filters {
  letter-spacing: inherit;

  &.active {
    color: var(--v-secondary-darken1);
    background-color: var(--v-secondary-lighten5);
  }
}
</style>
