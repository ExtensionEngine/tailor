<template>
  <div class="course-sidebar">
    <div v-if="isActivitySelected" class="row">
      <div class="col-xs-10">
        <div
          v-show="showNameInput"
          :class="{ 'has-error': vErrors.has('newActivityName') }"
          class="form-group">
          <textarea
            ref="newActivityName"
            @blur="onInputBlur"
            @keyup.enter="onInputEnter"
            @keyup.esc="deactivateInput"
            class="form-control"
            name="newActivityName"
            v-model="newActivityName"
            v-validate="{ rules: { required: true, min: 2, max: 250 } }"
            data-vv-as="name">
          </textarea>
          <span v-if="vErrors.has('newActivityName')" class="help-block">
            {{ vErrors.first('newActivityName') }}
          </span>
        </div>
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
const noop = Function.prototype;

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
      setTimeout(() => this.$refs.newActivityName.focus(), 0);
    },
    deactivateInput() {
      // This removes input from DOM and triggers blur event!
      this.showNameInput = false;
    },
    onInputBlur() {
      this.$validator.validateAll().then(() => {
        this.saveActivityName();
        this.deactivateInput();
      }, noop);
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
