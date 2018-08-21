<template>
  <div v-if="showCreateButton" class="create-course">
    <button @click="show" class="btn btn-primary btn-fab" type="button">
      <span class="mdi mdi-plus"></span>
    </button>
    <modal :show="showModal" :focus="false">
      <div slot="header">
        <h4 class="modal-title">Create content repository</h4>
      </div>
      <div slot="body">
        <circular-progress v-show="showLoader" class="loader"></circular-progress>
        <div v-show="!showLoader">
          <div class="error-message">
            <span v-if="vErrors.has('default')">
              {{ vErrors.first('default') }}
            </span>
          </div>
          <div class="form-group">
            <div :class="{ 'has-error': vErrors.has('schema') }" class="form-group">
              <multiselect
                v-validate="'required'"
                v-model="schema"
                :options="schemas"
                :searchable="false"
                label="name"
                value="id"
                trackBy="id"
                data-vv-value-path="id"
                name="schema">
              </multiselect>
              <span class="help-block">{{ vErrors.first('schema') }}</span>
            </div>
          </div>
          <div :class="{ 'has-error': vErrors.has('name') }" class="form-group">
            <input
              v-validate="{ rules: { required: true, min: 2, max: 250 } }"
              v-model="name"
              class="form-control"
              name="name"
              type="text"
              placeholder="Name"/>
            <span class="help-block">{{ vErrors.first('name') }}</span>
          </div>
          <div :class="{ 'has-error': vErrors.has('description') }" class="form-group">
            <textarea
              v-validate="{ rules: { required: true, min: 2, max: 2000 } }"
              v-model="description"
              class="form-control"
              name="description"
              placeholder="Description">
            </textarea>
            <span class="help-block">{{ vErrors.first('description') }}</span>
          </div>
        </div>
      </div>
      <div slot="footer">
        <button
          :disabled="showLoader"
          @click="hide"
          class="btn btn-material btn-default"
          type="button">
          Cancel
        </button>
        <button
          :disabled="showLoader"
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
import { mapActions, mapGetters } from 'vuex-module';
import { SCHEMAS } from 'shared/activities';
import { withValidation } from 'utils/validation';

import CircularProgress from 'components/common/CircularProgress';
import Modal from 'components/common/Modal';
import Multiselect from 'components/common/Select';
import pick from 'lodash/pick';
import Promise from 'bluebird';

const getDefaultData = () => ({
  schema: null,
  name: '',
  description: '',
  showLoader: false,
  showModal: false
});

export default {
  name: 'create-course',
  mixins: [withValidation()],
  data: getDefaultData,
  computed: {
    ...mapGetters(['isAdmin']),
    showCreateButton() {
      return this.isAdmin;
    },
    schemas() {
      return SCHEMAS;
    }
  },
  methods: {
    ...mapActions(['save'], 'courses'),
    submit() {
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        this.showLoader = true;
        const schema = this.schema.id;
        const course = { schema, ...pick(this, ['name', 'description']) };
        return Promise.join(this.save(course), Promise.delay(1000))
          .then(() => this.hide())
          .catch(() => this.vErrors.add('default', 'An error has occurred!'));
      });
    },
    show() {
      this.vErrors.clear();
      this.showModal = true;
    },
    hide() {
      Object.assign(this, getDefaultData());
    }
  },
  components: {
    CircularProgress,
    Modal,
    Multiselect
  }
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
    min-height: 80px;
    margin: 0;
  }

  .error-message {
    padding: 3px 0;
    color: #a94442;
    text-align: left;
  }

  /deep/ .modal-body {
    min-height: 300px;
  }

  .loader {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
  }
}
</style>
