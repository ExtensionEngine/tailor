<template>
  <div class="course-container">
    <ul class="nav nav-tabs" role="tablist">
      <li role="presentation" class="active">
        <a href="#outline" aria-controls="outline" role="tab" data-toggle="tab">
          Activities
        </a>
      </li>
      <li role="presentation">
        <a href="#history" aria-controls="history" role="tab" data-toggle="tab">
          Revision history
        </a>
      </li>
      <li role="presentation">
        <a href="#comments" aria-controls="comments" role="tab" data-toggle="tab">
          Comments
        </a>
      </li>
      <li role="presentation">
        <a href="#settings" aria-controls="settings" role="tab" data-toggle="tab">
          Settings
        </a>
      </li>
    </ul>
    <div class="tab-content">
      <div id="outline" role="tabpanel" class="activities tab-pane active">
        <outline :activities="activities"></outline>
        <sidebar></sidebar>
      </div>
      <div id="history" role="tabpanel" class="tab-pane"></div>
      <div id="comments" role="tabpanel" class="tab-pane"></div>
      <div id="settings" role="tabpanel" class="tab-pane"></div>
    </div>
  </div>
</template>

<script>
import Outline from './Outline.vue';
import Sidebar from './Sidebar.vue';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';

export default {
  computed: mapGetters(['activities'], 'editor'),
  methods: {
    ...mapActions(['fetch'], 'activity'),
    ...mapMutations(['activateCourse'], 'activity')
  },
  created() {
    this.activateCourse(this.$route.params.courseKey);
    this.fetch();
  },
  components: {
    Outline,
    Sidebar
  }
};
</script>

<style lang="scss">
.course-container, .tab-content, .tab-pane {
  width: 100%;
  height: 100%;
}

.course-container {
  .nav-tabs {
    position: fixed;
    width: 100%;
    background-color: white;

    li a {
      font-size: 16px;
    }
  }

  .tab-content {
    padding-top: 41px;
  }

  .activities {
    padding-right: 400px;
  }
}
</style>
