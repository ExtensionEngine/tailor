<template>
  <div>
    <div class="form-group">
      <span class="form-label">Answer</span>
      <span :class="{ 'has-error': errors.includes('correct') }" class="answer">
        <textarea
          v-model="correct"
          :disabled="!isEditing"
          @blur="update"
          class="form-control"
          rows="6"
          type="text">
        </textarea>
      </span>
    </div>
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
  methods: {
    update() {
      let data = { correct: this.correct };
      this.$emit('update', data);
    }
  },
  watch: {
    isEditing: function(newVal) {
      if (!newVal) this.correct = this.assessment.correct;
    }
  }
};
</script>

<style lang="scss">
.assessment.text-response {
  min-height: 400px;
  margin: 10px auto;
  padding: 10px 30px 30px 30px;
  background-color: white;
  overflow: hidden;

  .alert-container {
    padding: 0 10px;
  }

  .alert {
    display: inline-block;
    margin: 0 auto;
    padding: 3px 7px;
    text-align: center;
  }

  button {
    margin: 15px 10px 0 0;
    float: right;
  }

  .assessment-type {
    font-size: 13px;
    margin: 15px 15px 50px 0;
    float: right;
    background-color: grey;
  }

  .form-label {
    font-size: 20px;
  }

  .answer {
    padding: 10px 0 0 50px;
    font-size: 16px;
    margin: 10px 0;
  }

  ul {
    padding: 10px 0 0 50px;

    li {
      display: inline-block;
      width: 100%;
      margin: 10px 0;

      .answers {
        vertical-align: bottom;
        font-size: 16px;
      }
    }
  }

  .form-group {
    text-align: left;
    margin: 0 auto;
    padding: 25px 20px 15px 20px;
    width: 100%;
    overflow: hidden;
  }

  .form-control {
    padding-left: 10px !important;
  }
}

@media (max-width: 850px) {
  .assessment.true-false {
    ul {
      padding-left: 0;
    }
  }
}
</style>
