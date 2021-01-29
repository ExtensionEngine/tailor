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
        class="mt-9 mb-12" />
    </template>
    <section v-else class="placeholder grey--text text--darken-3">
      <h4>Status Sidebar</h4>
      <v-icon>mdi-chevron-left</v-icon>
      <div class="info-content">{{ emptyMessage }}</div>
    </section>
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { isTrackedInWorkflow } from 'shared/activities';
import SidebarHeader from './Header';
import StatusFieldGroup from './FieldGroup';

export default {
  props: {
    emptyMessage: {
      type: String,
      default: 'Please select Activity on the left to view and edit its status here.'
    }
  },
  computed: {
    ...mapGetters('repository', ['selectedActivity']),
    isTrackedActivity() {
      console.log(this.selectedActivity);
      return this.selectedActivity && isTrackedInWorkflow(this.selectedActivity.type);
    }
  },
  methods: {
    ...mapActions('repository/activities', ['saveStatus']),
    updateStatus(key, value) {
      const status = {
        ...this.selectedActivity.status,
        [key]: value || null
      };
      this.saveStatus({ activity: this.selectedActivity, status })
        .then(() => { this.$snackbar.show('Status saved'); });
    }
  },
  components: { StatusFieldGroup, SidebarHeader }
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
