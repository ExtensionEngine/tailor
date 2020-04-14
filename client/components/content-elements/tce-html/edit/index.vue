<template>
  <div class="tce-html">
    <element-placeholder
      v-if="!isFocused && !content && showPlaceholder"
      :is-focused="isFocused"
      name="Text (deprecated)"
      icon="mdi-text"
      active-icon="mdi-arrow-up" />
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
import { Quill, quillEditor as QuillEditor } from 'vue-quill-editor';
import createCustomTheme from './theme';
import debounce from 'lodash/debounce';
import { ElementPlaceholder } from 'tce-core';
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
    showPlaceholder: { type: Boolean, default: true }
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
      this.$emit('save', { content: this.content });
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
.text-placeholder {
  .message {
    padding: 9px;

    .heading {
      font-size: 24px;
    }

    span {
      display: block;
      font-size: 18px;
    }
  }
}

.well {
  margin-bottom: 0;
}
</style>

<style lang="scss">
.ql-container.ql-snow {
  font-size: 16px;
  border: none;
}

.ql-editor {
  min-height: 120px;

  &.ql-blank::before {
    width: 100%;
  }

  img {
    vertical-align: initial;
  }
}
</style>
