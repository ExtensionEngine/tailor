<template>
  <v-card
    @click="$emit('click', task.id)"
    :elevation="isSelected ? 4 : 1"
    class="card d-flex flex-column align-start px-4 py-3 my-2 mx-3"
    :ripple="false">
    <chip :id="task.shortId" />
    <h4 class="text-left card-title">
      {{ task.name }}
    </h4>
    <div class="d-flex align-center mt-auto">
      <v-avatar :size="34" color="avatar grey lighten-3 d-flex white--text">
        <img v-if="task.assignee" :src="task.assignee.imgUrl">
        <v-icon v-else>mdi-account</v-icon>
      </v-avatar>
      <v-icon class="priority-icon mx-5">$vuetify.icons.{{ icon }}</v-icon>
      <span class="caption grey--text">{{ task.dueDate | formatDate('MM/DD/YY') }}</span>
    </div>
  </v-card>
</template>

<script>
import Chip from './Chip';
import { priorities } from 'shared/workflow';

export default {
  name: 'workflow-board-card',
  props: {
    task: { type: Object, default: () => ({}) },
    isSelected: { type: Boolean, default: false }
  },
  computed: {
    icon() {
      const { priority } = this.task;
      const { icon } = priorities.find(it => it.id === priority);
      return icon;
    }
  },
  components: { Chip }
};
</script>

<style lang="scss" scoped>
  .card.v-card {
    min-height: 10rem;
    flex: 0;
    align-self: stretch;

    .avatar.v-avatar {
      border-radius: 50%;
    }

    .priority-icon {
      width: 0.8rem;
    }

    &::before {
      opacity: 0;
    }
  }
</style>
