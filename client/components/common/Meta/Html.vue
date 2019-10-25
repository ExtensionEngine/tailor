<template>
  <div class="meta-quill-input">
    <label :for="meta.key">{{ meta.label }}</label>
    <div class="editor-wrapper">
      <quill-editor
        :ref="meta.key"
        v-model="content"
        @focus="enableEditing"
        @blur="update"
        :name="meta.key"
        :options="quillOptions"
        :disabled="!editing"
        :class="{ 'meta-quill-disabled': !editing }" />
    </div>
  </div>
</template>

<script>
import { quillEditor as QuillEditor } from 'vue-quill-editor';
import some from 'lodash/some';

const quillOptions = () => ({
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
    meta: { type: Object, default: () => ({ value: null }) },
    quillOptions: { type: Object, default: quillOptions }
  },
  data() {
    return {
      content: this.meta.value,
      editing: false
    };
  },
  methods: {
    update(quill) {
      if (!this.getActiveTooltips(quill)) this.editing = false;
      if (this.meta.value === this.content) return;
      this.$emit('update', this.meta.key, this.content);
    },
    enableEditing() {
      this.editing = true;
      const { quill } = this.$refs.html;
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
  padding: 10px 8px;
  margin: 0 0 20px 0;
  cursor: pointer;

  .meta-quill-disabled {
    .ql-toolbar.ql-snow {
      background: #f5f5f5;
    }
  }

  .ql-container {
    max-height: 230px;
    overflow: auto;
   }

  .ql-tooltip {
    left: 30px !important;
  }
}
</style>
