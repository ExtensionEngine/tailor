<template>
  <v-card
    @click="selectActivity(activity.id)"
    elevation="4"
    :color="activity.color"
    class="card d-flex flex-column px-4 py-3 my-2"
    :class="{ 'selected': isSelected }">
    <div class="caption text-left text-uppercase">
      {{ activity.label }}
      <span class="mx-2 px-2 py-1 grey lighten-2">{{ activity.shortId }}</span>
      <publishing-badge :activity="activity" top />
    </div>
    <h4 class="text-left card-title">
      {{ activity.name }}
    </h4>
    <div class="d-flex align-center mt-auto">
      <v-avatar :size="34" color="avatar d-flex mr-4 grey lighten2 white--text">
        <img :src="assignee.imgUrl">
      </v-avatar>
      <v-icon class="mr-4">$vuetify.icons.{{ icon }}</v-icon>
      <span class="caption grey--text lighten2">{{ activity.data.dueDate | formatDate('MM/DD/YY') }}</span>
    </div>
  </v-card>
</template>

<script>
import { priorities } from 'shared/workflow';
import PublishingBadge from '../common/Sidebar/Badge';
import selectActivity from '../common/selectActivity';

export default {
  name: 'workflow-board-card',
  mixins: [selectActivity],
  props: {
    activity: { type: Object, default: () => ({}) },
    assignee: { type: Object, default: () => ({}) }
  },
  computed: {
    isSelected() {
      return this.selectedActivity && this.selectedActivity._cid === this.activity._cid;
    },
    icon() {
      const { priorityId } = this.activity.data;
      const { icon } = priorities.find(it => it.id === priorityId);
      return icon;
    }
  },
  components: { PublishingBadge }
};
</script>

<style lang="scss" scoped>
  .card.v-card {
    width: calc(100% - 2 * 12px);
    min-height: 180px;
    background: #fafafa !important;
    border-left: 4px solid currentColor;
    transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);

    &.selected {
      border-left-width: 12px;
    }

    .avatar.v-avatar {
      border-radius: 50%;
    }
  }
</style>
