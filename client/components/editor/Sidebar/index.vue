<template>
  <v-navigation-drawer width="400" permanent absolute>
    <v-row no-gutters class="fill-height">
      <div class="sidebar-container grow">
        <element-sidebar
          v-if="selectedElement && !metadata.isEmpty"
          :key="selectedElement._cid"
          :element="selectedElement"
          :metadata="metadata" />
        <activity-navigation
          v-else
          :repository="repository"
          :activities="outlineActivities"
          :selected="activity"
          :class="{ 'toolbar-visible': selectedElement && metadata.isEmpty }" />
      </div>
    </v-row>
  </v-navigation-drawer>
</template>

<script>
import ActivityNavigation from './Navigation';
import ElementSidebar from '../ElementSidebar';
import get from 'lodash/get';
import { getElementMetadata } from 'shared/activities';
import { mapGetters } from 'vuex';

export default {
  name: 'editor-sidebar',
  props: {
    activity: { type: Object, required: true },
    selectedElement: { type: Object, default: null }
  },
  computed: {
    ...mapGetters('repository', ['repository', 'outlineActivities']),
    metadata() {
      const { repository, selectedElement } = this;
      return getElementMetadata(get(repository, 'schema'), selectedElement);
    }
  },
  components: { ActivityNavigation, ElementSidebar }
};
</script>

<style lang="scss" scoped>
.sidebar-container {
  padding: 3.75rem 0 0;
  text-align: left;
}

.toolbar-visible {
  margin-top: 3.5rem;
}
</style>
