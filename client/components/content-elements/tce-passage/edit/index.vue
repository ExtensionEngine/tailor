<template>
  <div class="tce-passage">
    <template v-if="!isFocused && !content && showPlaceholder">
      <div class="well passage-placeholder">
        <div class="message">
          <span class="heading">Passage placeholder</span>
          <span>Click to edit</span>
        </div>
      </div>
    </template>
    <div v-else class="jodit-container">
      <jodit-editor v-if="isFocused" v-model="content"/>
      <div v-else>
        <div v-html="content"></div>
      </div>
    </div>
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
    showPlaceholder: { type: Boolean, default: true }
  },
  data() {
    return {
      content: get(this.element, 'data.content', '')
    };
  },
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
.jodit-container {
  text-align: left;
}

.passage-placeholder {
  .message {
    padding: 50px 9px;

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
