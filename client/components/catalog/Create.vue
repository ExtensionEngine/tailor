<template>
  <div v-if="showCreateButton" class="create-course" >
    <button @click="show" class="btn btn-primary btn-fab" type="button">
      <span class="mdi mdi-plus"></span>
    </button>
    <modal :show="showModal">
      <div slot="header">
        <h4 class="modal-title">Create course</h4>
      </div>
      <div slot="body">
        <loader v-show="showLoader"></loader>
        <div v-show="!showLoader">
          <div class="error-message">
            <span v-if="vErrors.has('default')">
              {{ vErrors.first('default') }}
            </span>
          </div>
          <div :class="{ 'has-error': vErrors.has('name') }" class="form-group">
            <input
              v-model="name"
              v-focus="focusName"
              v-validate="{ rules: { required: true, min: 2, max: 250 } }"
              @focus="focusName = true"
              @blur="focusName = false"
              class="form-control"
              name="name"
              type="text"
              placeholder="Name"/>
            <span v-show="vErrors.has('name')" class="help-block">
              {{ vErrors.first('name') }}
            </span>
          </div>
          <div :class="{ 'has-error': vErrors.has('description') }" class="form-group">
            <textarea
              v-model="description"
              v-validate="{ rules: { required: true, min: 2, max: 2000 } }"
              class="form-control"
              name="description"
              placeholder="Description">
            </textarea>
            <span v-show="vErrors.has('description')" class="help-block">
              {{ vErrors.first('description') }}
            </span>
          </div>
        </div>
      </div>
      <div slot="footer">
        <button
          @click="hide"
          class="btn btn-material btn-default"
          type="button">
          Cancel
        </button>
        <button
          @click="submit"
          class="btn btn-material btn-primary"
          type="button">
          Create
        </button>
      </div>
    </modal>
  </div>
</template>

<script>
import { focus } from 'vue-focus';
import Loader from '../common/Loader';
import { mapActions, mapGetters } from 'vuex-module';
import Modal from 'components/common/Modal';
import pick from 'lodash/pick';
import Promise from 'bluebird';

const getDefaultData = () => ({
  name: '',
  description: '',
  showLoader: false,
  showModal: false,
  focusName: true
});

export default {
  name: 'create-course',
  data: getDefaultData,
  computed: {
    ...mapGetters(['isAdmin']),
    showCreateButton() {
      return this.isAdmin;
    }
  },
  methods: {
    ...mapActions(['save'], 'courses'),
    submit() {
      this.$validator.validateAll()
        .then(result => {
          if (!result) return;
          const course = pick(this, ['name', 'description']);
          return this.create(course);
        });
    },
    create(course) {
      this.showLoader = true;
      return Promise.join(this.save(course), Promise.delay(1000))
        .then(() => this.hide())
        .catch(() => this.vErrors.add('default', 'An error has occurred!'));
    },
    show() {
      this.vErrors.clear();
      this.showModal = true;
      this.focusName = true;
    },
    hide() {
      Object.assign(this, getDefaultData());
    }
  },
  directives: { focus },
  components: {
    Modal,
    Loader
  },
  inject: ['$validator']
};
</script>

<style lang="scss" scoped>
.btn-fab .mdi {
  display: inline-block;
  font-size: 28px;
  line-height: 28px;
  vertical-align: middle;
}

.create-course {
  textarea {
    resize: none;
  }

  .form-group {
    margin: 0;
    min-height: 80px;
  }

  .error-message {
    padding: 3px 0;
    color: #a94442;
    text-align: left;
  }

  .loader {
    margin: 50px 0;
  }
}
</style>
