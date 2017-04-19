<template>
  <div class="course-sidebar">
    <div v-if="isActivitySelected">
      <div class="sb-row">
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
      </div>
      <div class="sb-row name-row">
        <div class="form-group">
          <label for="name">Name</label>
          <div v-show="editName" :class="{ 'has-error': vErrors.has('name') }">
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
            <span v-if="vErrors.has('name')" class="help-block">
              {{ vErrors.first('name') }}
            </span>
          </div>
          <div v-show="!editName" @click.stop="focusName">
            <h3 class="title">{{ activity.name }}</h3>
          </div>
        </div>
      </div>
      <div class="sb-row">
        <div class="form-group">
          <label for="description">Description</label>
          <div
            v-show="editDescription"
            :class="{ 'has-error': vErrors.has('description') }">
            <textarea
              v-model="descriptionInput"
              v-validate="{ rules: { required: false, max: 250 } }"
              @blur="focusoutDescription"
              @keyup.enter="focusoutDescription"
              @keyup.esc="hideDescriptionInput"
              placeholder="Add description here..."
              ref="descriptionInput"
              name="description"
              class="form-control desc-textarea">
            </textarea>
            <span v-if="vErrors.has('description')" class="help-block">
              {{ vErrors.first('description') }}
            </span>
          </div>
          <div v-show="!editDescription" @click.stop="focusDescription">
            <h3 class="title desc-title">
              {{ description || 'Add description here...' }}
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from 'EventBus';
import get from 'lodash/get';
import { mapActions, mapGetters } from 'vuex-module';
const noop = Function.prototype;

const appChannel = EventBus.channel('app');

export default {
  data() {
    return {
      nameInput: '',
      descriptionInput: '',
      editName: false,
      editDescription: false
    };
  },
  computed: {
    ...mapGetters(['activity'], 'course'),
    activityData() {
      return this.activity.data || {};
    },
    name() {
      return this.activity.name;
    },
    description() {
      return get(this.activity, 'data.description', '');
    },
    isActivitySelected() {
      return !!this.activity.name;
    }
  },
  methods: {
    ...mapActions(['remove', 'update'], 'activities'),
    focusName() {
      this.nameInput = this.activity.name;
      this.editName = true;
      setTimeout(() => this.$refs.nameInput.focus(), 0);
    },
    focusoutName() {
      this.$validator.validateAll().then(() => {
        if (this.nameInput === this.activity.name) {
          this.hideNameInput();
          return;
        }
        this.update({ _cid: this.activity._cid, name: this.nameInput });
        this.hideNameInput();
      }, noop);
    },
    hideNameInput() {
      this.editName = false;
    },
    focusDescription() {
      this.descriptionInput = this.activityData.description;
      this.editDescription = true;
      setTimeout(() => this.$refs.descriptionInput.focus(), 0);
    },
    focusoutDescription() {
      this.$validator.validateAll().then(() => {
        if (this.descriptionInput === this.description) {
          this.hideDescriptionInput();
          return;
        }
        this.update({
          _cid: this.activity._cid,
          data: { description: this.descriptionInput }
        });
        this.hideDescriptionInput();
      }, noop);
    },
    hideDescriptionInput() {
      this.editDescription = false;
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
    },
    description(val) {
      this.descriptionInput = val;
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
  padding: 30px 10px;
  text-align: left;
  border-top: 1px solid #e8e8e8;
  background-color: #fcfcfc;

  .btn-options {
    margin: 0 10px;
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

  .sb-row {
    width: 100%;
    margin: 0;
  }

  .form-group {
    padding: 1px 5px 5px 5px;

    &:hover {
      background-color: #f5f5f5;
    }
  }

  .dropdown {
    margin-bottom: 10px;
    text-align: right;

    button {
      padding: 2px;
    }

    .dropdown-menu {
      margin-right: 10px;
    }

    .mdi-dots-vertical {
      font-size: 18px;
    }
  }

  .title {
    display: inline-block;
    height: 100px;
    margin: 3px 3px 5px 0;
    font-size: 17px;
    line-height: 24px;
    word-wrap: break-word;
    font-weight: normal;
    color: #333;
   }

  .name-row {
    height: 155px;
  }

  .form-control {
    font-size: 17px;
    letter-spacing: 0.1px;
  }

  .desc-title {
    width: 100%;
    height: 150px;
  }

  textarea {
    margin: 5px 0;
    height: 100px;
    resize: none;
  }

  .desc-textarea {
    height: 150px;
  }

  .help-block {
    margin-bottom: 0;
  }

  label {
    display: block;
    margin: 2px 0;
    color: gray;
  }
}
</style>
