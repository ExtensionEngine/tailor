<template>
  <div @click="focus" class="table-cell">
    <div class="cell-editor col-xs-12">
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
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import { mapGetters, mapMutations } from 'vuex-module';
import { quillEditor } from 'vue-quill-editor';

export default {
  name: 'table-cell',
  props: ['element'],
  data() {
    return {
      content: get(this.element, 'data.content', ''),
      options: { placeholder: '', modules: { toolbar: '#tableToolbar' } }
    };
  },
  computed: {
    ...mapGetters(['focusedElement'], 'editor'),
    isFocused() {
      if (!this.focusedElement.type) return false;
      return this.focusedElement.embedded
        ? this.focusedElement.id === this.element.id
        : this.focusedElement._cid === this.element._cid;
    },
    hasChanges() {
      const previousValue = get(this.element, 'data.content', '');
      return previousValue !== get(this, 'content', '');
    }
  },
  methods: {
    ...mapMutations(['focusElement'], 'editor'),
    onQuillReady(quill) {
      quill.focus();
      if (quill.root) {
        quill.root.innerHTML = this.content;
      }
    },
    focus(e) {
      this.focusElement(this.element);
      // Attach component meta
      e.component = { name: 'table-cell', data: this.element };
    },
    saveElement(data) {
      let element = cloneDeep(this.element);
      Object.assign(element.data, data);
      this.$emit('save', element);
    }
  },
  watch: {
    element(val) {
      this.content = get(val, 'data.content', '');
    },
    isFocused(val, oldVal) {
      if (oldVal && !val && this.hasChanges) {
        this.saveElement({ content: this.content });
      }
    },
    content: debounce(function () {
      if (!this.hasChanges) return;
      this.saveElement({ content: this.content });
    }, 2000)
  },
  components: {
    quillEditor
  }
};
</script>

<style lang="scss" scoped>
.table-cell {
  display: table-cell;
  width: 312px;
  max-width: 312px;
  height: 100%;
  border: 1px solid black;

  .cell-editor {
    height: 100%;
    padding: 0;
  }
}
</style>

<style lang="scss">
.cell-editor {
  .ql-editor {
    min-height: 42px;
  }

  .ql-container.ql-snow {
    border: none !important;
  }
}
</style>
