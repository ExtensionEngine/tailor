<template>
	<div class="meta-input">
		<label>{{ meta.label }}</label>
    <div
      v-show="showInput"
      :class="{ 'has-error': vErrors.has(meta.key) }">
      <input
        v-model="value"
        v-validate="meta.validate"
        :ref="meta.key"
        :name="meta.key"
        :placeholder="meta.placeholder"
        @blur="focusoutInput"
        @keyup.enter="focusoutInput"
        class="form-control">
      </input>
      <span class="help-block">{{ vErrors.first(meta.key) }}</span>
    </div>
    <div v-show="!showInput" @click.stop="focusInput">
      <div class="title">{{ value || meta.placeholder }}</div>
    </div>
  </div>
</template>

<script>
const noop = Function.prototype;

export default {
  props: ['meta'],
  data() {
    return {
      value: this.meta.value,
      showInput: false
    };
  },
  methods: {
    focusInput() {
      this.showInput = true;
      setTimeout(() => this.$refs[this.meta.key].focus(), 0);
    },
    focusoutInput() {
      this.$validator.validate(this.meta.key).then(() => {
        if (this.value === this.meta.value) {
          this.showInput = false;
          return;
        }

        this.$emit('update', this.meta.key, this.value);
        this.showInput = false;
      }, noop);
    }
  }
};
</script>

<style lang="scss" scoped>
.meta-input {
  padding: 3px 8px;

  &:hover {
    cursor: pointer;
    background-color: #f5f5f5;
  }

  label {
    color: gray;
  }

  .form-control {
    font-size: 17px;
    letter-spacing: 0.1px;
  }

  .title {
    margin: 5px 3px 5px 0;
    font-size: 17px;
    line-height: 24px;
    word-wrap: break-word;
    font-weight: normal;
    color: #333;
   }
}
</style>
