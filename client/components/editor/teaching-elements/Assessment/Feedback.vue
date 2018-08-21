<template>
  <div class="feedback">
    <span class="heading">
      Feedback
      <span
        @click="isExpanded = !isExpanded"
        class="btn btn-link btn-xs">
        {{ isExpanded ? 'hide' : 'show' }}
      </span>
    </span>
    <transition name="fade">
      <ul v-if="isExpanded">
        <li
          v-for="(answer, index) in processedAnswers"
          :key="getAnswerIndex(answer, index)">
          <div>
            <div v-if="answer.value" class="dead-center-img-container">
              <img :src="answer.value" class="dead-center-img"/>
            </div>
            <span v-else>
              <span class="answer-index">Answer {{ index + 1 }}:</span>
              {{ answer }}
            </span>
          </div>
          <textarea
            :ref="getAnswerRef(answer, index)"
            :value="feedback ? feedback[getAnswerIndex(answer, index)] : ''"
            :disabled="!isEditing"
            @change="update(answer, index)"
            class="form-control">
          </textarea>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
import isArray from 'lodash/isArray';

export default {
  name: 'feedback',
  props: {
    answers: [Array, Boolean],
    feedback: Object,
    isEditing: Boolean
  },
  data() {
    return {
      isExpanded: this.isEditing
    };
  },
  computed: {
    processedAnswers() {
      return isArray(this.answers) ? this.answers : ['True', 'False'];
    }
  },
  methods: {
    update(answer, index) {
      let answerIndex = this.getAnswerIndex(answer, index);
      let answerRef = this.getAnswerRef(answer, index);
      let data = { [answerIndex]: this.$refs[answerRef][0].value };
      this.$emit('update', data);
    },
    getAnswerRef(answer, index) {
      return answer.key || `option${index}`;
    },
    getAnswerIndex(answer, index) {
      return answer.key || index;
    }
  },
  watch: {
    isEditing(val) {
      if (val) this.isExpanded = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.feedback {
  width: 100%;
  margin: 0 auto;
  padding: 30px 20px 15px;
  text-align: left;
}

.heading {
  font-size: 20px;

  .btn {
    margin-left: 15px;
    padding: 3px 10px;
  }
}

ul {
  margin-top: 20px;
  list-style: none;
}

li {
  padding: 10px 0;
  font-size: 15px;

  .answer-index {
    padding-right: 10px;
    color: #444;
    font-weight: bold;
  }

  textarea {
    height: 50px;
    margin: 10px 0;
    resize: none;
  }
}

.dead-center-img-container {
  width: 200px;
  height: 200px;
  border: 1px solid #ccc;
}

.fade-enter-active {
  transition: opacity 0.5s;
}

.fade-enter {
  opacity: 0;
}

.fade-leave, .fade-leave-active, .fade-leave-to {
  display: none;
}
</style>
