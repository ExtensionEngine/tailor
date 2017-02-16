<template>
  <div class="controls">
    <div v-if="isEditing" class="pull-right">
      <button
        @click="$emit('cancel')"
        class="btn btn-default">
        Cancel
      </button>
      <button
        @click="$emit('save')"
        class="btn btn-default">
        Save
      </button>
    </div>
    <div v-else>
      <button
        @click="$emit('remove')"
        class="btn btn-danger pull-left">
        Remove
      </button>
      <div class="pull-right">
        <button
          @click="$emit('close')"
          class="btn btn-default">
          Close
        </button>
        <button
          @click="$emit('edit')"
          class="btn btn-default">
          Edit
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: { isEditing: Boolean }
  };
</script>

<style lang="scss">
  .controls {
    padding: 10px;

    .btn-default {
      margin-right: 10px;
    }

    .btn-danger {
      margin-left: 10px;
    }
  }
</style>
