<template>
  <button @click="$emit('create')" class="btn btn-primary" type="button">
    <span class="mdi mdi-plus"></span> Create perspective
  </button>
</template>

<script>
export default {
  name: 'create-perspective'
};
</script>

<style lang="scss" scoped>
.btn {
  margin: 30px 0 0 0;
  padding: 10px 15px;
  font-size: 16px;
  line-height: 16px;
}

.mdi {
  padding-right: 3px;
}
</style>
