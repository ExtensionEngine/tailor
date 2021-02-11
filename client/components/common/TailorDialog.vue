<template>
  <v-dialog
    v-on="$listeners"
    :width="width"
    v-bind="$attrs">
    <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope"></slot>
    </template>
    <v-card>
      <v-card-title primary-title class="dialog-title primary darken-3">
        <v-avatar
          v-if="headerIcon"
          color="secondary"
          size="38"
          class="mr-3">
          <v-icon dark>{{ headerIcon }}</v-icon>
        </v-avatar>
        <div class="text-truncate">
          <slot name="header"></slot>
        </div>
      </v-card-title>
      <v-card-text :class="[paddingless ? 'pa-0' : 'pt-7 px-4 pb-2']">
        <slot name="body"></slot>
      </v-card-text>
      <v-card-actions v-if="$slots.actions" class="px-4 pb-3">
        <v-spacer />
        <slot name="actions"></slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'tailor-dialog',
  props: {
    headerIcon: { type: String, default: null },
    width: { type: [Number, String], default: 500 },
    paddingless: { type: Boolean, default: false }
  }
};
</script>

<style lang="scss" scoped>
.dialog-title {
  display: flex;
  color: #f1f1f1;

  .text-truncate {
    flex: 1;
    text-align: left;
  }
}
</style>
