<template>
  <div
    :class="{ editing }"
    @focusout="focusoutInput"
    @mousedown="onEdit"
    class="input">
    <label :for="meta.key">{{ meta.label }}</label>
    <div
      v-show="editing"
      :class="{ 'has-error': vErrors.has(meta.key) }">
      <input
        v-model="value"
        v-validate="meta.validate"
        :ref="meta.key"
        :name="meta.key"
        :placeholder="meta.placeholder"
        @keyup.enter="focusoutInput"
        class="form-control">
      <span class="help-block">{{ vErrors.first(meta.key) }}</span>
    </div>
    <div v-show="!editing" @click.stop="focusInput">
      <div class="content">{{ value || meta.placeholder }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'line-input',
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
      this.focusInput();
    },
    focusInput() {
      this.editing = true;
      setTimeout(() => this.$refs[this.meta.key].focus(), 0);
    },
    focusoutInput() {
      this.$validator.validate(this.meta.key).then(result => {
        if (!result) return;
        this.editing = false;
        if (this.value === this.meta.value) return;
        this.$emit('update', this.meta.key, this.value);
      });
    }
  },
  inject: ['$validator']
};
</script>

<style lang="scss" scoped>
.input {
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

  input {
    letter-spacing: inherit;
  }

  .form-control, .content {
    font-size: 17px;
  }

  .content {
    margin: 5px 3px 15px 0;
    color: #333;
    line-height: 24px;
    word-wrap: break-word;
  }
}
</style>
