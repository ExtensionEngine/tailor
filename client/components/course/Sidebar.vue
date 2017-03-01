<template>
  <div class="course-sidebar">
    <div v-if="isActivitySelected" class="row">
      <div class="col-xs-10">
        <textarea
          class="form-control"
          ref="activityName"
          v-show="showNameInput"
          v-model="newActivityName"
          @blur="onInputBlur"
          @keyup.enter="onInputEnter"
          @keyup.esc="deactivateInput">
        </textarea>
        <div v-show="!showNameInput" class="title-container">
          <h3 class="title" @click.stop="activateInput">
            {{ activity.name }}
          </h3>
          <span class="fa fa-pencil"></span>
        </div>
      </div>
      <div class="col-xs-2">
        <div class="dropdown">
          <button
            class="btn btn-default btn-options dropdown-toggle"
            type="button"
            data-toggle="dropdown">
            <span class="fa fa-ellipsis-v"></span>
          </button>
          <ul class="dropdown-menu pull-right">
            <li><a @click.stop="removeSelectedActivity">Delete</a></li>
          </ul>
        </div>
      </div>
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
    ...mapGetters(['activity'], 'editor'),
    isActivitySelected() {
      return !!this.activity.name;
    }
  },
  methods: {
    ...mapActions(['remove', 'update'], 'activity'),
    activateInput() {
      this.newActivityName = this.activity.name.slice(0);
      this.showNameInput = true;
      setTimeout(() => this.$refs.activityName.focus(), 0);
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
    }
  }
};
</script>

<style lang="scss" scoped>
.course-sidebar {
  position: fixed;
  right: 0;
  width: 400px;
  height: 100%;
  padding: 30px 20px;
  text-align: left;
  border-top: 1px solid #e8e8e8;
  background-color: #fcfcfc;

  .btn-options {
    margin: 0px 10px;
    padding: 6px 8px 4px;
    color: #555;
    border: 1px #ddd solid;
    border-radius: 2px;
    background-color: white;
    box-shadow: none;

    &:hover {
      color: #444;
      border: 1px #555 solid;
    }
  }

  .title {
    display: inline-block;
    float: left;
    width: 94%;
    margin: 5px 3px 0 0;
    font-size: 17px;
    font-weight: normal;
  }

  .title-container {
    .fa {
      display: none;
    }

    &:hover {
      cursor: pointer;

      .fa {
        display: inline-block;;
      }
    }
  }

  textarea {
    margin: 5px 0;
    min-height: 100px;
  }
}
</style>
