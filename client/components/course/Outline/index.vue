<template>
  <div class="outline-page">
    <circular-progress v-if="showLoader"/>
    <div v-else class="outline">
      <div class="activity-container">
        <draggable
          :list="topLevelActivities"
          :options="{ handle: '.activity' }"
          @update="data => reorder(data, topLevelActivities)">
          <activity
            v-for="(activity, index) in topLevelActivities"
            v-bind="activity"
            :key="activity._cid"
            :index="index + 1"
            :level="1"
            :activities="activities"/>
        </draggable>
        <no-activities v-if="!topLevelActivities.length"/>
      </div>
      <sidebar/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex-module';
import Activity from './Activity';
import CircularProgress from 'components/common/CircularProgress';
import Draggable from 'vuedraggable';
import filter from 'lodash/filter';
import map from 'lodash/map';
import NoActivities from './NoActivities';
import reorderMixin from './reorderMixin';
import Sidebar from '../Sidebar';

export default {
  mixins: [reorderMixin],
  props: {
    showLoader: { type: Boolean, default: false }
  },
  computed: {
    ...mapGetters(['activities', 'structure'], 'course'),
    topLevelActivities() {
      const types = map(filter(this.structure, { level: 1 }), 'type');
      return filter(this.activities, it => types.includes(it.type))
        .sort((x, y) => x.position - y.position);
    }
  },
  components: { Activity, CircularProgress, Draggable, NoActivities, Sidebar }
};
</script>

<style lang="scss" scoped>
.outline-page {
  height: 100%;

  .circular-progress {
    margin-top: 115px;
  }
}

.outline {
  position: relative;
  height: 100%;
  padding-right: 420px;
}

.activity-container {
  width: 100%;
  height: 100%;
  float: left;
  padding: 80px 90px 0 60px;
  overflow-y: scroll;
  overflow-y: overlay;
  scrollbar-width: none;

  /deep/ {
    > :last-child {
      margin-bottom: 120px;
    }
  }
}

.activity-container::-webkit-scrollbar {
  width: 0 !important;
}
</style>
