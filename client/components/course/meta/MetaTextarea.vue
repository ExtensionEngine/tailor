<template>
	<div class="meta-textarea">
		<label>{{ meta.label }}</label>
    <div
      v-show="showTextarea"
      :class="{ 'has-error': vErrors.has(meta.key) }">
      <textarea
        v-model="value"
        v-validate="meta.validate"
        :ref="meta.key"
        :name="meta.key"
        :placeholder="meta.placeholder"
        @blur="focusoutTextarea"
        @keyup.enter="focusoutTextarea"
        class="form-control">
      </textarea>
      <span class="help-block">{{ vErrors.first(meta.key) }}</span>
    </div>
    <div v-show="!showTextarea" @click.stop="focusTextarea">
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
      showTextarea: false
    };
  },
  methods: {
    focusTextarea() {
      this.showTextarea = true;
      setTimeout(() => this.$refs[this.meta.key].focus(), 0);
    },
    focusoutTextarea() {
      this.$validator.validate(this.meta.key).then(() => {
        if (this.value === this.meta.value) {
          this.showTextarea = false;
          return;
        }

        this.$emit('update', this.meta.key, this.value);
        this.showTextarea = false;
      }, noop);
    }
  }
};
</script>

<style lang="scss" scoped>
.meta-textarea {
  height: 155px;
  padding: 3px 8px;

  &:hover {
    cursor: pointer;
    background-color: #f5f5f5;
  }

  label {
    color: gray;
  }

  textarea {
    margin: 5px 0;
    height: 100px;
    resize: none;
  }

  .form-control {
    font-size: 17px;
    letter-spacing: 0.1px;
  }

  .title {
    height: 100px;
    margin: 5px 3px 5px 0;
    font-size: 17px;
    line-height: 24px;
    word-wrap: break-word;
    font-weight: normal;
    color: #333;
   }
}
</style>