<template>
  <div :key="activity._cid" class="repository-sidebar elevation-1">
    <div v-if="activitySelected">
      <sidebar-header />
      <sidebar-body />
    </div>
    <div v-else class="placeholder grey--text text--darken-3">
      <h4>Outline Sidebar</h4>
      <v-icon>mdi-chevron-left</v-icon>
      <div class="helper">
        Please create your first Item on the left
        to view and edit its details here.
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SidebarBody from './Body';
import SidebarHeader from './Header';

export default {
  computed: {
    ...mapGetters('repository', ['activity']),
    activitySelected() {
      return !!this.activity._cid;
    }
  },
  components: {
    SidebarBody,
    SidebarHeader
  }
};
</script>

<style lang="scss" scoped>
.repository-sidebar {
  position: absolute;
  right: 0;
  width: 28.125rem;
  height: 100%;
  text-align: left;
  background-color: #fafafa;
  border-top: 1px solid #e8e8e8;
  overflow: auto;
}

.placeholder {
  margin-top: 4.375rem;
  padding: 0 1rem;
  color: #777;

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

  .helper {
    width: 20.625rem;
  }
}
</style>
