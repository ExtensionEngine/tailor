<template>
  <div
    :class="{ editing, 'has-error': vErrors.has(meta.key) }"
    @focusout="focusoutTextarea"
    class="textarea">
    <label :for="meta.key">{{ meta.label }}</label>
    <div class="textarea-wrapper">
      <textarea
        v-model="value"
        v-show="editing"
        v-validate="meta.validate"
        :ref="meta.key"
        :name="meta.key"
        :placeholder="meta.placeholder"
        @keydown.enter="onEnter"
        @keydown.esc="editing = false"
        class="form-control">
      </textarea>
      <div :style="previewStyle" @mousedown.stop="focusTextarea" class="content">
        <pre><span>{{ value || meta.placeholder }}</span><br></pre>
      </div>
    </div>
    <span class="help-block">{{ vErrors.first(meta.key) }}</span>
  </div>
</template>

<script>
const noop = Function.prototype;

export default {
  name: 'multiline-input',
  props: ['meta', 'min-height'],
  data() {
    return {
      value: this.meta.value,
      editing: false
    };
  },
  computed: {
    previewStyle() {
      return {
        visibility: this.editing ? 'hidden' : 'visible',
        'min-height': `${this.minHeight || 60}px`
      };
    }
  },
  methods: {
    onEnter(e) {
      if (e.shiftKey) return;
      e.preventDefault();
      this.focusoutTextarea();
    },
    focusTextarea() {
      this.editing = true;
      setTimeout(() => this.$refs[this.meta.key].focus(), 0);
    },
    focusoutTextarea() {
      this.$validator.validateAll().then(() => {
        this.editing = false;
        if (this.value === this.meta.value) return;
        this.$emit('update', this.meta.key, this.value);
      }, noop);
    }
  }
};
</script>

<style lang="scss" scoped>
.textarea {
  position: relative;
  padding: 3px 8px;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }

  &.editing:hover {
    background-color: inherit;
  }

  label {
    width: 100%;
    color: #808080;
  }

  &-wrapper {
    margin: 5px 0;
    position: relative;
  }

  textarea {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    box-sizing: content-box;
    overflow: hidden;
    resize: none;
    letter-spacing: inherit;
  }

  .form-control, .content {
    font-size: 17px;
  }

  .content {
    line-height: 24px;
    color: #333;

    pre {
      height: 100%;
      padding: 0px 4px 8px 0;
      margin: 0;
      border: none;
      font: inherit;
      background: inherit;
      word-break: break-all;
      word-wrap: break-word;
      white-space: pre-wrap;
      overflow: hidden;
    }
  }
}
</style>
