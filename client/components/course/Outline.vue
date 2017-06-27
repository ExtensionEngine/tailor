<template>
  <div class="activities-container">
    <loader v-if="showLoader"></loader>
    <div v-else class="activities">
      <activity :level="0" :activities="activities" class="outline"></activity>
      <sidebar></sidebar>
    </div>
  </div>
</template>

<script>
import Activity from './Activity';
import Loader from '../common/Loader';
import { mapGetters } from 'vuex-module';
import Sidebar from './sidebar';

export default {
  props: ['showLoader'],
  computed: mapGetters(['activities'], 'course'),
  components: {
    Activity,
    Loader,
    Sidebar
  }
};
</script>

<style lang="scss" scoped>
.activities-container {
  height: 100%;
}

.activities {
  padding-right: 400px;
  height: 100%;
}

.outline {
  width: 100%;
  height: 100%;
  float: left;
  padding: 80px 60px;
  overflow-y: scroll;
}
</style>
