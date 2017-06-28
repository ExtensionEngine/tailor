<template>
  <div
    :class="{ editing }"
    @focusout="focusoutTextarea"
    @mousedown="onEdit"
    class="textarea">
    <label :for="meta.key">{{ meta.label }}</label>
    <div
      v-show="editing"
      :class="{ 'has-error': vErrors.has(meta.key) }">
      <textarea
        v-model="value"
        v-validate="meta.validate"
        :ref="meta.key"
        :name="meta.key"
        :placeholder="meta.placeholder"
        @keydown.enter="onEnter"
        @keydown.esc="editing = false"
        class="form-control">
      </textarea>
      <span class="help-block">{{ vErrors.first(meta.key) }}</span>
    </div>
    <div v-show="!editing" @click.stop="focusTextarea">
      <div class="content"><pre>{{ value || meta.placeholder }}</pre></div>
    </div>
  </div>
</template>

<script>
const noop = Function.prototype;

export default {
  name: 'multiline-input',
  props: ['meta'],
  data() {
    return {
      value: this.meta.value,
      editing: false
    };
  },
  methods: {
    onEdit(e) {
      if (this.editing) {
        e.preventDefault();
        return;
      }
      this.focusTextarea();
    },
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
      this.$validator.validate(this.meta.key).then(() => {
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
  padding: 3px 8px;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }

  &.editing:hover {
    background-color: inherit;
  }

  label {
    color: #808080;
  }

  textarea {
    height: 100px;
    margin: 5px 0;
    box-sizing: border-box;
    resize: none;
    letter-spacing: inherit;
  }

  .form-control, .content {
    font-size: 17px;
  }

  .content {
    height: 100px;
    margin: 5px 3px 10px 0;
    line-height: 24px;
    color: #333;
    overflow: auto;

    pre {
      padding: 0;
      margin: 0;
      border: none;
      font: inherit;
      background: inherit;
    }
  }
}
</style>
