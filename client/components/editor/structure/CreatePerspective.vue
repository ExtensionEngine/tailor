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
