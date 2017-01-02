<template>
  <div class="course-sidebar">
    <h3 class="title">{{ activity.name }}</h3>
  </div>
</template>

<script>
import { mapGetters } from 'vuex-module';

export default {
  computed: mapGetters(['activity'], 'editor')
};
</script>

<style lang="scss">
.course-sidebar {
  width: 400px;
  height: 100%;
  position: fixed;
  right: 0;
  padding: 30px 20px;
  border-top: 1px solid #e8e8e8;
  background-color: #fcfcfc;

  .title {
    text-align: left;
    font-size: 18px;
  }
}
</style>
