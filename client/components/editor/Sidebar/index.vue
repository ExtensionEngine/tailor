<template>
  <v-navigation-drawer
    width="400"
    absolute permanent
    class="sidebar grey lighten-4 elevation-2">
    <div :class="{ 'toolbar-visible': selectedElement }">
      <activity-navigation
        v-if="selectedTab === 'browser'"
        :repository="repository"
        :activities="activities"
        :selected="selectedActivity" />
      <activity-discussion
        v-show="selectedTab === 'comments'"
        @change="comments => commentCount = comments.length"
        :activity="selectedActivity" />
      <element-sidebar
        v-if="selectedTab === 'element'"
        :key="getElementId(selectedElement)"
        :element="selectedElement"
        :metadata="metadata" />
    </div>
    <template v-slot:append>
      <v-tabs
        :value="selectedTabIndex"
        background-color="blue-grey darken-4"
        icons-and-text fixed-tabs dark>
        <v-tabs-slider />
        <v-tab
          v-for="tab in tabs"
          :key="tab.name"
          @click="selectedTab = tab.name"
          :disabled="!!tab.disabled">
          {{ tab.label }}
          <v-icon>mdi-{{ tab.icon }}</v-icon>
          <v-badge
            v-if="tab.badgeData"
            :content="tab.badgeData"
            color="secondary"
            offset-y="18"
            offset-x="-16" />
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
import { getElementId } from 'tce-core/utils';
import { getElementMetadata } from 'shared/activities';

export default {
  name: 'editor-sidebar',
  props: {
    repository: { type: Object, required: true },
    activities: { type: Array, required: true },
    selectedActivity: { type: Object, required: true },
    selectedElement: { type: Object, default: null }
  },
  data: () => ({ selectedTab: 'browser', commentCount: 0 }),
  computed: {
    selectedTabIndex: vm => vm.tabs.map(it => it.name).indexOf(vm.selectedTab),
    tabs: vm => ([{
      name: 'browser',
      label: 'Browse',
      icon: 'file-tree'
    }, {
      name: 'comments',
      label: 'Comments',
      icon: 'forum-outline',
      badgeData: vm.commentCount
    }, {
      name: 'element',
      label: 'Element',
      icon: 'toy-brick-outline',
      disabled: !vm.elementSidebarEnabled
    }]),
    elementSidebarEnabled: vm => vm.selectedElement && !vm.metadata.isEmpty,
    metadata() {
      const { repository, selectedElement } = this;
      return getElementMetadata(get(repository, 'schema'), selectedElement);
    }
  },
  methods: {
    getElementId
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
  margin-top: 4rem;
}
</style>
