<template>
  <div :class="{ disabled }">
    <h5>Answers</h5>
    <span @click="addAnswer" class="btn btn-link mdi mdi-plus pull-right"></span>
    <ul>
      <li v-for="answer in answers" :key="answer.key">
        <span
          :class="{ 'has-error': getErrorMessages(answer.key).length > 0 }"
          class="row-content">
          <input
            :checked="correct.includes(answer.key)"
            :disabled="disabled"
            @change="toggleAnswer(answer.key)"
            type="checkbox">
          <div class="image-container">
            <img
              :src="answer.value || './assets/img/no-image.png'"
              class="image-content">
          </div>
          <div class="image-input-err">
            <input
              :data-key="answer.key"
              :disabled="disabled"
              :accept="imageInputType"
              @change="updateAnswer"
              class="form-control image-input"
              type="file">
            <span
              v-for="(message, index) in getErrorMessages(answer.key)"
              :key="index"
              class="error-msg">
              {{ message }}
            </span>
            <span @click="removeAnswer(answer.key)" class="mdi mdi-close control"></span>
          </div>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import cuid from 'cuid';
import find from 'lodash/find';
import pull from 'lodash/pull';
import { blobToDataURL } from 'blob-util';

const maxImageDimension = 256;
const isImageValidatonError = err => !!err[Symbol.for('error:image-validation')];
const findByKey = (collection, key) => find(collection, { key });

export default {
  props: {
    assessment: Object,
    isEditing: Boolean,
    errors: Array,
    fileInputTypes: { type: Array, default: () => ['image/jpeg', 'image/png'] }
  },
  data() {
    return {
      fieldErrors: {}
    };
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
        .then(() => validateImage(image))
        .then(() => {
          let answer = findByKey(answers, dataset.key);
          if (answer) answer.value = image.dataUrl;
        })
        .then(() => this.update({ answers }))
        .catch(error => {
          if (!isImageValidatonError(error)) throw error;
          this.addErrorMessage(dataset.key, error.message);
        });
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
    },
    addErrorMessage(answerKey, message) {
      if (!this.fieldErrors[answerKey]) {
        this.$set(this.fieldErrors, answerKey, []);
      }
      if (!this.fieldErrors[answerKey].includes(message)) {
        this.fieldErrors[answerKey].push(message);
      }
    },
    getErrorMessages(answerKey) {
      return this.fieldErrors[answerKey] || [];
    },
    deleteErrorMessages(answerKey) {
      if (this.fieldErrors[answerKey]) this.$delete(this.fieldErrors, answerKey);
    }
  },
  watch: {
    assessment() {
      this.validate();
    },
    isEditing() {
      if (!this.isEditing) this.fieldErrors = [];
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

function imageValidationError(message) {
  const err = new Error(message);
  err[Symbol.for('error:image-validation')] = true;
  return err;
}

function validateImage(image) {
  return new Promise((resolve, reject) => {
    if (image.size > 100000) {
      const err = imageValidationError(
        'The image is too large. Maximum allowed image size: 100 kB'
      );
      return reject(err);
    }
    return resolve();
  })
    .then(() => getImageDimensions(image.dataUrl))
    .then(({ width, height }) => {
      if (width > maxImageDimension || height > maxImageDimension) {
        const err = imageValidationError(`
          Incorrect image width and/or height. Maximum allowed image dimensions:
          ${maxImageDimension}x${maxImageDimension}
        `);
        return Promise.reject(err);
      }
    })
    .then(() => Promise.resolve());
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

.image {
  &-container {
    position: relative;
    min-width: $imageContainerDimension;
    min-height: $imageContainerDimension;
    margin-right: 5%;
    border: 1px solid #ccc;
    vertical-align: middle;
  }

  &-input {
    display: inline-block;

    &-err {
      vertical-align: middle;
    }
  }

  &-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    max-width: 100%;
    max-height: 100%;
  }
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
}

.disabled {
  pointer-events: none;

  .control, .btn {
    opacity: 0;
  }
}
</style>
