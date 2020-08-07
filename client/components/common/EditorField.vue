<template>
  <v-input :class="{ editing }" class="field d-flex px-3">
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
  name: 'v-editor-field',
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
      return this.$nextTick(() => quill.focus());
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
  components: { QuillEditor }
};
</script>

<style lang="scss">
.field {
  position: relative;
  border: none;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.38);
  border-radius: 0.125rem;
  cursor: pointer;

  &:hover {
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0);
  }

  &.editing {
    box-shadow: inset 0 0 0 2px var(--v-primary-base);
    cursor: inherit;

    .ql-editor {
      cursor: text;
    }
  }

  .label {
    position: absolute;
    top: -0.625rem;
    left: -0.25rem;
    padding: 0 0.25rem;
    font-size: 0.75rem;
    background: #fff;
  }

  .editor {
    flex: 1;
    max-width: 100%;
  }

  .ql-toolbar.ql-snow {
    border-bottom: 1px solid currentColor;

    button:hover, button:focus {
      color: var(--v-secondary-base);
    }
  }

  .ql-container {
    max-height: 15rem;
    overflow: auto;
  }

  .ql-tooltip {
    left: 1.875rem !important;
  }
}
</style>
