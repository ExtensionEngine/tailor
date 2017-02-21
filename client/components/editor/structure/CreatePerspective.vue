<template>
  <button
    class="btn btn-primary"
    type="button"
    @click="$emit('create')">
    <span class="fa fa-plus"></span> Create perspective
  </button>
</template>

<script>
export default {
  name: 'create-perspective'
};
</script>

<style lang="scss" scoped>
.btn {
  margin: 20px 0;
  padding: 10px 15px;
}

.fa {
  padding-right: 5px;
}
</style>
