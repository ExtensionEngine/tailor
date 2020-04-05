<template>
  <v-navigation-drawer
    width="400"
    absolute permanent
    class="sidebar">
    <activity-navigation
      v-if="isNavigationVisible"
      :repository="repository"
      :activities="activities"
      :selected="selectedActivity"
      :class="{ 'toolbar-visible': selectedElement }" />
    <element-sidebar
      v-else
      :key="selectedElement._cid"
      :element="selectedElement"
      :metadata="metadata" />
  </v-navigation-drawer>
</template>

<script>
import ActivityNavigation from './Navigation';
import ElementSidebar from './ElementSidebar';
import get from 'lodash/get';
import { getElementMetadata } from 'shared/activities';

export default {
  name: 'editor-sidebar',
  props: {
    repository: { type: Object, required: true },
    activities: { type: Array, required: true },
    selectedActivity: { type: Object, required: true },
    selectedElement: { type: Object, default: null }
  },
  computed: {
    isNavigationVisible: vm => !vm.selectedElement || vm.metadata.isEmpty,
    metadata() {
      const { repository, selectedElement } = this;
      return getElementMetadata(get(repository, 'schema'), selectedElement);
    }
  },
  components: { ActivityNavigation, ElementSidebar }
};
</script>

<style lang="scss" scoped>
.sidebar {
  padding: 3.125rem 0 0;
  text-align: left;
  background: #fafafa;
}

.toolbar-visible {
  margin-top: 3.125rem;
}
</style>
