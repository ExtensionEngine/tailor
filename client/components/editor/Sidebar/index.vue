<template>
  <v-navigation-drawer
    width="400"
    absolute permanent
    class="sidebar grey lighten-5 elevation-3">
    <div
      :class="{
        'toolbar-visible': selectedElement,
        'toolbar-composite': selectedElement && selectedElement.parent
      }"
      class="sidebar-container">
      <activity-navigation
        v-if="selectedTab === 'browser'"
        :repository="repository"
        :activities="activities"
        :selected="selectedActivity" />
      <activity-discussion
        v-show="discussionTabVisible"
        :activity="selectedActivity"
        :is-visible="discussionTabVisible"
        class="my-8 mx-4" />
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
import ActivityDiscussion from '@/components/repository/common/Discussion';
import ActivityNavigation from './Navigation';
import debounce from 'lodash/debounce';
import ElementSidebar from './ElementSidebar';
import get from 'lodash/get';
import { getElementId } from 'tce-core/utils';
import { getElementMetadata } from 'shared/activities';
import { mapGetters } from 'vuex';

export default {
  name: 'editor-sidebar',
  props: {
    repository: { type: Object, required: true },
    activities: { type: Array, required: true },
    selectedActivity: { type: Object, required: true },
    selectedElement: { type: Object, default: null }
  },
  data: () => ({ selectedTab: 'browser', unseenCommentCount: 0 }),
  computed: {
    selectedTabIndex: vm => vm.tabs.map(it => it.name).indexOf(vm.selectedTab),
    ...mapGetters('repository/comments', ['getUnseenComments']),
    unseenComments: vm => vm.getUnseenComments({ activity: vm.selectedActivity }),
    discussionTabVisible: vm => vm.selectedTab === 'comments',
    tabs: vm => ([{
      name: 'browser',
      label: 'Browse',
      icon: 'file-tree'
    }, {
      name: 'comments',
      label: 'Comments',
      icon: 'forum-outline',
      badgeData: vm.unseenCommentCount
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
    },
    unseenComments: debounce(function (val) {
      this.unseenCommentCount = val.length;
    }, 200)
  },
  components: { ActivityDiscussion, ActivityNavigation, ElementSidebar }
};
</script>

<style lang="scss" scoped>
.sidebar {
  padding: 3.125rem 0 0;
  text-align: left;
}

.sidebar-container {
  height: 100%;

  &.toolbar-visible {
    padding-top: 4.75rem;

    &.toolbar-composite {
      padding-top: 8.75rem;
    }
  }
}
</style>
