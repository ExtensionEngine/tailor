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
        Please create your first Item on the left
        to view and edit its details here.
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex';
import SidebarBody from './Body';
import SidebarHeader from './Header';

export default {
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
