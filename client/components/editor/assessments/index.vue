<template>
  <div class="assessment-container" @selected="$emit('selected')">
    <div class="assessment" v-bind:class="typeInfo.class">
      <div class="label label-primary assessment-type">
        {{ typeInfo.title }}
      </div>
      <div class="form-group">
        <span class="form-label">Question</span>
        <span :class="{ 'has-error': errors.includes('question') }">
          <div @click="focus" class="question" v-bind:class="{ editing: isEditing }">
            <div v-if="!isFocused && !assessment.question">
              <div class="well text-placeholder">
                <div class="message">
                  <span class="heading">Text placeholder</span>
                  <span>Click to edit</span>
                </div>
              </div>
            </div>
            <div v-else>
              <quill-editor
                v-if="isFocused"
                v-model="assessment.question"
                :config="config">
              </quill-editor>
              <div
                v-else
                class="ql-container ql-snow">
                <div
                  v-html="assessment.question"
                  class="ql-editor">
                </div>
              </div>
            </div>
          </div>
        </span>
      </div>
      <multiple-choice
        v-if="assessment.type === 'MC'"
        :assessment="assessment"
        :errors="errors"
        :isEditing="isEditing"
        @update="update">
      </multiple-choice>
      <single-choice
        v-else-if="assessment.type === 'SC'"
        :assessment="assessment"
        :errors="errors"
        :isEditing="isEditing"
        @update="update">
      </single-choice>
      <true-false
        v-else-if="assessment.type === 'TF'"
        :assessment="assessment"
        :errors="errors"
        :isEditing="isEditing"
        @update="update">
      </true-false>
      <numerical-response
        v-else-if="assessment.type === 'NR'"
        :assessment="assessment"
        :errors="errors"
        :isEditing="isEditing"
        @update="update">
      </numerical-response>
      <text-response
        v-else-if="assessment.type === 'TR'"
        :assessment="assessment"
        :errors="errors"
        :isEditing="isEditing"
        @update="update">
      </text-response>
      <div class="form-group">
        <span class="form-label">Hint</span>
        <input
          v-model="assessment.hint"
          :disabled="!isEditing"
          class="form-control"
          type="text"
          placeholder="Optional hint">
      </div>
      <div class="alert-container">
        <div
          v-show="showAlert"
          :class="alertType"
          class="alert alert-dismissible">
          <strong>{{ alert }}</strong>
        </div>
      </div>
      <div v-if="isEditing" class="controls">
        <button @click="save" class="btn btn-default" type="button">
          Save
        </button>
        <button @click="cancel" class="btn btn-default" type="button">
          Cancel
        </button>
      </div>
      <div v-else class="controls">
        <button @click="close" class="btn btn-default" type="button">
          Close
        </button>
        <button @click.stop="remove" class="btn btn-default" type="button">
          Remove
        </button>
        <button @click="edit" class="btn btn-default" type="button">
          Edit
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { mapGetters, mapMutations } from 'vuex-module';
import { quillEditor } from 'vue-quill-editor';
import MultipleChoice from './MultipleChoice';
import SingleChoice from './SingleChoice';
import TrueFalse from './TrueFalse';
import NumericalResponse from './NumericalResponse';
import TextResponse from './TextResponse';
import { schemas, typeInfo } from '../../../utils/assessment';

const validationOptions = { recursive: true, abortEarly: false };

export default {
  name: 'assessment',
  props: { initAssessment: Object },
  data() {
    return {
      assessment: cloneDeep(this.initAssessment),
      isEditing: !this.initAssessment.question,
      showAlert: false,
      alertType: null,
      alert: '',
      errors: [],
      config: { modules: { toolbar: '#quillToolbar' } }
    };
  },
  computed: {
    schema() {
      return schemas[this.assessment.type] || {};
    },
    typeInfo() {
      return typeInfo[this.assessment.type] || {};
    },
    ...mapGetters(['toolbar']),
    isFocused() {
      return this.isEditing && (this.toolbar.context._cid === this.assessment._cid);
    }
  },
  methods: {
    save() {
      this.errors = [];
      this.validate(this.assessment)
        .then(() => {
          this.isEditing = false;
          this.$emit('save', cloneDeep(this.assessment));
        })
        .catch(err => err.inner.forEach(it => this.errors.push(it.path)));
    },
    validate(question) {
      return this.schema.validate(question, validationOptions);
    },
    update(data) {
      Object.assign(this.assessment, cloneDeep(data));
    },
    ...mapMutations(['setToolbar']),
    focus(e) {
      this.setToolbar(this.assessment);
      // Attach component meta to event
      e.component = {
        name: 'assessment',
        data: this.assessment
      };
    },
    cancel() {
      Object.assign(this.assessment, cloneDeep(this.initAssessment));
      this.isEditing = false;
    },
    close() {
      this.$emit('selected');
    },
    edit() {
      this.isEditing = true;
    },
    remove() {
      this.$emit('remove');
    }
  },
  components: {
    quillEditor,
    MultipleChoice,
    SingleChoice,
    TrueFalse,
    NumericalResponse,
    TextResponse
  }
};
</script>

<style lang="scss">
.question {
  border: 1px dashed transparent;

  &.editing {
    border-color: #ccc;
  }
}
</style>
