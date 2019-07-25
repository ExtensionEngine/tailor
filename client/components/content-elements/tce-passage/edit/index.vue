<template>
  <div class="tce-passage">
    <div
      v-if="!isFocused && !content && showPlaceholder"
      class="well passage-placeholder">
      <div class="message">
        <span class="heading">Passage placeholder</span>
        <span>Click to edit</span>
      </div>
    </div>
    <template v-else>
      <jodit-editor
        v-if="isFocused"
        ref="editor"
        v-model="content"
        :minHeight="$el.clientHeight"/>
      <div v-else class="jodit_container">
        <div v-html="content" class="jodit_wysiwyg"></div>
      </div>
    </template>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import JoditEditor from './Editor';

export default {
  name: 'tce-passage',
  props: {
    element: { type: Object, required: true },
    isFocused: { type: Boolean, default: false },
    isDragged: { type: Boolean, default: false },
    showPlaceholder: { type: Boolean, default: true }
  },
  data: vm => ({
    content: get(vm.element, 'data.content', '')
  }),
  computed: {
    hasChanges() {
      const previousValue = get(this.element, 'data.content', '');
      return previousValue !== this.content;
    }
  },
  methods: {
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
    isDragged(state, oldState) {
      const jodit = getJodit(this);
      if (!jodit) return;
      if (!state && oldState) {
        return jodit.setReadOnly(false);
      }
      if (state) {
        return jodit.setReadOnly(true);
      }
    },
    content: debounce(function () {
      this.save();
    }, 4000)
  },
  components: {
    JoditEditor
  }
};

function getJodit(vm) {
  if (!vm.$refs.editor) return;
  const { editor } = vm.$refs;
  if (!editor.$refs.jodit) return;
  return editor.$refs.jodit.editor;
}
</script>

<style lang="scss" scoped>
$min-height: 140px;

.tce-passage {
  text-align: initial;
}

.well {
  display: flex;
  flex-direction: column;
  min-height: $min-height;
  margin-bottom: 0;
}

.passage-placeholder .message {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
  font-size: 18px;
  text-align: center;

  span {
    display: block;
  }

  .heading {
    font-size: 24px;
  }
}

/deep/ .jodit_container:not(.jodit_inline) {
  min-height: $min-height;
  font-size: 16px;
}
</style>
