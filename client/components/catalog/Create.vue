<template>
  <div class="create-course" v-if="showCreateButton">
    <button type="button" class="btn btn-primary" @click="show">
      Create course
    </button>
    <modal :show="showModal" :backdrop="false" effect="fade">
      <div slot="modal-header" class="modal-header">
        <h4 class="modal-title">Create course</h4>
      </div>
      <div slot="modal-body" class="modal-body">
        <loader v-show="showLoader"></loader>
        <div v-show="!showLoader">
          <div class="form-group" :class="getErrorClass('name')">
            <input v-model="name" type="text" class="form-control" placeholder="Name"/>
            <div v-show="hasError('name')" class="error-message">
              {{ getErrorMessage('name') }}
            </div>
          </div>
          <div class="form-group" :class="getErrorClass('description')">
            <textarea
              v-model="description"
              class="form-control"
              placeholder="Description">
            </textarea>
            <div v-show="hasError('description')" class="error-message">
              {{ getErrorMessage('description') }}
            </div>
          </div>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" @click="hide" class="btn btn-default">Cancel</button>
        <button type="button" @click="create" class="btn btn-primary">Create</button>
      </div>
    </modal>
  </div>
</template>

<script>
import { isEmpty } from 'lodash';
import Loader from '../common/Loader';
import { mapActions, mapGetters } from 'vuex-module';
import { modal } from 'vue-strap';
import Promise from 'bluebird';
import yup from 'yup';

const bounds = {
  name: { min: 2, max: 250 },
  description: { min: 2, max: 2000 }
};

const schema = yup.object().shape({
  name: yup.string().trim()
    .min(bounds.name.min)
    .max(bounds.name.max)
    .required(),
  description: yup.string().trim()
    .min(bounds.description.min)
    .max(bounds.description.max)
    .required()
});

export default {
  name: 'create-course',
  data() {
    return {
      name: '',
      description: '',
      showLoader: false,
      showModal: false,
      errors: this.getDefaultErrors()
    };
  },
  components: {
    modal,
    Loader
  },
  methods: {
    ...mapActions(['save'], 'courses'),
    create() {
      const course = { name: this.name, description: this.description };
      const save = course => {
        this.showLoader = true;
        return Promise.join(this.save(course), Promise.delay(1000)).then(() => {
          this.showLoader = false;
          this.hide();
        });
      };

      this.errors = this.getDefaultErrors();
      this.validate(course)
        .then(save)
        .catch(err => {
          err.inner.forEach(it => this.errors[it.path].push(it.type));
        });
    },
    show() {
      this.showModal = true;
    },
    hide() {
      this.name = '';
      this.description = '';
      this.errors = this.getDefaultErrors();
      this.showModal = false;
    },
    validate(course) {
      return schema.validate(course, { abortEarly: false });
    },
    getDefaultErrors() {
      // Array of error types for input fields
      return { name: [], description: [] };
    },
    hasError(field) {
      return !isEmpty(this.errors[field]);
    },
    getErrorClass(field) {
      return { 'has-error': this.hasError(field) };
    },
    getErrorMessage(field) {
      // Helpers
      const capitalize = word => word.replace(/(^|\s)[a-z]/g, l => l.toUpperCase());
      const [minValue, maxValue] = [bounds[field].min, bounds[field].max];

      // Error messages
      const required = `${capitalize(field)} should not be empty`;
      const min = `${capitalize(field)} field should contain at least ${minValue} characters`;
      const max = `${capitalize(field)} field should contain at most ${maxValue} characters`;

      // Display message by error priority
      const types = this.errors[field];
      if (types.includes('required')) return required;
      else if (types.includes('min')) return min;
      else if (types.includes('max')) return max;
    }
  },
  computed: {
    ...mapGetters(['isAdmin']),
    showCreateButton() {
      return this.isAdmin;
    }
  }
};
</script>

<style lang="scss">
.create-course {
  textarea {
    resize: none;
  }

  .modal-content {
    padding: 10px;
    border-radius: 0;
  }

  .modal-header {
    border: 0;
    text-align: left;
  }

  .modal-footer {
    border: 0;
  }

  .form-group {
    margin: 0;
    min-height: 80px;
  }

  .error-message {
    padding: 3px 0;
    color: #dd4b39;
    font-size: 15px;
    font-weight: 600;
    text-align: left;
  }
}
</style>
