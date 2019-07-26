<template>
  <div
    :class="{ editing }"
    @focusout="focusoutInput"
    @mousedown.stop="focusInput"
    class="input">
    <label :for="meta.key">{{ meta.label }}</label>
    <v-text-field
      v-validate="meta.validate"
      v-show="editing"
      v-model="value"
      :ref="meta.key"
      :name="meta.key"
      :error-messages="vErrors.collect(meta.key)"
      :placeholder="meta.placeholder"
      @keyup.enter="focusoutInput"/>
    <div v-show="!editing" @click.stop="focusInput">
      <div class="content">{{ value || meta.placeholder }}</div>
    </div>
  </div>
</template>

<script>
import { withValidation } from 'utils/validation';

export default {
  name: 'line-input',
  mixins: [withValidation()],
  props: {
    meta: { type: Object, default: () => ({ value: null }) }
  },
  data() {
    return {
      value: this.meta.value,
      editing: false
    };
  },
  methods: {
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
  }
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

  .v-input {
    min-height: 70px;
  }

  .content {
    margin: 20px 3px 30px 0;
    color: #333;
    font-size: 16px;
    word-wrap: break-word;
  }
}
</style>
