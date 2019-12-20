<template>
  <v-dialog
    v-hotkey="{ esc: hide }"
    v-on="$listeners"
    width="500"
    v-bind="$attrs">
    <template v-for="(_, slot) in $scopedSlots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope"></slot>
    </template>
    <v-form @submit.prevent>
      <v-card>
        <v-card-title primary-title class="primary darken-1 white--text">
          <v-avatar
            v-if="headerIcon"
            color="secondary"
            size="38"
            class="mr-3">
            <v-icon dark>{{ headerIcon }}</v-icon>
          </v-avatar>
          <slot name="header"></slot>
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
    headerIcon: { type: String, default: null }
  }
};
</script>
