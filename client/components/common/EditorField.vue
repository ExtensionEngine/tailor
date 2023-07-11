<template>
  <v-input :class="{ editing }" class="editor-field d-flex px-3">
    <label class="label v-label theme--light font-weight-regular">
      {{ label }}
    </label>
    <quill-editor
      ref="editor"
      v-model="internalValue"
      @focus="enableEditing"
      @blur="emitChange"
      :options="options"
      :disabled="!editing"
      class="editor py-2" />
  </v-input>
</template>

<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

import { quillEditor as QuillEditor } from 'vue-quill-editor';
import some from 'lodash/some';

const options = {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      ['link', 'image']
    ]
  }
};

export default {
  name: 'editor-field',
  props: {
    label: { type: String, required: true },
    value: { type: String, default: '' }
  },
  data() {
    return {
      options,
      editing: false,
      internalValue: this.value
    };
  },
  methods: {
    enableEditing() {
      this.editing = true;
      const { quill } = this.$refs.editor;
      this.$nextTick(() => quill.focus());
    },
    emitChange(editor) {
      if (!this.hasActiveTooltip(editor)) this.editing = false;
      this.$emit('change', this.internalValue);
    },
    hasActiveTooltip(editor) {
      const tooltips = editor.container.querySelectorAll('.ql-tooltip');
      return !some(tooltips, it => it.classList.contains('ql-hidden'));
    }
  },
  watch: {
    value(newValue) {
      this.internalValue = this.value;
    }
  },
  components: { QuillEditor }
};
</script>

<style lang="scss">
.editor-field {
  position: relative;
  border: none;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    inset: 1px 0 0;
    box-shadow: inset 0 0 0 1px rgb(0 0 0 / 38%);
    border-radius: 0.125rem;
  }

  &:hover::before {
    box-shadow: inset 0 0 0 1px rgb(0 0 0);
  }

  .ql-editor {
    padding: 0.75rem 0;

    &::before {
      // Places placeholder where the actual content is inserted.
      left: 0;
    }
  }

  &.editing {
    cursor: inherit;

    &::before {
      box-shadow: inset 0 0 0 2px var(--v-primary-darken2);
    }

    .ql-editor {
      cursor: text;
    }
  }

  .label {
    position: absolute;
    top: -0.5625rem;
    left: -0.25rem;
    padding: 0 0.25rem;
    background: #fff;
    font-size: 0.75rem;
  }

  .editor {
    flex: 1;
    max-width: 100%;
  }

  .ql-toolbar.ql-snow {
    border-bottom: 1px solid currentcolor;

    button:hover, button:focus {
      color: var(--v-secondary-base);
    }
  }

  .ql-container {
    overflow: auto;
    max-height: 15rem;
  }

  .ql-tooltip {
    left: 1.875rem !important;
  }
}
</style>
