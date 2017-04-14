<template>
  <div class="course-sidebar">
    <div v-if="isActivitySelected">
      <div class="row name-row">
        <div class="form-group">
          <div class="col-xs-10">
            <label for="name">Name</label>
            <div
              v-show="editName"
              :class="{ 'has-error': vErrors.has('nameInput') }"
              class="form-group">
              <textarea
                v-model="nameInput"
                v-validate="{ rules: { required: true, min: 2, max: 250 } }"
                @blur="focusoutName"
                @keyup.enter="focusoutName"
                @keyup.esc="hideNameInput"
                ref="nameInput"
                name="nameInput"
                data-vv-as="name"
                class="form-control">
              </textarea>
              <span v-if="vErrors.has('nameInput')" class="help-block">
                {{ vErrors.first('nameInput') }}
              </span>
            </div>
            <div v-show="!editName" class="title-container">
              <h3 class="title" @click.stop="focusName">
                {{ activity.name }}
              </h3>
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
                <li><a @click.stop="deleteActivity">Delete</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12">
          <div class="form-group">
            <label for="description">Description</label>
            <div
              v-show="editDescription"
              :class="{ 'has-error': vErrors.has('descriptionInput') }"
              class="form-group">
              <textarea
                v-model="descriptionInput"
                v-validate="{ rules: { required: false, max: 250 } }"
                @blur="focusoutDescription"
                @keyup.enter="focusoutDescription"
                @keyup.esc="hideDescriptionInput"
                placeholder="Add decription here..."
                ref="descriptionInput"
                name="descriptionInput"
                data-vv-as="description"
                class="form-control desc-text-area">
              </textarea>
              <span v-if="vErrors.has('descriptionInput')" class="help-block">
                {{ vErrors.first('descriptionInput') }}
              </span>
            </div>
            <div v-show="!editDescription">
              <h3
                @click.stop="focusDescription"
                class="title desc-title">{{ description || 'Add description here...' }}
              </h3>
            </div>
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
    decription(val) {
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
    width: 94%;
    margin: 0px 3px 51px 0;
    line-height: 24px;
    font-size: 17px;
    font-weight: normal;
    word-wrap: break-word;

      &:hover {
        background-color: #eaeaea;
      }
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

  .form-control {
    letter-spacing: 0.1px;
    font-size: 17px;
  }

  .name-row {
    height: 150px;
  }

  .desc-text-area {
    height: 200px;
    font-size: 17px;
  }

  .desc-title {
    margin-top: 0px;
    width: 100%;
  }

  textarea {
    margin: 5px 0;
    min-height: 60px;
  }

  label {
    color: gray;
    display: block;
    margin-top: 10px;
    margin-bottom: 10px;
  }
}
</style>
