<template>
  <div class="tce-multiple-choice" :class="{ disabled }">
    <span class="title">{{ isGraded ? 'Answers' : 'Options' }}</span>
    <v-btn v-if="!disabled" @click="addAnswer" icon class="float-right">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-container :class="{ 'non-graded': !isGraded }">
      <v-row
        v-for="(answer, index) in answers"
        :key="index"
        no-gutters>
        <v-col cols="1" align-self="center">
          <v-checkbox
            v-if="isGraded"
            @change="toggleAnswer(index)"
            :error="!hasCorrectAnswers"
            :checked="correct.includes(index)"
            :disabled="disabled"
            hide-details
            type="checkbox" />
          <v-avatar v-else size="32" color="primary">{{ index + 1 }}</v-avatar>
        </v-col>
        <v-col cols="11">
          <v-text-field
            @change="updateAnswer(index, $event)"
            @click:append="removeAnswer(index)"
            append-icon="mdi-close"
            single-line
            hide-details
            :error="errors.includes(`answers[${index}]`)"
            :value="answers[index]"
            :disabled="disabled"
            :placeholder="isGraded ? 'Answer...' : 'Option...'" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import range from 'lodash/range';

const customAlert = {
  type: 'error',
  text: 'Please make at least two answers available !'
};

export default {
  props: {
    assessment: { type: Object, required: true },
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
    hasCorrectAnswers() {
      return !this.errors.includes('correct');
    },
    disabled() {
      return !this.isEditing;
    }
  },
  methods: {
    update(data) {
      this.$emit('update', data);
    },
    toggleAnswer(index) {
      const correct = cloneDeep(this.correct);
      const position = correct.indexOf(index);

      if (position < 0) {
        correct.push(index);
      } else {
        correct.splice(position, 1);
      }

      this.update({ correct });
    },
    updateAnswer(index, value) {
      const answers = cloneDeep(this.answers);
      answers[index] = value;
      this.update({ answers });
    },
    addAnswer() {
      const answers = cloneDeep(this.answers);
      answers.push('');
      this.update({ answers });
    },
    removeAnswer(answerIndex) {
      const answers = cloneDeep(this.answers);
      const correct = cloneDeep(this.correct);
      const feedback = cloneDeep(this.feedback);

      answers.splice(answerIndex, 1);

      if (this.isGraded) {
        const index = correct.indexOf(answerIndex);
        if (index !== -1) correct.splice(index, 1);
        correct.forEach((it, i) => {
          if (it >= answerIndex) correct[i] = it - 1;
        });
      }

      if (feedback) {
        range(answerIndex, answers.length).forEach(it => {
          feedback[it] = feedback[it + 1];
        });
        delete feedback[answers.length];
      }

      this.update({ answers, correct, feedback });
    },
    validate() {
      this.$emit('alert', this.answers.length < 2 ? customAlert : {});
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
.tce-multiple-choice {
  text-align: left;
  padding: 25px 20px 15px;
}

.container {
  clear: both;
  padding: 5px 0 0 10px;

  .row {
    margin: 20px 0;

    .v-text-field {
      margin: 0;
      padding: 0;
    }

    .v-input--checkbox {
      margin: 0;
      padding: 0;
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
