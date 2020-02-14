<template>
  <div class="outline-page">
    <v-progress-circular v-if="showLoader" color="primary" indeterminate />
    <div v-else :class="{ 'pt-11': isFlat }" class="outline">
      <div class="activity-container">
        <v-toolbar
          v-if="!isFlat"
          color="grey lighten-4"
          flat dense>
          <v-spacer />
          <v-btn
            @click="toggleActivities"
            color="grey darken-4"
            text>
            Toggle all
          </v-btn>
        </v-toolbar>
        <draggable
          @update="data => reorder(data, rootActivities)"
          :list="rootActivities"
          v-bind="{ handle: '.activity' }">
          <activity
            v-for="(activity, index) in rootActivities"
            :key="activity._cid"
            v-bind="activity"
            :index="index + 1"
            :level="1"
            :activities="outlineActivities" />
        </draggable>
        <outline-footer :root-activities="rootActivities" />
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
import Sidebar from '../common/Sidebar';

export default {
  mixins: [reorderMixin],
  props: {
    showLoader: { type: Boolean, default: false }
  },
  computed: {
    ...mapGetters('repository', ['structure', 'outlineActivities']),
    isFlat() {
      const types = map(filter(this.structure, { level: 2 }), 'type');
      if (!types.length) return false;
      return !find(this.outlineActivities, it => types.includes(it.type));
    },
    rootActivities() {
      const types = map(filter(this.structure, { level: 1 }), 'type');
      return filter(this.outlineActivities, it => types.includes(it.type))
        .sort((x, y) => x.position - y.position);
    }
  },
  methods: mapActions('repository', ['toggleActivities']),
  components: { Activity, Draggable, OutlineFooter, Sidebar }
};
</script>

<style lang="scss" scoped>
.outline-page {
  height: 100%;

  .v-progress-circular {
    margin-top: 7.5rem;
  }
}

.outline {
  position: relative;
  height: 100%;
  padding-right: 28.125rem;
}

.activity-container {
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

::v-deep .v-toolbar__content {
  padding: 0;
}
</style>
