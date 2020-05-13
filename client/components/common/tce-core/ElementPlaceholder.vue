<template>
  <v-sheet class="pa-12 transparent grey--text text--darken-4">
    <v-avatar size="60" color="blue-grey darken-4">
      <v-icon
        :size="isFocused ? 38 : 30"
        :color="isFocused ? activeColor : '#fff'">
        {{ icon }}
      </v-icon>
    </v-avatar>
    <div class="headline my-4">{{ name }} component</div>
    <div v-if="!isDisabled" class="subtitle-1">
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
    isFocused: { type: Boolean, default: false }
  }
};
</script>
