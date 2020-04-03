<template>
  <div class="text-center">
    <v-dialog :value="show" :width="width" persistent>
      <v-card color="blue-grey darken-3" dark>
        <v-card-text>
          {{ label }}
          <v-progress-linear :value="status" color="white" class="mb-0" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    show: { type: Boolean, default: false },
    status: { type: Number, default: 0 },
    width: { type: Number, default: 300 },
    label: { type: String, default: 'Please wait...' }
  }
};
</script>
