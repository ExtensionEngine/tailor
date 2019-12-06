<template>
  <div class="outline-page">
    <v-progress-circular v-if="showLoader" color="primary" indeterminate />
    <div v-else class="outline">
      <div :class="{ 'mt-12': isFlat }" class="activity-container">
        <v-toolbar
          v-if="!isFlat"
          color="grey lighten-3"
          flat
          dense>
          <v-spacer />
          <v-btn
            @click="toggleActivities"
            color="grey darken-3"
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
        <outline-footer />
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
import Sidebar from '../Sidebar';

export default {
  mixins: [reorderMixin],
  props: {
    showLoader: { type: Boolean, default: false }
  },
  computed: {
    ...mapGetters('course', ['structure', 'outlineActivities']),
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
  methods: mapActions('course', ['toggleActivities']),
  components: { Activity, Draggable, OutlineFooter, Sidebar }
};
</script>

<style lang="scss" scoped>
.outline-page {
  height: 100%;

  .v-progress-circular {
    margin-top: 120px;
  }
}

.outline {
  position: relative;
  height: 100%;
  padding-right: 450px;
}

.activity-container {
  width: 100%;
  height: 100%;
  float: left;
  padding: 50px 90px 0 60px;
  overflow-y: scroll;
  overflow-y: overlay;

  ::v-deep {
    > :last-child {
      margin-bottom: 120px;
    }
  }
}

::v-deep .v-toolbar__content {
  padding: 0;
}
</style>
