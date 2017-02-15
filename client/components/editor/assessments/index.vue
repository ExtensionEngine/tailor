<template>
  <div
    class="assessment-container"
    @selected="$emit('selected')">
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
        @update="update"
        @alert="setAlert">
      </multiple-choice>
      <single-choice
        v-else-if="assessment.type === 'SC'"
        :assessment="assessment"
        :errors="errors"
        :isEditing="isEditing"
        @update="update"
        @alert="setAlert">
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
          v-show="alert.text"
          :class="alert.type"
          class="alert alert-dismissible">
          <strong>{{ alert.text }}</strong>
        </div>
      </div>
      <div v-if="isEditing" class="controls">
        <button @click="cancel" class="btn btn-default" type="button">
          Cancel
        </button>
        <button @click="save" class="btn btn-default" type="button">
          Save
        </button>
      </div>
      <div v-else class="controls">
        <button @click="close" class="btn btn-default" type="button">
          Close
        </button>
        <button @click="edit" class="btn btn-default" type="button">
          Edit
        </button>
        <button @click="remove" class="btn btn-default" type="button">
          Remove
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
const saveAlert = { text: 'Question saved !', type: 'alert-success' };

export default {
  name: 'assessment',
  props: { initAssessment: Object },
  data() {
    return {
      assessment: cloneDeep(this.initAssessment),
      isEditing: !this.initAssessment.question,
      alert: {},
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
    setAlert(data = {}) {
      this.alert = data;
    },
    save() {
      this.errors = [];
      this.validate(this.assessment)
        .then(() => {
          this.isEditing = false;
          this.setAlert(saveAlert);
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
      this.setAlert();
      this.errors = [];
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
.assessment {
  min-height: 400px;
  margin: 10px auto;
  padding: 10px 30px 30px 30px;
  background-color: white;
  overflow: hidden;

  .question {
    font-size: 22px;
    border: 1px dashed transparent;
    text-align: center;
    padding: 10px;

    .message {
      padding: 13px;
    }

    &.editing {
      border-color: #ccc;
    }

    .well {
      margin: 0;
      padding: 29px;
    }
  }

  .alert {
    display: inline-block;
    margin: 0 auto;
    padding: 3px 7px;
    text-align: center;
  }

  .controls {
    float: right;
    padding: 10px;
  }

  button {
    margin-right: 10px;
  }

  .assessment-type {
    font-size: 13px;
    float: right;
    background-color: grey;
    margin: 15px 15px 50px 0;
  }

  .form-label {
    font-size: 20px;
  }

  .destroy {
    display: none;
    position: absolute;
    opacity: 0.6;
    transition: all 0.2s;
    border: 0;
    background-color: transparent;
    padding: 0;
    bottom: 8px;
    right: 10px;

    span {
      font-size: 16px;
    }
  }

  .destroy:focus {
    outline: none;
  }

  .form-group {
    text-align: left;
    margin: 0 auto;
    padding: 25px 20px 15px 20px;
    width: 100%;
    overflow: hidden;
  }

  input.form-control {
    padding-left: 10px;
  }

  .answer {
    padding: 10px 0 0 50px;
    font-size: 16px;
    margin: 10px 0;
  }

  .answers-add {
    padding: 7px;
    height: 28px;
    width: 50px;
    float: right;
  }

  ul {
    padding: 10px 0 0 50px;

    li {
      position: relative;
      display: inline-block;
      width: 100%;
      margin: 10px 0;

      .answers {
        vertical-align: bottom;
        font-size: 16px;
      }

      .answers-radio,
      .answers-checkbox {
        float: left;
        margin-top: 7px;
        width: 19px;
      }

      .answers-radio input {
        padding-bottom: 9px;
      }
      .answers-checkbox input {
        padding-bottom: 11px;
      }

      .answers-input {
        display: block;
        overflow: hidden;

        input {
          height: 40px;
          width: 100%;
          margin-left: 3px;
          padding: 0 33px 0 10px;
        }

        input:focus {
          outline: none;
        }
      }
    }

    li:hover {
      .destroy:enabled {
        display: inline;
      }
    }
  }
}

@media (max-width: 850px) {
  .assessment ul {
    padding-left: 0;
  }
}
</style>
