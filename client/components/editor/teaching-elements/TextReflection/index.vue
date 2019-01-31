<template>
  <div class="te-text-reflection">
    <div class="reflection-container">
      <div class="reflection-heading">
        <h4>Text Reflection</h4>
        <span class="mdi mdi-comment-text pull-right"></span>
      </div>
      <div class="question row">
        <primitive
          :key="question.id"
          :initialElement="question"
          @save="saveQuestion"/>
      </div>
      <div class="answer form-group">
        <label for="`${element._cid}`" class="answer-label">Answer</label>
        <input
          id="`${element._cid}`"
          type="text"
          class="form-control answer-input"
          disabled
          placeholder="Click here to begin typing…">
      </div>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import { mapActions } from 'vuex-module';
import Primitive from '../Primitive';
import set from 'lodash/set';

export default {
  name: 'te-text-reflection',
  props: {
    element: { type: Object, required: true },
    isFocused: { type: Boolean, default: false }
  },
  computed: {
    embeds() {
      return get(this.element, 'data.embeds', {});
    },
    question() {
      return this.embeds[this.element.data.question];
    }
  },
  methods: {
    ...mapActions(['save'], 'tes'),
    saveQuestion(question) {
      const element = cloneDeep(this.element);
      element.data.question = question.id;
      set(element.data.embeds, question.id, question);
      this.save(element);
    }
  },
  components: { Primitive }
};
</script>

<style lang="scss" scoped>
$label-color: #3f51b5;

.te-text-reflection {
  margin: 10px auto;
  padding: 10px 30px 20px;
}

.reflection-container {
  width: 100%;
}

.reflection-heading {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.mdi-comment-text {
  color: $label-color;
  font-size: 20px;
}

.answer {
  margin-top: 20px;
  text-align: left;
}

.answer-label {
  margin-bottom: 10px;
  font-size: 16px;
}

.answer-input::placeholder {
  padding-left: 20px;
  font-style: italic;
  font-weight: 300;
}
</style>
