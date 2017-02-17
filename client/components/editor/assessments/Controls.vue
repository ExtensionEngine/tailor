<template>
  <div class="controls">
    <div v-if="isEditing" class="pull-right">
      <button @click="$emit('cancel')" class="btn btn-default">Cancel</button>
      <button @click="$emit('save')" class="btn btn-success">Save</button>
    </div>
    <div v-else>
      <button @click="$emit('remove')" class="btn btn-danger pull-left">
        Remove
      </button>
      <div class="pull-right">
        <button @click="$emit('close')" class="btn btn-default">Close</button>
        <button @click="$emit('edit')" class="btn btn-success">
          Edit <span class="fa fa-pencil"></span>
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

<style lang="scss" scoped>
.controls {
  display: block;
  width: 100%;
  height: 55px;
  margin-top: 20px;
  padding: 10px 20px;

  .btn {
    padding: 6px 10px;
    margin-right: 6px;
  }
}
</style>
