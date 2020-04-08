<template>
  <v-navigation-drawer
    width="400"
    absolute permanent
    class="sidebar">
    <div :class="{ 'toolbar-visible': selectedElement }">
      <activity-navigation
        v-if="selectedTab === 'browser'"
        :repository="repository"
        :activities="activities"
        :selected="selectedActivity" />
      <activity-discussion
        v-else-if="selectedTab === 'comments'"
        :activity="selectedActivity" />
      <element-sidebar
        v-else-if="selectedTab === 'element'"
        :key="selectedElement._cid"
        :element="selectedElement"
        :metadata="metadata" />
    </div>
    <template v-slot:append>
      <v-tabs
        :value="selectedTabIndex"
        background-color="grey darken-4"
        icons-and-text fixed-tabs dark>
        <v-tabs-slider />
        <v-tab
          v-for="tab in tabs"
          :key="tab.name"
          @click="selectedTab = tab.name"
          :disabled="!!tab.disabled">
          {{ tab.label }}
          <v-icon>mdi-{{ tab.icon }}</v-icon>
        </v-tab>
      </v-tabs>
    </template>
  </v-navigation-drawer>
</template>

<script>
import ActivityDiscussion from './Discussion';
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
  data: () => ({ selectedTab: 'comments' }),
  computed: {
    selectedTabIndex: vm => vm.tabs.map(it => it.name).indexOf(vm.selectedTab),
    tabs: vm => ([
      { name: 'browser', label: 'Browse', icon: 'file-tree' },
      { name: 'comments', label: 'Comments', icon: 'forum-outline' },
      {
        name: 'element',
        label: 'Element',
        icon: 'toy-brick-outline',
        disabled: !vm.elementSidebarEnabled
      }
    ]),
    elementSidebarEnabled: vm => vm.selectedElement && !vm.metadata.isEmpty,
    metadata() {
      const { repository, selectedElement } = this;
      return getElementMetadata(get(repository, 'schema'), selectedElement);
    }
  },
  watch: {
    selectedElement() {
      if (this.elementSidebarEnabled) {
        this.selectedTab = 'element';
        return;
      }
      if (this.selectedTab !== 'element') return;
      this.selectedTab = 'browser';
    }
  },
  components: { ActivityDiscussion, ActivityNavigation, ElementSidebar }
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
