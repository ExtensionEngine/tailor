<template>
  <v-navigation-drawer
    width="450"
    color="grey lighten-5"
    absolute right permanent>
    <div v-if="selectedActivity" :key="selectedActivity.uid">
      <sidebar-header :activity="selectedActivity" />
      <sidebar-body :activity="selectedActivity" />
    </div>
    <div v-else class="placeholder grey--text text--darken-3">
      <h4>Outline Sidebar</h4>
      <v-icon>mdi-chevron-left</v-icon>
      <div class="info-content">
        {{ emptyMessage }}
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex';
import SidebarBody from './Body.vue';
import SidebarHeader from './Header.vue';

export default {
  name: 'repository-sidebar',
  props: {
    emptyMessage: {
      type: String,
      default: 'Please create your first Item on the left to view and edit its details here.'
    }
  },
  computed: mapGetters('repository', ['selectedActivity']),
  components: {
    SidebarBody,
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
    font-size: 1.25rem;
    text-align: center;
  }

  .v-icon {
    float: left;
    padding: 0.375rem 1.25rem 0 0.75rem;
    font-size: 2rem;
    color: inherit;
  }

  .info-content {
    width: 22rem;
  }
}
</style>
