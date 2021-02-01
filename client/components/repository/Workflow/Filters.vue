<template>
  <div class="d-flex align-center">
    <v-text-field
      @input="updateFilter('searchText', $event)"
      :value="searchText"
      prepend-inner-icon="mdi-magnify"
      placeholder="Search by ID or name"
      clearable
      class="search-field" />
    <div v-if="assigneeOptions" class="ml-7 mr-3">
      <assignee-avatar
        v-for="{ id, isActive, ...assignee } in assigneeOptions"
        :key="`assignee-${id}`"
        @click="toggleAssignee(id)"
        v-bind="assignee"
        :class="{ active: isActive }"
        class="avatar" />
      <assignee-avatar
        v-if="showUnassigned"
        @click="updateFilter('unassigned', !unassigned)"
        :class="{ active: unassigned }"
        class="avatar" />
    </div>
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
import AssigneeAvatar from '@/components/repository/common/AssigneeAvatar';
import xor from 'lodash/xor';

export default {
  name: 'workflow-filters',
  props: {
    searchText: { type: String, default: null },
    recentOnly: { type: Boolean, default: false },
    selectedAssigneeIds: { type: Array, default: () => ([]) },
    unassigned: { type: Boolean, default: false },
    assigneeOptions: { type: Object, default: () => ({}) },
    showUnassigned: { type: Boolean, default: false }
  },
  methods: {
    updateFilter(filter, value) {
      this.$emit(`update:${filter}`, value);
    },
    toggleAssignee(id) {
      this.updateFilter('selectedAssigneeIds', xor(this.selectedAssigneeIds, [id]));
    }
  },
  components: { AssigneeAvatar }
};
</script>

<style lang="scss" scoped>
.search-field {
  min-width: 14.5rem;
  max-width: 17.5rem;
}

.avatar.v-avatar {
  border: 2px solid;
  border-color: #fff !important;

  &:not(:first-of-type) {
    margin-left: -0.5rem;
  }

  &.active {
    box-shadow: var(--v-secondary-base) 0 0 0 2px;
  }

  &:hover {
    transform: scale(1.1);
    z-index: 1;
    cursor: pointer;
  }
}

.btn-filters {
  letter-spacing: inherit;

  &.active {
    color: var(--v-secondary-darken1);
    background-color: var(--v-secondary-lighten5);
  }
}
</style>
