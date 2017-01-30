<template>
  <div class="activities">
    <activity
      class="outline"
      :level="0"
      :activities="activities">
    </activity>
    <sidebar></sidebar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex-module';
import Activity from './Activity.vue';
import Sidebar from './Sidebar.vue';

export default {
  computed: mapGetters(['activities'], 'editor'),
  components: {
    Activity,
    Sidebar
  }
};
</script>

<style lang="scss" scoped>
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
