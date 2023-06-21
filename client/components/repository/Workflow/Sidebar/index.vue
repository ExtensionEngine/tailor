<template>
  <v-navigation-drawer
    width="450"
    color="grey lighten-5"
    absolute right permanent
    class="px-4">
    <template v-if="isTrackedActivity">
      <sidebar-header
        v-bind="selectedActivity"
        :name="selectedActivity.data.name"
        :updated-at="selectedActivity.status.updatedAt"
        class="pt-4" />
      <status-field-group
        @update="updateStatus"
        v-bind="selectedActivity.status"
        class="mt-9 mb-2" />
    </template>
    <section v-else class="placeholder grey--text text--darken-3">
      <h4>Status Sidebar</h4>
      <v-icon>mdi-chevron-left</v-icon>
      <div class="info-content">{{ emptyMessage }}</div>
    </section>
    <activity-discussion
      v-if="selectedActivity"
      :activity="selectedActivity"
      panel
      class="mt-2 mb-5 mx-1" />
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ActivityDiscussion from '@/components/repository/common/ActivityDiscussion.vue';
import SidebarHeader from './Header.vue';
import StatusFieldGroup from './FieldGroup.vue';

export default {
  name: 'workflow-sidebar',
  props: {
    emptyMessage: {
      type: String,
      default: 'Please select item on the left to view and edit its status here.'
    }
  },
  computed: {
    ...mapGetters('repository', ['selectedActivity']),
    isTrackedActivity: vm => vm.selectedActivity?.isTrackedInWorkflow
  },
  methods: {
    ...mapActions('repository/activities', ['saveStatus']),
    async updateStatus(key, value) {
      const status = {
        ...this.selectedActivity.status,
        [key]: value || null
      };
      await this.saveStatus({ activity: this.selectedActivity, status });
      this.$snackbar.show('Status saved');
    }
  },
  components: {
    ActivityDiscussion,
    StatusFieldGroup,
    SidebarHeader
  }
};
</script>

<style lang="scss" scoped>
.v-navigation-drawer {
  padding-bottom: 0.375rem;
  text-align: left;
}

.placeholder {
  margin: 4.375rem 0 2.5rem 0;
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
