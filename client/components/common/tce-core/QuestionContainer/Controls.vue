<template>
  <div class="d-flex pb-4">
    <v-spacer />
    <div v-if="isEditing">
      <v-btn @click="$emit('cancel')" text large>Cancel</v-btn>
      <v-btn
        @click="save"
        color="green darken-3"
        text large>
        <v-icon class="pr-1">mdi-check</v-icon>
        Save
      </v-btn>
    </div>
    <div v-else>
      <v-btn
        @click="$emit('delete')"
        color="blue-grey darken-4"
        text large>
        Delete
      </v-btn>
      <v-btn
        @click="$emit('edit')"
        color="blue-grey darken-4"
        text large>
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
