<template>
  <v-sheet
    :class="dense ? 'pt-3': 'pa-12'"
    class="transparent grey--text text--darken-4">
    <v-avatar
      :size="dense ? 40 : 60"
      :color="isDisabled ? 'grey darken-3' : 'blue-grey darken-4'">
      <v-icon
        :size="iconSize"
        :color="isFocused ? activeColor : '#fff'">
        {{ icon }}
      </v-icon>
    </v-avatar>
    <div
      :class="[
        isDisabled ? 'text--darken-3' : 'text--darken-4',
        dense ? 'my-2 subtitle-2' : 'my-4 headline'
      ]"
      class="grey--text">
      {{ name }}
    </div>
    <div v-if="!dense && !isDisabled" class="subtitle-1">
      <template v-if="!isFocused">{{ placeholder }}</template>
      <template v-else>
        <span>{{ activePlaceholder }}</span>
        <v-icon
          v-if="activeIcon"
          size="20"
          color="blue-grey darken-4">
          {{ activeIcon }}
        </v-icon>
      </template>
    </div>
  </v-sheet>
</template>

<script>
export default {
  name: 'element-placeholder',
  props: {
    name: { type: String, required: true },
    icon: { type: String, required: true },
    placeholder: { type: String, default: 'Select to edit' },
    activePlaceholder: { type: String, default: 'Use toolbar to edit' },
    activeIcon: { type: String, default: null },
    activeColor: { type: String, default: '#fff' },
    isDisabled: { type: Boolean, default: false },
    isFocused: { type: Boolean, default: false },
    dense: { type: Boolean, default: false }
  },
  computed: {
    iconSize() {
      if (this.dense) return this.isFocused ? 24 : 20;
      return this.isFocused ? 38 : 30;
    }
  }
};
</script>
