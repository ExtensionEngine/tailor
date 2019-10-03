<template>
  <div class="tce-single-choice">
    <span class="title">{{ isGraded ? 'Answers' : 'Options' }}</span>
    <v-btn @click="addAnswer" :disabled="disabled" icon class="float-right">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-container :class="{ 'non-graded': !isGraded }">
      <v-radio-group
        @change="selectAnswer"
        :value="correct"
        :error="correctError"
        :disabled="disabled">
        <v-row v-for="(answer, index) in answers" :key="index" no-gutters>
          <v-col cols="1" align-self="center">
            <v-radio v-if="isGraded" />
            <v-avatar v-else size="32" color="primary">{{ index + 1 }}</v-avatar>
          </v-col>
          <v-col cols="11">
            <v-text-field
              @change="updateAnswer(index, $event)"
              @click:append="removeAnswer(index)"
              append-icon="mdi-close"
              single-line
              hide-details
              :error="answerError(index)"
              :value="answer"
              :disabled="disabled"
              :placeholder="isGraded ? 'Answer...' : 'Option...'" />
          </v-col>
        </v-row>
      </v-radio-group>
    </v-container>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { defaults } from 'utils/assessment';
import range from 'lodash/range';

const customAlert = {
  type: 'error',
  text: 'Please make at least two answers available !'
};

export default {
  props: {
    assessment: { type: Object, default: defaults.SC },
    isGraded: { type: Boolean, default: false },
    errors: { type: Array, default: () => ([]) },
    isEditing: { type: Boolean, default: false }
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
    correctError() {
      return this.errors.includes('correct');
    },
    disabled() {
      return !this.isEditing;
    }
  },
  methods: {
    addAnswer() {
      let answers = cloneDeep(this.answers);
      answers.push('');
      this.update({ answers });
    },
    updateAnswer(index, value) {
      let answers = cloneDeep(this.answers);
      answers[index] = value;
      this.update({ answers });
    },
    removeAnswer(index) {
      let answers = cloneDeep(this.answers);
      let correct = cloneDeep(this.correct);
      let feedback = cloneDeep(this.feedback);

      answers.splice(index, 1);

      if (this.isGraded) {
        if (correct === index) correct = null;
        if (correct && correct >= index) correct -= 1;
      }

      if (feedback) {
        range(index, answers.length).forEach(it => {
          feedback[it] = feedback[it + 1];
        });
        delete feedback[answers.length];
      }

      this.update({ answers, correct, feedback });
    },
    selectAnswer(index) {
      this.update({ correct: index });
    },
    answerError(index) {
      return this.errors.includes(`answers[${index}]`);
    },
    validate() {
      this.$emit('alert', this.answers.length < 2 ? customAlert : {});
    },
    update(data) {
      this.$emit('update', data);
    }
  },
  watch: {
    assessment: {
      deep: true,
      handler: function () {
        this.validate();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tce-single-choice {
  text-align: left;
  padding: 25px 20px 15px;

  .title {
    font-family: $font-family-primary !important;
  }
}

.container {
  clear: both;
  padding: 5px 0 0 10px;

  ::v-deep .v-input__control {
    width: 100%;
  }

  .row {
    margin: 10px 0;

    .v-text-field {
      margin: 0;
      padding: 0;
    }

    ::v-deep .v-input__slot {
      margin: 0;
    }

    .v-avatar {
      float: left;
      margin-top: 1px;
      margin-right: 10px;
      color: #fff;
      font-weight: 700;
    }
  }
}
</style>
