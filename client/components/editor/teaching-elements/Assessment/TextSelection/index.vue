<template>
  <div :class="{ disabled: !isEditing }">
    <h5 class="title">Text and selection</h5>
    <div @click="focus" class="container">
      <te-html
        v-if="!isSelecting && isEditing"
        :element="textElement"
        :isFocused="isFocused"
        @save="save"/>
      <selector
        v-else
        :content="this.content"
        :correct="correct"
        :isEditing="isEditing"
        @save="save"
        class="htmlContent ql-container ql-snow"/>
    </div>
    <div v-if="isEditing">
      <button
        @click="isSelecting ? edit() : select()"
        class="btn btn-primary btn-material"
        type="button">
        <span
          :class="isSelecting ? 'mdi-stop-circle-outline' : 'mdi-marker'"
          class="mdi">
        </span>
        {{ isSelecting ? 'Edit content' : 'Select solutions' }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import cuid from 'cuid';
import Selector from './Selector';
import TeHtml from '../../Html';

export default {
  props: {
    assessment: { type: Object, required: true },
    errors: { type: Array, required: true },
    isEditing: { type: Boolean, required: true }
  },
  data() {
    return {
      id: cuid(),
      content: this.assessment.content,
      correct: this.assessment.correct,
      isSelecting: false
    };
  },
  computed: {
    ...mapGetters(['focusedElement'], 'editor'),
    textElement() {
      return {
        embedded: true,
        id: this.id,
        type: 'HTML',
        data: {
          content: this.content,
          width: this.assessment.width
        }
      };
    },
    isFocused() {
      const { focusedElement = {} } = this;
      return focusedElement.embedded && focusedElement.id === this.id;
    }
  },
  methods: {
    ...mapMutations(['focusElement'], 'editor'),
    ...mapActions({ updateElement: 'update' }, 'tes'),
    save({ selection, content }) {
      if (content) this.content = content;
      if (selection) this.correct = selection;
      this.update();
    },
    select() {
      if (this.isFocused) this.focusElement();
      this.$nextTick(() => {
        this.correct = [];
        this.isSelecting = true;
        this.update();
      });
    },
    edit() {
      this.correct = [];
      this.isSelecting = false;
      this.update();
    },
    focus(e) {
      this.focusElement(this.textElement);
      e.component = { name: 'selection-assesment', data: this.textElement };
    },
    update() {
      const { content, correct } = this;
      this.$emit('update', { content, correct });
    }
  },
  watch: {
    errors() {
      const noCorrectAnswers = this.errors.includes('correct');
      const alert = {
        text: 'Select at least one answer',
        type: 'alert-danger'
      };
      if (noCorrectAnswers) this.$emit('alert', alert);
    },
    isEditing() {
      this.isSelecting = true;
    }
  },
  components: {
    TeHtml,
    Selector
  }
};
</script>

<style lang="scss" scoped>
.title {
  display: block;
  margin: 30px 0 10px;
  font-size: 18px;
  text-align: left;
}

.container {
  margin-bottom: 20px;
  width: 100%;
}

.ql-container.ql-snow {
  border: none;
}

.disabled {
  pointer-events: none;
}
</style>
