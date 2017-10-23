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
import Sidebar from './Sidebar';

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
  position: relative;
  height: 100%;
  padding-right: 400px;
}

.outline {
  width: 100%;
  height: 100%;
  float: left;
  padding: 80px 60px 0;
  overflow-y: scroll;
  overflow-y: overlay;
}
</style>

<style lang="scss">
.outline > *:last-child { margin-bottom: 120px; }
</style>
