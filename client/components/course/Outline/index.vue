<template>
  <div class="activities-container">
    <circular-progress v-if="showLoader"></circular-progress>
    <div v-else class="activities">
      <activity :level="0" :activities="activities" class="outline"></activity>
      <sidebar></sidebar>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex-module';
import Activity from './Activity';
import CircularProgress from 'components/common/CircularProgress';
import Sidebar from '../Sidebar';

export default {
  props: {
    showLoader: { type: Boolean, default: false }
  },
  computed: mapGetters(['activities'], 'course'),
  components: {
    Activity,
    CircularProgress,
    Sidebar
  }
};
</script>

<style lang="scss" scoped>
.activities-container {
  height: 100%;

  .circular-progress {
    margin-top: 115px;
  }
}

.activities {
  position: relative;
  height: 100%;
  padding-right: 420px;
}

.outline {
  width: 100%;
  height: 100%;
  float: left;
  padding: 80px 60px 0;
  overflow-y: scroll;
  overflow-y: overlay;
}

.outline /deep/ > :last-child {
  margin-bottom: 120px;
}
</style>
