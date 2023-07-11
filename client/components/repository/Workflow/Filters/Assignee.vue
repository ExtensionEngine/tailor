<template>
  <div>
    <assignee-avatar
      v-for="{ id, isActive, ...assignee } in options"
      :key="`assignee-${id}`"
      @click="toggleAssignee(id)"
      v-bind="assignee"
      :class="{ active: isActive }"
      show-tooltip
      class="avatar" />
    <assignee-avatar
      v-if="showUnassigned"
      @click="toggleUnassigned"
      :class="{ active: unassigned }"
      show-tooltip
      class="avatar" />
  </div>
</template>

<script>
import AssigneeAvatar from '@/components/repository/common/AssigneeAvatar.vue';
import xor from 'lodash/xor';

export default {
  name: 'workflow-filters-assignee',
  props: {
    selected: { type: Array, default: () => [] },
    unassigned: { type: Boolean, default: false },
    options: { type: Object, default: () => ({}) },
    showUnassigned: { type: Boolean, default: false }
  },
  methods: {
    toggleAssignee(id) {
      this.$emit('change:assignee', xor(this.selected, [id]));
    },
    toggleUnassigned() {
      this.$emit('change:unassigned', !this.unassigned);
    }
  },
  components: { AssigneeAvatar }
};
</script>

<style lang="scss" scoped>
.avatar.v-avatar {
  border: 2px solid;

  &:not(:first-of-type) {
    margin-left: -0.5rem;
  }

  &.active {
    box-shadow: var(--v-secondary-base) 0 0 0 2px;
    border: 2px solid $bg-color-default !important;
  }

  &:hover {
    z-index: 1;
    transform: scale(1.1);
    cursor: pointer;
  }
}
</style>
