<template>
  <div class="course-sidebar">
    <div class="title-bar" v-if="isActivitySelected">
      <template v-if="showNameInput">
        <input
          class="form-control"
          v-model="newActivityName"
          @blur="onInputBlur"
          @keyup.enter="onInputEnter"
          @keyup.esc="deactivateInput"
          type="text">
      </template>
      <template v-else>
        <span class="title-editor">
          <h3 class="title" @click.stop="activateInput">{{ activity.name }}</h3>
          <span class="fa fa-pencil pencil" aria-hidden="true"></span>
        </span>
        <button class="btn btn-default"
                @click.stop="removeSelectedActivity">
          X
        </button>
      </template>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';

export default {
  data() {
    return {
      newActivityName: '',
      showNameInput: false
    };
  },
  computed: {
    isActivitySelected() {
      return !!this.activity.name;
    },
    ...mapGetters(['activity'], 'editor')
  },
  methods: {
    activateInput() {
      this.newActivityName = this.activity.name.slice(0);
      this.showNameInput = true;
    },
    deactivateInput() {
      this.newActivityName = '';
      // This removes input from DOM and triggers blur event!
      this.showNameInput = false;
    },
    onInputBlur() {
      // Input lost focus as a side-effect of being removed from HTML.
      if (!this.showNameInput) return;
      this.saveActivityName();
      this.deactivateInput();
    },
    onInputEnter() {
      this.saveActivityName();
      this.deactivateInput();
    },
    saveActivityName() {
      if (this.newActivityName !== this.activity.name) {
        this.update({ _cid: this.activity._cid, name: this.newActivityName });
      }
    },
    removeSelectedActivity() {
      this.remove(this.activity);
    },
    ...mapActions(['remove', 'update'], 'activity')
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
