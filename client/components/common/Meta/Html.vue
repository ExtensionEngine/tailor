<template>
  <v-input :class="{ editing }" class="meta-quill-input">
    <label
      :for="meta.key"
      class="quill-label v-label theme--light grey lighten-5 px-1">
      {{ meta.label }}
    </label>
    <div class="editor-wrapper">
      <quill-editor
        :ref="meta.key"
        v-model="content"
        @focus="enableEditing"
        @blur="update"
        :name="meta.key"
        :options="options"
        :disabled="!editing"
        :class="{ 'meta-quill-disabled': !editing }" />
    </div>
  </v-input>
</template>

<script>
import { quillEditor as QuillEditor } from 'vue-quill-editor';
import some from 'lodash/some';

const defaultOptions = () => ({
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      ['link', 'image']
    ]
  }
});

export default {
  name: 'html-input',
  props: {
    meta: { type: Object, default: () => ({ value: null }) }
  },
  data() {
    return {
      content: this.meta.value,
      editing: false
    };
  },
  computed: {
    options: ({ meta }) => ({ ...defaultOptions(), ...meta.editorOptions })
  },
  methods: {
    update(quill) {
      if (!this.getActiveTooltips(quill)) this.editing = false;
      if (this.meta.value === this.content) return;
      this.$emit('update', this.meta.key, this.content);
    },
    enableEditing() {
      this.editing = true;
      const { quill } = this.$refs[this.meta.key];
      return this.$nextTick(() => quill.focus());
    },
    getActiveTooltips(quill) {
      const tooltips = quill.container.querySelectorAll('.ql-tooltip');
      const visibleTooltip = !some(tooltips, it => it.classList.contains('ql-hidden'));
      if (tooltips.length && visibleTooltip) return tooltips;
    }
  },
  components: {
    QuillEditor
  }
};
</script>

<style lang="scss">
.meta-quill-input {
  position: relative;
  margin: 0 0 1.25rem 0;
  padding: 0.625rem 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.6);
  border-radius: 0.125rem;
  cursor: pointer;

  &.editing {
    border-width: 0.125rem;
  }

  .quill-label {
    position: absolute;
    top: -1.375rem;
    font-size: 0.875rem;
  }

  .editor-wrapper {
    flex: 1;
  }

  .ql-toolbar.ql-snow {
    border-bottom: 1px solid currentColor;
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
