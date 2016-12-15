<template>
  <div class="outline">
    <activity :level="0" :activities="activities"></activity>
  </div>
</template>

<script>
import Activity from './Activity.vue';

export default {
  props: ['activities'],
  components: {
    Activity
  }
};
</script>

<style lang="scss">
.outline {
  width: 100%;
  height: 100%;
  float: left;
  padding: 80px 60px;
  overflow-y: scroll;
}
</style>
