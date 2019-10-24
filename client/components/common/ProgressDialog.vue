<template>
  <div class="text-xs-center">
    <v-dialog
      :value="show"
      persistent
      width="300">
      <v-card color="blue-grey darken-3" dark>
        <v-card-text>
          Please wait...
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
    status: { type: Number, default: 0 }
  }
};
</script>
