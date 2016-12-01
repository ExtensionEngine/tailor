<template>
  <div>
    <activity :activities="activities"></activity>
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

</style>
