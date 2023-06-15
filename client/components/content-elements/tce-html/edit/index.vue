<template>
  <div class="tce-html">
    <element-placeholder
      v-if="!isFocused && !content && showPlaceholder"
      :is-focused="isFocused"
      :is-disabled="isDisabled"
      :dense="dense"
      name="Text (deprecated) component"
      icon="mdi-text"
      class="element-placeholder" />
    <div v-else>
      <quill-editor
        v-if="isFocused"
        v-model="content"
        @ready="onQuillReady"
        :options="options" />
      <div v-else class="ql-container ql-snow">
        <!-- eslint-disable vue/no-v-html -->
        <div class="ql-editor" v-html="content"></div>
        <!-- eslint-enable -->
      </div>
    </div>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

import { Quill, quillEditor as QuillEditor } from 'vue-quill-editor';
import createCustomTheme from './theme';
import debounce from 'lodash/debounce';
import { ElementPlaceholder } from '@tailor-cms/core-components';
import get from 'lodash/get';

const CustomTheme = createCustomTheme(Quill);
Quill.register(`themes/${CustomTheme.NAME}`, CustomTheme, true);

const toolbar = {
  container: '#quillToolbar',
  handlers: {
    redo() {
      this.quill.history.redo();
    },
    undo() {
      this.quill.history.undo();
    }
  }
};

const options = {
  theme: CustomTheme.NAME,
  modules: {
    toolbar,
    imageEmbed: { spacing: 1 },
    history: { userOnly: true }
  }
};

export default {
  name: 'tce-html',
  props: {
    element: { type: Object, required: true },
    isFocused: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false },
    showPlaceholder: { type: Boolean, default: true },
    dense: { type: Boolean, default: false }
  },
  data() {
    return {
      content: get(this.element, 'data.content', ''),
      options
    };
  },
  computed: {
    hasChanges() {
      const previousValue = get(this.element, 'data.content', '');
      return previousValue !== this.content;
    }
  },
  methods: {
    onQuillReady(quill) {
      quill.focus();
      if (quill.root) {
        quill.root.innerHTML = this.content;
      }
    },
    save() {
      if (!this.hasChanges) return;
      const { content, element } = this;
      this.$emit('save', { ...element.data, content });
    }
  },
  watch: {
    element(val) {
      // Make sure that component state is kept
      // until events (i.e. focusout => save) are triggered
      setTimeout(() => {
        if (this.isFocused) return;
        this.content = get(val, 'data.content', '');
      }, 0);
    },
    isFocused(val, oldVal) {
      if (oldVal && !val) this.save();
    },
    content: debounce(function () {
      this.save();
    }, 4000)
  },
  components: { ElementPlaceholder, QuillEditor }
};
</script>

<style lang="scss" scoped>
::v-deep .element-placeholder {
  padding: 0.5rem !important;
}
</style>

<style lang="scss">
.ql-container.ql-snow {
  font-size: 1rem;
  border: none;
}

.ql-editor {
  min-height: 10.5rem;

  &.ql-blank::before {
    width: 100%;
  }

  img {
    vertical-align: initial;
  }
}
</style>
