<template>
  <div :class="{ disabled }">
    <h5>Answers</h5>
    <span @click="addAnswer" class="btn btn-link mdi mdi-plus pull-right"></span>
    <ul>
      <li v-for="answer in answers" :key="answer.key" class="answer-row">
        <span
          :class="{ 'has-error': !!vErrors.first(answer.key) }"
          class="row-content">
          <input
            :checked="correct.includes(answer.key)"
            :disabled="disabled"
            @change="toggleAnswer(answer.key)"
            type="checkbox"/>
          <div class="dead-center-img-container">
            <img
              :src="answer.value || './assets/img/no-image.png'"
              class="dead-center-img"/>
          </div>
          <div class="image-input-err">
            <input
              v-validate
              data-vv-as="image"
              :data-vv-rules="imageValidationRules"
              :accept="imageInputType"
              :data-key="answer.key"
              :disabled="disabled"
              :name="answer.key"
              :ref="`${answer.key}_file_input`"
              @change="updateAnswer"
              class="image-input"
              type="file"/>
            <button
              @click="$refs[`${answer.key}_file_input`][0].click();"
              class="btn btn-material btn-primary"
              type="button">
              Upload image...
            </button>
              <span v-if="vErrors.first(answer.key)" class="error-msg">
                {{ vErrors.first(answer.key) }}
              </span>
          </div>
          <span @click="removeAnswer(answer.key)" class="mdi mdi-close control">
          </span>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import { blobToDataURL } from 'blob-util';
import cloneDeep from 'lodash/cloneDeep';
import cuid from 'cuid';
import find from 'lodash/find';
import pull from 'lodash/pull';
import { withValidation } from 'utils/validation';

const maxImageDimension = 256;
const isImageValidationError = err => !!err[Symbol.for('error:image-validation')];
const findByKey = (collection, key) => find(collection, { key });

const maxDimensionsValidationRule = {
  getMessage(field, [width, height], data) {
    return (data && data.message) ||
      `Incorrect image width and/or height. Maximum allowed image dimensions:
      ${maxImageDimension}x${maxImageDimension}`;
  },
  validate(files, [width, height]) {
    if (!files || !files[0]) {
      return Promise.resolve(true);
    }
    return getImageDimensions(files[0].dataUrl)
      .then(({ width, height }) => {
        let valid = true;
        if (width > maxImageDimension || height > maxImageDimension) {
          valid = false;
        }
        return Promise.resolve(valid);
      });
  }
};

export default {
  mixins: [withValidation()],
  props: {
    assessment: Object,
    isEditing: Boolean,
    errors: Array,
    fileInputTypes: { type: Array, default: () => ['image/jpeg', 'image/png'] }
  },
  computed: {
    answers() {
      return this.assessment.answers;
    },
    correct() {
      return this.assessment.correct;
    },
    feedback() {
      return this.assessment.feedback;
    },
    disabled() {
      return !this.isEditing;
    },
    imageInputType() {
      return this.fileInputTypes.join(',');
    },
    imageValidationRules() {
      return `size:100|maxdimensions:${maxImageDimension},${maxImageDimension}`;
    }
  },
  methods: {
    update(data) {
      this.$emit('update', data);
    },
    toggleAnswer(key) {
      let correct = cloneDeep(this.correct);
      const position = correct.indexOf(key);

      position < 0 ? correct.push(key) : correct.splice(position, 1);

      this.update({ correct });
    },
    updateAnswer(evt) {
      let answers = cloneDeep(this.answers);
      const { target: input } = evt;
      const { dataset, files = [] } = input;
      const image = files[0];

      this.deleteErrorMessages(dataset.key);

      if (!image) return;

      return blobToDataURL(image)
        .then(dataUrl => (image.dataUrl = dataUrl))
        .then(() => this.$validator.validate(dataset.key, [image]))
        .then(isValid => {
          if (!isValid) return Promise.reject(imageValidationError());
        })
        .then(() => {
          let answer = findByKey(answers, dataset.key);
          if (answer) answer.value = image.dataUrl;
        })
        .then(() => this.update({ answers }))
        .catch(error => {
          if (!isImageValidationError(error)) throw error;
        })
        .then(() => (input.value = null));
    },
    addAnswer() {
      let answers = cloneDeep(this.answers);
      answers.push({ key: cuid(), value: '' });
      this.update({ answers });
    },
    removeAnswer(key) {
      let answers = cloneDeep(this.answers);
      let correct = cloneDeep(this.correct);
      let feedback = cloneDeep(this.feedback);

      pull(answers, findByKey(answers, key));

      const index = correct.indexOf(key);
      if (index !== -1) correct.splice(index, 1);

      if (feedback) pull(feedback, findByKey(feedback, key));

      this.deleteErrorMessages(key);
      this.update({ answers, correct, feedback });
    },
    hasCorrectAnswers() {
      return this.correct.length > 0;
    },
    validate() {
      let error = {};
      if (Object.keys(this.answers).length < 2) {
        error = {
          type: 'alert-danger',
          text: 'Please make at least two answers available.'
        };
      } else if (!this.hasCorrectAnswers()) {
        error = {
          type: 'alert-danger',
          text: 'There needs to be at least one correct answer.'
        };
      }
      this.$emit('alert', error);

      this.$validator.validateAll();
    },
    deleteErrorMessages(answerKey) {
      const errorField = this.$validator.fields.find({ name: answerKey });
      if (errorField) {
        errorField.reset();
        this.$validator.errors.remove(errorField.name, errorField.scope);
      }
    }
  },
  created() {
    this.$validator.extend('maxdimensions', maxDimensionsValidationRule);
  },
  watch: {
    assessment() {
      this.validate();
    }
  }
};

function getImageDimensions(imageSrc) {
  return new Promise(resolve => {
    let i = document.createElement('img');
    i.onload = () => resolve({ width: i.width, height: i.height });
    i.src = imageSrc;
  });
}

function imageValidationError(message = '') {
  const err = new Error(message);
  err[Symbol.for('error:image-validation')] = true;
  return err;
}
</script>

<style lang="scss" scoped>
$errorRed: #d9534f;
$imageContainerDimension: 128px;

h5 {
  display: block;
  margin: 30px 0 10px;
  font-size: 18px;
  text-align: left;
}

ul {
  clear: both;
  padding: 5px 0 0 10px;
  list-style: none;

  li {
    position: relative;
    margin: 20px 0;
    padding-left: 40px;
    text-align: start;

    .form-control {
      padding-left: 10px;
    }

    input[type=checkbox] {
      position: absolute;
      top: 30%;
      left: 0;
    }
  }

  .mdi-close {
    position: absolute;
    right: 1%;
    bottom: 50%;
    padding: 5px;
    color: #888;
    cursor: pointer;

    &:hover {
      color: darken(#888, 20%);
    }
  }
}

.dead-center-img-container {
  margin-right: 5%;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}

.image {
  &-input {
    display: none;

    &-err {
      vertical-align: text-top;
    }
  }
}

.answer-row {
  text-align: left;
}

.row-content {
  div {
    display: inline-block;
  }
}

.has-error {
  .image-container {
    border-color: $errorRed;
  }
}

.error-msg {
  display: block;
  text-align: center;
  margin-top: 2%;
  color: $errorRed;
  font-size: 1.1em;
}

.disabled {
  pointer-events: none;

  .control, .btn {
    opacity: 0;
  }
}
</style>
