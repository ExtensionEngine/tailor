<template>
  <div class="course-sidebar">
    <div class="title-bar" v-show="isActivitySelected">
      <span class="title-editor">
        <h3 class="title">{{ activity.name }}</h3>
        <span class="fa fa-pencil pencil" aria-hidden="true"></span>
      </span>
      <button class="btn btn-default"
              @click.stop="removeSelectedActivity">
        X
      </button>
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
  position: fixed;
  right: 0;
  width: 400px;
  height: 100%;
  padding: 30px 20px;
  text-align: left;
  border-top: 1px solid #e8e8e8;
  background-color: #fcfcfc;

  .title {
    display: inline-block;
    width: 85%;
    text-align: left;
    font-size: 18px;
  }

  .title-editor {
    .pencil {
      display: none;
    }
  }

  .title-editor:hover {
    .pencil {
      display: inline;
    }
  }

  button {
    float: right;
    margin-top: 12px;
  }
}
</style>
