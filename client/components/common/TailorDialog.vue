<template>
  <v-dialog
    v-on="$listeners"
    :width="width"
    v-bind="$attrs">
    <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope"></slot>
    </template>
    <v-form @submit.prevent>
      <v-card>
        <v-card-title primary-title class="dialog-title primary darken-1">
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
        <v-card-text class="pt-7">
          <slot name="body"></slot>
        </v-card-text>
        <v-card-actions class="px-4 pb-3">
          <v-spacer />
          <slot name="actions"></slot>
        </v-card-actions>
      </v-card>
    </v-form>
</v-dialog>
</template>

<script>
export default {
  name: 'tailor-dialog',
  props: {
    headerIcon: { type: String, default: null },
    width: { type: [Number, String], default: 500 }
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
