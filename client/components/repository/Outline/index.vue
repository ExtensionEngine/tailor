<template>
  <div class="structure-page">
    <v-progress-circular v-if="showLoader" color="primary" indeterminate />
    <div v-else class="structure-container">
      <div ref="structure" class="structure">
        <structure-toolbar
          v-if="hasActivities"
          @search="search = $event"
          :search="search"
          :is-flat="isFlat"
          class="ml-1" />
        <tree-view v-if="isGraphView" class="tree-view" />
        <template v-else-if="!search">
          <draggable
            @update="data => reorder(data, rootActivities)"
            :list="rootActivities"
            v-bind="{ handle: '.activity' }"
            class="mt-5">
            <activity
              v-for="(activity, index) in rootActivities"
              :key="activity.uid"
              v-bind="activity"
              :index="index + 1"
              :level="1"
              :activities="outlineActivities" />
          </draggable>
          <outline-footer :root-activities="rootActivities" />
        </template>
        <template v-else>
          <search-result
            v-for="activity in filteredActivities"
            :key="activity.uid"
            @select="selectActivity(activity.id)"
            @show="goTo(activity)"
            :activity="activity"
            :is-selected="selectedActivity.id === activity.id" />
          <v-alert
            :value="!filteredActivities.length"
            color="blue-grey darken-2"
            icon="mdi-magnify"
            prominent text
            class="mt-5">
            No matches found
          </v-alert>
        </template>
      </div>
      <sidebar />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Activity from './Activity';
import Draggable from 'vuedraggable';
import filter from 'lodash/filter';
import find from 'lodash/find';
import map from 'lodash/map';
import OutlineFooter from './OutlineFooter';
import reorderMixin from './reorderMixin';
import SearchResult from './SearchResult';
import selectActivity from '@/components/repository/common/selectActivity';
import Sidebar from '../common/Sidebar';
import StructureToolbar from './Toolbar';
import TreeView from './TreeView';

export default {
  mixins: [reorderMixin, selectActivity],
  props: {
    showLoader: { type: Boolean, default: false }
  },
  data: () => ({ search: '' }),
  computed: {
    ...mapGetters('repository', ['structure', 'outlineActivities']),
    hasActivities: vm => !!vm.rootActivities.length,
    isGraphView: vm => vm.$route.query.graph,
    isFlat() {
      const types = map(filter(this.structure, it => !it.rootLevel), 'type');
      if (!types.length) return false;
      return !find(this.outlineActivities, it => types.includes(it.type));
    },
    rootActivities() {
      const types = map(this.structure.filter(it => it.rootLevel), 'type');
      return filter(this.outlineActivities, it => types.includes(it.type) && !it.parentId)
        .sort((x, y) => x.position - y.position);
    },
    filteredActivities() {
      const { outlineActivities: activities, search } = this;
      if (!search) return activities;
      const regex = new RegExp(search.trim(), 'i');
      return filter(activities, ({ shortId, data: { name } }) => {
        return regex.test(shortId) || regex.test(name);
      });
    }
  },
  methods: {
    ...mapActions('repository', ['expandParents']),
    goTo(activity) {
      this.search = '';
      this.selectActivity(activity.id);
      this.expandParents(activity);
      this.scrollToActivity(activity);
    },
    scrollToActivity(activity, timeout = 500) {
      setTimeout(() => {
        const elementId = `#activity_${activity.uid}`;
        const element = this.$refs.structure.querySelector(elementId);
        element.scrollIntoView();
      }, timeout);
    }
  },
  watch: {
    showLoader(val) {
      const { selectedActivity: activity, rootActivities } = this;
      if (!val && activity && (rootActivities[0].id !== activity.id)) {
        this.scrollToActivity(this.selectedActivity, 200);
      }
    }
  },
  components: {
    Activity,
    Draggable,
    OutlineFooter,
    SearchResult,
    Sidebar,
    StructureToolbar,
    TreeView
  }
};
</script>

<style lang="scss" scoped>
.structure-page {
  height: 100%;

  .v-progress-circular {
    margin-top: 7.5rem;
  }
}

.tree-view {
  width: 100%;
  height: 100%;
}

.structure-container {
  position: relative;
  height: 100%;
  padding-right: 28.125rem;
}

.structure {
  width: 100%;
  height: 100%;
  float: left;
  padding: 3.125rem 5.625rem 0 3.75rem;
  overflow-y: scroll;
  overflow-y: overlay;

  ::v-deep {
    > :last-child {
      margin-bottom: 7.5rem;
    }
  }
}

.structure ::v-deep .v-toolbar__content {
  padding: 0;
}
</style>
