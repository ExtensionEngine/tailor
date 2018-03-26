<template>
  <div class="datepicker control">
    <span class="title">{{ meta.label }}</span>
    <div class="form-group">
      <datetime :value="value" :input-class="'form-control'"></datetime>
    </div>
  </div>
</template>

<script>
import { Datetime } from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css';

export default {
  props: ['meta'],
  data() {
    return { value: this.meta.value };
  },
  components: { Datetime }
};
</script>

<style lang="scss">
.control {
  padding: 7px 8px;

  &:hover {
    background-color: #f5f5f5;
  }
}

.title {
  display: block;
  margin-bottom: 10px;
  color: #808080;
}

.form-control {
  background-color: inherit
}
</style>
