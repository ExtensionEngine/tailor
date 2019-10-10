<template>
  <div class="tce-jodit-html">
    <div
      v-if="!isFocused && !content && showPlaceholder"
      class="well jodit-html-placeholder">
      <div class="message">
        <span class="heading">Text placeholder</span>
        <span>Click to edit</span>
      </div>
    </div>
    <template v-else>
      <jodit-editor
        v-if="isFocused"
        v-model="content"
        :min-height="$el.clientHeight"
        :readonly="readonly" />
      <div v-else class="jodit_container">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="jodit_wysiwyg" v-html="content"></div>
      </div>
    </template>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import JoditEditor from './Editor';

export default {
  name: 'tce-jodit-html',
  props: {
    element: { type: Object, required: true },
    isFocused: { type: Boolean, default: false },
    isDragged: { type: Boolean, default: false },
    showPlaceholder: { type: Boolean, default: true }
  },
  data: vm => ({
    content: get(vm.element, 'data.content', ''),
    readonly: false
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
      if (state) {
        this.readonly = true;
      } else if (!state && oldState) {
        this.readonly = false;
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
</script>

<style lang="scss" scoped>
$min-width: 180px;
$min-height: 140px;

.tce-jodit-html {
  text-align: initial;
}

.well {
  display: flex;
  flex-direction: column;
  min-height: $min-height;
  margin-bottom: 0;
}

.jodit_container {
  min-width: $min-width;
  min-height: $min-height;
}

.jodit-html-placeholder .message {
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
</style>
