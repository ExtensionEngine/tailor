<template>
  <div class="course-sidebar">
    <div class="title-bar" v-show="isActivitySelected">
      <h3 class="title">{{ activity.name }}</h3>
      <button class="btn btn-default" @click.stop="removeSelectedActivity">X</button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';

export default {
  computed: {
    isActivitySelected() {
      return !!this.activity.name;
    },
    ...mapGetters(['activity'], 'editor')
  },
  methods: {
    removeSelectedActivity() {
      this.remove(this.activity);
    },
    ...mapActions(['remove'], 'activity')
  }
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
    display: inline-block;
    width: 90%;
    text-align: left;
    font-size: 18px;
  }
}
</style>
