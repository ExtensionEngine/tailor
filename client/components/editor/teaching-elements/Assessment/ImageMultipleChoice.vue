<template>
  <div :class="{ disabled }">
    <h5>Answers</h5>
    <span @click="addAnswer" class="btn btn-link mdi mdi-plus pull-right"></span>
    <ul>
      <li
        v-for="(answer, index) in answers"
        :key="getUniqueIndex(index)"
        style="text-align: start;">
        <span>
          <input
            :checked="correct.includes(index)"
            :disabled="disabled"
            @change="toggleAnswer(index)"
            type="checkbox">
        </span>
        <span :class="{ 'has-error': getErrorMessages(index).length > 0 }">
          <div class="image-container">
            <img :src="getSrc(answer)" class="image-content">
          </div>
          <input
            :data-index="index"
            type="file"
            :disabled="disabled"
            @change="updateAnswer"
            class="form-control image-input"
            :accept="imageInputType">
          <span
            v-for="(message, index) in getErrorMessages(index)"
            :key="index"
            class="error-msg">
            {{ message }}
          </span>
        </span>
        <span @click="removeAnswer(index)" class="mdi mdi-close control"></span>
      </li>
    </ul>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import range from 'lodash/range';
import { blobToBase64String } from 'blob-util';

const maxImageDimension = 256;

const formAlert = (message) => {
  return {
    type: 'alert-danger',
    text: message
  };
};

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
      const imageFile = files[0];

      return new Promise((resolve, reject) => {
        this.resetErrorMessages(dataset.index);
        if (imageFile.size > 100000) {
          // eslint-disable-next-line prefer-promise-reject-errors
          return reject('The image is too large. Maximum allowed image size: 100 kB');
        }
        return resolve(imageFile);
      })
        .then(() => blobToBase64String(imageFile))
        .then(base64String => {
          answers[dataset.index] = base64String;
          return this.getImageDimensions(base64String);
        })
        .then(({ width, height }) => {
          if (width > maxImageDimension || height > maxImageDimension) {
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject(
              `Incorrect image width and/or height. Maximum allowed image dimensions:
               ${maxImageDimension}x${maxImageDimension}`
            );
          }
        })
        .catch(errorMsg => {
          this.addErrorMessage(dataset.index, errorMsg);
          answers[dataset.index] = '';
        })
        .then(() => {
          this.update({ answers });
        });
    },
    getImageDimensions(base64String) {
      return new Promise((resolve, reject) => {
        let i = document.createElement('img');
        i.onload = () => {
          resolve({ width: i.width, height: i.height });
        };
        i.src = this.getSrc(base64String);
      });
    },
    getSrc(base64String) {
      if (base64String === '') return './assets/img/no-image.png';
      return `data:image/jpg;base64,${base64String}`;
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

      this.resetErrorMessages(answerIndex);

      this.update({ answers, correct, feedback });
    },
    hasQuestionText() {
      let questionContent = this.assessment.question[0].data.content || '';
      return questionContent !== '';
    },
    hasCorrectAnswers() {
      return this.correct.length > 0;
    },
    validate() {
      let error = {};
      if (!this.hasQuestionText()) {
        error = formAlert('The question field may not be empty.');
      } else if (this.answers.length < 2) {
        error = formAlert('Please make at least two answers available.');
      } else if (!this.hasCorrectAnswers()) {
        error = formAlert('There needs to be at least one correct answer.');
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
      this.fieldErrors.splice(index, 1);
    },
    getUniqueIndex(index) {
      return `imc_${Date.now()}_${index}`;
    }
  },
  watch: {
    assessment() {
      this.validate();
    }
  }
};
</script>

<style lang="scss" scoped>
$errorRed: #d9534f;

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

    .form-control {
      padding-left: 10px;
    }

    input[type=checkbox] {
      position: absolute;
      top: 5px;
      left: 0;
    }
  }

  .mdi-close {
    position: absolute;
    right: 5px;
    bottom: 5px;
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
    display: inline-block;
    position: relative;
    min-width: 128px;
    max-width: 128px;
    min-height: 128px;
    max-height: 128px;
    margin-right: 5%;
    border: 1px solid #ccc;
    vertical-align: middle;
  }

  &-input {
    display: inline-block;
    width: 70%;
  }

  &-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
}

.has-error {
  input[type="checkbox"]::after {
    border-color: $errorRed;
  }

  input[type="checkbox"]:checked::after {
    border-color: #337ab7;
  }
}

.error-msg {
  display: block;
  text-align: center;
  color: $errorRed;
}

.disabled {
  pointer-events: none;

  .control, .btn {
    opacity: 0;
  }
}
</style>
