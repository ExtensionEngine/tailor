<template>
  <div :class="{ disabled }">
    <h5>Answers</h5>
    <ul>
      <li v-for="{ id, data } in answers" :key="id" class="answer-row">
        <span
          :class="{ 'has-error': !!vErrors.first(id) }"
          class="row-content">
          <input
            :checked="correct.includes(id)"
            :disabled="disabled"
            @change="toggleAnswer(id)"
            type="checkbox"/>
          <async-image :url="data.url" class="image-container"/>
          <div class="image-input-err">
            <input
              v-validate
              :ref="`${id}_file_input`"
              :data-vv-rules="imageValidationRules"
              :accept="imageInputType"
              :data-key="id"
              :disabled="disabled"
              :name="id"
              @change="updateAnswer"
              data-vv-as="image"
              class="image-input"
              type="file"/>
            <button
              @click="$refs[`${id}_file_input`][0].click();"
              class="btn btn-material btn-primary"
              type="button">
              Upload image...
            </button>
            <span v-if="vErrors.first(id)" class="error-msg">
              {{ vErrors.first(id) }}
            </span>
          </div>
          <span
            @click="removeAnswer(id)"
            class="mdi mdi-close control btn-remove">
          </span>
        </span>
      </li>
    </ul>
    <span
      v-if="isEditing"
      @click="addAnswer"
      class="btn btn-link mdi mdi-plus btn-add">
    </span>
  </div>
</template>

<script>
import { blobToDataURL } from 'blob-util';
import { defaults } from 'utils/assessment';
import { withValidation } from 'utils/validation';
import AsyncImage from './shared/AsyncImage';
import cloneDeep from 'lodash/cloneDeep';
import cuid from 'cuid';
import find from 'lodash/find';
import pull from 'lodash/pull';

const maxImageDimension = 256;
const findById = (collection, id) => find(collection, { id });
const isImageValidationError = err => !!err[Symbol.for('error:image-validation')];

const maxDimensionsValidationRule = {
  getMessage(field, [width, height], data) {
    return (data && data.message) ||
      `Incorrect image width and/or height. Maximum allowed image dimensions:
      ${maxImageDimension}x${maxImageDimension}`;
  },
  validate(files, [width, height]) {
    if (!files || !files[0]) return Promise.resolve(true);
    return getImageDimensions(files[0].dataUrl)
      .then(({ width, height }) => {
        let valid = true;
        if (width > maxImageDimension || height > maxImageDimension) valid = false;
        return Promise.resolve(valid);
      });
  }
};

export default {
  mixins: [withValidation()],
  props: {
    assessment: { type: Object, default: defaults.IMC },
    isEditing: { type: Boolean, default: false },
    errors: { type: Array, default: () => [] },
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
    toggleAnswer(id) {
      let correct = cloneDeep(this.correct);
      const position = correct.indexOf(id);
      position < 0 ? correct.push(id) : correct.splice(position, 1);
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
          let answer = findById(answers, dataset.key);
          if (answer) answer.data.url = image.dataUrl;
        })
        .then(() => this.update({ answers }))
        .catch(error => {
          if (!isImageValidationError(error)) throw error;
        })
        .then(() => (input.value = null));
    },
    addAnswer() {
      let answers = cloneDeep(this.answers);
      answers.push({ type: 'IMAGE', data: { url: '' }, id: cuid() });
      this.update({ answers });
    },
    removeAnswer(id) {
      let answers = cloneDeep(this.answers);
      let correct = cloneDeep(this.correct);
      let feedback = cloneDeep(this.feedback);

      pull(answers, findById(answers, id));

      const index = correct.indexOf(id);
      if (index !== -1) correct.splice(index, 1);

      if (feedback) pull(feedback, findById(feedback, id));

      this.deleteErrorMessages(id);
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
    deleteErrorMessages(answerId) {
      const errorField = this.$validator.fields.find({ name: answerId });
      if (errorField) {
        errorField.reset();
        this.$validator.errors.remove(errorField.name, errorField.scope);
      }
    }
  },
  watch: {
    assessment() {
      this.validate();
    }
  },
  created() {
    this.$validator.extend('maxdimensions', maxDimensionsValidationRule);
  },
  components: { AsyncImage }
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
    padding: 2rem;
  }

  .mdi-close {
    padding: 5px;
    color: #888;
    cursor: pointer;

    &:hover {
      color: darken(#888, 20%);
    }
  }
}

.image {
  &-input {
    display: none;

    &-err {
      vertical-align: text-top;

      .btn {
        margin-left: 2rem;
      }
    }
  }

  &-container {
    margin: 0 2rem;
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

.btn {
  &-add {
    font-size: 3rem;
  }

  &-remove {
    margin-left: 10%;
    font-size: 2rem;
  }
}
</style>
