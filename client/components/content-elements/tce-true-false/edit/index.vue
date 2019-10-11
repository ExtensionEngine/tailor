<template>
  <div class="form-group">
    <span class="form-label">
      {{ isGraded ? 'Select correct  answer' : 'Options' }}
    </span>
    <ul :class="{ 'non-graded': !isGraded }">
      <li>
        <span :class="{ 'has-error': correctError }">
          <input
            v-model="correct"
            @change="update"
            :disabled="disabled"
            :value="true"
            type="radio">
        </span>
        <span class="answers">True</span>
      </li>
      <li>
        <span :class="{ 'has-error': correctError }">
          <input
            v-model="correct"
            @change="update"
            :disabled="disabled"
            :value="false"
            type="radio">
        </span>
        <span class="answers">False</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { defaults } from 'utils/assessment';

export default {
  props: {
    assessment: { type: Object, default: defaults.TF },
    isGraded: { type: Boolean, default: false },
    errors: { type: Array, default: () => ([]) },
    isEditing: { type: Boolean, default: false }
  },
  data() {
    return {
      correct: this.assessment.correct
    };
  },
  computed: {
    correctError() {
      return this.errors.includes('correct');
    },
    disabled() {
      return !this.isEditing || !this.isGraded;
    }
  },
  methods: {
    update() {
      this.$emit('update', { correct: this.correct });
    }
  },
  watch: {
    isEditing(newVal) {
      if (this.isGraded && !newVal) this.correct = this.assessment.correct;
    }
  }
};
</script>

<style lang="scss" scoped>
.form-group {
  width: 100%;
  margin: 0 auto;
  padding: 25px 20px 15px;
  text-align: left;
  overflow: hidden;
}

.form-label {
  font-size: 20px;
}

ul {
  padding: 10px 0 0 50px;

  li {
    display: inline-block;
    position: relative;
    width: 100%;
    margin: 10px 0;

    .answers {
      vertical-align: bottom;
      font-size: 16px;
    }
  }
}

.non-graded {
  padding-left: 30px;

  input {
    margin: 5px 3px 0 0;

    &[disabled]::after {
      background: #eee;
      border: none;
    }
  }
}

@media (max-width: 850px) {
  ul {
    padding-left: 0;
  }
}
</style>
