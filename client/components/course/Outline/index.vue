<template>
  <div class="outline">
    <circular-progress v-if="showLoader"/>
    <div v-else class="activities-container">
      <div class="activity-list">
        <activity
          v-for="(activity, index) in topLevelActivities"
          v-bind="activity"
          :key="activity._cid"
          :index="index + 1"
          :level="1"
          :activities="activities"/>
      </div>
      <no-activities v-if="!topLevelActivities.length"/>
      <sidebar/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex-module';
import Activity from './Activity';
import CircularProgress from 'components/common/CircularProgress';
import filter from 'lodash/filter';
import map from 'lodash/map';
import NoActivities from './NoActivities';
import Sidebar from '../Sidebar';

export default {
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
  components: { Activity, CircularProgress, NoActivities, Sidebar }
};
</script>

<style lang="scss" scoped>
.outline {
  height: 100%;

  .circular-progress {
    margin-top: 115px;
  }
}

.activities-container {
  position: relative;
  height: 100%;
  padding-right: 420px;
}

.activity-list {
  width: 100%;
  height: 100%;
  float: left;
  padding: 80px 60px 0;
  overflow-y: scroll;
  overflow-y: overlay;

  /deep/ {
    > :last-child {
      margin-bottom: 120px;
    }
  }
}
</style>
