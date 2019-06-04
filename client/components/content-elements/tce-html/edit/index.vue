<template>
  <div class="tce-html">
    <div v-if="!isFocused && !content && showPlaceholder">
      <div class="well text-placeholder">
        <div class="message">
          <span class="heading">Text placeholder</span>
          <span>Click to edit</span>
        </div>
      </div>
    </div>
    <div v-else>
      <quill-editor
        v-if="isFocused"
        v-model="content"
        :options="options"
        @ready="onQuillReady">
      </quill-editor>
      <div v-else class="ql-container ql-snow">
        <div v-html="content" class="ql-editor"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { Quill, quillEditor as QuillEditor } from 'vue-quill-editor';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import ImageEmbed from './image-embed';

Quill.register('modules/imageEmbed', ImageEmbed);

const toolbar = {
  container: '#quillToolbar',
  handlers: {
    redo() {
      this.quill.history.redo();
    },
    undo() {
      this.quill.history.undo();
    },
    image() {
      this.quill.tooltips.imageEmbed.show();
    }
  }
};

const options = {
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
  components: { QuillEditor }
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
.tce-html {
  .ql-editor {
    min-height: 121px;

    img {
      vertical-align: initial;
    }
  }

  .ql-container.ql-snow {
    border: none !important;
  }

  .ql-editor.ql-blank::before {
    width: 100%;
  }
}
</style>
