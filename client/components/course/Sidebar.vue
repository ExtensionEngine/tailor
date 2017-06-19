<template>
  <div class="course-sidebar">
    <div v-if="name">
      <div class="dropdown">
        <button
          class="btn btn-default btn-options dropdown-toggle"
          type="button"
          data-toggle="dropdown">
          <span class="mdi mdi-dots-vertical"></span>
        </button>
        <ul class="dropdown-menu pull-right">
          <li><a @click.stop="deleteActivity">Delete</a></li>
        </ul>
      </div>
      <div class="row-a">
        <label>Name</label>
        <div v-show="showNameInput" :class="{ 'has-error': vErrors.has('name') }">
          <textarea
            v-model="nameInput"
            v-validate="{ rules: { required: true, min: 2, max: 150 } }"
            @blur="focusoutName"
            @keyup.enter="focusoutName"
            @keyup.esc="hideNameInput"
            ref="nameInput"
            name="name"
            class="form-control">
          </textarea>
          <span class="help-block">{{ vErrors.first('name') }}</span>
        </div>
        <div v-show="!showNameInput" @click.stop="focusName">
          <div class="title">{{ name }}</div>
        </div>
      </div>
      <metax :activity="activity"></metax>
    </div>
    <div v-else class="placeholder">
      <h4>Outline Sidebar</h4>
      <div class="mdi mdi-arrow-left"></div>
      <div class="helper">
        Please create your first Goal on the left to view and edit its details
        here.
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from 'EventBus';
import { mapActions, mapGetters } from 'vuex-module';
import Metax from './meta';
const noop = Function.prototype;

const appChannel = EventBus.channel('app');

export default {
  data() {
    return {
      nameInput: '',
      showNameInput: false
    };
  },
  computed: {
    ...mapGetters(['activity'], 'course'),
    name() {
      return this.activity.name;
    }
  },
  methods: {
    ...mapActions(['remove', 'update'], 'activities'),
    focusName() {
      this.nameInput = this.activity.name;
      this.showNameInput = true;
      setTimeout(() => this.$refs.nameInput.focus(), 0);
    },
    focusoutName() {
      this.$validator.validateAll().then(() => {
        if (this.nameInput === this.activity.name) {
          this.showNameInput = false;
          return;
        }
        this.update({ _cid: this.activity._cid, name: this.nameInput });
        this.showNameInput = false;
      }, noop);
    },
    deleteActivity() {
      appChannel.emit('showConfirmationModal', {
        type: 'activity',
        item: this.activity,
        action: () => this.remove(this.activity)
      });
    }
  },
  watch: {
    name(val) {
      this.nameInput = val;
    }
  },
  components: {
    Metax
  }
};
</script>

<style lang="scss" scoped>
.course-sidebar {
  position: fixed;
  right: 0;
  width: 400px;
  height: 100%;
  padding: 30px 10px;
  text-align: left;
  border-top: 1px solid #e8e8e8;
  background-color: #fcfcfc;

  .btn-options {
    margin: 0 15px;
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

  .dropdown {
    margin-bottom: 10px;
    text-align: right;

    button {
      padding: 2px;
      font-size: 18px;
    }

    .dropdown-menu {
      margin-right: 15px;
    }
  }

  .title {
    height: 100px;
    margin: 5px 3px 5px 0;
    font-size: 17px;
    line-height: 24px;
    word-wrap: break-word;
    font-weight: normal;
    color: #333;
   }

  .form-control {
    font-size: 17px;
    letter-spacing: 0.1px;
  }

  textarea {
    margin: 5px 0;
    height: 100px;
    resize: none;
  }

  .help-block {
    margin-bottom: 0;
  }

  label {
    color: gray;
  }
}

.row-a {
  height: 155px;
  padding: 3px 8px;

  &:hover {
    cursor: pointer;
    background-color: #f5f5f5;
  }
}

.placeholder {
  color: gray;

  h4 {
    padding: 8px 0 18px;
    text-align: center;
    font-size: 19px;
  }

  .mdi {
    float: left;
    padding: 5px 20px 5px 12px;
    font-size: 20px;
  }

  .helper {
    width: 330px;
  }
}
</style>
