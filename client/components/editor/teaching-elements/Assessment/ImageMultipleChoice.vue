<template>
  <div :class="{ disabled }">
    <h5>Answers</h5>
    <span @click="addAnswer" class="btn btn-link mdi mdi-plus pull-right"></span>
    <ul>
      <li
        v-for="(answer, index) in answers"
        :key="index">
        <span
          :class="{ 'has-error': getErrorMessages(index).length > 0 }"
          class="row-content">
          <input
            :checked="correct.includes(index)"
            :disabled="disabled"
            @change="toggleAnswer(index)"
            type="checkbox">
          <div class="image-container">
            <img :src="answer || './assets/img/no-image.png'" class="image-content">
          </div>
          <div class="image-input-err">
            <input
              :data-index="index"
              :disabled="disabled"
              :accept="imageInputType"
              @change="updateAnswer"
              class="form-control image-input"
              type="file">
            <span
              v-for="(message, index) in getErrorMessages(index)"
              :key="index"
              class="error-msg">
              {{ message }}
            </span>
            <span @click="removeAnswer(index)" class="mdi mdi-close control"></span>
          </div>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import range from 'lodash/range';
import { blobToDataURL } from 'blob-util';

const maxImageDimension = 256;

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

const isImageValidatonError = err => !!err[Symbol.for('error:image-validation')];

function validateImage(image) {
  let imageDataUrl = '';
  return new Promise((resolve, reject) => {
    if (image.size > 100000) {
      const err = imageValidationError(
        'The image is too large. Maximum allowed image size: 100 kB'
      );
      return reject(err);
    }
    return resolve(image);
  })
    .then(() => blobToDataURL(image))
    .then(dataUrl => {
      imageDataUrl = dataUrl;
      return getImageDimensions(dataUrl);
    })
    .then(({ width, height }) => {
      if (width > maxImageDimension || height > maxImageDimension) {
        const err = imageValidationError(`
          Incorrect image width and/or height. Maximum allowed image dimensions:
          ${maxImageDimension}x${maxImageDimension}
        `);
        return Promise.reject(err);
      }
    })
    .then(() => Promise.resolve(imageDataUrl));
}

export default {
  props: {
    assessment: Object,
    isEditing: Boolean,
    errors: Array,
    fileInputTypes: { type: Array, default: () => ['image/jpeg', 'image/png'] }
  },
  data() {
    return {
      fieldErrors: []
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
    toggleAnswer(index) {
      let correct = cloneDeep(this.correct);
      const position = correct.indexOf(index);

      if (position < 0) {
        correct.push(index);
      } else {
        correct.splice(position, 1);
      }

      this.update({ correct });
    },
    updateAnswer(evt) {
      let answers = cloneDeep(this.answers);
      const { target: input } = evt;
      const { dataset, files = [] } = input;
      const image = files[0];

      this.resetErrorMessages(dataset.index);

      return validateImage(image)
        .then(imageSrc => { answers[dataset.index] = imageSrc; })
        .catch(error => {
          if (!isImageValidatonError(error)) throw error;
          this.addErrorMessage(dataset.index, error.message);
        })
        .then(() => this.update({ answers }));
    },
    addAnswer() {
      let answers = cloneDeep(this.answers);
      answers.push('');
      this.update({ answers });
    },
    removeAnswer(answerIndex) {
      let answers = cloneDeep(this.answers);
      let correct = cloneDeep(this.correct);
      let feedback = cloneDeep(this.feedback);

      answers.splice(answerIndex, 1);
      const index = correct.indexOf(answerIndex);
      if (index !== -1) correct.splice(index, 1);

      correct.forEach((it, i) => {
        if (it >= answerIndex) correct[i] = it - 1;
      });

      if (feedback) {
        range(answerIndex, answers.length).forEach(it => {
          feedback[it] = feedback[it + 1];
        });
        delete feedback[answers.length];
      }

      this.fieldErrors.splice(answerIndex, 1);

      this.update({ answers, correct, feedback });
    },
    hasCorrectAnswers() {
      return this.correct.length > 0;
    },
    validate() {
      let error = {};
      if (this.answers.length < 2) {
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
    addErrorMessage(index, message) {
      if (!this.fieldErrors[index]) {
        this.fieldErrors[index] = [];
      }
      if (!this.fieldErrors[index].includes(message)) {
        this.fieldErrors[index].push(message);
      }
    },
    getErrorMessages(index) {
      return this.fieldErrors[index] || [];
    },
    resetErrorMessages(index) {
      this.fieldErrors[index] = [];
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
