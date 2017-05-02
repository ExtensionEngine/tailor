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
        <li v-for="(answer, index) in processedAnswers">
          <div>Answer {{ index + 1 }}: {{ answer }}</div>
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
import cloneDeep from 'lodash/cloneDeep';
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
      isExpanded: false
    };
  },
  computed: {
    processedAnswers() {
      return isArray(this.answers) ? this.answers : ['True', 'False'];
    }
  },
  methods: {
    update(index) {
      let options = this.options ? cloneDeep(this.options) : {};
      options[index] = this.$refs['option' + index][0].value;
      this.$emit('update', options);
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
  padding: 30px 20px 15px 20px;
  text-align: left;

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
  }

  textarea {
    height: 60px;
    margin: 10px 0;
    resize: none;
  }

  .fade-enter-active {
    transition: opacity .5s
  }

  .fade-enter {
    opacity: 0
  }

  .fade-leave, .fade-leave-active, .fade-leave-to {
    display: none;
  }
}
</style>
