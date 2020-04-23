<template>
  <v-navigation-drawer
    width="400"
    absolute permanent
    class="sidebar grey lighten-4 elevation-2">
    <div
      :class="{
        'toolbar-visible': selectedElement,
        'toolbar-composite': selectedElement && selectedElement.parent
      }">
      <activity-navigation
        v-if="selectedTab === 'browser'"
        :repository="repository"
        :activities="activities"
        :selected="selectedActivity" />
      <activity-discussion
        v-show="discussionTabVisible"
        @change="comments => commentCount = comments.length"
        :activity="selectedActivity"
        :is-visible="discussionTabVisible" />
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
import { mapGetters, mapState } from 'vuex';
import ActivityDiscussion from './Discussion';
import ActivityNavigation from './Navigation';
import debounce from 'lodash/debounce';
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
  data: () => ({ selectedTab: 'browser', commentCount: 0, unseenCount: 0 }),
  computed: {
    selectedTabIndex: vm => vm.tabs.map(it => it.name).indexOf(vm.selectedTab),
    ...mapState({ seenByActivity: state => state.seenByActivity }),
    ...mapGetters('repository/comments', ['getActivityComments', 'getUnseenComments']),
    activityComments: vm => vm.getActivityComments(vm.selectedActivity.id),
    unseenComments: vm => vm.getUnseenComments(vm.activityComments, vm.selectedActivity.uid),
    discussionTabVisible: vm => vm.selectedTab === 'comments',
    tabs: vm => ([{
      name: 'browser',
      label: 'Browse',
      icon: 'file-tree'
    }, {
      name: 'comments',
      label: 'Comments',
      icon: 'forum-outline',
      badgeData: vm.unseenCount
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
    unseenComments: debounce(function (val, oldVal) {
      if (val.length !== oldVal.length) this.unseenCount = val.length;
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

.toolbar-visible {
  margin-top: 4.5rem;

  &.toolbar-composite {
    margin-top: 7.5rem;
  }
}
</style>
