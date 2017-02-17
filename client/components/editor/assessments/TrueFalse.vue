<template>
  <div class="form-group">
    <span class="form-label">Select correct answer</span>
    <ul>
      <li>
        <span :class="{ 'has-error': correctError }">
          <input
            v-model="correct"
            :disabled="!isEditing"
            :value="true"
            @change="update"
            type="radio">
        </span>
        <span class="answers">True</span>
      </li>
      <li>
        <span :class="{ 'has-error': correctError }">
          <input
            v-model="correct"
            :disabled="!isEditing"
            :value="false"
            @change="update"
            type="radio">
        </span>
        <span class="answers">False</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    assessment: Object,
    errors: Array,
    isEditing: Boolean
  },
  data() {
    return {
      correct: this.assessment.correct
    };
  },
  computed: {
    correctError() {
      return this.errors.includes('correct');
    }
  },
  methods: {
    update() {
      let data = { correct: this.correct };
      this.$emit('update', data);
    }
  },
  watch: {
    isEditing(newVal) {
      if (!newVal) this.correct = this.assessment.correct;
    }
  }
};
</script>


<style lang="scss" scoped>
.form-group {
  text-align: left;
  margin: 0 auto;
  padding: 25px 20px 15px 20px;
  width: 100%;
  overflow: hidden;
}

.form-label {
  font-size: 20px;
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
  }
}

@media (max-width: 850px) {
  ul {
    padding-left: 0;
  }
}
</style>
