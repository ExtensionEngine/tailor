<template>
  <div class="select-action">
    <div
      v-for="action in actions"
      :key="action.name"
      @click="$emit('selected', action.name)"
      class="action">
      <span :class="action.icon" class="mdi"></span>
      <span>{{ action.label }}</span>
    </div>
    <div @click="$emit('close')" class="action">
      <span class="mdi mdi-close"></span>
      <span>Cancel</span>
    </div>
  </div>
</template>

<script>
const ACTIONS = [
  { name: 'create', label: 'Create', icon: 'mdi-plus' },
  { name: 'clone', label: 'Copy', icon: 'mdi-content-copy' }
];

export default {
  computed: {
    actions() {
      return ACTIONS;
    }
  }
};
</script>

<style lang="scss" scoped>
.select-action {
  margin: 0 auto;
}

.action {
  display: inline-block;
  margin: 20px 25px;

  &:hover {
    color: #42b983;
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
  }

  .mdi {
    padding-bottom: 7px;
    font-size: 26px;
  }
}
</style>
