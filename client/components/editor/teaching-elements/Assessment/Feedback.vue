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
          :key="index">
          <div>
            <span class="answer-index">Answer {{ index + 1 }}:</span>
            {{ answer }}
          </div>
          <textarea
            :ref="'option' + index"
            :value="feedback ? feedback[index] : ''"
            :disabled="!isEditing"
            @change="update(index)"
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
    answers: { type: [Array, Boolean], default: null },
    feedback: { type: Object, default: () => ({}) },
    isEditing: { type: Boolean, default: false }
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
    update(index) {
      let data = { [index]: this.$refs[`option${index}`][0].value };
      this.$emit('update', data);
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
