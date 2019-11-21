<template>
  <div class="controls">
    <div v-if="isEditing" class="pull-right">
      <v-btn @click="$emit('cancel')" text>
        Cancel
      </v-btn>
      <v-btn @click="save" color="primary">
        Save
      </v-btn>
    </div>
    <div v-else class="pull-right">
      <v-btn @click="$emit('edit')" color="primary">
        Edit
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isEditing: { type: Boolean, default: false }
  },
  methods: {
    save() {
      // Make sure all other handlers are executed prior to save
      setTimeout(() => this.$emit('save'), 0);
    }
  }
};
</script>

<style lang="scss" scoped>
.controls {
  width: 100%;
  height: 55px;
  margin-top: 20px;
  padding: 10px 20px;

  .v-btn {
    min-width: 85px;
    margin-left: 5px;
  }
}
</style>
