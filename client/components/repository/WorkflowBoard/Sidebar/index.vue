<template>
  <v-navigation-drawer
    width="450"
    color="grey lighten-5"
    absolute right permanent>
    <article
      v-if="selectedTask"
      :key="selectedTask._cid"
      class="px-4 pt-4 pb-10">
      <sidebar-header :task="selectedTask" />
      <task-form :task="selectedTask" />
      <section>
        <h5>Related content</h5>
        <activity-card :activity="activity" />
      </section>
      <section class="my-10">
        <div class="caption my-1 px-3 grey--text text--darken-1">Created at {{ selectedTask.createdAt | formatDate }}</div>
        <div class="caption my-1 px-3 grey--text text--darken-1">Updated at {{ selectedTask.updatedAt | formatDate }}</div>
        <v-btn @click="requestArchiveConfirmation" class="my-3" text small>
          <v-icon class="pr-2">mdi-package-down</v-icon> Archive
        </v-btn>
      </section>
    </article>
    <article v-else class="placeholder grey--text text--darken-3">
      <h4>Task Sidebar</h4>
      <v-icon>mdi-chevron-left</v-icon>
      <div class="info-content">
        {{ emptyMessage }}
      </div>
    </article>
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ActivityCard from './ActivityCard';
import EventBus from 'EventBus';
import SidebarHeader from './Header';
import TaskForm from './Form';

const appChannel = EventBus.channel('app');

export default {
  props: {
    emptyMessage: {
      type: String,
      default: 'Please select Task on the left to view and edit its details here.'
    }
  },
  computed: {
    ...mapGetters('repository', ['selectedTask', 'activities']),
    activity() {
      return this.activities.find(it => it.id === this.selectedTask.activityId);
    }
  },
  methods: {
    ...mapActions('repository/tasks', ['archive']),
    requestArchiveConfirmation() {
      appChannel.emit('showConfirmationModal', {
        title: 'Archive task?',
        message: 'Are you sure you want to archive task?',
        action: () => this.archive(this.selectedTask)
      });
    }
  },
  components: {
    ActivityCard,
    TaskForm,
    SidebarHeader
  }
};
</script>

<style lang="scss" scoped>
.v-navigation-drawer {
  text-align: left;
}

.placeholder {
  margin-top: 4.375rem;
  padding: 0 1rem;

  h4 {
    padding: 0.5rem 0 1.125rem;
    text-align: center;
    font-size: 1.25rem;
  }

  .v-icon {
    float: left;
    padding: 0.375rem 1.25rem 0 0.75rem;
    color: inherit;
    font-size: 2rem;
  }

  .info-content {
    width: 22rem;
  }
}
</style>
