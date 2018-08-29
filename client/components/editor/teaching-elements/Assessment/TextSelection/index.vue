<template>
  <div :class="{ disabled: !isEditing }">
    <h5 class="title">Text and selection</h5>
    <div
      @click="focus"
      class="container">
      <te-html
        v-if="!isSelecting && isEditing"
        :element="textElement"
        :is-focused="isFocused"
        @save="saveContent"/>
      <selector
        v-else
        :rootNode="blastedContent"
        :correct="correct"
        :isEditing="isEditing"
        @save="saveSelection"
        class="htmlContent ql-container ql-snow"/>
    </div>
    <div v-if="isEditing">
      <button
        v-if="isSelecting"
        @click="edit"
        class="btn btn-primary btn-material">
        <span class="mdi mdi-stop-circle-outline"/>
          Edit content
      </button>
      <button
        v-else
        @click="select"
        class="btn btn-primary btn-material">
        <span class="mdi mdi-marker"/>
          Select solutions
      </button>
    </div>
  </div>
</template>

<script>
import { blastContent } from './helpers';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import cuid from 'cuid';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
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
      text: this.assessment.text,
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
          content: this.text,
          width: this.assessment.width
        }
      };
    },
    isFocused() {
      if (!get(this.focusedElement, 'type')) return false;
      const isEmbedded = this.focusedElement.embedded;
      const isSameId = this.focusedElement.id === this.id;
      return isEmbedded && isSameId;
    },
    blastedContent() {
      if (isEmpty(this.text)) return null;
      return blastContent(this.text, this.correct);
    }
  },
  methods: {
    ...mapMutations(['focusElement'], 'editor'),
    ...mapActions({ updateElement: 'update' }, 'tes'),
    saveContent({ content }) {
      this.text = content;
      this.update();
    },
    saveSelection(selection) {
      this.correct = selection;
      this.update();
    },
    select() {
      if (this.isFocused) {
        this.focusElement();
      }
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
      const data = {
        text: this.text,
        correct: this.correct
      };
      this.$emit('update', data);
    }
  },
  watch: {
    errors() {
      const notSelected = this.errors.includes('correct');
      const alert = {
        text: 'Select at least one answer',
        type: 'alert-danger'
      };
      if (notSelected) this.$emit('alert', alert);
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
  border-style: none;
}

.disabled {
  pointer-events: none;
}
</style>
